<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    :title="title"
    width="800px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { giftCardsBatchUpdate } from '/@/api/app/giftCard';
  import {
    GiftCardsBatchUpdateCards,
    GiftCardsBatchUpdateParams,
  } from '/@/api/app/model/giftCardModel';
  import { FormSchema } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const schemas: FormSchema[] = [
    {
      field: 'identityNo',
      label: '身份证',
      component: 'Input',
    },
    {
      field: 'phone',
      label: '电话',
      component: 'Input',
    },
    {
      field: 'address',
      label: '地址',
      component: 'Input',
    },
    {
      field: 'name',
      label: '公司名称/姓名',
      component: 'Input',
    },
    {
      field: 'bankCardNo',
      label: '付款账号',
      component: 'Input',
    },
  ];

  const title = ref('备注');
  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>(0);
  const updateTableId = ref<number>(0);
  const record = reactive<GiftCardsBatchUpdateCards>({ cardNo: '' });

  const emit = defineEmits(['success']);

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    isUpdate.value = !!data?.isUpdate;

    // 默认值
    Object.assign(record, {
      identityNo: '', // 身份证
      phone: '', // 电话号码
      name: '', // 公司名称|姓名
      bankCardNo: '', // 付款账号
      address: '', // 地址
      cardNo: '', // 卡号, 支持多个卡号
    });

    if (data.record) {
      Object.assign(record, data.record);

      updateId.value = data?.cardConfigId || 0;
      updateTableId.value = data?.cardId || 0;
      // delete record[primaryKey];
    }

    console.debug('record', record);

    setFieldsValue(record);
    clearValidate();
  });

  const [registerForm, { validate, setFieldsValue, clearValidate, resetFields }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      // console.debug('handleSubmit values=', values);

      let isModify = false;
      for (const val in values) {
        if (Object.prototype.hasOwnProperty.call(values, val)) {
          if (values[val] !== '') {
            isModify = true;
            break;
          }
        }
      }
      if (!isModify) return closeModal();

      setModalProps({ confirmLoading: true });
      const { cardNo } = record;
      const cards = [{ cardNo, ...values }];
      const params: GiftCardsBatchUpdateParams = { cards };
      await giftCardsBatchUpdate(updateId.value, params);
      emit('success', {
        values: { ...record, ext: { ...values }, id: updateTableId.value },
        isUpdate: true,
      });
      message.success('操作完成');
      closeModal();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
