import { H as Hls } from './hls-vendor-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
  var player = document.querySelector('[data-player]');

  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var playButton = player.querySelector('.player-play-button');
  var status = player.querySelector('[data-player-status]');
  var hlsInstance = null;
  var initialized = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function initializePlayer() {
    if (initialized || !video) {
      return;
    }

    initialized = true;
    var source = video.getAttribute('data-src');

    if (!source) {
      setStatus('未找到播放源');
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus('播放源已就绪，点击画面可播放或暂停');
      });
      hlsInstance.on(Hls.Events.ERROR, function (eventName, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setStatus('网络加载异常，正在重试播放源');
          hlsInstance.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setStatus('媒体解码异常，正在尝试恢复');
          hlsInstance.recoverMediaError();
        } else {
          setStatus('当前浏览器无法播放该视频源');
          hlsInstance.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      setStatus('播放源已就绪，点击画面可播放或暂停');
    } else {
      setStatus('当前浏览器不支持 HLS 播放');
    }
  }

  function playVideo() {
    initializePlayer();

    if (!video) {
      return;
    }

    var request = video.play();

    if (request && typeof request.catch === 'function') {
      request.catch(function () {
        setStatus('浏览器阻止了自动播放，请再次点击播放按钮');
      });
    }
  }

  if (playButton) {
    playButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      playVideo();
    });
  }

  if (video) {
    video.addEventListener('click', function () {
      initializePlayer();
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
      setStatus('正在播放');
    });

    video.addEventListener('pause', function () {
      player.classList.remove('is-playing');
      setStatus('已暂停，点击画面继续播放');
    });

    video.addEventListener('ended', function () {
      player.classList.remove('is-playing');
      setStatus('播放结束，可重新播放');
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
});
