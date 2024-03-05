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
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'sendNum'">
            <RegInput v-model:value="record['sendNum']" :type="RegInputType.int" />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { couponConditionList } from '/@/views/mms/coupons/data';
  import { couponsList, couponsSend } from '/@/api/app/mms';
  import { RegInput, RegInputType } from '/@/components/RegInput';

  const emit = defineEmits(['success', 'register']);

  // 弹窗标题
  const title = '发放优惠券';

  let dataInfo: Recordable = {};

  const tableSchema: BasicColumn[] = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
    },
    {
      title: '优惠内容',
      dataIndex: 'value',
      customRender: ({ record }: Recordable) => {
        return `满${record.threshold}减${record.value}元`;
      },
    },
    {
      width: 90,
      title: '适用条件',
      dataIndex: 'condition',
      customRender: ({ value }) =>
        couponConditionList.find((item) => item.value == value.type)?.label,
    },
    {
      title: '剩余库存',
      dataIndex: 'stock',
      width: 100,
      customRender: ({ record }: Recordable) => {
        return record.stock - record.sent;
      },
    },
    // {
    //   title: '发券数',
    //   dataIndex: 'sendNum',
    //   width: 120,
    // },
  ];

  const [registerTable, { getSelectRows }] = useTable({
    title: '',
    rowKey: 'id',
    api: couponsList,
    beforeFetch: (params) => {
      return { ...params, state: 1, disabled: 0 };
    },
    columns: tableSchema,
    pagination: true,
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
        dataInfo = { ...data.record };
      }

      nextTick(redoModalHeight);
    },
  );

  async function handleSubmit() {
    try {
      const values = getSelectRows();
      if (values.length === 0) {
        return message.warn('需至少选择一张优惠券');
      }

      if (values.length > 5) {
        return message.warn('一次最多发送5张优惠券');
      }

      // const coupons = values.map((item) => {
      //   return {
      //     id: item.id,
      //     num: Number(item.sendNum),
      //   };
      // });

      // if (coupons.some((item) => !item.num)) {
      //   return message.warn('请填写发放券数');
      // }

      setModalProps({ confirmLoading: true });

      const successed: { id: number; name: string }[] = [];
      for (const row of values) {
        console.log(row);
        try {
          await couponsSend({ userId: dataInfo.userIds[0], couponId: row.id });
          successed.push(row as any);
        } catch (error) {
          console.log(error);
        }
      }

      // const params = { coupons, userIds: dataInfo.userIds, ...dataInfo.params };
      // console.log(params);
      //待添加接口
      dataInfo.resolve?.();
      closeModal();
      emit('success');
      message.success('成功发放' + successed.length + '张优惠券');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
