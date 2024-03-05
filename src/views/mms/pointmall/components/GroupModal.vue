<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="分组设置"
    width="800px"
    :minHeight="80"
  >
    <div class="pt-3 pr-3px">
      <BasicTable @register="registerTable" :data-source="dataSource">
        <template #bodyCell="{ column, index }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '删除',
                  popConfirm: { title: '是否确认删除？', confirm: handleDel.bind(null, index) },
                },
              ]"
            />
          </template>
        </template>
        <template #toolbar>
          <a-button type="primary" @click="handleAdd">添加分组</a-button>
        </template>
      </BasicTable>
    </div>
    <template #footer>
      <a-button @click="closeModal()">取消</a-button>
      <a-button type="primary" @click="handleSave">保存</a-button>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { ref } from 'vue';
  import { IPointmallConfigItem } from '/@/api/app/model/promotionsModel';
  import {
    pointMallConfigsList as listApi,
    pointMallConfigsUpdate as updateApi,
  } from '/@/api/app/promotions';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';

  const columns: BasicColumn[] = [
    {
      title: '分组名称',
      dataIndex: 'name',
      edit: true,
      editRule: true,
      editComponent: 'Input',
      editComponentProps: { maxlength: 10 },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      edit: true,
      editRule: true,
      editComponent: 'InputNumber',
      editComponentProps: { min: 0, max: 999999 },
    },
  ];

  const dataSource = ref<IPointmallConfigItem[]>([]);

  const [registerModal, { closeModal }] = useModalInner(async () => {
    dataSource.value = [];
    load();
  });

  const [registerTable] = useTable({
    title: '',
    rowKey: 'id',
    columns,
    pagination: false,
    bordered: true,
    showTableSetting: false,
    showIndexColumn: false,
    immediate: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 150 },
    useSearchForm: false,
    clickToRowSelect: false,
  });

  const load = async () => {
    const { groups = [] } = await listApi();
    dataSource.value = groups;
  };

  const handleAdd = () => {
    dataSource.value.push({ name: '', sort: 0 });
  };

  const handleDel = async (index) => {
    const groups = cloneDeep(dataSource.value);
    dataSource.value.splice(index, 1);
    groups[index].isDelete = true;
    try {
      await updateApi({
        groups: groups.map((i) => ({
          id: i.id,
          name: i.name,
          sort: i.sort,
          isDelete: Boolean(i.isDelete),
        })),
      });
      message.success('删除成功');
    } catch (e) {
      groups[index].isDelete = false;
      dataSource.value = groups;
    }
  };

  const handleSave = async () => {
    try {
      const groups = dataSource.value.map((i) => ({
        id: i.id,
        name: i.name,
        sort: i.sort,
      }));

      if (groups.find((i) => !i.name)) return message.error('请填写分组名称');

      await updateApi({ groups });
      message.success('保存成功', 1, closeModal);
    } catch (err) {
      console.error('handleSave err', err);
    }
  };
</script>
