

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import '@mux/mux-video';

const props = defineProps<{
  playbackId?: string;
  poster?: string;
  autoplay?: boolean | 'any' | 'muted';
  loop?: boolean;
  muted?: boolean;
  title?: string;
  content?: string;
}>();

const muxRef = ref();
const showPoster = ref(Boolean(props.poster));
defineExpose({
  play: () => muxRef.value?.play?.(),
  pause: () => muxRef.value?.pause?.(),
  set currentTime(val) { if (muxRef.value) muxRef.value.currentTime = val; },
  get currentTime() { return muxRef.value?.currentTime; },
  get muted() { return muxRef.value?.muted; },
  set muted(val) { if (muxRef.value) muxRef.value.muted = val; },
});

// Hover on desktop, visibility-based autoplay on phones/tablets.
const isPhoneView = () =>
  window.matchMedia("(hover: none), (pointer: coarse), (max-width: 900px)").matches;

let wrap: HTMLElement | null = null;
let observer: IntersectionObserver | null = null;
let playTimer: ReturnType<typeof setTimeout> | null = null;
const pauseOtherMobileMedia = (activeElement: Element) => {
  document.querySelectorAll("video, mux-video, mux-player").forEach((candidate) => {
    if (candidate === activeElement) return;
    const media = candidate as HTMLMediaElement & { pause?: () => void };
    if (typeof media.pause === "function") {
      try {
        media.pause();
      } catch {}
    }
  });
};

const play = async () => {
  if (!muxRef.value) return;
  if (isPhoneView()) pauseOtherMobileMedia(muxRef.value as Element);
  muxRef.value.muted = true;
  muxRef.value.playsInline = true;
  try {
    await muxRef.value.play();
    showPoster.value = false; // hide poster only once play actually starts
  } catch {
    // autoplay blocked or network error — keep poster visible
  }
};


const stop = () => {
  if (playTimer) { clearTimeout(playTimer); playTimer = null; } // cancel pending play
  showPoster.value = Boolean(props.poster); // restore poster first, always
  if (!muxRef.value) return;
  try { muxRef.value.pause(); } catch {}
};

onMounted(() => {
  if (!muxRef.value) return;
  muxRef.value.addEventListener('ended', stop);
  muxRef.value.pause();
  showPoster.value = Boolean(props.poster);

  if (isPhoneView()) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // Show thumbnail for 1.5 s before the video starts
            if (!playTimer) {
              playTimer = setTimeout(() => { playTimer = null; play(); }, 1500);
            }
          } else {
            stop(); // cancels the timer and pauses
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(muxRef.value);
    return;
  }

  // Find closest anchor for accessibility
  wrap = muxRef.value.closest('a');
  const targets = [muxRef.value, wrap].filter(Boolean);
  targets.forEach((t) => {
    t.addEventListener('mouseenter', play);
    t.addEventListener('mouseleave', stop);
    t.addEventListener('focusin', play);
    t.addEventListener('focusout', stop);
  });
});

onBeforeUnmount(() => {
  if (playTimer) { clearTimeout(playTimer); playTimer = null; }
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (!muxRef.value) return;
  muxRef.value.removeEventListener('ended', stop);

  const targets = [muxRef.value, wrap].filter(Boolean);
  targets.forEach((t) => {
    t.removeEventListener('mouseenter', play);
    t.removeEventListener('mouseleave', stop);
    t.removeEventListener('focusin', play);
    t.removeEventListener('focusout', stop);
  });

  wrap = null;
});
</script>


<template>
  <div class="muxWrap">
    <img
      v-if="poster && showPoster"
      class="muxPoster"
      :src="poster"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
    <mux-video
      ref="muxRef"
      class="muxFrame"
      :playback-id="playbackId"
      :poster="poster"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      crossorigin
      playsinline
      preload="metadata"
      style="--media-object-fit: cover;"
    />
  </div>
</template>

<style scoped>
  .muxWrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .muxFrame {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .muxPoster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
    pointer-events: none;
  }
</style>
