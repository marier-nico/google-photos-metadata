import { balanceIcon, signatureIcon } from "./icons";
import { findChildTag } from "./utils";

export enum TagName {
  Rights = "Rights",
  Creator = "Creator,",
}
export type Metadata = {
  name: TagName;
  description: string;
  url?: string;
  icon: SVGElement;
}[];

export const getMetadata = async (
  imageElem: HTMLImageElement,
): Promise<Metadata> => {
  const response = await fetch(imageElem.currentSrc);
  const text = await response.text();
  const xmpStart = text.indexOf("<x:xmpmeta");
  const xmpEnd = text.indexOf("</x:xmpmeta>") + "</x:xmpmeta>".length;
  const xmpMetaString = text.slice(xmpStart, xmpEnd);

  const parser = new DOMParser();
  const [xmpMeta] = parser.parseFromString(xmpMetaString, "text/xml").children;

  const meta = [];
  const { value: rights } = findChildTag(xmpMeta, "dc:rights");
  const { value: creator } = findChildTag(xmpMeta, "dc:creator");

  if (rights && rights.textContent) {
    const textContent = rights.textContent.trim();
    meta.push({
      name: TagName.Rights,
      description: TagName.Rights,
      url: textContent.startsWith("http") ? textContent : undefined,
      icon: balanceIcon,
    });
  }
  if (creator && creator.textContent) {
    const textContent = creator.textContent.trim();
    meta.push({
      name: TagName.Creator,
      description:
        textContent
          .trim()
          .split("/")
          .filter((s) => s.trim().length > 0)
          .pop() || textContent,
      url: textContent.startsWith("http") ? textContent : undefined,
      icon: signatureIcon,
    });
  }

  return meta;
};
