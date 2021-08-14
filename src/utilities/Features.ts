import defaultFeatureFlags from "../config/features.ts";

export function isActive(featureName) {
  return defaultFeatureFlags[featureName];
}

export function hasPermission(featureName) {
  return true;
}

export async function requestPermission(featureName) {
  return true;
}

export async function requestSetActive(featureName) {
  return true;
}
