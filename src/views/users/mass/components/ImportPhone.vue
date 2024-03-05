<template>
  <div :class="`file-upload-wrap`">
    <div class="con-wrap">
      <div class="preview-item" v-if="fileName"
        ><span>{{ fileName }}</span> <span class="delete" @click="onDelete"><CloseOutlined /></span>
      </div>
      <a-upload
        accept="*"
        name="file"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :disabled="disabled"
        :customRequest="customRequest"
      >
        <a-button>导入用户ID</a-button>
      </a-upload>
      <a-button type="link" @click="downloadDemo">下载示例</a-button>
    </div>
    <div class="tip">{{ tip }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { message, Upload as AUpload } from 'ant-design-vue';
  import type { UploadFile } from 'ant-design-vue';
  import { downloadByData } from '/@/utils/file/download';

  const props = defineProps({
    value: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxSize: {
      type: Number,
      default: 20,
    },
    tip: {
      type: String,
      default: '上传格式: 请上传csv、txt格式',
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const fileName = ref('');

  const beforeUpload = (file: UploadFile) => {
    const ext = file.name.split('.').pop();

    const isFormat = ['csv', 'txt'].includes((ext || '').toLocaleLowerCase());
    if (!isFormat) {
      message.error('文件格式不正确，请上传csv、txt格式!');
      return false;
    }

    const isSize = (file.size || 0) / 1024 / 1024 < props.maxSize;
    if (!isSize) {
      message.error(`文件大小不能超过${props.maxSize}MB!`);
      return false;
    }

    fileName.value = file.name;

    emit('update:value', file);
    emit('change', file);
  };

  const onDelete = () => {
    fileName.value = '';
    emit('update:value', null);
    emit('change', null);
  };

  const customRequest = () => {};

  const downloadDemo = () => {
    downloadByData(
      `60082
60083`,
      'demo.csv',
    );
  };
</script>

<style lang="less" scoped>
  .file-upload-wrap {
    .con-wrap {
      display: flex;
    }
    .tip {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
    .preview-item {
      margin-right: 10px;
      display: flex;
      align-items: center;
      color: #0960bd;
      .delete {
        font-size: 16px;
        color: #666;
        cursor: pointer;
        display: block;
        margin-left: 4px;
      }
    }
  }
</style>
