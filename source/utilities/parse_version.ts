export default function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
  descriptor: string;
} {
  if (!version) throw new Error('No Version Detected');

  const [major, minor, patch, ...descriptors] = version.split(/\.|-/);

  if (major == null || minor == null || patch == null) {
    throw new Error(`Error Parsing Version ${version}`);
  }

  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    descriptor: descriptors.join('-') || '',
  };
}
