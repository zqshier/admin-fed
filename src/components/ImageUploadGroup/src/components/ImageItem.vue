<template>
  <div class="image-item-wrap" v-if="item">
    <div class="img" v-if="item.url">
      <a-image :preview="false" :src="item.url" />
    </div>
    <div class="mask" v-if="!loading">
      <div class="action" @click="onPreview"><EyeOutlined /></div>
      <a-popconfirm title="确认删除此图片？" @confirm="onDelete">
        <div class="action"><DeleteOutlined /></div>
      </a-popconfirm>
    </div>
    <div class="mask loading" v-else>
      <div class="action"><LoadingOutlined /></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Image as AImage, Popconfirm as APopconfirm } from 'ant-design-vue';
  import { EyeOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { ImageInfo } from '../types';
  import { onMounted, ref } from 'vue';
  import type { UploadFile } from 'ant-design-vue';
  import { getAliyunPolicy, aliyunUpload } from '/@/api/sys/upload';
  import { buildUUID } from '/@/utils/uuid';

  const props = defineProps({
    item: Object as PropType<ImageInfo>,
  });

  const emit = defineEmits(['update:item', 'change', 'preview', 'delete']);

  const loading = ref(false);

  async function doUpload(file: UploadFile) {
    if (file.status === 'uploading') {
      return;
    }

    loading.value = true;
    file.status = 'uploading';

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

      emit('update:item', {
        ...props.item,
        url: result.url,
        file: null,
      });
    } finally {
      loading.value = false;
      file.status = 'done';
      emit('change', props.item);
    }
  }

  function onPreview() {
    emit('preview');
  }

  function onDelete() {
    emit('delete');
  }

  onMounted(() => {
    if (props.item && props.item.file) {
      doUpload(props.item.file);
    }
  });
</script>

<style lang="less" scoped>
  .image-item-wrap {
    // padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    position: relative;
    width: 102px;
    height: 102px;
    .img {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
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
    &:hover {
      .mask {
        display: flex;
      }
    }

    .mask {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      .action {
        cursor: pointer;
        margin: 0 5px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      }

      &.loading {
        display: flex;
        .action {
          font-size: 20px;
          cursor: default;
        }
      }
    }
  }
</style>
