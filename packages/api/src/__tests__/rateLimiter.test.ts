import { describe, it, expect } from "vitest";
import { RATE_LIMITS, RateLimitError } from "../modules/rateLimiter";

describe("Rate Limiter Module", () => {
  describe("Rate Limits Configuration", () => {
    it("should have all required rate limit configs", () => {
      expect(RATE_LIMITS).toHaveProperty("AUTH");
      expect(RATE_LIMITS).toHaveProperty("LESSON_CREATE");
      expect(RATE_LIMITS).toHaveProperty("PAYMENT");
      expect(RATE_LIMITS).toHaveProperty("EMERGENCY");
      expect(RATE_LIMITS).toHaveProperty("GENERAL");
    });

    it("should have valid rate limit structure", () => {
      Object.values(RATE_LIMITS).forEach(config => {
        expect(config).toHaveProperty("maxRequests");
        expect(config).toHaveProperty("windowMs");
        expect(typeof config.maxRequests).toBe("number");
        expect(typeof config.windowMs).toBe("number");
        expect(config.maxRequests).toBeGreaterThan(0);
        expect(config.windowMs).toBeGreaterThan(0);
      });
    });

    it("should have reasonable limits for auth", () => {
      expect(RATE_LIMITS.AUTH.maxRequests).toBeLessThanOrEqual(10);
      expect(RATE_LIMITS.AUTH.windowMs).toBeGreaterThanOrEqual(10 * 60 * 1000); // At least 10 minutes
    });

    it("should have reasonable limits for emergency", () => {
      expect(RATE_LIMITS.EMERGENCY.maxRequests).toBeLessThanOrEqual(5);
      expect(RATE_LIMITS.EMERGENCY.windowMs).toBeGreaterThanOrEqual(60 * 60 * 1000); // At least 1 hour
    });
  });

  describe("RateLimitError", () => {
    it("should create error with default remaining", () => {
      const error = new RateLimitError();
      expect(error.remaining).toBe(0);
      expect(error.message).toBe("Too many requests. Please try again later.");
      expect(error.name).toBe("RateLimitError");
    });

    it("should create error with custom remaining", () => {
      const error = new RateLimitError(5);
      expect(error.remaining).toBe(5);
    });

    it("should be instance of Error", () => {
      const error = new RateLimitError();
      expect(error).toBeInstanceOf(Error);
    });
  });
});
