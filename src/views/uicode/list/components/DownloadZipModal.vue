<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="查看链接"
    :width="800"
    :showOkBtn="false"
    :maskClosable="false"
  >
    <div class="p-15 flex flex-col items-center content-center w-full h-full">
      <Icon icon="ic:baseline-drive-file-move" size="100" />
      <div class="p-5">{{ name }}</div>
      <div class="pb-5" style="color: red">解压密码：{{ downloadData.zipPassword }}</div>
      <div class="flex">
        <a-button class="mr-2" type="primary" @click="handleCopy" size="large">复制链接</a-button>
        <a-button type="primary" @click="hanldeDownload" size="large">下载</a-button>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';

  interface IDownloadData {
    link: string;
    zipPassword: string;
  }

  const downloadData = ref<IDownloadData>({ link: '', zipPassword: '' });
  const name = computed((): string => {
    const arr = (downloadData.value?.link && downloadData.value?.link.split('/')) || [];
    return arr[arr.length - 1] || '';
  });

  const [registerModal] = useModalInner(async (data: IDownloadData) => {
    if (data) downloadData.value = data;
  });

  const hanldeDownload = () => {
    const { link } = downloadData.value;
    if (!link) return;
    window.open(link, '_blank');
  };

  async function handleCopy() {
    try {
      const { link } = downloadData.value;
      copyTextToClipboard(link);
      message.success('复制成功');
    } catch (e) {
      message.error('复制失败');
    }
  }
</script>
<style lang="less" scoped></style>
