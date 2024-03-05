<template>
  <div :class="`image-upload-wrap ${size}`">
    <div class="img img-l" v-show="imageUrl && size !== SizeTypeEnum.fullwidth">
      <ImageItem :src="imageUrl" @delete="onImageDelete" :show-del-icon="!disabled" />
    </div>
    <a-upload
      :accept="accept"
      name="avatar"
      list-type="picture-card"
      class="uploader"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :multiple="multiple"
      v-show="!imageUrl || size === SizeTypeEnum.fullwidth"
    >
      <video v-if="isVideo(imageUrl) && size === SizeTypeEnum.fullwidth" :src="imageUrl"></video>
      <img
        class="img"
        v-else-if="imageUrl && size === SizeTypeEnum.fullwidth"
        :src="imageUrl"
        alt="avatar"
      />
      <div v-if="!imageUrl">
        <loading-outlined v-if="loading" />
        <plus-outlined v-else />
        <div class="text">上传</div>
      </div>
    </a-upload>
    <div class="tip">{{ tips }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import type { UploadFile } from 'ant-design-vue';
  import { Upload as AUpload, message } from 'ant-design-vue';
  import { isEmpty } from 'lodash-es';
  import type { PropType } from 'vue';
  import { computed, onMounted, ref, unref, watch } from 'vue';
  import ImageItem from './components/ImageItem.vue';
  import { aliyunUpload, getAliyunPolicy } from '/@/api/sys/upload';
  import { buildUUID } from '/@/utils/uuid';

  type SizeType = 'default' | 'small' | 'fullwidth';

  enum SizeTypeEnum {
    default = 'default',
    small = 'small',
    fullwidth = 'fullwidth',
  }

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'default',
    },
    tip: {
      type: String,
      default: '图片大小不超过2M，视频大小不超过20M',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: 'video/mp4,image/jpeg,image/png,image/gif',
    },
    maxVideoSize: {
      type: Number,
      default: 20,
    },
    maxImageSize: {
      type: Number,
      default: 2,
    },
    sizeTips: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:value', 'change', 'creat']);
  const loading = ref<boolean>(false);
  const imageUrl = ref<string>('');

  const tips = computed(
    () =>
      `图片大小不超过${props.maxImageSize}M，${
        props.sizeTips ? `建议尺寸${props.sizeTips}，` : ''
      }只能是JPG、PNG、GIF格式${
        /video/.test(props.accept) ? `，视频大小不超过${props.maxVideoSize}M，只能是MP4格式` : ''
      }`,
  );

  watch(
    () => props.value,
    (value: string) => {
      imageUrl.value = value;
    },
  );

  onMounted(() => {
    imageUrl.value = props.value;
  });

  const beforeUpload = async (file: UploadFile, fileList: UploadFile[]) => {
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
    // console.log('beforeupload');

    // if (isJpgOrPng && isLt2M) {
    // console.warn('fileList', fileList);
    if (props.size === SizeTypeEnum.fullwidth && !isEmpty(fileList)) {
      if (fileList.length > 1) {
        const imageUrls = await Promise.all(
          fileList.map(async (file) => await doUpload(file, props.size)),
        );
        emit('creat', imageUrls);
      } else {
        const imageUrl = await doUpload(file, props.size);
        emit('creat', [imageUrl]);
        return false;
      }
      return false;
    }
    doUpload(file);
    // }
    return false;
  };

  const onImageDelete = () => {
    imageUrl.value = '';
    emit('update:value', imageUrl.value);
    emit('change', imageUrl.value);
  };

  const doUpload = async (file: UploadFile, size: string = SizeTypeEnum.default) => {
    loading.value = true;
    try {
      const data = await getAliyunPolicy();
      const fileName = `${buildUUID()}.${file.type?.split('/')[1]}`;
      const pathName = `${data.dir}${fileName}`;

      // {"host":"https://ugrow-wxs-dev.oss-cn-shenzhen.aliyuncs.com",
      // "expire":1660905337,"policy":"eyJleHBpcmF0aW9uIjoiMjAyMi0wOC0xOVQxMDozNTozNy41MzZaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsNTM2ODcwOTEyMDAwXSx7ImJ1Y2tldCI6InVncm93LXd4cy1kZXYifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsImFwcC0xLzIwMjIvMDgvIl1dfQ==",
      // "signature":"0MmN2+CQ94WBB6Plm3+xomUbMvE=",
      // "accessId":"LTAI5tKTicoqXeVo2vPKJU1a",
      // "callback":"eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vd3hzLmRldi5jZW50ZXIudWdyb3cuY24vY2FsbGJhY2svYWxpeXVuL29zcyIsImNhbGxiYWNrQm9keSI6IntcbiAgICAgICAgXCJtaW1lVHlwZVwiOiAke21pbWVUeXBlfSxcbiAgICAgICAgXCJzaXplXCI6ICR7c2l6ZX0sXG4gICAgICAgIFwiZmlsZW5hbWVcIjogJHtvYmplY3R9LFxuICAgICAgICBcImJ1Y2tldFwiOiAke2J1Y2tldH0sXG4gICAgICAgIFwiaW1hZ2VcIjogeyBcIndpZHRoXCI6ICR7aW1hZ2VJbmZvLndpZHRofSwgXCJoZWlnaHRcIjogJHtpbWFnZUluZm8uaGVpZ2h0fSwgXCJmb3JtYXRcIjogJHtpbWFnZUluZm8uZm9ybWF0fSB9LFxuICAgICAgICBcImNkblwiOiBcImh0dHBzOi8vcmVzLmRldi5jZW50ZXIudWdyb3cuY25cIixcbiAgICAgICAgXCJhcHBJZFwiOiBcIjFcIlxuICAgICAgfSIsImNhbGxiYWNrQm9keVR5cGUiOiJhcHBsaWNhdGlvbi9qc29uIn0=",
      // "dir":"app-1/2022/08/","cdn":"https://res.dev.center.ugrow.cn"}

      const result = await aliyunUpload(
        data.host,
        {
          data: {
            name: fileName,
            key: pathName,
            policy: data.policy,
            OSSAccessKeyId: data.accessId,
            // success_action_status: '200',
            signature: data.signature,
            callback: data.callback,
          },
          file: file as any,
          name: 'file',
          filename: fileName,
        },
        () => {},
      );
      if (size === SizeTypeEnum.fullwidth) {
        return result.url;
      }
      imageUrl.value = result.url;
      emit('update:value', imageUrl.value);
      emit('change', imageUrl.value);
    } finally {
      loading.value = false;
    }
  };

  const isVideo = (url: string) => {
    return /\.mp4$/i.test(url);
  };
</script>

<style lang="less" scoped>
  .image-upload-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .tip {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
    .img-l {
      margin-right: 8px;
    }
    .uploader {
      width: 120px;
    }
    &.default,
    &.small {
      :deep(.ant-upload) {
        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
    }
    &.small {
      :deep(.ant-upload) {
        width: 60px;
        height: 60px;
        margin: 0;
      }
      .tip {
        display: none;
      }
    }
    &.fullwidth {
      display: block;
      .uploader {
        width: 100%;
        :deep(.ant-upload) {
          width: 100%;
          height: auto;
          min-height: 120px;
        }
        .img {
          width: 100%;
        }
      }
      .tip {
        margin-top: 0;
      }
    }
  }
</style>
