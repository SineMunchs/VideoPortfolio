

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

// Hover/focus play/stop logic
let wrap: HTMLElement | null = null;
const play = async () => {
  if (muxRef.value) {
    showPoster.value = false;
    muxRef.value.muted = true;
    muxRef.value.currentTime = 0;
    try { await muxRef.value.play(); } catch {}
  }
};
const stop = () => {
  if (muxRef.value) {
    muxRef.value.pause();
    muxRef.value.currentTime = 0;
    showPoster.value = Boolean(props.poster);
  }
};
onMounted(() => {
  if (!muxRef.value) return;
  muxRef.value.addEventListener('ended', stop);

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
  if (!muxRef.value) return;
  muxRef.value.removeEventListener('ended', stop);

  const targets = [muxRef.value, wrap].filter(Boolean);
  targets.forEach((t) => {
    t.removeEventListener('mouseenter', play);
    t.removeEventListener('mouseleave', stop);
    t.removeEventListener('focusin', play);
    t.removeEventListener('focusout', stop);
  });
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
