<template>
  <div class="p-4">
    <BasicTable @register="registerTable" :beforeEditSubmit="beforeEditSubmit">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'idx'">
          <a-button type="link" @click="handleCompile(record)">{{ record.idx }}</a-button>
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新增勋章</a-button>
        <a-dropdown :trigger="['click']">
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item :key="EMedalsSettingsFedorder.sort">
                <template #icon>
                  <CheckOutlined
                    :style="{
                      color: fedorder === EMedalsSettingsFedorder.sort ? 'green' : 'gray',
                    }"
                  />
                </template>
                按照后台勋章排序展示
              </a-menu-item>
              <a-menu-item :key="EMedalsSettingsFedorder.create">
                <template #icon>
                  <CheckOutlined
                    :style="{
                      color: fedorder === EMedalsSettingsFedorder.create ? 'green' : 'gray',
                    }"
                  />
                </template>
                按照点亮、勋章名称排序
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary" @click="handleGetMedalssettings">
            小程序排序设置
            <DownOutlined />
          </a-button>
        </a-dropdown>

        <a-button type="primary" @click="openRuleModal(true, {})">勋章说明</a-button>
        <a-button type="primary" @click="openRecordDrawer(true, {})">获取记录</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="reload" />
    <RuleModal @register="registerRuleModal" />
    <RecordDrawer @register="registerRecordDrawer" />
  </div>
</template>
<script lang="ts" setup name="UsersList">
  import { CheckOutlined, DownOutlined } from '@ant-design/icons-vue';
  import {
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
    MenuProps,
    Modal,
    message,
  } from 'ant-design-vue';
  import { ref } from 'vue';
  import RuleModal from './components/RuleModal.vue';
  import { columns, pageTitle, primaryKey } from './data';
  import Drawer from './drawer.vue';
  import RecordDrawer from './recordDrawer.vue';
  import {
    medalsSettings as detailApi,
    medalsConfigsList as listApi,
    medalsConfigsGroup,
    medalsSettingsUpdate,
  } from '/@/api/app/medals';
  import { EMedalsSettingsFedorder, IMedalsSettingsParams } from '/@/api/app/model/medalsModel';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';

  const fedorder = ref('');

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordDrawer, { openDrawer: openRecordDrawer }] = useDrawer();

  const [registerRuleModal, { openModal: openRuleModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    title: `${pageTitle}列表`,
    api: listApi,
    afterFetch(dataList) {
      return dataList.map((i, index) => ({ ...i, idx: index + 1 }));
    },
    rowKey: `${primaryKey}-subgroup`,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: false,
    showIndexColumn: false,
    clickToRowSelect: false,
  });

  //新增
  function handleAdd() {
    openDrawer(true, { isUpdate: false });
  }

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, { isUpdate: true, record: row });
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.debug('handleMenuClick e', e);
    const { key } = e;
    let content =
      key === EMedalsSettingsFedorder.sort
        ? '是否按照后台勋章排序展示进行此操作'
        : '是否按照点亮、勋章名称排序进行此操作';

    Modal.confirm({
      content,
      centered: true,
      onOk: async () => {
        return new Promise((resolve, reject) => {
          medalsSettingsUpdate({ fedorder: key } as IMedalsSettingsParams)
            .then((res) => {
              message.success('操作成功');
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

  // 字段编辑
  async function beforeEditSubmit({ key, value, rawRecord }) {
    if (key !== 'sort') return false;

    if (!value) {
      message.info('请填写排序数字');
      return false;
    }
    try {
      await medalsConfigsGroup({
        group: rawRecord.group,
        subgroup: rawRecord.subgroup,
        sort: +value,
      });
      reload();
      return true;
    } catch {
      return false;
    }
  }

  const handleGetMedalssettings = async () => {
    let result;
    try {
      const res = await detailApi();
      console.debug('res', res);
      result = res;
    } catch (err) {}

    if (!result) return;

    fedorder.value = result.fedorder || '';
  };
</script>

<style lang="less" scoped></style>
