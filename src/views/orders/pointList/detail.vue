<template>
  <PageWrapper :title="`积分订单编号：${orderNo}详情`" contentBackground @back="goBack">
    <div class="top-info p-4">
      <div class="title">
        <span class="txt">订单状态:</span>
        <Tag v-if="dataInfo.id" :color="OrderStatusColors(dataInfo.status)"
          >{{ orderStatusName }}
        </Tag>
        <a-button
          v-if="dataInfo.status === OrderStatusEnum.PENDING_SHIPMENT"
          type="primary"
          size="small"
          @click="handleShipment(dataInfo)"
          >发货</a-button
        >
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
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
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
                <Tag class="sku" color="blue" v-if="record.goodsInfo?.comb?.length">
                  <span v-for="(comb, idx) in record.goodsInfo.comb" :key="idx">
                    {{ comb.k }}：{{ comb.v }}
                    <span v-if="idx + 1 < record.goodsInfo.comb.length"> &nbsp;I&nbsp; </span>
                  </span>
                </Tag>
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
            <p
              v-if="
                record.aftersaleItemStatus.itemStatus.serveStatus === EOrderItemServeStatus.SERVING
              "
              ><Tag color="orange">退款中</Tag></p
            >
            <p
              v-if="
                record.aftersaleItemStatus.itemStatus.serveStatus === EOrderItemServeStatus.CLOSE
              "
              ><Tag color="red">退款完成</Tag></p
            >
            <p
              v-if="
                record.aftersaleItemStatus.itemStatus.serveStatus ===
                EOrderItemServeStatus.NOSERVING
              "
              ><Tag>无退款</Tag></p
            >
            <p>已退款: {{ record.aftersaleItemStatus.itemStatus.goodsRefundAmount }}</p>
            <p>退款中: {{ record.aftersaleItemStatus.itemStatus.pendingRefundAmount }}</p>

            <TableAction
              v-if="
                record.aftersaleItemStatus.itemStatus.serveStatus ===
                EOrderItemServeStatus.NOSERVING
              "
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
    <RemarkModal @register="registerRemark" />
    <ShipmentModal @register="registerShipment" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import {
    Image as AImage,
    Popconfirm as APopconfirm,
    TabPane as ATabPane,
    Tabs as ATabs,
    Modal,
    Tag,
    message,
  } from 'ant-design-vue';
  import StatisticCountdown from 'ant-design-vue/es/statistic/Countdown';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import RemarkModal from '../list/components/RemarkModal.vue';
  import ShipmentModal from '../list/components/ShipmentModal.vue';
  import {
    OrderStatusColors,
    OrderStatusEnum,
    OrderStatusNames,
    logisticSchema,
  } from './../list/data';
  import { buyerSchema, goodsTableSchema, orderSchema, userSchema } from './data';
  import { AfterSaleType, EOrderItemServeStatus } from '/@/api/app/model/ordersModel';
  import {
    aftersaleRefundOrder,
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

  const [registerRemark, { openModal: openRemark }] = useModal();

  onMounted(async () => {
    setTitle('积分详情：订单编号' + orderNo.value);
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
  }

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

  //发货
  const [registerShipment, { openModal: openShipment }] = useModal();
  function handleShipment(row: Recordable) {
    openShipment(true, {
      row,
      ids: [row.id],
      orderNos: [row.orderNo],
      onSuccess: () => {
        getOrderDetail(row.orderNo);
      },
    });
  }

  // 退单
  function handleRefundOrder(row: Recordable) {
    const { orderNo = '', goodsId = '', skuId = '' } = row;
    if (!orderNo) return;
    Modal.confirm({
      title: '是否将该商品进行退单？',
      content: '退单后积分和支付金额将原路返回用户账户',
      onOk: async () => {
        return new Promise((resolve, reject) => {
          aftersaleRefundOrder({
            type: AfterSaleType.MONEY_ONLY,
            isRefundCostFright: false,
            orderNo,
            userId: dataInfo.value.userId,
            reason: '后台操作退单',
            items: [{ goodsId, skuId, refundGoodsAmount: '0' }],
          })
            .then((res) => {
              resolve(res);
              getOrderDetail(orderNo);
            })
            .catch((err) => reject(err));
        }).catch((err) => message.error((err as any).message));
      },
    });
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
