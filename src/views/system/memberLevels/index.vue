<template>
  <div class="p-4">
    <BasicTable @register="registerTable" :dataSource="dataSource">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'level'">VIP{{ record.level }}</template>
        <template v-if="column.key === 'gifts.coupons'">
          <Space @click="changeCoupon(record)" direction="vertical">
            <div v-for="coupon in record?.gifts?.coupons" :key="coupon.code">
              <Tag
                color="green"
                :closable="record.editable"
                @close="hanldeCouponClose(index, coupon.code)"
              >
                {{ coupon.name || coupon.code }}
              </Tag>
            </div>
          </Space>
          <a-button
            v-if="record.level !== 1 && record.editable"
            type="link"
            @click="changeCoupon(record)"
          >
            选择优惠券
          </a-button>
        </template>

        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd" :disabled="currentEditKeyRef !== ''"
          >添加{{ pageTitle }}</a-button
        >
      </template>
    </BasicTable>

    <CouponPicker @register="registerCouponPick" />
  </div>
</template>
<script lang="ts" setup>
  import { Space, Tag } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { nextTick, onMounted, ref } from 'vue';
  import { columns, pageTitle, primaryKey } from './data';
  import { IMemberLevelsItem, IMemberLevelsParams } from '/@/api/app/model/userModel';
  import { memberLevelsList as listApi, memberLevelsSave as saveApi } from '/@/api/app/users';
  import { useModal } from '/@/components/Modal';
  import {
    ActionItem,
    BasicTable,
    EditRecordRow,
    TableAction,
    useTable,
  } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import CouponPicker from '/@/views/components/CouponPicker.vue';

  const defaultData: IMemberLevelsParams = {
    id: 0,
    alias: '',
    image: '',
    pointsRate: '1',
    threshold: 1,
    gifts: { points: 0, coupons: [] },
    image2: '',
    rules: [],
  };
  const currentEditKeyRef = ref('');
  const currentEditKeyData = ref<IMemberLevelsItem | null>(null);
  const dataSource = ref<IMemberLevelsItem[]>([]);
  let newRecordIds: number[] = [];

  const { createMessage: msg } = useMessage();
  const [registerCouponPick, { openModal: openCouponModal }] = useModal();

  const [registerTable] = useTable({
    title: pageTitle + '方案',
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    pagination: false,
    showTableSetting: true,
    showIndexColumn: false,
    useSearchForm: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 150 },
    tableSetting: { redo: false },
  });

  onMounted(() => {
    load();
  });

  async function load() {
    try {
      const { levels = [] } = await listApi();
      dataSource.value = hanldeGrounp(levels);
      console.debug('load result=', levels);
    } catch (err) {
      console.error('load', err);
    }
  }

  function hanldeGrounp(data: IMemberLevelsItem[]) {
    return data.map((item) => ({
      ...item,
      image: item.image || '',
      gifts: Object.assign(cloneDeep(defaultData.gifts), item.gifts),
      rules: item.rules.map((i, index) => ({ id: index, url: i })),
    }));
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '编辑',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.id : false,
          onClick: handleEdit.bind(null, record),
        },
      ];
    }
    return [
      {
        label: '保存',
        onClick: handleSave.bind(null, record),
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否取消编辑',
          confirm: handleCancel.bind(null, record),
        },
      },
    ];
  }

  // 新增
  function handleAdd() {
    const id = Date.now();
    dataSource.value.push({
      ...cloneDeep(defaultData),
      id,
      createdAt: null,
      updatedAt: null,
      level: dataSource.value.length + 1,
      levelCode: '',
    });
    newRecordIds.push(id);
    nextTick(() => handleEdit(dataSource.value[dataSource.value.length - 1]));
  }

  // 编辑
  function handleEdit(record: EditRecordRow) {
    console.debug('handleEdit', record);
    currentEditKeyRef.value = record.id + '';
    // 保存当前编辑原数据
    currentEditKeyData.value = cloneDeep(record) as IMemberLevelsItem;
    record.onEdit?.(true);
  }

  // 保存
  async function handleSave(record: EditRecordRow) {
    // 校验
    console.debug('handleSave', record);
    msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
    if (!record?.image) return msg.error({ content: '请上传会员卡面图片', key: 'saving' });
    if (!record?.image2) return msg.error({ content: '请上传会员图片', key: 'saving' });
    const valid = await record.onValid?.();
    if (valid) {
      try {
        const editValues = cloneDeep(record.editValueRefs);
        const levels: IMemberLevelsParams[] = cloneDeep(dataSource.value).map((i) => ({
          id: i.id,
          alias: (i.id === record.id ? editValues?.alias || i.alias : i.alias) as string,
          image: i.image,
          image2: i.image2,
          pointsRate: i.pointsRate,
          threshold: (i.id === record.id
            ? editValues?.threshold || i.threshold
            : i.threshold) as number,
          gifts: i.gifts,
          rules: i.rules.map((r) => r.url),
        }));
        await saveApi(levels);

        // 保存之后提交编辑状态
        const pass = await record.onEdit?.(false, true);
        if (pass) currentEditKeyRef.value = '';
        newRecordIds = [];
        msg.success({ content: '数据已保存', key: 'saving' });
      } catch (error) {
        msg.error({ content: '保存失败', key: 'saving' });
      } finally {
        currentEditKeyData.value = null;
      }
    } else {
      msg.error({ content: '请填写会员名称', key: 'saving' });
    }
  }

  // 取消
  function handleCancel(record: EditRecordRow) {
    console.debug('handleCancel', record);
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);

    // 复原数据
    dataSource.value[dataSource.value.findIndex((i) => i.id === record.id)] =
      currentEditKeyData.value as IMemberLevelsItem;
    currentEditKeyData.value = null;

    for (const id of newRecordIds) {
      const index = dataSource.value.findIndex((i) => i.id === id);
      if (index > -1) dataSource.value.splice(index, 1);
    }
    newRecordIds = [];

    // 取消添加数据
    // if (!record.levelCode) load();
  }

  function changeCoupon(row: Recordable) {
    if (!row.editable) return false;
    const state = row?.gifts || {};
    openCouponModal(true, {
      codes: (state.coupons && state.coupons.map((c) => c.code)) || [],
      type: 'checkbox',
      cb: (coupons: Recordable) => {
        row.gifts.coupons = coupons.map((c) => ({ code: c.code, count: 1, name: c.name }));
        console.debug('row', row);
      },
    });
  }

  function hanldeCouponClose(removedIdx: number, removedCode: string) {
    if (!dataSource.value.length) return;
    const index = dataSource.value[removedIdx].gifts?.coupons.findIndex(
      (item) => item.code === removedCode,
    );
    dataSource.value[removedIdx].gifts?.coupons.splice(index, 1);
  }
</script>
