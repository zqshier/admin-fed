<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'id'">
          <a-button type="link" @click="handleDetail(record)">{{ record.id }}</a-button>
        </template>
        <!-- <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                onClick: handleDetail.bind(null, record),
              },
            ]"
          />
        </template> -->
      </template>
      <template #toolbar>
        <a-checkbox v-model:checked="stateInfo.selectAll" @change="onSelectAll()"
          >筛选全选<span v-if="stateInfo.selectAll" class="info-text"
            >(当前选定了{{ stateInfo.totalSelect }}条记录)</span
          ></a-checkbox
        >
        <a-button type="primary" @click="handleAddTags">添加标签</a-button>
        <a-dropdown :disabled="!getSelectRowKeys().length">
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="1">选中的人加入黑名单</a-menu-item>
              <a-menu-item key="0">选中的人取消黑名单</a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary">
            加入黑名单
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <!-- <a-button type="primary" @click="handlePoints">修改积分</a-button>
        <a-button type="primary" @click="handleCoupon">发放优惠券</a-button> -->
        <a-button type="primary" :href="exportLink" target="_blank">导出报表</a-button>
      </template>
    </BasicTable>
    <AddTagsModal @register="registerAddTagsModal" />
    <PointsModal @register="registerPointsModal" />
    <CouponModal @register="registerCouponModal" />
    <Drawer @register="registerDrawer" />
  </div>
</template>
<script lang="ts" setup name="UsersList">
  import { DownOutlined } from '@ant-design/icons-vue';
  import {
    Checkbox as ACheckbox,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
    MenuProps,
    Modal,
    message,
  } from 'ant-design-vue';
  import { computed, reactive } from 'vue';
  import AddTagsModal from './components/AddTagsModal.vue';
  import CouponModal from './components/CouponModal.vue';
  import PointsModal from './components/PointsModal.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer, { ActionsType } from './drawer.vue';
  import {
    AppUserListParams,
    IAppUserModelStatus,
    userList as listApi,
    updateUserStatus,
    userListExport,
  } from '/@/api/app/users';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  // import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  // import { useGo } from '/@/hooks/web/usePage';

  // const go = useGo();

  const [registerDrawer, { openDrawer }] = useDrawer();
  // const [registerDrawer] = useDrawer();

  const [registerAddTagsModal, { openModal: openAddTagsModal }] = useModal();
  const [registerPointsModal, { openModal: openPointsModal }] = useModal();
  const [registerCouponModal, { openModal: openCouponModal }] = useModal();

  let searchParams: Recordable = {};
  const stateInfo = reactive({
    selectAll: false,
    totalSelect: 0,
  });

  const exportLink = computed(() => userListExport(searchParams as AppUserListParams));

  const [
    registerTable,
    {
      setSelectedRowKeys,
      getSelectRowKeys,
      getSelectRows,
      getDataSource,
      getPaginationRef,
      clearSelectedRowKeys,
      reload,
    },
  ] = useTable({
    title: pageTitle,
    api: listApi,
    beforeFetch: (params) => {
      searchParams = params;
    },
    afterFetch: (data) => {
      onSelectAll(true, data);
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    showIndexColumn: false,
    // actionColumn: { title: '操作', dataIndex: 'action', width: 90 },
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 8 },
      actionColOptions: { span: 24 },
      transformDateFunc: (date) => {
        return date ? date.toISOString() : '';
      },
    },
    rowSelection: { type: 'checkbox' },
    clickToRowSelect: false,
  });

  // function handleExport() {
  //   exportLoading.value = true;
  //   userListExport(searchParams as AppUserListParams).finally(() => {
  //     exportLoading.value = false;
  //   });
  // }

  function onSelectAll(isCheck: Boolean = false, data: any = null) {
    if (stateInfo.selectAll) {
      data = data || getDataSource();
      const ids = data.map((item) => item.id);
      setSelectedRowKeys(ids);
      const pagi = getPaginationRef() as Recordable;
      stateInfo.totalSelect = pagi.total;
    } else {
      if (!isCheck) {
        setSelectedRowKeys([]);
      }
    }
  }

  function openModal(open: Function) {
    const ids = getSelectRowKeys();
    if (stateInfo.selectAll) {
      open(true, {
        record: { userIds: [], params: searchParams, total: stateInfo.totalSelect },
      });
    } else {
      if (ids.length === 0) {
        return message.warn('请勾选用户');
      }
      open(true, {
        record: { userIds: ids, params: {}, total: ids.length },
      });
    }
  }

  function handleAddTags() {
    openModal(openAddTagsModal);
  }

  // function handlePoints() {
  //   openModal(openPointsModal);
  // }

  // function handleCoupon() {
  //   openModal(openCouponModal);
  // }

  //注销用户
  function openEarse(data: Recordable) {
    Modal.confirm({
      title: '提醒',
      content: '确认要注销该用户吗，注销后该用户积分、优惠券将全部清空',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        console.debug('注销用户', data);
        await updateUserStatus(data.record.userIds[0], 2);
        data.record.resolve?.();
      },
    });
  }

  function handleDetailAction(action: ActionsType, userId: number, nickname: string) {
    const data: Recordable = {
      record: {
        userIds: [userId],
        params: {},
        total: 0,
        info: { userId, nickname },
      },
    };
    return new Promise((resolve) => {
      data.record.resolve = () => resolve(action);
      switch (action) {
        case 'tag':
          openAddTagsModal(true, data);
          break;
        case 'coupon':
          openCouponModal(true, data);
          break;
        case 'point':
          openPointsModal(true, data);
          break;
        case 'erase':
          openEarse(data);
          break;
      }
    });
  }

  function handleDetail(record: Recordable) {
    openDrawer(true, { record, handle: handleDetailAction });
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.debug('handleMenuClick e', e);
    const { key } = e;
    let content =
      key === `${IAppUserModelStatus.blacklist}`
        ? '拉黑后用户将无法购买商品，是否进行此操作'
        : '请确认此操作，确认后将选中的用户从黑名单中取消';

    Modal.confirm({
      content,
      centered: true,
      onOk: async () => {
        return new Promise((resolve, reject) => {
          batchUppdateUserStatus(getSelectRows(), Number(key))
            .then((res) => {
              message.success(`${key === '1' ? '加入黑名单操作成功' : '取消黑名单操作成功'}`);
              clearSelectedRowKeys();
              reload();
              return resolve(res);
            })
            .catch((err) => {
              console.error('handleMenuClick111 err=', err);
              return reject(err);
            });
        }).catch((err) => console.error('handleMenuClick err=', err));
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  };

  const batchUppdateUserStatus = async (
    rows: { status: IAppUserModelStatus; id: number }[],
    status: IAppUserModelStatus,
  ) => {
    const promiseAll = rows
      .filter((row) => row.status !== IAppUserModelStatus.logout)
      .map((i) => updateUserStatus(Number(i.id), status));
    return Promise.all(promiseAll);
  };
</script>

<style lang="less" scoped>
  .info-text {
    color: @primary-color;
  }
</style>
