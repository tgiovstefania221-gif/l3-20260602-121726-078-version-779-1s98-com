import { H as Hls } from "./hls-vendor-dru42stk.js";

document.addEventListener("DOMContentLoaded", function () {
  var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  boxes.forEach(function (box) {
    var video = box.querySelector("video");
    var button = box.querySelector("button");
    var src = box.getAttribute("data-video");
    var hlsInstance = null;

    function attach() {
      if (!video || !src) {
        return Promise.resolve();
      }

      if (video.dataset.ready === "1") {
        return video.play();
      }

      video.dataset.ready = "1";

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return video.play();
      }

      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        return new Promise(function (resolve) {
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play().then(resolve).catch(resolve);
          });
        });
      }

      video.src = src;
      return video.play();
    }

    function start() {
      box.classList.add("is-playing");
      attach();
    }

    if (button) {
      button.addEventListener("click", start);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener("ended", function () {
        if (hlsInstance) {
          hlsInstance.stopLoad();
        }
      });
    }
  });
});
