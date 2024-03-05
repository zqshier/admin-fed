<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="优惠券分享"
    width="600px"
    @ok="closeModal"
    :showCancelBtn="false"
  >
    <div class="pt-3 pr-3px flex flex-col items-center content-center">
      <LoadingOutlined v-if="!link" />
      <Qrcode ref="qrcode" :value="link" v-if="link" />
      <div class="mt-3">
        <a-button class="mr-4" type="link" @click="download">下载二维码</a-button>
        <a-button type="link" @click="copyLink">复制链接</a-button>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import Qrcode from '/@/components/Qrcode/src/Qrcode.vue';
  import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { linksCreateURL } from '/@/api/app/mms';

  const link = ref('');
  const qrcode = ref();

  const [registerModal, { closeModal }] = useModalInner((data) => {
    if (data.record) {
      linksCreateURL({
        path: 'packageA/pages/couponShare/couponShare',
        query: `code=${data.record.code}`,
      }).then((res) => {
        link.value = res.link;
      });
    }
  });

  function download() {
    qrcode.value?.download();
  }

  function copyLink() {
    try {
      copyTextToClipboard(link.value);
      message.success('复制成功');
    } catch (e) {
      message.error('复制失败');
    }
  }
</script>
