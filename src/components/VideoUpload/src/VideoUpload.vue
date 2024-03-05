<template>
  <div :class="`image-upload-wrap`">
    <div class="con-wrap">
      <div class="video" v-if="videoInfo && videoInfo.url">
        <video-player :src="videoInfo.url" />
        <a-popconfirm title="确认删除此视频？" placement="topRight" @confirm="onDelete">
          <div class="delete"><DeleteFilled /></div>
        </a-popconfirm>
      </div>
      <a-upload
        accept="video/*"
        name="avatar"
        list-type="picture-card"
        class="uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :disabled="disabled"
      >
        <div>
          <loading-outlined v-if="loading" />
          <plus-outlined v-else />
          <div class="text">上传</div>
        </div>
      </a-upload>
    </div>
    <div class="tip">视频建议尺寸，大小不超过20M</div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, watch, onMounted, reactive } from 'vue';
  import { PlusOutlined, LoadingOutlined, DeleteFilled } from '@ant-design/icons-vue';
  import { message, Upload as AUpload, Popconfirm as APopconfirm } from 'ant-design-vue';
  import { getAliyunPolicy, aliyunUpload } from '/@/api/sys/upload';
  import type { UploadFile } from 'ant-design-vue';
  import { buildUUID } from '/@/utils/uuid';
  import type { PropType } from 'vue';
  import { VideoInfo } from './types';
  import VideoPlayer from './components/VideoPlayer.vue';

  const props = defineProps({
    value: {
      type: Object as PropType<VideoInfo>,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxFileSize: {
      type: Number,
      default: 20,
    },
    tip: {
      type: String,
      default: '视频建议尺寸，大小不超过20M',
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const loading = ref<boolean>(false);
  const videoInfo = reactive<VideoInfo>({
    id: null,
    url: '',
    uid: '',
    thumb: '',
  });

  watch(
    () => props.value,
    (value: VideoInfo) => {
      if (value) {
        Object.assign(videoInfo, value);
      } else {
        Object.assign(videoInfo, {
          id: null,
          url: '',
          uid: '',
          thumb: '',
        });
      }
    },
  );

  onMounted(() => {
    if (props.value) {
      Object.assign(videoInfo, props.value);
    }
  });

  const beforeUpload = (file: UploadFile) => {
    if (unref(loading)) {
      return false;
    }
    const isVideo = file.type === 'video/mp4';
    if (!isVideo) {
      message.error('请上传mp4格式的视频');
    }
    const isLt2M = (file.size || 0) / 1024 / 1024 < props.maxFileSize;
    if (!isLt2M) {
      message.error(`视频大小不能超过${props.maxFileSize}MB!`);
    }
    console.log('beforeupload');

    if (isVideo && isLt2M) {
      doUpload(file);
    }
    return false;
  };

  const doUpload = async (file: UploadFile) => {
    loading.value = true;

    try {
      const data = await getAliyunPolicy();
      const fileName = `${buildUUID()}.${file.type?.split('/')[1]}`;
      const pathName = `${data.dir}${fileName}`;

      const result = await aliyunUpload(
        data.host,
        {
          data: {
            name: fileName,
            key: pathName,
            policy: data.policy,
            OSSAccessKeyId: data.accessId,
            signature: data.signature,
            callback: data.callback,
          },
          file: file as any,
          name: 'file',
          filename: fileName,
        },
        () => {},
      );
      videoInfo.url = result.url;
      emit('update:value', videoInfo);
      emit('change', videoInfo);
    } finally {
      loading.value = false;
    }
  };

  const onDelete = () => {
    videoInfo.url = '';
    emit('update:value', null);
    emit('change', null);
  };
</script>

<style lang="less" scoped>
  .image-upload-wrap {
    .con-wrap {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .tip {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
    .uploader {
      width: 120px;
    }
    .video {
      margin-right: 10px;
      position: relative;
      .delete {
        position: absolute;
        z-index: 1;
        font-size: 20px;
        color: red;
        right: -5px;
        top: -8px;
        cursor: pointer;
        display: none;
      }
      &:hover {
        .delete {
          display: block;
        }
      }
    }
  }
</style>
