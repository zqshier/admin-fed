<template>
  <div :class="`file-upload-wrap`">
    <div class="con-wrap">
      <div class="preview-item" v-if="fileUrl">
        <video-player :src="fileUrl" v-if="isVideo(fileUrl)" />
        <div class="img" v-else>
          <a-image :src="fileUrl" />
        </div>
        <a-popconfirm title="确认删除？" placement="topRight" @confirm="onDelete">
          <div class="delete"><DeleteFilled /></div>
        </a-popconfirm>
      </div>
      <a-upload
        accept="video/*,image/*"
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
    <div class="tip">{{ tips }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, watch, onMounted, computed } from 'vue';
  import { PlusOutlined, LoadingOutlined, DeleteFilled } from '@ant-design/icons-vue';
  import {
    message,
    Upload as AUpload,
    Popconfirm as APopconfirm,
    Image as AImage,
  } from 'ant-design-vue';
  import { getAliyunPolicy, aliyunUpload } from '/@/api/sys/upload';
  import type { UploadFile } from 'ant-design-vue';
  import { buildUUID } from '/@/utils/uuid';
  import VideoPlayer from './components/VideoPlayer.vue';

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxVideoSize: {
      type: Number,
      default: 20,
    },
    maxImageSize: {
      type: Number,
      default: 5,
    },
    tip: {
      type: String,
      default: '图片大小不超过2M，视频大小不超过20M',
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const loading = ref<boolean>(false);
  const fileUrl = ref('');

  const tips = computed(
    () => `图片大小不超过${props.maxImageSize}M，视频大小不超过${props.maxVideoSize}M`,
  );

  watch(
    () => props.value,
    (value) => {
      fileUrl.value = value;
    },
  );

  onMounted(() => {
    fileUrl.value = props.value;
  });

  const beforeUpload = (file: UploadFile) => {
    if (unref(loading)) {
      return false;
    }
    if (/video/.test(file.type as string)) {
      if (file.type !== 'video/mp4') {
        message.error('请上传mp4格式的视频');
        return false;
      }
      const isSize = (file.size || 0) / 1024 / 1024 < props.maxVideoSize;
      if (!isSize) {
        message.error(`视频大小不能超过${props.maxVideoSize}MB!`);
        return false;
      }
    } else {
      const isSize = (file.size || 0) / 1024 / 1024 < props.maxImageSize;
      if (!isSize) {
        message.error(`图片大小不能超过${props.maxImageSize}MB!`);
        return false;
      }
    }

    doUpload(file);
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
      fileUrl.value = result.url;
      emit('update:value', fileUrl.value);
      emit('change', fileUrl.value);
    } finally {
      loading.value = false;
    }
  };

  const onDelete = () => {
    fileUrl.value = '';
    emit('update:value', fileUrl.value);
    emit('change', fileUrl.value);
  };

  const isVideo = (url: string) => {
    return /\.mp4$/i.test(url);
  };
</script>

<style lang="less" scoped>
  .file-upload-wrap {
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
    .preview-item {
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
      .img {
        width: 110px;
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        :deep(.ant-image) {
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
        }
      }
    }
  }
</style>
