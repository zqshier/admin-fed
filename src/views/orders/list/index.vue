<template>
  <div class="p-4">
    <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'orderNo'">
          <a-button type="link" @click="handleViewDetail(record)">{{ record.orderNo }}</a-button>
        </template>
        <template v-if="column.key === 'status'">
          <Tag :color="OrderStatusColors(record.status)">{{ OrderStatusNames[record.status] }}</Tag>
        </template>
        <template v-if="column.key === 'deliverAddr'">
          <div>{{ (record.deliverAddr && record.deliverAddr.name) || '-' }}</div>
          <div>{{ (record.deliverAddr && record.deliverAddr.phone) || '-' }}</div>
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
                label: '取消订单',
                popConfirm: {
                  title: '是否确认取消订单？',
                  confirm: handleCancelOrder.bind(null, record),
                },
                ifShow: () => record.status === 'pending_paid',
              },
              {
                label: '发货',
                onClick: handleShipment.bind(null, record),
                ifShow: () => record.status === 'pending_shipment',
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <tabs-option :options="tabsOptionList" v-model="tabsActive" @change="reload()" />
        <a-button v-if="false" type="primary" @click="handleRemarkBat">批量备注</a-button>
        <a-button v-if="false" type="primary" @click="handleShipmentBat">批量发货</a-button>
        <a-button type="primary" @click="handleExport">导出报表</a-button>
      </template>
    </BasicTable>
    <!-- <Drawer @register="registerDrawer" /> -->
    <ExportModal @register="registerExport" />
    <RemarkModal @register="registerRemark" />
    <ShipmentModal @register="registerShipment" />
  </div>
</template>
<script lang="ts" setup name="OrdersList">
  import {
    OrderStatusColors,
    OrderStatusNames,
    OrderType,
    bizCodesOptions,
    columns,
    primaryKey,
    searchFormSchema,
    tabsOptionList,
    tabsOptionListParams,
  } from './data';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  // import Drawer from './drawer.vue';
  // import { useDrawer } from '/@/components/Drawer';
  import { Image as AImage, Tag, message } from 'ant-design-vue';
  import { pickBy } from 'lodash-es';
  import { ref, unref } from 'vue';
  import ExportModal from './components/ExportModal.vue';
  import RemarkModal from './components/RemarkModal.vue';
  import ShipmentModal from './components/ShipmentModal.vue';
  import { ordersCancel, ordersList } from '/@/api/app/orders';
  import { useModal } from '/@/components/Modal';
  import { TabsOption } from '/@/components/TabsOption';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();

  const [registerExport, { openModal: openExport }] = useModal();
  const [registerRemark, { openModal: openRemark }] = useModal();
  const [registerShipment, { openModal: openShipment }] = useModal();

  // const [registerDrawer, { openDrawer }] = useDrawer();

  const tabsActive = ref<number>(0);

  const [registerTable, { reload, getSelectRowKeys, getForm }] = useTable({
    title: '订单列表',
    api: ordersList,
    beforeFetch(params) {
      const bizCodes = params?.bizCodes
        ? params.bizCodes
        : bizCodesOptions.map((i) => i.value).join(',');
      return {
        ...pickBy(params),
        ...tabsOptionListParams[unref(tabsActive)],
        bizCodes,
      };
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
    showTableSetting: true,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 150 },
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
    isTreeTable: true,
    expandRowByClick: true,
  });

  // 查看详情
  function handleViewDetail(row: Recordable) {
    go('/orders/detail/' + row.orderNo);
    // openDrawer(true, {
    //   id: row.id,
    //   orderNo: row.orderNo,
    // });
  }

  //取消订单
  async function handleCancelOrder(row: Recordable) {
    console.debug('handleCancelOrder', row);
    await ordersCancel({ orderNo: row.orderNo, userId: row.userId, cancelMemo: '管理取消' });
    await reload();
  }

  //发货
  function handleShipment(row: Recordable) {
    console.log(row);
    openShipment(true, { row, ids: [row.id], orderNos: [row.orderNo], onSuccess: reload });
  }

  //导出全部
  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    Object.assign(value, { bizCodes: `${OrderType.default},${OrderType.giftCard}` });
    openExport(true, { orderFilterParams: value });
  }

  function handleRemarkBat() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return message.info('请先勾选订单');
    }
    console.log(getSelectRowKeys());
    openRemark(true, { data: { ids } });
  }

  function handleShipmentBat() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return message.info('请先勾选订单');
    }
    openShipment(true, { ids, onSuccess: reload });
  }
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
