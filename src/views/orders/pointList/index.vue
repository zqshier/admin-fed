<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'orderNo'">
          <a-button type="link" @click="handleViewDetail(record)">{{ record.orderNo }}</a-button>
        </template>
        <template v-if="column.key === 'deliverAddr'">
          <div>{{ (record.deliverAddr && record.deliverAddr.name) || '-' }}</div>
          <div>{{ (record.deliverAddr && record.deliverAddr.phone) || '-' }}</div>
        </template>
        <template v-if="column.key === 'goodsType'">
          <div class="flex flex-col" :style="{ height: '80px' }">
            <div
              class="flex flex-1 justify-center items-center"
              v-for="item in record.orderItems"
              :key="item.id"
            >
              {{
                (item.itemType &&
                  goodsTypeOptions.find((i) => i.value === +item.itemType)?.label) ||
                ''
              }}
            </div>
          </div>
        </template>
        <template v-if="column.key === 'items'">
          <div class="goods_box">
            <div class="box_item" v-for="item in record.orderItems" :key="item.id">
              <div class="pic">
                <a-image :src="item.goodsInfo.image" :width="80" :height="80" />
              </div>
              <div class="box_item-r">
                <div class="top">
                  <span class="name">{{ item.goodsInfo.name }}</span>
                  <span class="count">x{{ item.count }}</span>
                </div>
                <div class="bottom">
                  <Tag class="sku" color="blue" v-if="item.goodsInfo?.comb?.length">
                    <span v-for="(comb, idx) in item.goodsInfo.comb" :key="idx">
                      {{ comb.k }}：{{ comb.v }}
                      <span v-if="idx + 1 < item.goodsInfo.comb.length"> &nbsp;I&nbsp; </span>
                    </span>
                  </Tag>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :stopButtonPropagation="true"
            :actions="[
              {
                label: '发货',
                onClick: handleShipment.bind(null, record),
                ifShow: () => record.status === OrderStatusEnum.PENDING_SHIPMENT,
              },
              // {
              //   label: '退单',
              //   onClick: handleRefundOrder.bind(null, record),
              //   ifShow: () =>
              //     record.status === OrderStatusEnum.COMPLETED ||
              //     record.status === OrderStatusEnum.PENDING_RECEIPT ||
              //     record.status === OrderStatusEnum.PENDING_SHIPMENT,
              // },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出报表</a-button>
      </template>
    </BasicTable>
    <ExportModal @register="registerExport" />
    <ShipmentModal @register="registerShipment" />
  </div>
</template>
<script lang="ts" setup name="OrdersPointList">
  import { Image as AImage, Tag } from 'ant-design-vue';
  import { pickBy } from 'lodash-es';
  import { goodsTypeOptions } from '../../goods/list/data';
  import ExportModal from '../list/components/ExportModal.vue';
  import ShipmentModal from '../list/components/ShipmentModal.vue';
  import { OrderStatusEnum, OrderType } from '../list/data';
  import { columns, primaryKey, searchFormSchema } from './data';
  import { ordersList as listApi } from '/@/api/app/orders';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();

  const [registerExport, { openModal: openExport }] = useModal();
  const [registerShipment, { openModal: openShipment }] = useModal();

  const [registerTable, { reload, getForm }] = useTable({
    title: '订单列表',
    api: listApi,
    beforeFetch(params) {
      return { ...pickBy(params), bizCodes: `${OrderType.point}` };
    },
    afterFetch(dataList) {
      dataList.forEach((item: Recordable) => {
        if (item.children && item.children.length == 0) {
          delete item.children;
        }
      });
      return dataList;
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showIndexColumn: false,
    showTableSetting: true,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 80 },
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 6 },
    },
  });

  // 查看详情
  function handleViewDetail(row: Recordable) {
    go('/orders/pointDetail/' + row.orderNo);
  }

  //发货
  function handleShipment(row: Recordable) {
    openShipment(true, { row, ids: [row.id], orderNos: [row.orderNo], onSuccess: reload });
  }

  //导出全部
  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    Object.assign(value, { bizCodes: `${OrderType.point}` });
    openExport(true, { orderFilterParams: value });
  }

  // 退单
  // function handleRefundOrder(row: Recordable) {
  //   const { orderNo = '' } = row;
  //   if (!orderNo) return;
  //   Modal.confirm({
  //     title: '是否将该订单进行退单？',
  //     content: '退单后积分和支付金额将原路返回用户账户',
  //     onOk: async () => {
  //       return new Promise((resolve, reject) => {
  //         cancelApi(orderNo)
  //           .then((res) => {
  //             resolve(res);
  //             reload();
  //           })
  //           .catch((err) => reject(err));
  //       }).catch((err) => message.error((err as any).message));
  //     },
  //   });
  // }
</script>
<style lang="less" scoped>
  .goods_box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .box_item {
      display: flex;
      margin-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
      .box_item-r {
        padding-left: 5px;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
          .name {
            flex: 1;
            text-align: left;
          }
          .count {
            margin-left: 30px;
          }
        }

        .bottom {
          display: flex;
          align-items: flex-start;
        }
      }
      &:last-child {
        margin-bottom: 0;
        border-bottom: none;
      }
    }
  }
</style>
