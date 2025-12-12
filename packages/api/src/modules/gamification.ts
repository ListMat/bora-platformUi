import { PrismaClient } from "@bora/db";

const prisma = new PrismaClient();

// Configuração de pontos
export const POINTS_CONFIG = {
  LESSON_COMPLETED: 10, // Pontos por aula concluída
  FIRST_LESSON: 50, // Bônus pela primeira aula
  RATING_GIVEN: 5, // Pontos por dar avaliação
  PERFECT_RATING_RECEIVED: 20, // Bônus por receber nota 5
  REFERRAL_SIGNUP: 100, // Pontos por indicação (quando indicado se cadastra)
  REFERRAL_FIRST_LESSON: 50, // Pontos adicionais quando indicado faz primeira aula
};

// Configuração de níveis
export const LEVELS = [
  { level: 1, minPoints: 0, name: "Iniciante" },
  { level: 2, minPoints: 100, name: "Aprendiz" },
  { level: 3, minPoints: 300, name: "Praticante" },
  { level: 4, minPoints: 600, name: "Experiente" },
  { level: 5, minPoints: 1000, name: "Avançado" },
  { level: 6, minPoints: 1500, name: "Expert" },
  { level: 7, minPoints: 2500, name: "Mestre" },
  { level: 8, minPoints: 4000, name: "Lenda" },
];

// Configuração de medalhas
export const MEDALS = {
  FIRST_LESSON: {
    id: "first_lesson",
    name: "Primeira Aula",
    description: "Complete sua primeira aula",
    icon: "🎓",
  },
  FIVE_LESSONS: {
    id: "five_lessons",
    name: "Dedicado",
    description: "Complete 5 aulas",
    icon: "🏅",
  },
  TEN_LESSONS: {
    id: "ten_lessons",
    name: "Persistente",
    description: "Complete 10 aulas",
    icon: "🥇",
  },
  TWENTY_LESSONS: {
    id: "twenty_lessons",
    name: "Comprometido",
    description: "Complete 20 aulas",
    icon: "🏆",
  },
  PERFECT_RATING: {
    id: "perfect_rating",
    name: "Excelência",
    description: "Receba uma avaliação 5 estrelas",
    icon: "⭐",
  },
  FIVE_PERFECT_RATINGS: {
    id: "five_perfect_ratings",
    name: "Consistente",
    description: "Receba 5 avaliações 5 estrelas",
    icon: "🌟",
  },
  FIRST_REFERRAL: {
    id: "first_referral",
    name: "Influenciador",
    description: "Indique seu primeiro amigo",
    icon: "🤝",
  },
  FIVE_REFERRALS: {
    id: "five_referrals",
    name: "Embaixador",
    description: "Indique 5 amigos",
    icon: "👥",
  },
  EARLY_BIRD: {
    id: "early_bird",
    name: "Madrugador",
    description: "Complete uma aula antes das 7h",
    icon: "🌅",
  },
  NIGHT_OWL: {
    id: "night_owl",
    name: "Noturno",
    description: "Complete uma aula depois das 22h",
    icon: "🌙",
  },
};

/**
 * Adiciona pontos ao usuário
 */
export async function addPoints(
  userId: string,
  points: number,
  reason: string
): Promise<number> {
  const student = await prisma.student.findFirst({
    where: { userId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const newPoints = student.points + points;

  await prisma.student.update({
    where: { id: student.id },
    data: { points: newPoints },
  });

  // Registrar no log de atividades
  await prisma.activityLog.create({
    data: {
      userId,
      action: "ADD_POINTS",
      resource: "GAMIFICATION",
      metadata: { points, reason, newTotal: newPoints },
    },
  });

  // Verificar se subiu de nível
  await checkLevelUp(userId, newPoints);

  return newPoints;
}

/**
 * Verifica e atualiza o nível do usuário
 */
async function checkLevelUp(userId: string, currentPoints: number): Promise<void> {
  const student = await prisma.student.findFirst({
    where: { userId },
  });

  if (!student) return;

  const newLevel = LEVELS.reduce((level, l) => {
    return currentPoints >= l.minPoints ? l : level;
  });

  if (newLevel.level > student.level) {
    await prisma.student.update({
      where: { id: student.id },
      data: { level: newLevel.level },
    });

    // Registrar level up
    await prisma.activityLog.create({
      data: {
        userId,
        action: "LEVEL_UP",
        resource: "GAMIFICATION",
        metadata: { newLevel: newLevel.level, levelName: newLevel.name },
      },
    });
  }
}

/**
 * Concede uma medalha ao usuário
 */
export async function awardMedal(userId: string, medalId: string): Promise<void> {
  const student = await prisma.student.findFirst({
    where: { userId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const medals = (student.medals as string[]) || [];

  if (!medals.includes(medalId)) {
    medals.push(medalId);

    await prisma.student.update({
      where: { id: student.id },
      data: { medals },
    });

    // Registrar no log
    await prisma.activityLog.create({
      data: {
        userId,
        action: "MEDAL_AWARDED",
        resource: "GAMIFICATION",
        metadata: { medalId },
      },
    });
  }
}

/**
 * Verifica e concede medalhas baseadas em aulas completadas
 */
export async function checkLessonMedals(userId: string): Promise<void> {
  const completedLessons = await prisma.lesson.count({
    where: {
      student: { userId },
      status: "FINISHED",
    },
  });

  if (completedLessons === 1) {
    await awardMedal(userId, MEDALS.FIRST_LESSON.id);
  } else if (completedLessons === 5) {
    await awardMedal(userId, MEDALS.FIVE_LESSONS.id);
  } else if (completedLessons === 10) {
    await awardMedal(userId, MEDALS.TEN_LESSONS.id);
  } else if (completedLessons === 20) {
    await awardMedal(userId, MEDALS.TWENTY_LESSONS.id);
  }
}

/**
 * Verifica e concede medalhas baseadas em avaliações
 */
export async function checkRatingMedals(userId: string): Promise<void> {
  const perfectRatings = await prisma.rating.count({
    where: {
      ratedId: userId,
      rating: 5,
    },
  });

  if (perfectRatings === 1) {
    await awardMedal(userId, MEDALS.PERFECT_RATING.id);
  } else if (perfectRatings === 5) {
    await awardMedal(userId, MEDALS.FIVE_PERFECT_RATINGS.id);
  }
}

/**
 * Verifica medalhas de horário
 */
export async function checkTimeMedals(
  userId: string,
  lessonTime: Date
): Promise<void> {
  const hour = lessonTime.getHours();

  if (hour < 7) {
    await awardMedal(userId, MEDALS.EARLY_BIRD.id);
  } else if (hour >= 22) {
    await awardMedal(userId, MEDALS.NIGHT_OWL.id);
  }
}

/**
 * Processa gamificação após conclusão de aula
 */
export async function processLessonCompletion(
  userId: string,
  lessonId: string,
  lessonTime: Date
): Promise<void> {
  // Contar aulas completadas
  const completedLessons = await prisma.lesson.count({
    where: {
      student: { userId },
      status: "FINISHED",
    },
  });

  // Dar pontos
  let points = POINTS_CONFIG.LESSON_COMPLETED;
  if (completedLessons === 1) {
    points += POINTS_CONFIG.FIRST_LESSON;
  }

  await addPoints(userId, points, `Aula ${lessonId} concluída`);

  // Verificar medalhas
  await checkLessonMedals(userId);
  await checkTimeMedals(userId, lessonTime);
}

/**
 * Processa gamificação após dar avaliação
 */
export async function processRatingGiven(userId: string): Promise<void> {
  await addPoints(userId, POINTS_CONFIG.RATING_GIVEN, "Avaliação enviada");
}

/**
 * Processa gamificação após receber avaliação perfeita
 */
export async function processRatingReceived(
  userId: string,
  rating: number
): Promise<void> {
  if (rating === 5) {
    await addPoints(
      userId,
      POINTS_CONFIG.PERFECT_RATING_RECEIVED,
      "Avaliação 5 estrelas recebida"
    );
    await checkRatingMedals(userId);
  }
}

/**
 * Obtém informações de gamificação do usuário
 */
export async function getGamificationInfo(userId: string) {
  const student = await prisma.student.findFirst({
    where: { userId },
  });

  if (!student) {
    return null;
  }

  const currentLevel = LEVELS.find((l) => l.level === student.level) || LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.level === student.level + 1);

  const medals = (student.medals as string[]) || [];
  const unlockedMedals = Object.values(MEDALS).filter((m) =>
    medals.includes(m.id)
  );

  return {
    points: student.points,
    level: currentLevel,
    nextLevel,
    pointsToNextLevel: nextLevel ? nextLevel.minPoints - student.points : 0,
    medals: unlockedMedals,
    totalMedals: Object.keys(MEDALS).length,
  };
}
