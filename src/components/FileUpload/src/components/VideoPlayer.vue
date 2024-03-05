<template>
  <div class="video-player-wrap">
    <div class="video-con">
      <div class="video">
        <video :src="src" v-if="src" controls></video>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    src: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="less" scoped>
  .video-player-wrap {
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    position: relative;
    width: 150px;
    .video-con {
      width: 100%;
      .video {
        width: 100%;
      }
    }
  }
</style>
