import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Verifica se uma requisição excede o rate limit
 * @param key Chave única para identificar o recurso (ex: userId, IP)
 * @param config Configuração de rate limit
 * @returns true se excedeu o limite, false caso contrário
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ limited: boolean; remaining: number }> {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Chave do Redis
  const redisKey = `ratelimit:${key}`;

  try {
    // Remover requisições fora da janela
    await redis.zremrangebyscore(redisKey, 0, windowStart);

    // Contar requisições na janela atual
    const count = await redis.zcount(redisKey, windowStart, now);

    if (count >= config.maxRequests) {
      return {
        limited: true,
        remaining: 0,
      };
    }

    // Adicionar nova requisição
    await redis.zadd(redisKey, { score: now, member: `${now}:${Math.random()}` });

    // Definir expiração para limpeza automática
    await redis.expire(redisKey, Math.ceil(config.windowMs / 1000));

    return {
      limited: false,
      remaining: config.maxRequests - count - 1,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Em caso de erro, permitir a requisição
    return {
      limited: false,
      remaining: config.maxRequests,
    };
  }
}

/**
 * Middleware de rate limiting para endpoints sensíveis
 */
export const RATE_LIMITS = {
  // Autenticação: 5 tentativas por 15 minutos
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },
  // Criação de aulas: 10 por hora
  LESSON_CREATE: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
  // Pagamentos: 5 por hora
  PAYMENT: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  },
  // Emergência (SOS): 3 por hora
  EMERGENCY: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000,
  },
  // API geral: 100 requisições por minuto
  GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
};

/**
 * Helper para criar erro de rate limit
 */
export class RateLimitError extends Error {
  constructor(public remaining: number = 0) {
    super("Too many requests. Please try again later.");
    this.name = "RateLimitError";
  }
}
