<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    :title="title"
    width="400px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px file-upload-wrap">
      <div class="con-wrap">
        <div class="preview-item" v-if="fileName"
          ><span>{{ fileName }}</span>
          <span class="delete" @click="onDelete"><CloseOutlined /></span>
        </div>
        <a-upload
          accept="*"
          name="file"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :customRequest="customRequest"
        >
          <a-button>导入更新</a-button>
        </a-upload>
        <a-button type="link" @click="downloadDemo">下载示例</a-button>
      </div>
      <div class="tip">{{ tip }}</div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { h, ref } from 'vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { message, Modal, Upload as AUpload } from 'ant-design-vue';
  import type { UploadFile } from 'ant-design-vue';
  import { giftCardImport } from '/@/api/app/giftCard';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { jsonToSheetXlsx } from '/@/components/Excel';

  const maxSize = ref(20);
  const tip = ref('上传格式: 请上传xlsx、xls格式');
  const fileData = ref<UploadFile<File>>({} as UploadFile);
  const fileName = ref('');
  const title = ref('导入卡信息');
  const cardConfigId = ref<number>(0);

  const emit = defineEmits(['refresh']);

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log(data);
    fileData.value = {} as UploadFile;
    fileName.value = '';
    cardConfigId.value = data.id || 0;
    data.maxSize ? (maxSize.value = data.maxSize) : '';
    data.tip ? (tip.value = data.tip) : '';
  });

  const beforeUpload = (file: UploadFile) => {
    const ext = file.name.split('.').pop();
    console.error('ext', ext);
    const isFormat = ['xlsx', 'xls'].includes((ext || '').toLocaleLowerCase());
    if (!isFormat) {
      message.error('导入失败，请检查导入格式是否正确');
      return false;
    }

    const isSize = (file.size || 0) / 1024 / 1024 < maxSize.value;
    if (!isSize) {
      message.error(`文件大小不能超过${maxSize.value}MB!`);
      return false;
    }

    fileName.value = file.name;
    fileData.value = file;
  };

  const onDelete = () => {
    fileName.value = '';
  };

  const customRequest = () => {};

  const downloadDemo = () => {
    const header = [
      '卡号（必填）',
      '状态',
      '购买渠道',
      '身份证',
      '电话',
      '地址',
      '公司名称',
      '付款账号',
    ];
    jsonToSheetXlsx({
      data: [],
      header,
      filename: '礼品卡信息导入demo.xlsx',
    });
  };

  async function handleSubmit() {
    if (!fileName.value) {
      message.warn('请选择导入更新文件');
      return;
    }
    try {
      setModalProps({ confirmLoading: true });
      // console.debug('fileData', fileData.value);
      const { successCount = 0, failCount = 0 } = await giftCardImport(cardConfigId.value, {
        file: fileData.value as unknown as File,
      });
      Modal.success({
        title: () => '导入结果',
        content: () =>
          h('div', {}, [h('p', `更新${successCount}条数据成功，${failCount}条数据失败`)]),
        okText: '关闭',
        onOk: () => {
          emit('refresh');
        },
      });
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
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
