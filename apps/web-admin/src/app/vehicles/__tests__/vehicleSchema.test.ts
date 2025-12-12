import { describe, it, expect } from "vitest";
import { vehicleSchema } from "../schema/vehicleSchema";

describe("Vehicle Schema Validation", () => {
  it("should validate correct vehicle data", () => {
    const validData = {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      color: "Branco",
      plateLastFour: "1D23",
      photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      category: "SEDAN" as const,
      transmission: "AUTOMATICO" as const,
      fuel: "FLEX" as const,
      engine: "2.0",
      horsePower: 154,
      hasDualPedal: false,
      acceptStudentCar: false,
      safetyFeatures: ["ABS", "Air-bag duplo"],
      comfortFeatures: ["Ar-digital", "Bluetooth"],
    };

    const result = vehicleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should require dual pedal photo when hasDualPedal is true", () => {
    const dataWithoutPedalPhoto = {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      color: "Branco",
      plateLastFour: "1D23",
      photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      category: "SEDAN" as const,
      transmission: "AUTOMATICO" as const,
      fuel: "FLEX" as const,
      engine: "2.0",
      hasDualPedal: true,
      // pedalPhotoBase64 missing
      acceptStudentCar: false,
      safetyFeatures: [],
      comfortFeatures: [],
    };

    const result = vehicleSchema.safeParse(dataWithoutPedalPhoto);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Foto do pedal obrigatória");
    }
  });

  it("should validate plate format", () => {
    const dataWithInvalidPlate = {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      color: "Branco",
      plateLastFour: "12", // Invalid: only 2 chars
      photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      category: "SEDAN" as const,
      transmission: "AUTOMATICO" as const,
      fuel: "FLEX" as const,
      engine: "2.0",
      hasDualPedal: false,
      acceptStudentCar: false,
      safetyFeatures: [],
      comfortFeatures: [],
    };

    const result = vehicleSchema.safeParse(dataWithInvalidPlate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Formato inválido");
    }
  });

  it("should validate year range (1980-2026)", () => {
    const dataWithInvalidYear = {
      brand: "Toyota",
      model: "Corolla",
      year: 1970, // Too old
      color: "Branco",
      plateLastFour: "1D23",
      photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      category: "SEDAN" as const,
      transmission: "AUTOMATICO" as const,
      fuel: "FLEX" as const,
      engine: "2.0",
      hasDualPedal: false,
      acceptStudentCar: false,
      safetyFeatures: [],
      comfortFeatures: [],
    };

    const result = vehicleSchema.safeParse(dataWithInvalidYear);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("1980");
    }
  });

  it("should require mandatory fields", () => {
    const incompleteData = {
      brand: "Toyota",
      // model missing
      year: 2020,
      color: "Branco",
      plateLastFour: "1D23",
      // photoBase64 missing
      category: "SEDAN" as const,
      transmission: "AUTOMATICO" as const,
      fuel: "FLEX" as const,
      engine: "2.0",
      hasDualPedal: false,
      acceptStudentCar: false,
      safetyFeatures: [],
      comfortFeatures: [],
    };

    const result = vehicleSchema.safeParse(incompleteData);
    expect(result.success).toBe(false);
  });

  it("should allow optional horsePower", () => {
    const dataWithoutHorsePower = {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      color: "Branco",
      plateLastFour: "1D23",
      photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      category: "SEDAN" as const,
      transmission: "AUTOMATICO" as const,
      fuel: "FLEX" as const,
      engine: "2.0",
      // horsePower is optional
      hasDualPedal: false,
      acceptStudentCar: false,
      safetyFeatures: [],
      comfortFeatures: [],
    };

    const result = vehicleSchema.safeParse(dataWithoutHorsePower);
    expect(result.success).toBe(true);
  });

  it("should accept valid plate formats (letters and numbers)", () => {
    const validPlates = ["1D23", "AB12", "9Z9Z", "0000", "ZZZZ"];

    validPlates.forEach((plate) => {
      const data = {
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        color: "Branco",
        plateLastFour: plate,
        photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        category: "SEDAN" as const,
        transmission: "AUTOMATICO" as const,
        fuel: "FLEX" as const,
        engine: "2.0",
        hasDualPedal: false,
        acceptStudentCar: false,
        safetyFeatures: [],
        comfortFeatures: [],
      };

      const result = vehicleSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

