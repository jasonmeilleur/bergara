export type SpecUnitSystem = "imperial" | "metric";

const INCHES_TO_CM = 2.54;
const LBS_TO_KG = 0.453592;

export function formatLengthFromInches(
  inches: number,
  system: SpecUnitSystem,
): string {
  if (system === "imperial") {
    return `${inches} in`;
  }
  return `${(inches * INCHES_TO_CM).toFixed(1)} cm`;
}

export function formatWeightFromLbs(lbs: number, system: SpecUnitSystem): string {
  if (system === "imperial") {
    return `${lbs} lbs`;
  }
  return `${(lbs * LBS_TO_KG).toFixed(1)} kg`;
}
