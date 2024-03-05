<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="600px"
    @ok="handleSubmit"
  >
    <div class="con-wrap">
      <div class="tip">请输入需要新增的数量</div>
      <div class="input-wrap">
        <a-button @click="numMinus">-</a-button>
        <a-input class="inp" v-model:value="inpNum" :min="1" />
        <a-button @click="numPlus">+</a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message, Input as AInput } from 'ant-design-vue';
  import { qrcodesBatchesCreate } from '/@/api/app/qrcodes';

  const emit = defineEmits(['success', 'register']);

  let updateId: number;

  const inpNum = ref(1);

  //弹窗
  const [registerDrawer, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    updateId = data.record?.id;
    inpNum.value = 1;
  });

  // 弹窗标题
  const title = '添加一物一码数量';

  async function handleSubmit() {
    try {
      if (!inpNum.value || inpNum.value < 1) {
        message.error('请输入正整数');
        return;
      }
      setModalProps({ confirmLoading: true });

      let result = await qrcodesBatchesCreate(updateId, inpNum.value);

      closeModal();
      emit('success', { values: { ...result } });
      message.success('提交成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function numPlus() {
    if (!inpNum.value) {
      inpNum.value = 0;
    }
    inpNum.value++;
  }

  function numMinus() {
    if (inpNum.value > 1) {
      inpNum.value--;
    }
  }
</script>

<style lang="less" scoped>
  .con-wrap {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .tip {
      color: #999;
    }
    .input-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 6px;
      :deep(input) {
        text-align: center;
      }
      .inp {
        width: 100px;
      }
    }
  }
</style>
