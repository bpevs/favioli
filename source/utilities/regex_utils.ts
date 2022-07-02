// Determines whether a string is in the shape of a regex
export function isRegexString(filter: string): boolean {
  return Boolean(parseRegExp(filter));
}

export function parseRegExp(filter: string): RegExp | null {
  try {
    const parts = filter.trim().split('/');
    if (parts.length < 3) return null;
    else if (parts.length === 3) {
      const [_, regex, options] = parts;
      return new RegExp(regex, options);
    } else {
      // regex could have escaped "/"
      const options = parts.pop();
      const regex = parts.slice(1).join('\/');
      return new RegExp(regex, options);
    }
  } catch {
    return null;
  }
}
