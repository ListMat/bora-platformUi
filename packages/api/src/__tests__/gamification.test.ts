import { describe, it, expect, beforeEach } from "vitest";
import { POINTS_CONFIG, LEVELS, MEDALS } from "../modules/gamification";

describe("Gamification Module", () => {
  describe("Points Configuration", () => {
    it("should have correct point values", () => {
      expect(POINTS_CONFIG.LESSON_COMPLETED).toBe(10);
      expect(POINTS_CONFIG.FIRST_LESSON).toBe(50);
      expect(POINTS_CONFIG.RATING_GIVEN).toBe(5);
      expect(POINTS_CONFIG.PERFECT_RATING_RECEIVED).toBe(20);
      expect(POINTS_CONFIG.REFERRAL_SIGNUP).toBe(100);
      expect(POINTS_CONFIG.REFERRAL_FIRST_LESSON).toBe(50);
    });
  });

  describe("Levels Configuration", () => {
    it("should have 8 levels", () => {
      expect(LEVELS).toHaveLength(8);
    });

    it("should have ascending point requirements", () => {
      for (let i = 1; i < LEVELS.length; i++) {
        expect(LEVELS[i].minPoints).toBeGreaterThan(LEVELS[i - 1].minPoints);
      }
    });

    it("should start at level 1 with 0 points", () => {
      expect(LEVELS[0].level).toBe(1);
      expect(LEVELS[0].minPoints).toBe(0);
    });

    it("should have unique level names", () => {
      const names = LEVELS.map(l => l.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(LEVELS.length);
    });
  });

  describe("Medals Configuration", () => {
    it("should have all required medals", () => {
      const medalIds = Object.keys(MEDALS);
      const requiredMedals = [
        "FIRST_LESSON",
        "FIVE_LESSONS",
        "TEN_LESSONS",
        "TWENTY_LESSONS",
        "PERFECT_RATING",
        "FIVE_PERFECT_RATINGS",
        "FIRST_REFERRAL",
        "FIVE_REFERRALS",
        "EARLY_BIRD",
        "NIGHT_OWL",
      ];

      requiredMedals.forEach(medalId => {
        expect(medalIds).toContain(medalId);
      });
    });

    it("should have valid medal structure", () => {
      Object.values(MEDALS).forEach(medal => {
        expect(medal).toHaveProperty("id");
        expect(medal).toHaveProperty("name");
        expect(medal).toHaveProperty("description");
        expect(medal).toHaveProperty("icon");
        expect(typeof medal.id).toBe("string");
        expect(typeof medal.name).toBe("string");
        expect(typeof medal.description).toBe("string");
        expect(typeof medal.icon).toBe("string");
      });
    });

    it("should have unique medal IDs", () => {
      const ids = Object.values(MEDALS).map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(Object.keys(MEDALS).length);
    });
  });
});
