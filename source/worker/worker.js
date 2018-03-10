import { MIME_IMAGE } from "../constants";


const cacheName = "favicon-cache";
const favicon_uri = "/favicon.ico";


export function serveFavicon() {
  if (self.document) return;
  self.addEventListener("message", addFaviconToCache);
  self.addEventListener("fetch", getFaviconFromCache);
}


function addFaviconToCache({ data }) {
  const faviconRequest = new Request(favicon_uri);
  const faviconResponse = new Response(data, {
    headers: {
      "Content-Type": MIME_IMAGE,
      "Content-Length": String(data.byteLength)
    }
  });

  caches.open(cacheName)
    .then(cache => cache.put(faviconRequest, faviconResponse));
}

function getFaviconFromCache(event) {
  const { request, respondWith } = event;
  const faviconOrRequest = caches.open(cacheName)
    .then(cache => cache.match(request))
    .then(response => response || fetch(request));

  respondWith(faviconOrRequest);
}
