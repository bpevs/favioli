const allLinks = Array.prototype.slice.call(document.getElementsByTagName("link"), 0);
const mime_text_regex = /^\s*(?:text\/plain)\s*(?:$|;)/i;


export function hasIconLink() {
  return Boolean(getLastIconLink());
}

export function hasTextIconLink() {
  return Boolean(getLastTextIconLink());
}

export function getLastIconLink() {
  return allLinks.filter(isIcon).pop();
}

export function getLastTextIconLink() {
  return allLinks.filter(isTextIcon).pop();
}

export function isIcon(link) {
  return link.rel.toLowerCase().indexOf("icon") !== -1;
}

export function isTextIcon(link) {
  const isText = mime_text_regex.test(link.type);
  return isIcon(link) && isText;
}
