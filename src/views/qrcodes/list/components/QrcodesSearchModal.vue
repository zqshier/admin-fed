<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="600px"
    @ok="handleSubmit"
    okText="查询"
  >
    <BasicForm @register="registerForm" />
    <div v-show="linkInp">
      <BasicTable @register="registerTable" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { qrcodesQuery } from '/@/api/app/qrcodes';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import { timeRender } from '../data';
  import { ref } from 'vue';

  const formSchema: FormSchema[] = [
    {
      required: true,
      field: 'link',
      label: '二维码链接',
      component: 'Input',
    },
  ];

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    labelWidth: 140,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setModalProps }] = useModalInner(async () => {
    resetFields();
    setModalProps({ confirmLoading: false });
    setFieldsValue({ link: '' });
  });

  // 弹窗标题
  const title = '二维码查询';

  const linkInp = ref('');

  const columns: BasicColumn[] = [
    {
      title: '扫码用户ID',
      dataIndex: 'userId',
    },
    {
      title: '扫码时间',
      dataIndex: 'createdAt',
      customRender: timeRender,
    },
  ];

  const [registerTable, { reload }] = useTable({
    api: qrcodesQuery,
    rowKey: 'id',
    columns: columns,
    bordered: true,
    showTableSetting: false,
    showIndexColumn: false,
    useSearchForm: false,
    beforeFetch(params) {
      params.link = encodeURIComponent(linkInp.value);
      return params;
    },
    immediate: false,
  });

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setModalProps({ confirmLoading: true });
      linkInp.value = values.link;
      reload({ page: 1 });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
