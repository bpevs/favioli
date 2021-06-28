import defaultFeatureFlags from "../config/features.ts";

export function isActive(featureName) {
  return defaultFeatureFlags[featureName];
}
