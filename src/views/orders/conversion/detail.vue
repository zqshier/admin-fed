<template>
  <PageWrapper :title="`订单ID：${orderId}详情`" contentBackground @back="goBack">
    <div class="top-info p-4">
      <div class="title">
        <span class="txt">订单记录状态:</span>
        <Tag :color="auditStatusOptions.find((i) => i.value === dataInfo.auditStatus)?.color"
          >{{ auditStatusOptions.find((i) => i.value === dataInfo.auditStatus)?.label }}
        </Tag>
      </div>
    </div>
    <div class="p-4">
      <Description
        size="middle"
        title="用户信息"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="userSchema"
      />
      <Description
        size="middle"
        title="订单记录信息"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="orderSchema"
      />
      <Description
        size="middle"
        title="补充信息"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="replenishSchema"
      />

      <BasicTable @register="registerGoodsTable" />

      <Description size="middle" title="积分发放记录" :bordered="false" :column="1" />
      <BasicTable @register="registerPointTable" />
    </div>

    <div
      v-if="dataInfo.auditStatus === EOrderConversionAuditStatus.pending"
      class="p-4 flex justify-center"
    >
      <a-button class="m-2" @click="handleEdit">编辑</a-button>
      <Popconfirm title="是否将该记录审核通过？" @confirm="handleOk">
        <a-button class="m-2" type="primary">审核通过</a-button>
      </Popconfirm>
      <a-button class="m-2" :loading="btnLoading" @click="handleCancel" danger>审核拒绝</a-button>
    </div>

    <refuseModal @register="registerRefuseModal" @refresh="handleRefresh" />
    <detailDrawer @register="registerEditDrawer" @refresh="handleRefresh" />
    <ConfirmPriceModal @register="registerComfirmModal" @refresh="handleRefresh" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Popconfirm, Tag, message } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ConfirmPriceModal from './components/ConfirmPriceModal.vue';
  import refuseModal from './components/refuseModal.vue';
  import {
    ERefuseType,
    auditStatusOptions,
    goodsTableSchema,
    orderSchema,
    pointTableSchema,
    refuseTypeOptions,
    replenishSchema,
    userSchema,
  } from './data';
  import detailDrawer from './detailDrawer.vue';
  import { EOrderConversionAuditStatus } from '/@/api/app/model/ordersModel';
  import { orderConversionDetail as detailApi } from '/@/api/app/orders';
  import { Description } from '/@/components/Description/index';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  const route = useRoute();
  const router = useRouter();
  const { setTitle } = useTabs();

  const orderId = ref(route.params?.orderId);
  const dataInfo = ref<Recordable>({
    orderItems: [],
    deliverAddr: {},
  });
  const btnLoading = ref<boolean>(false);
  let goBackRefresh = false;

  const [registerEditDrawer, { openDrawer: openEditDrawer }] = useDrawer();
  const [registerRefuseModal, { openModal: openRefuseModal }] = useModal();
  const [registerComfirmModal, { openModal: openComfirmModal }] = useModal();

  onMounted(async () => {
    goBackRefresh = false;
    setTitle(`详情：订单ID  ${orderId.value}`);
    try {
      await getOrderDetail();
    } catch (error) {}
  });

  async function getOrderDetail() {
    const res = await detailApi(+orderId.value);
    // console.log(res);
    dataInfo.value = res;

    // 应收金额payAmount 如果没值则读取订单金额orderAmount
    if (!dataInfo.value?.payAmount) dataInfo.value.payAmount = dataInfo.value?.orderAmount || '';

    let goodsInfo: Recordable = [];
    if (dataInfo.value?.goodsInfo && dataInfo.value.goodsInfo?.length) {
      goodsInfo = dataInfo.value?.goodsInfo.map((i) => ({
        ...i,
        specName: i.specName || i.goodsName,
      }));
    } else {
      // 没有商品信息用订单记录信息组合一条新数据
      if (dataInfo.value?.productName || dataInfo.value?.orderAmount) {
        const o = {
          amount: dataInfo.value?.orderAmount || '',
          goodsBarCode: '',
          goodsName: dataInfo.value?.productName || '',
          notes: '',
          num: 1,
          price: '',
          skuBarCode: '',
          specName: '',
        };
        goodsInfo.push(o);
      }
    }

    dataInfo.value.goodsInfo = goodsInfo;
    setGoodsTableData(dataInfo.value.goodsInfo);

    if (
      dataInfo.value?.actualIntegral ||
      dataInfo.value?.grantStatus ||
      dataInfo.value?.refuseReason
    ) {
      setPointTableData([
        {
          actualIntegral: dataInfo.value.actualIntegral,
          grantStatus: dataInfo.value?.grantStatus,
          refuseReason:
            (dataInfo.value?.refuseType == ERefuseType.other && dataInfo.value?.refuseReason) ||
            refuseTypeOptions.find((i) => i.value == dataInfo.value?.refuseType)?.label,
        },
      ]);
    }
  }

  const [registerPointTable, { setTableData: setPointTableData }] = useTable({
    title: '',
    bordered: true,
    columns: pointTableSchema,
    pagination: false,
    showIndexColumn: false,
    childrenColumnName: 'xchild', //data中有children字段，设置没有的字段来禁用展开
  });

  const [registerGoodsTable, { setTableData: setGoodsTableData }] = useTable({
    title: '商品信息',
    bordered: true,
    columns: goodsTableSchema,
    pagination: false,
    showIndexColumn: false,
  });

  async function goBack() {
    const { currentRoute } = router;
    const targetKey = currentRoute.value.fullPath;
    await useMultipleTabStore().closeTabByKey(targetKey, router);
    if (goBackRefresh) await useMultipleTabStore().refreshPage(router);
  }

  async function handleOk() {
    // 审核通过
    // 判断该条记录中是否存在"预计发放积分数"
    if (!dataInfo.value?.predictIntegral) {
      message.error('请输入实付金额后再次操作');
      return;
    }
    openComfirmModal(true, { ...dataInfo.value });
  }

  async function handleCancel() {
    openRefuseModal(true, { ids: [+orderId.value] });
  }

  function handleEdit() {
    openEditDrawer(true, { record: dataInfo.value });
  }

  function handleRefresh() {
    goBackRefresh = true;
    getOrderDetail();
  }
</script>

<style lang="less" scoped>
  .top-info {
    .title {
      font-size: 20px;
      display: flex;
      align-items: center;

      .txt {
        margin-right: 10px;
        font-weight: 600;
      }
    }
  }
</style>
