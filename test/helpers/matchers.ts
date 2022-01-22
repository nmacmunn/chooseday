export function textContentMatcher(textContent: string) {
  return (_: string, el: Element) => el.textContent === textContent;
}
