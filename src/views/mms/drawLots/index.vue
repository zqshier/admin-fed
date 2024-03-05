<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'id'">
          <a-button type="link" @click="handleViewDetail(record)">{{ record.id }}</a-button>
        </template>
        <template v-if="column.key === 'bookingBase'">
          <div @click="handleNumModify(record, ModifyTypes.booking)">
            <span style="padding: 0 20px">{{
              +record.bookingCount + +record.bookingBase || 0
            }}</span>
            <FormOutlined />
          </div>
        </template>
        <template v-if="column.key === 'participantBase'">
          <div @click="handleNumModify(record, ModifyTypes.join)">
            <span style="padding: 0 20px">{{
              +record.participantCount + +record.participantBase || 0
            }}</span>
            <FormOutlined />
          </div>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              // {
              //   label: '详情',
              //   onClick: handleViewDetail.bind(null, record),
              // },
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
                ifShow:
                  statusText({
                    startAt: record.startAt,
                    endAt: record.endAt,
                    finishAt: record.finishAt,
                  }) !== STATUS_TEXT.PUBILISH,
              },
              {
                label: '复制',
                onClick: handleCopy.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加抽签活动</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <DetailDrawer @register="registerDetailDrawer" />

    <BaseNumModal ref="BaseNumModalRef" @register="registerBaseNumModify">
      <template #header>
        <div :style="{ color: '#8c8c8c', paddingLeft: '13px' }"
          >截止到{{ format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss') }}</div
        >
      </template>
    </BaseNumModal>
  </div>
</template>
<script lang="ts" setup name="DrawLots">
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { FormOutlined } from '@ant-design/icons-vue';
  import { format } from 'date-fns';
  import {
    columns,
    primaryKey,
    statusText,
    STATUS_TEXT,
    formSchemaModifyBooking,
    formSchemaModifyJoin,
  } from './data';
  import Drawer from './drawer.vue';
  import { goodsList } from '/@/api/app/goods';
  import { drawLotsList, DrawLotsItems, drawLotsUpdate } from '/@/api/app/mms';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { bookingUpdate as updateApi } from '/@/api/app/booking';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import BaseNumModal, { ModifyInfo } from '/@/views/components/BaseNumModal.vue';
  import DetailDrawer from './components/DetailDrawer.vue';

  enum ModifyTypes {
    booking,
    join,
  }

  const BaseNumModalRef = ref();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();
  const [registerBaseNumModify, { openModal: openBaseNumModify }] = useModal();

  const [registerTable, { reload, setTableData, updateTableDataRecord }] = useTable({
    title: '抽签',
    api: drawLotsList,
    afterFetch: (data) => {
      const ids = data.map((item: Recordable) => item.targetData.goodsId);
      goodsList({
        ids: ids as number[],
        page: 1,
        perPage: 20,
      }).then(({ list }) => {
        data.forEach((item: Recordable) => {
          item.goods = list.find((record: Recordable) => record.id == item.targetData.goodsId);
        });
        setTableData(data);
      });
      const result = data.map((item) => {
        item.goods = {};
        return item;
      });
      return result;
    },
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 120,
    },
  });

  //新增
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      record: row,
    });
  }

  // 复制
  function handleCopy(row: Recordable) {
    openDrawer(true, {
      isCopy: true,
      record: row,
    });
  }

  function handleNumModify(values, type) {
    const stateInfo: ModifyInfo = {
      values: { count: '', addCount: '', baseCount: '' },
      title: '',
      schemas: [],
      ok: null,
    };
    if (type === ModifyTypes.booking) {
      stateInfo.title = '修改预约人数';
      stateInfo.schemas = formSchemaModifyBooking;
      stateInfo.values.count = values.bookingCount;
      stateInfo.values.baseCount = +values.bookingCount + +values.bookingBase;
    } else {
      stateInfo.title = '修改参与人数';
      stateInfo.schemas = formSchemaModifyJoin;
      stateInfo.values.count = values.participantCount;
      stateInfo.values.baseCount = +values.participantCount + +values.participantBase;
    }
    openBaseNumModify(true, {
      ...stateInfo,
      ok: async (row) => {
        try {
          let result;
          if (type === ModifyTypes.booking) {
            await updateApi(values.bookingId, { counterBase: +row.addCount } as any);
            result = { ...values, bookingBase: +row.addCount };
          } else {
            const params = { participantBase: +row.addCount };
            result = await drawLotsUpdate(values.id, params as DrawLotsItems);
          }
          message.success('操作成功');
          BaseNumModalRef.value?.closeModal();
          updateTableDataRecord(values.id, result);
        } catch (err) {}
      },
    } as ModifyInfo);
  }

  function handleViewDetail(row: Recordable) {
    openDetailDrawer(true, {
      isCheck: true,
      record: row,
    });
  }

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }
</script>

<style lang="less" scoped></style>
