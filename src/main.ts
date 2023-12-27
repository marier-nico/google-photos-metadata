import { getMetadata } from "./getMetadata";
import { fromHTML } from "./utils";

const imageCdnUrl = "https://lh3.googleusercontent.com/";

const isViewingPhoto = () =>
  window.location.href.startsWith("https://photos.google.com/") &&
  window.location.href.includes("/photo/");

const findInfoContainer = () => {
  const [details] = [...document.querySelectorAll("div")].filter(
    (e) => e.innerText === "DETAILS",
  );
  return details;
};

let infoContainer: Element | null = null;
setInterval(() => {
  const details = findInfoContainer();

  const newContainer = details?.nextSibling as Element | null;
  if (newContainer && infoContainer !== newContainer) {
    infoContainer = newContainer;
    window.dispatchEvent(new Event("infoContainerUpdated"));
  }
}, 200);

const findViewContainer = () => {
  const [viewContainer] = [...document.querySelectorAll("c-wiz")].filter(
    (e: Element & { dataset?: { p?: string } }) =>
      e.dataset?.p?.includes(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        window.location.href
          .split("/")
          .filter((s) => s.length > 0)
          .pop()!,
      ),
  );

  return viewContainer;
};

const findImage = () => {
  const viewContainer = findViewContainer();
  const [image] = [...viewContainer.querySelectorAll("img")].filter((i) =>
    i.src.includes(imageCdnUrl),
  );
  if (image) return image;

  throw Error("Could not find an image on this page");
};

const upsertInfo = (
  name: string,
  description: string,
  icon: SVGElement,
  url?: string,
) => {
  // It looks like refetching the info container is necessary
  const details = findInfoContainer();

  const link = `<a class="R9U8ab IidYxf" href="${url}" target="_blank">${description}</a>`;
  console.log("Link", link);

  const entryId = `${name}-photos-metadata`;
  const entry = fromHTML(`
    <div class="ffq9nc" id="${entryId}">
      <dt class="dNjXAc">${icon.outerHTML}</dt>
      <dd class="rCexAf">${url ? link : description}</dd>
    </div>
    `);

  console.log("Entry", entry);
  const previousEntry = document.getElementById(entryId);
  if (previousEntry) {
    previousEntry.remove();
  }

  details?.nextSibling?.appendChild(entry as Element);
};

const injectMetadata = async () => {
  if (isViewingPhoto() && findInfoContainer()) {
    const imageElem = findImage();
    const metadata = await getMetadata(imageElem);

    for (const { icon, name, description, url } of metadata) {
      upsertInfo(name, description, icon, url);
    }
  }
};

window.addEventListener("infoContainerUpdated", injectMetadata);
injectMetadata();
