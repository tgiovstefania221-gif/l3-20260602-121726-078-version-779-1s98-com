(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (box) {
      var video = box.querySelector("video[data-hls-src]");
      var button = box.querySelector("[data-play-button]");
      var hlsInstance = null;
      var loaded = false;

      function loadSource() {
        if (!video || loaded) {
          return;
        }

        var source = video.getAttribute("data-hls-src");

        if (!source) {
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            maxBufferLength: 30,
            enableWorker: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }

        loaded = true;
      }

      function start() {
        loadSource();
        box.classList.add("is-playing");
        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            video.controls = true;
          });
        }
      }

      if (button && video) {
        button.addEventListener("click", start);
        video.addEventListener("click", function () {
          if (!loaded) {
            start();
          }
        });
      }

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
