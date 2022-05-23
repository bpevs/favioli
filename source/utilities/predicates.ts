// Checks whether a link is an icon rel
export function isIconLink(link: HTMLLinkElement): boolean {
  return link.rel.toLowerCase().indexOf('icon') !== -1;
}

// Determines whether a string is in the shape of a regex
export function isRegexString(filter: string): boolean {
  return filter.length > 2 &&
    filter.startsWith('/') &&
    filter.endsWith('/');
}
