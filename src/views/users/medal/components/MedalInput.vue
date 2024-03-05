<template>
  <div>
    <div class="mb-4" v-if="tableDataList.length">
      <BasicTable size="small" @register="registerTable">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column?.dataIndex === 'name'">
            <a-input v-model:value="record[column.dataIndex]" :maxlength="20" :showCount="true" />
          </template>
          <template v-if="column?.dataIndex === 'value'">
            <div
              v-if="props.group === EMedalsConfigsGroup.annualmember"
              class="flex justify-center items-center"
            >
              <span class="mr-1">年底时获得</span>
              <ApiSelect
                :api="memberLevelsList"
                :immediate="true"
                resultField="levels"
                valueField="level"
                labelField="levelCode"
                :disabled="disabled && record?.id"
                v-model:value="record[column.dataIndex]"
              />
              <span class="ml-1">及以上等级会员</span>
            </div>
            <a-input-number
              v-else
              :value="record[column.dataIndex]"
              :min="tableDataList[index - 1]?.value! + 1 || 1"
              :max="9999"
              :controls="false"
              :addonBefore="valueMap[props.group].addonBefore"
              :addonAfter="valueMap[props.group].addonAfter"
              :disabled="disabled && record?.id"
              @change="
                (val) => {
                  record[column.dataIndex] =
                    val === null ? tableDataList[index - 1]?.value! + 1 || 1 : val;
                }
              "
            />
          </template>
          <template v-if="column?.dataIndex === 'description'">
            <a-input v-model:value="record[column.dataIndex]" :maxlength="20" :showCount="true" />
          </template>
          <template v-if="column?.dataIndex === 'greetings'">
            <a-textarea
              v-model:value="record[column.dataIndex]"
              placeholder="请输入"
              :rows="1"
              :maxlength="50"
              :showCount="true"
            />
          </template>
          <template v-if="column?.dataIndex === 'image1'">
            <ImageUpload size="small" v-model:value="record[column.dataIndex]" />
          </template>
          <template v-if="column?.dataIndex === 'image2'">
            <ImageUpload size="small" v-model:value="record[column.dataIndex]" />
          </template>
          <template v-if="column?.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '删除',
                  icon: 'ic:outline-delete-outline',
                  popConfirm: { title: '是否删除？', confirm: handleDel.bind(null, index) },
                  disabled: !!record?.id,
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <div
      ><a-button
        v-if="!(isAnnualmemberlevelGroup && tableDataList.length > 0)"
        type="primary"
        @click="handleAdd"
        >添加</a-button
      ></div
    >
  </div>
</template>

<script setup lang="ts">
  import { Input as AInput, InputNumber as AInputNumber } from 'ant-design-vue';
  import { cloneDeep, omitBy } from 'lodash-es';
  import { computed, nextTick, ref, watch } from 'vue';
  import { EMedalsConfigsGroup, IMedalsConfigsMedals } from '/@/api/app/model/medalsModel';
  import { memberLevelsList } from '/@/api/app/users';
  import { ApiSelect } from '/@/components/Form';
  import { ImageUpload } from '/@/components/ImageUpload';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';

  const props = defineProps<{
    value?: any[];
    group: EMedalsConfigsGroup;
    disabled: { type: Boolean; default: false };
  }>();

  const emit = defineEmits(['update:value', 'change', 'remove']);

  const defaultData: IMedalsConfigsMedals = {
    name: '',
    description: '',
    greetings: '',
    image1: '',
    image2: '',
    value: 1,
    condition: { __type: props.group, count: 0 },
  };

  const valueMap = {
    [EMedalsConfigsGroup.goodsrate]: { addonBefore: '完成', addonAfter: '个商品评分' },
    [EMedalsConfigsGroup.goodsfavorite]: { addonBefore: '完成', addonAfter: '个商品收藏' },
    [EMedalsConfigsGroup.goodsshare]: { addonBefore: '完成', addonAfter: '个商品分享' },
    [EMedalsConfigsGroup.signin]: { addonBefore: '连续签到', addonAfter: '天' },
    [EMedalsConfigsGroup.scancode]: { addonBefore: '领取', addonAfter: '个首次扫码奖励' },
    [EMedalsConfigsGroup.pointorder]: { addonBefore: '兑换', addonAfter: '个积分商品' },
    [EMedalsConfigsGroup.invitemember]: { addonBefore: '邀请', addonAfter: '个新用户注册' },
    [EMedalsConfigsGroup.joinactivity]: { addonBefore: '报名', addonAfter: '个活动' },
    [EMedalsConfigsGroup.questionanswer]: { addonBefore: '提交', addonAfter: '个调查问卷' },
    [EMedalsConfigsGroup.goodskindorder]: { addonBefore: '完成', addonAfter: '个商品下单' },
  };

  const tableDataList = ref<IMedalsConfigsMedals[]>([]);

  const isAnnualmemberlevelGroup = computed(() => props.group === EMedalsConfigsGroup.annualmember);

  const columns: BasicColumn[] = [
    {
      title: '勋章等级',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      customRender: ({ index }: Recordable) => index + 1,
    },
    { title: '勋章名称', dataIndex: 'name', align: 'center', width: '200px' },
    { title: '完成条件', dataIndex: 'value', align: 'center', width: '260px' },
    { title: '勋章描述', dataIndex: 'description', align: 'center', width: '200px' },
    { title: '完成祝福', dataIndex: 'greetings', align: 'center', width: '200px' },
    { title: '勋章图片', dataIndex: 'image1', align: 'center' },
    { title: '勋章未完成图片', dataIndex: 'image2', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '110px',
      ifShow: !isAnnualmemberlevelGroup.value,
    },
  ];

  const [registerTable, { setProps, getDataSource }] = useTable({
    columns,
    pagination: false,
    bordered: true,
    showIndexColumn: false,
    rowKey: 'id',
  });

  const updateValue = () => {
    console.debug('tableDataList.value', getDataSource());
    const _data = getDataSource().map((i) => {
      const item = {
        id: i?.id || null,
        name: i.name,
        greetings: i.greetings,
        description: i.description,
        image1: i.image1,
        image2: i.image2,
        condition: {
          __type: i.condition.__type,
          count: isAnnualmemberlevelGroup.value ? 0 : i.value,
          level: isAnnualmemberlevelGroup.value ? i.value : '',
        },
      };
      return omitBy(item, (value) => value === undefined || value === null);
    });
    emit('update:value', _data);
    emit('change', _data);
  };

  function handleAdd() {
    const minValue =
      (tableDataList.value.length > 0 &&
        tableDataList.value[tableDataList.value.length - 1].value! + 1) ||
      1;
    const data = {
      ...defaultData,
      value: isAnnualmemberlevelGroup.value ? '' : minValue,
    };
    tableDataList.value.push(cloneDeep(data));
    console.debug('tableDataList.value', tableDataList.value);
    nextTick(() => setProps({ dataSource: tableDataList.value }));
  }

  function handleDel(index: number) {
    console.debug('handleDel', index);
    tableDataList.value.splice(index, 1);
  }

  // async function updateGoodsInfo() {
  //   if (tableDataList.value.length === 0) return;
  //   if (tableDataList.value[0].goodsName) return;

  //   const skuIds = tableDataList.value.map((item) => item.skuId);
  //   console.log(skuIds);

  //   const { list } = await skuList({ skuIds, perPage: skuIds.length, page: 1 });
  //   for (const o of tableDataList.value) {
  //     const s = list.find((a) => a.id === o.skuId);
  //     if (s) {
  //       o.goodsName = s.item.name;
  //       o.goodsPrice = s.price;
  //       o.goodsSku = s.comb.map((a) => a.v).join(' ');
  //     }
  //   }
  // }

  watch(
    () => props.value,
    (val) => {
      tableDataList.value =
        (val?.length &&
          val.map((i) => ({
            ...i,
            value: isAnnualmemberlevelGroup.value ? i.condition.level : i.condition.count,
            condition: { ...i.condition, __type: props.group },
          }))) ||
        [];
      nextTick(() => setProps({ dataSource: tableDataList.value }));
    },
    { immediate: true },
  );

  watch(
    () => props.group,
    (val) => {
      if (!val) return;
      if (tableDataList.value?.length) return;
      // tableDataList.value = cloneDeep([defaultData]);
      // nextTick(() => setProps({ dataSource: tableDataList.value }));
      handleAdd();
    },
    {
      immediate: true,
    },
  );

  // watch(
  //   () => props.disabled,
  //   (val) => {
  //     for (const column of columns) {
  //       column['dataIndex'] === 'quantity' ? (column['edit'] = !val) : '';
  //     }
  //     nextTick(() => {
  //       setProps({ columns });
  //     });
  //   },
  //   {
  //     immediate: true,
  //   },
  // );

  defineExpose({ updateValue });
</script>

<style scoped></style>
