import { MIME_IMAGE } from "../constants";


const self_uri = document.currentScript && document.currentScript.getAttribute("src");
const service_worker_container = navigator.serviceWorker;


export function cacheFaviconToWorker(canvas, service_worker_container) {
  if (!service_worker_container) return;

  canvas.toBlob(blob => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    readerLoadEnd(reader)
      .then(() => windowLoad())
      .then(() => {
        service_worker_container.register(self_uri, { scope: "/" });
        return service_worker_container.ready;
      })
      .then(registration => {
        const array_buffer = reader.result;
        registration.active.postMessage(array_buffer, [ array_buffer ]);
      });

  }, MIME_IMAGE);
}


// PRIVATE
function readerLoadEnd(reader) {
  return new Promise(resolve => {
    reader.addEventListener("loadend", resolve);
  });
};

function windowLoad() {
  return new Promise(resolve => {
    window.addEventListener("load", resolve);
  })
};
