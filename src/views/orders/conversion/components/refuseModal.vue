<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="审核拒绝"
    width="400px"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import { ERefuseType, refuseTypeOptions } from '../data';
  import { orderConversionAudit as auditApi } from '/@/api/app/orders';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const emit = defineEmits(['refresh']);

  const formSchemas: FormSchema[] = [
    {
      required: true,
      field: 'refuseType',
      label: '请选择拒绝原因',
      component: 'Select',
      componentProps: { options: refuseTypeOptions },
    },
    {
      required: true,
      field: 'refuseReason',
      label: ' ',
      component: 'InputTextArea',
      componentProps: {
        rows: 4,
        placeholder: '请输入拒绝原因',
        maxlength: 50,
        showCount: true,
      },
      ifShow: ({ values }) => values.refuseType === 3,
    },
  ];

  const refuseIds = ref<number[]>([]);

  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.error('data', data);
    resetFields();
    refuseIds.value = data.ids;
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      let { refuseType, refuseReason } = values;
      if (refuseType != ERefuseType.other)
        refuseReason = refuseTypeOptions.find((i) => i.value === refuseType)?.label;

      await auditApi({ ids: refuseIds.value, isAllow: false, refuseType, refuseReason });
      message.success('审核拒绝成功');
      emit('refresh');
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
