<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    :title="title"
    width="900px"
    :minHeight="60"
    @ok="handleSubmit"
    wrap-class-name="common-modal-wrap"
  >
    <div class="p-8px">
      <BasicTable @register="registerTable" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { nextTick } from 'vue';
  import { getAccessList } from '/@/api/sys/access';
  import { updateRoles } from '/@/api/sys/role';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';

  const emit = defineEmits(['success', 'register']);

  // 弹窗标题
  const title = '权限设置';

  let dataInfo: Recordable = {};

  const tableSchema: BasicColumn[] = [
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '备注',
      dataIndex: 'description',
    },
  ];

  const [registerTable, { setSelectedRowKeys, getSelectRowKeys }] = useTable({
    title: '',
    rowKey: 'id',
    api: getAccessList,
    beforeFetch: (params) => {
      return { ...params };
    },
    columns: tableSchema,
    pagination: false,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'checkbox', preserveSelectedRowKeys: true },
    useSearchForm: false,
    bordered: true,
  });

  //弹窗
  const [registerModal, { setModalProps, closeModal, redoModalHeight }] = useModalInner(
    async (data) => {
      setModalProps({ confirmLoading: false });
      if (data.record) {
        dataInfo = { ...data.record, success: data.success };
        setSelectedRowKeys(dataInfo.apiIds.split(',').map(Number));
      }

      nextTick(redoModalHeight);
    },
  );

  async function handleSubmit() {
    try {
      const apiIds = getSelectRowKeys()
        .map(Number)
        .filter((n) => n > 0);
      if (!apiIds.length) {
        return message.warn('未选中任何权限');
      }

      setModalProps({ confirmLoading: true });
      await updateRoles(dataInfo.roleName, {
        appId: dataInfo.appId,
        domainId: dataInfo.domainId,
        apiIds: apiIds.map(Number),
      });
      console.log(dataInfo);
      dataInfo.success?.();
      dataInfo.resolve?.();
      closeModal();
      emit('success');
      message.success('设置成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
