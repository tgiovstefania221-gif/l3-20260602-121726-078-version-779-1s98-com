document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("main-player");
  const button = document.querySelector(".play-overlay");

  if (!video) {
    return;
  }

  const stream = video.getAttribute("data-stream");
  const Hls = window.Hls;
  let attached = false;
  let hls = null;

  function attachStream() {
    if (attached || !stream) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    attached = true;
  }

  function playMovie() {
    attachStream();
    video.controls = true;

    if (button) {
      button.classList.add("is-hidden");
    }

    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener("click", playMovie);
  }

  video.addEventListener("click", function () {
    if (!attached || video.paused) {
      playMovie();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
});
