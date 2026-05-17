export type LengthUnit = "feet" | "meters";

const INCHES_PER_FOOT = 12;
const INCHES_TO_METERS = 0.0254;
const LBS_TO_KG = 0.453592;

export function formatLengthFromInches(inches: number, unit: LengthUnit): string {
  if (unit === "feet") {
    return `${(inches / INCHES_PER_FOOT).toFixed(1)} ft`;
  }
  return `${(inches * INCHES_TO_METERS).toFixed(2)} m`;
}

export function formatWeightFromLbs(lbs: number, unit: LengthUnit): string {
  if (unit === "feet") {
    return `${lbs} lbs`;
  }
  return `${(lbs * LBS_TO_KG).toFixed(1)} kg`;
}
