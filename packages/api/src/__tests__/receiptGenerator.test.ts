import { describe, it, expect } from "vitest";
import { generateReceiptFilename } from "../modules/receiptGenerator";

describe("Receipt Generator Module", () => {
  describe("generateReceiptFilename", () => {
    it("should generate filename with correct format", () => {
      const lessonId = "abc123def456";
      const filename = generateReceiptFilename(lessonId);
      
      expect(filename).toMatch(/^recibo_[a-z0-9]{8}_\d{4}-\d{2}-\d{2}\.pdf$/);
    });

    it("should include first 8 chars of lesson ID", () => {
      const lessonId = "test1234567890";
      const filename = generateReceiptFilename(lessonId);
      
      expect(filename).toContain("test1234");
    });

    it("should include current date", () => {
      const lessonId = "test123";
      const filename = generateReceiptFilename(lessonId);
      const today = new Date().toISOString().split("T")[0];
      
      expect(filename).toContain(today);
    });

    it("should end with .pdf extension", () => {
      const lessonId = "test123";
      const filename = generateReceiptFilename(lessonId);
      
      expect(filename).toMatch(/\.pdf$/);
    });

    it("should handle short lesson IDs", () => {
      const lessonId = "abc";
      const filename = generateReceiptFilename(lessonId);
      
      expect(filename).toMatch(/^recibo_abc_\d{4}-\d{2}-\d{2}\.pdf$/);
    });
  });
});
