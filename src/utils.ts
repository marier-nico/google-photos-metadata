type Some<T> = { value: T };
type None = { value: null };
type Option<T> = Some<T> | None;

export const findChildTag = (
  root: Element,
  tagName: string,
): Option<Element> => {
  if (root.tagName === tagName) return { value: root };
  if (root.children.length === 0) return { value: null };

  for (const child of root.children) {
    const { value } = findChildTag(child, tagName);
    if (value !== null) {
      return { value };
    }
  }

  return { value: null };
};

export function fromHTML(html: string) {
  // Then set up a new template element.
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}
