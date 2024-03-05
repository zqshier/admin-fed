<template>
  <PageWrapper :title="`订单编号：${orderNo}详情`" contentBackground @back="goBack">
    <div class="top-info p-4">
      <div class="title">
        <span class="txt">订单状态:</span>
        <Tag v-if="dataInfo.id" :color="OrderStatusColors(dataInfo.status)"
          >{{ orderStatusName }}
        </Tag>
      </div>
      <div>备注: {{ dataInfo.remark }}</div>
      <div class="btn-wrap">
        <a-button class="btn" @click="handleRemark">备注</a-button>
        <a-popconfirm
          v-if="dataInfo.status === OrderStatusEnum.PENDING_PAID"
          title="确认取消订单？"
          placement="bottom"
          @confirm="handleCancel"
        >
          <a-button class="btn">取消订单</a-button>
        </a-popconfirm>

        <a-button
          class="btn"
          @click="handlePrice"
          v-if="dataInfo.status === OrderStatusEnum.PENDING_PAID"
          >改价
        </a-button>
      </div>
      <div
        class="info"
        v-if="
          dataInfo.status === OrderStatusEnum.PENDING_PAID &&
          Date.now() < new Date(dataInfo.expirationTime).getTime()
        "
        ><StatisticCountdown
          title="买家不付款订单将自动取消"
          :value="dataInfo.expirationTime"
          style="margin-right: 50px"
        />
      </div>
    </div>
    <div class="p-4">
      <Description
        size="middle"
        title="订单信息"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="orderSchema"
      />
      <Description
        size="middle"
        title="买家信息"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="buyerSchema"
      />
      <Description
        size="middle"
        title="收货人信息"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="userSchema"
      />
      <div class="parcel-wrap" v-if="showParcel">
        <a-tabs type="card">
          <a-tab-pane
            :tab="`包裹${index + 1}`"
            v-for="(parcel, index) in dataInfo.parcelItems"
            :key="index"
          >
            <div class="parcel-pane">
              <div class="pane">
                <div class="title">商品信息</div>
                <div class="con">
                  <div class="goods-info" v-for="item in parcel.items" :key="item.id">
                    <div class="pic">
                      <a-image :src="item.goodsInfo.image" :width="60" :height="60" />
                    </div>
                    <div class="info">
                      <div class="name">{{ item.goodsInfo.name }}</div>
                      <div class="sku">{{ item.goodsInfo.skuSn }}</div>
                      <div class="sku"
                        >{{
                          item.goodsInfo.comb
                            ? item.goodsInfo.comb.map((item) => item.v).join(', ')
                            : '单品'
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pane">
                <div class="title">物流信息</div>
                <div class="con">
                  <Description
                    size="middle"
                    :bordered="false"
                    :column="1"
                    :data="parcel"
                    :schema="logisticSchema"
                  />
                </div>
              </div>
              <div class="pane">
                <div class="title"
                  >物流状态：<span>{{
                    { pending: '未发货', delivered: '已经发货', shiping: '运输中' }[parcel.state] ||
                    '-'
                  }}</span></div
                >
                <a-popconfirm
                  v-if="dataInfo.status !== OrderStatusEnum.COMPLETED"
                  title="是否确认收货？"
                  @confirm="handleReceiving(parcel)"
                >
                  <a-button type="primary" size="small">确认收货</a-button>
                </a-popconfirm>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <a-tabs>
        <a-tab-pane key="1" tab="订单金额">
          <BasicTable @register="registerPriceTable" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="优惠明细" force-render>
          <BasicTable @register="registerDiscountTable" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="支付渠道" force-render v-if="showPayChannelTab">
          <BasicTable @register="registerPayTable" />
        </a-tab-pane>
      </a-tabs>
      <BasicTable @register="registerGoodsTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="goods-info">
              <div class="pic">
                <a-image :src="record.goodsInfo.image" :width="60" :height="60" />
              </div>
              <div class="info">
                <div class="name">{{ record.goodsInfo.name }}</div>
                <div class="sku">{{ record.goodsInfo.skuSn }}</div>
                <div class="sku">{{
                  record.goodsInfo.comb
                    ? record.goodsInfo.comb.map((item) => item.v).join(', ')
                    : '单品'
                }}</div>
              </div>
            </div>
          </template>
          <template
            v-if="
              column.key === 'refundField' &&
              ![
                OrderStatusEnum.PENDING_PAID,
                OrderStatusEnum.CANCELED,
                OrderStatusEnum.CLOSED,
              ].includes(dataInfo.status)
            "
          >
            <p v-if="record.aftersaleItemStatus.itemStatus.serveStatus === 'serving'"
              ><Tag color="orange">退款中</Tag></p
            >
            <p v-if="record.aftersaleItemStatus.itemStatus.serveStatus === 'close'"
              ><Tag color="red">退款完成</Tag></p
            >
            <p v-if="record.aftersaleItemStatus.itemStatus.serveStatus === 'noserving'"
              ><Tag>无退款</Tag></p
            >
            <p>已退款: {{ record.aftersaleItemStatus.itemStatus.goodsRefundAmount }}</p>
            <p>退款中: {{ record.aftersaleItemStatus.itemStatus.pendingRefundAmount }}</p>
            <TableAction
              v-if="
                record.aftersaleItemStatus.itemStatus.serveStatus === 'noserving' &&
                record.totalPrice * 100 > 1
              "
              :actions="[
                {
                  label: '小额补差',
                  onClick: handleRefund.bind(null, record),
                },
              ]"
            />
            <TableAction
              v-if="record.aftersaleItemStatus.itemStatus.serveStatus === 'noserving'"
              :actions="[
                {
                  label: '退单',
                  onClick: handleRefundOrder.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <PriceModal @register="registerPrice" />
    <RemarkModal @register="registerRemark" />
    <RefundModal @register="registerRefund" />
    <ServiceModal @register="registerService" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import {
    Image as AImage,
    Popconfirm as APopconfirm,
    TabPane as ATabPane,
    Tabs as ATabs,
    Tag,
    message,
  } from 'ant-design-vue';
  import StatisticCountdown from 'ant-design-vue/es/statistic/Countdown';
  import Decimal from 'decimal.js';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import PriceModal from './components/PriceModal.vue';
  import RefundModal from './components/RefundModal.vue';
  import RemarkModal from './components/RemarkModal.vue';
  import ServiceModal from './components/ServiceModal.vue';
  import {
    OrderStatusColors,
    OrderStatusEnum,
    OrderStatusNames,
    OrderType,
    buyerSchema,
    dicountTableSchema,
    goodsTableSchema,
    logisticSchema,
    orderSchema,
    payChannelTableSchema,
    priceTableSchema,
    userSchema,
  } from './data';
  import {
    orderManualParcelArrived,
    ordersAftersaleItemStatus,
    ordersCancel,
    ordersDetail,
  } from '/@/api/app/orders';
  import { Description } from '/@/components/Description/index';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  const route = useRoute();
  const router = useRouter();
  const { setTitle } = useTabs();

  const orderNo = ref(route.params?.orderNo);

  const dataInfo = ref<Recordable>({
    orderItems: [],
    deliverAddr: {},
  });

  const showParcel = ref(false);

  const showPayChannelTab = computed(() => {
    const { bizCode = '', giftCardDiscountAmount = '' } = dataInfo.value;
    if (!bizCode || !giftCardDiscountAmount) return false;
    return bizCode === OrderType.default && +giftCardDiscountAmount > 0;
  });

  const [registerPrice, { openModal: openPrice }] = useModal();
  const [registerRemark, { openModal: openRemark }] = useModal();
  const [registerRefund, { openModal: openRefund }] = useModal();
  const [registerService, { openModal: openService }] = useModal();

  onMounted(async () => {
    setTitle('详情：订单编号' + orderNo.value);
    try {
      await getOrderDetail(orderNo.value as string);
    } catch (error) {}
  });

  async function getOrderDetail(orderNo: string) {
    const res = await ordersDetail(orderNo);
    // console.log(res);
    dataInfo.value = res;

    if (dataInfo.value.parcelItems && dataInfo.value.parcelItems.length > 0) {
      dataInfo.value.parcelItems.map((parcel) => {
        parcel.items = parcel.items.map((item) => {
          const gitem = dataInfo.value.orderItems.find(
            (_item) => _item.skuId === item.skuId && _item.goodsId === item.goodsId,
          );
          return {
            ...gitem,
            ...item,
          };
        });
        return parcel;
      });
      showParcel.value = true;
    }

    setPriceTableData([dataInfo.value]);

    const statusList = await ordersAftersaleItemStatus(orderNo);

    setGoodsTableData(
      dataInfo.value.orderItems.map((item: Recordable) => {
        const status = statusList.find((a) => a.orderNo === item.orderNo);
        const itemStatus = status.items.find(
          (status: Recordable) => status.goodsId === item.goodsId && status.skuId === item.skuId,
        );
        return {
          ...item,
          aftersaleItemStatus: {
            itemStatus,
            costFrightRefundableAmount: status.costFrightRefundableAmount,
          },
        };
      }),
    );

    const discountTableDatas =
      dataInfo.value.discountDetails.filter((item) => item.type !== OrderType.giftCard) || [];
    discountTableDatas.forEach((data) => {
      data.items.forEach((itm) => {
        const [orderItem, _] = dataInfo.value.orderItems.filter((i) => i.skuId === itm.skuId) || [];
        itm.orderItem = orderItem;
      });
    });
    console.debug('setDiscountTableData discountTableDatas', discountTableDatas);
    setDiscountTableData(discountTableDatas);

    setPayTableData(
      (dataInfo.value.discountDetails && [
        {
          channel: '微信支付',
          price: dataInfo.value.payableAmount,
        },
        ...dataInfo.value.discountDetails
          .filter((i) => i.type === OrderType.giftCard)
          .map((item: Recordable) => {
            return {
              channel: `${item.identifier}兑换卡`,
              price: item.discountAmount,
            };
          }),
      ]) ||
        [],
    );
  }

  const [registerPriceTable, { setTableData: setPriceTableData }] = useTable({
    title: '',
    bordered: true,
    columns: priceTableSchema,
    pagination: false,
    showIndexColumn: false,
    childrenColumnName: 'xchild', //data中有children字段，设置没有的字段来禁用展开
  });

  const [registerDiscountTable, { setTableData: setDiscountTableData }] = useTable({
    title: '',
    bordered: true,
    columns: dicountTableSchema,
    pagination: false,
    showIndexColumn: false,
    childrenColumnName: 'xchild', //data中有children字段，设置没有的字段来禁用展开
  });

  const [registerGoodsTable, { setTableData: setGoodsTableData }] = useTable({
    title: ' ',
    bordered: true,
    columns: goodsTableSchema,
    actionColumn: {
      title: '退款',
      dataIndex: 'refundField',
      fixed: undefined,
      width: 230,
      ellipsis: true,
    },
    pagination: false,
    showIndexColumn: false,
  });

  const [registerPayTable, { setTableData: setPayTableData }] = useTable({
    title: '',
    bordered: true,
    columns: payChannelTableSchema,
    pagination: false,
    showIndexColumn: false,
  });

  //取消订单
  async function handleCancel() {
    await ordersCancel({
      orderNo: dataInfo.value.orderNo,
      userId: dataInfo.value.userId,
      cancelMemo: '管理取消',
    });
    await getOrderDetail(dataInfo.value.orderNo);
  }

  async function handleRemark() {
    openRemark(true, {
      orderNo: dataInfo.value.orderNo,
      remark: dataInfo.value.remark,
      success: async () => {
        await getOrderDetail(dataInfo.value.orderNo);
      },
    });
  }

  //改价
  function handlePrice() {
    console.log(dataInfo.value.costFreight, dataInfo.value.changeCostFreight);
    openPrice(true, {
      orderNo: dataInfo.value.orderNo,
      price: Decimal.add(0, Number(dataInfo.value.payableAmount)).toNumber(),
      goodsPrice: new Decimal(dataInfo.value.orderAmount).toNumber(),
      changeAmount: new Decimal(dataInfo.value.changeAmount).toNumber(),
      changeCostFreight: new Decimal(dataInfo.value.changeCostFreight).toNumber(),
      costFreight: Decimal.sub(
        Number(dataInfo.value.costFreight),
        Number(dataInfo.value.changeCostFreight),
      ).toNumber(),
      success: async () => {
        await getOrderDetail(dataInfo.value.orderNo);
      },
    });
  }

  // 主动退款
  function handleRefund(row: Recordable) {
    const aftersaleItemStatus = row.aftersaleItemStatus;
    openRefund(true, {
      orderNo: row.orderNo,
      skuId: row.skuId,
      goodsId: row.goodsId,
      userId: dataInfo.value.userId,
      costFrightRefundableAmount: aftersaleItemStatus.costFrightRefundableAmount,
      goodsRefundableAmount: aftersaleItemStatus.itemStatus.goodsRefundableAmount,
      success: async () => {
        await getOrderDetail(dataInfo.value.orderNo);
      },
    });
  }

  // 退单
  function handleRefundOrder(row: Recordable) {
    openService(true, {
      ...row,
      userId: dataInfo.value.userId,
      success: () => getOrderDetail(row.orderNo),
    });
  }

  const orderStatusName = computed(() => {
    if (
      dataInfo.value.status === OrderStatusEnum.PENDING_PAID &&
      Date.now() > new Date(dataInfo.value.expirationTime).getTime()
    ) {
      return '已过期, 等待取消';
    }
    return OrderStatusNames[dataInfo.value.status];
  });

  function goBack() {
    const { currentRoute } = router;
    const targetKey = currentRoute.value.fullPath;
    useMultipleTabStore().closeTabByKey(targetKey, router);
  }

  // 确认收货
  async function handleReceiving(row: Recordable) {
    const { id = 0, orderNo = '' } = row;
    if (!id || !orderNo) return;

    let result;
    try {
      result = await orderManualParcelArrived({ parcelId: id, orderNo });
    } catch (e) {}
    if (!result) return;
    message.success('操作成功');
    await getOrderDetail(dataInfo.value.orderNo);
    return true;
  }
</script>

<style lang="less" scoped>
  .top-info {
    margin-bottom: 20px;

    .title {
      font-size: 20px;
      display: flex;
      align-items: center;

      .txt {
        margin-right: 10px;
      }
    }

    .btn-wrap {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .btn {
        margin-right: 20px;
      }
    }

    .info {
      margin-top: 10px;

      .time {
        color: red;
      }
    }
  }

  .parcel-wrap {
    margin: 20px 0;
  }

  .goods-info {
    display: flex;

    .pic {
      margin-right: 10px;

      img {
        object-fit: scale-down;
      }
    }

    .info {
      text-align: left;
    }
  }

  .parcel-pane {
    display: flex;

    .pane {
      flex: 1;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }

      .title {
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }

      :deep(td) {
        // padding-bottom: 8px;
      }
    }
  }
</style>
