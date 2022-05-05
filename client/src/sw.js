export default function sw() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      let service_worker_url = `${process.env.PUBLIC_URL}/sw.js`;
      navigator.serviceWorker.register(service_worker_url);
    });
  }
}
