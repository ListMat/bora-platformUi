import Stripe from "stripe";
import { prisma } from "@bora/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia" as any,
});

const PLATFORM_FEE_PERCENTAGE = 0.25; // 25% de comissão

/**
 * Criar conta Connect para instrutor
 */
export async function createConnectAccount(instructorId: string) {
  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    include: { user: true },
  });

  if (!instructor) {
    throw new Error("Instructor not found");
  }

  if (instructor.stripeAccountId) {
    throw new Error("Instructor already has a Stripe account");
  }

  // Criar conta Express
  const account = await stripe.accounts.create({
    type: "express",
    country: "BR",
    email: instructor.user.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  // Atualizar instrutor
  await prisma.instructor.update({
    where: { id: instructorId },
    data: {
      stripeAccountId: account.id,
    },
  });

  return account;
}

/**
 * Criar link de onboarding do Connect
 */
export async function createConnectOnboardingLink(instructorId: string) {
  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
  });

  if (!instructor?.stripeAccountId) {
    throw new Error("Instructor does not have a Stripe account");
  }

  const accountLink = await stripe.accountLinks.create({
    account: instructor.stripeAccountId,
    refresh_url: `${process.env.APP_URL}/instructor/stripe/refresh`,
    return_url: `${process.env.APP_URL}/instructor/stripe/success`,
    type: "account_onboarding",
  });

  return accountLink.url;
}

/**
 * Verificar status da conta Connect
 */
export async function checkConnectAccountStatus(instructorId: string) {
  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
  });

  if (!instructor?.stripeAccountId) {
    throw new Error("Instructor does not have a Stripe account");
  }

  const account = await stripe.accounts.retrieve(instructor.stripeAccountId);

  // Atualizar status no banco
  await prisma.instructor.update({
    where: { id: instructorId },
    data: {
      stripeOnboarded: account.charges_enabled || false,
      stripeChargesEnabled: account.charges_enabled || false,
      stripePayoutsEnabled: account.payouts_enabled || false,
    },
  });

  return {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
  };
}

/**
 * Criar pagamento com split automático
 */
export async function createPaymentWithSplit(
  lessonId: string,
  amount: number,
  instructorId: string
) {
  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
  });

  if (!instructor?.stripeAccountId || !instructor.stripeChargesEnabled) {
    throw new Error("Instructor Stripe account not ready");
  }

  // Calcular valores
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE);
  const instructorAmount = amount - platformFee;

  // Criar Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // centavos
    currency: "brl",
    application_fee_amount: platformFee * 100,
    transfer_data: {
      destination: instructor.stripeAccountId,
    },
    metadata: {
      lessonId,
      instructorId,
    },
  });

  return {
    paymentIntent,
    platformFee,
    instructorAmount,
  };
}

/**
 * Processar split após pagamento confirmado
 */
export async function processSplit(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      lesson: {
        include: {
          instructor: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const instructor = payment.lesson.instructor;
  
  if (!instructor.stripeAccountId) {
    throw new Error("Instructor does not have a Stripe account");
  }

  const amount = Number(payment.amount);
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
  const instructorAmount = amount - platformFee;

  // Criar registro de split
  const split = await prisma.paymentSplit.create({
    data: {
      paymentId: payment.id,
      totalAmount: payment.amount,
      platformFee,
      instructorAmount,
      transferStatus: "pending",
    },
  });

  // Criar transferência no Stripe (se ainda não foi criada automaticamente)
  // Nota: Se usamos application_fee_amount no PaymentIntent, a transferência é automática
  // Este código é para casos onde precisamos fazer transfer manual
  
  return split;
}

/**
 * Webhook handler para eventos do Connect
 */
export async function handleConnectWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "account.updated":
      const account = event.data.object as Stripe.Account;
      // Atualizar status do instrutor
      const instructor = await prisma.instructor.findFirst({
        where: { stripeAccountId: account.id },
      });
      
      if (instructor) {
        await prisma.instructor.update({
          where: { id: instructor.id },
          data: {
            stripeOnboarded: account.charges_enabled || false,
            stripeChargesEnabled: account.charges_enabled || false,
            stripePayoutsEnabled: account.payouts_enabled || false,
          },
        });
      }
      break;

    case "transfer.created":
    case "transfer.updated":
      const transfer = event.data.object as Stripe.Transfer;
      // Atualizar split
      await prisma.paymentSplit.updateMany({
        where: { transferId: transfer.id },
        data: {
          transferStatus: transfer.status === "paid" ? "paid" : "pending",
          transferredAt: transfer.status === "paid" ? new Date() : undefined,
        },
      });
      break;
  }
}

