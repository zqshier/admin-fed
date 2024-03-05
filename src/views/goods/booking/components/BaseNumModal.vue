<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="修改预约人数"
    width="500px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <a-form :label-col="{ span: 10 }">
        <a-form-item label="实际预约人数：">
          <span>{{ openData.bookedNumbers }}</span>
        </a-form-item>
        <a-form-item label="在实际预约的基础上增加：">
          <a-input-number v-model:value="addNumber" :min="0" :precision="0" />
        </a-form-item>
        <a-form-item label="展示预约人数：">
          <span>{{ openData.bookedNumbers + Number(addNumber) }}</span>
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    message,
    Form as AForm,
    FormItem as AFormItem,
    InputNumber as AInputNumber,
  } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { bookingUpdate as updateApi } from '/@/api/app/booking';

  interface OpenDataModel {
    bookedNumbers: number;
    id: number;
    success?: (res: Recordable) => void;
    bookedBaseNumbers: number;
  }

  const addNumber = ref(1);

  const openData = reactive<OpenDataModel>({
    bookedBaseNumbers: 0,
    bookedNumbers: 0,
    id: 0,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data: OpenDataModel) => {
    if (data) {
      Object.assign(openData, data);
    }
    addNumber.value = openData.bookedBaseNumbers || 0;
  });

  async function handleSubmit() {
    try {
      if (addNumber.value === undefined || addNumber.value === null) {
        message.error('请输入增加的人数');
        return;
      }
      setModalProps({ confirmLoading: true });
      const result = await updateApi(openData.id, { counterBase: addNumber.value } as any);
      message.success('修改成功');
      openData.success?.({ ...result, bookedBaseNumbers: addNumber.value });
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
