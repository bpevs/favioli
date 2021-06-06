import defaultFeatureFlags from '../config/defaultFeatureFlags';

export class Features {
  isActive(featureName) {
    return defaultFeatureFlags[featureName];
  }
}
