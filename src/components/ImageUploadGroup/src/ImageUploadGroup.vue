<template>
  <div :class="`image-upload-wrap ${size}`">
    <div class="con-wrap">
      <draggable
        class="img-list"
        v-model="imageList"
        item-key="uid"
        tag="div"
        @change="onImageItemChange"
      >
        <template #item="{ index }">
          <image-item
            v-if="index < imageList.length - 1"
            class="img-item"
            v-model:item="imageList[index]"
            @change="onImageItemChange"
            @preview="onImagePreview(index)"
            @delete="onImageDelete(index)"
          />
          <a-upload
            v-else
            accept="image/*"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :disabled="disabled"
            :multiple="multiple"
            v-show="imageList.length - 1 < maxCount"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading" />
              <plus-outlined v-else />
              <div class="text">上传</div>
            </div>
          </a-upload>
        </template>
      </draggable>
    </div>
    <div class="tip">{{ tip }}</div>
    <div style="display: none">
      <a-image-preview-group v-if="previewState.visible" :preview="previewState">
        <a-image v-for="item in value" :src="item.url" :key="item.uid" />
      </a-image-preview-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, reactive } from 'vue';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import {
    message,
    Upload as AUpload,
    Image as AImage,
    ImagePreviewGroup as AImagePreviewGroup,
  } from 'ant-design-vue';
  import type { UploadFile } from 'ant-design-vue';
  import type { PropType } from 'vue';
  import ImageItem from './components/ImageItem.vue';
  import draggable from 'vuedraggable';
  import { ImageInfo, SizeType } from './types';

  const props = defineProps({
    value: {
      type: Array as PropType<ImageInfo[]>,
      default: () => {
        [];
      },
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
      default: '图片建议尺寸，大小不超过2M',
    },
    maxCount: {
      type: Number,
      default: 10,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['update:value', 'change', 'delete']);

  const addSlotInfo: ImageInfo = {
    id: 0,
    uid: '0',
    url: '',
  };

  const loading = ref<boolean>(false);
  const imageUrl = ref<string>('');
  const imageList = ref<ImageInfo[]>([addSlotInfo]);
  const previewState = reactive({
    visible: false,
    current: 0,
    onVisibleChange: (vis: boolean) => (previewState.visible = vis),
  });

  watch(
    () => props.value,
    (value: ImageInfo[]) => {
      if (value) {
        imageList.value = [...value, addSlotInfo];
      }
    },
  );

  function onImageItemChange() {
    const newList: ImageInfo[] = [];
    imageList.value.forEach((item) => {
      if (item.url && item.url !== '') {
        newList.push({
          id: item.id,
          url: item.url,
          thumb: item.thumb,
          uid: item.uid,
        });
      }
    });
    if (newList.length === imageList.value.length - 1) {
      console.log('change', newList);
      emit('update:value', newList);
      emit('change', newList);
    }
  }

  function onImagePreview(index: number) {
    previewState.current = index;
    previewState.visible = true;
  }

  function onImageDelete(index: number) {
    const item: ImageInfo[] = imageList.value.splice(index, 1);
    onImageItemChange();
    emit('delete', item[0]);
  }

  onMounted(() => {
    if (props.value) {
      imageList.value = [...props.value, addSlotInfo];
    }
  });

  const beforeUpload = (file: UploadFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传jpg或png格式的图片');
    }
    const isLt2M = (file.size || 0) / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    console.log('beforeupload');

    if (isJpgOrPng && isLt2M) {
      addFile(file);
    }
    return false;
  };

  const addFile = (file: UploadFile) => {
    const len = imageList.value.length - 1;
    if (len < props.maxCount) {
      imageList.value.splice(len, 1);
      imageList.value.push({
        uid: file.uid,
        id: null,
        url: '',
        thumb: '',
        file: file,
      });
      imageList.value.push(addSlotInfo);
    } else {
      message.error(`最多${props.maxCount}张图片`);
    }
  };
</script>

<style lang="less" scoped>
  .image-upload-wrap {
    .con-wrap {
      display: flex;
    }
    .img-list {
      display: flex;
      flex-wrap: wrap;
      .img-item {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .tip {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
    .avatar-uploader {
      width: 120px;
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
  }
</style>
