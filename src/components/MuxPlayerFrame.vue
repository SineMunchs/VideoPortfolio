

<script setup lang="ts">
import { ref, defineExpose, onMounted, onBeforeUnmount } from 'vue';
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
    muxRef.value.muted = true;
    muxRef.value.currentTime = 0;
    try { await muxRef.value.play(); } catch {}
  }
};
const stop = () => {
  if (muxRef.value) {
    muxRef.value.pause();
    muxRef.value.currentTime = 0;
  }
};
onMounted(() => {
  if (!muxRef.value) return;
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
  <mux-video
    ref="muxRef"
    class="aspect-square w-full overflow-hidden md:aspect-video"
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
</template>


