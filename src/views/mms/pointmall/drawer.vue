<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="1200px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #goodsTypeSlot="{ model, field, schema }">
        <GoodsTypeInput
          ref="goodsTypeInputRef"
          :disabled="isUpdate"
          :options="schema.componentProps.options"
          v-model:ctype="model['type']"
          v-model:value="model[field]"
          @change="onValidateFields([field])"
        />
      </template>
      <template #groupUser="{ model, field }">
        <GroupUser v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import dayjs from 'dayjs';
  import { cloneDeep, omit } from 'lodash-es';
  import { IPropsValue } from './components/GoodsTypeInput.vue';
  import GroupUser from './components/GroupUser.vue';
  import { skuList, skuStockList } from '/@/api/app/goods';
  import { couponsList } from '/@/api/app/mms';
  import { EGoodsType } from '/@/api/app/model/goodsModel';
  export interface IDefaults extends IPointmallParams {
    targetData: IPropsValue;
    tagOptions: { tagOptionType: ETagOptionType; tagOptionData: number[] };
  }
</script>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import GoodsTypeInput, { ITableGoodsListItem } from './components/GoodsTypeInput.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import {
    EPointmallTargetType,
    EPointmallType,
    ETagOptionType,
    IPointmallItemsOptionData,
    IPointmallParams,
  } from '/@/api/app/model/promotionsModel';
  import {
    pointMallCreate as createApi,
    pointMallDetail as detailApi,
    pointMallUpdate as updateApi,
  } from '/@/api/app/promotions';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<string>('');
  const record = reactive<any>({});
  const goodsTypeInputRef = ref<any>(null);

  //表单
  const [
    registerForm,
    {
      resetFields,
      setFieldsValue,
      validate,
      validateFields,
      getFieldsValue,
      clearValidate,
      updateSchema,
    },
  ] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const defaults: IDefaults = {
    name: '',
    startTime: null,
    endTime: null,
    displayStartTime: null,
    limitCount: '',
    isLimit: false,
    targetId: '',
    targetType: EPointmallTargetType.goods,
    oriPriceBy: false,
    type: EPointmallType.pointAndPrice,
    disable: false,
    image: '',
    optionData: null,
    targetData: { type: EPointmallTargetType.goods, goodsItems: [], couponItems: [] },
    expireTime: 30,
    group: [],
    sort: 0,
    jumpToDetail: false,
    tagOptionType: ETagOptionType.all,
    tagOptionData: [],
    tagOptions: { tagOptionType: ETagOptionType.all, tagOptionData: [] },
  };

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    Object.assign(record, { ...defaults });

    updateSchema([
      { field: 'type', dynamicDisabled: isUpdate.value },
      { field: 'jumpToDetail', dynamicDisabled: isUpdate.value },
    ]);

    if (data.record) {
      let _record = data.record;
      updateId.value = _record?.[primaryKey];
      try {
        const res = await detailApi(updateId.value!);
        _record = res;
      } catch (err) {}

      _record = await handleGroupRecord(_record);

      Object.assign(record, { ..._record });
    }

    nextTick(() => {
      goodsTypeInputRef.value?.initData && goodsTypeInputRef.value.initData();
    });

    console.debug('record', record);
    setFieldsValue(record);
    clearValidate();
  });

  async function handleGroupRecord(record: IDefaults) {
    if (record.targetType === EPointmallTargetType.goods) {
      const goodsItems = await getTargetGoodsData(+record.targetId);
      const newGoodsItems = await goodsItems.map((item) => {
        const data = record.optionData?.items.find((i) => i.skuId === item.id);
        return {
          ...item,
          select: !!data?.skuId,
          cpoint: data?.point || 0,
          cprice: (data?.price && +data.price) || 0,
          cstock: data?.stock || 0,
        };
      });
      record.targetData = {
        type: record.optionData!.type,
        goodsItems: newGoodsItems,
        couponItems: [],
      };
    }
    if (record.targetType === EPointmallTargetType.coupon) {
      const { list } = await skuList({
        itemId: +record.targetId,
        itemTypes: `${EGoodsType.coupon}`,
        page: 1,
        perPage: 100,
      });
      const codes = list.map((i) => i.meta?.couponCode).join(',');
      const newCouponItems = (
        await couponsList({ codes, page: 1, perPage: codes.split(',').length })
      ).list
        .map((i) => ({
          // 组合 优惠券数据+商品数据 id、stock取商品数据
          ...i,
          item: list.find((j) => j.meta?.couponCode === i.code)?.item,
          id: list.find((j) => j.meta?.couponCode === i.code)?.id,
          stock: list.find((j) => j.meta?.couponCode === i.code)?.stock,
        }))
        .map((itm) => {
          // 组合 需要显示数据
          const data = record.optionData?.items.find((i) => i.skuId === itm.id);
          return {
            ...itm,
            select: !!data?.skuId,
            cpoint: data?.point || 0,
            cprice: (data?.price && +data.price) || 0,
            cstock: data?.stock || 0,
          };
        });

      record.targetData = {
        type: record.optionData!.type,
        goodsItems: [],
        couponItems: newCouponItems,
      };
    }

    typeof record.group === 'string' ? (record.group = record.group.split(',')) : '';

    if (record?.startTime) record.startTime = dayjs(record.startTime);
    if (record?.endTime) record.endTime = dayjs(record.endTime);

    if (record?.tagOptionType || record?.tagOptionData) {
      record.tagOptions = {
        tagOptionType: record.tagOptionType,
        tagOptionData: record.tagOptionData,
      };
    }

    return record;
  }

  async function getTargetGoodsData(itemId: number): Promise<ITableGoodsListItem[]> {
    const { list } = await skuStockList({ itemId, perPage: 10, page: 1 });
    return list.map((i) => ({ ...i, cstock: 0, cprice: 0, cpoint: 0 }));
  }

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue() as IDefaults;
      setDrawerProps({ confirmLoading: true });
      console.debug('handleSubmit', values);

      const params = {
        ...cloneDeep(omit(values, 'targetData')),
        isLimit: !(values.limitCount === 0),
        tagOptionType: values.tagOptions.tagOptionType,
        tagOptionData: values.tagOptions.tagOptionData || [],
        sort: record.sort,
      };

      let optionData: IPointmallItemsOptionData = {
        items: [],
        type: values?.targetData.type || '',
      };

      if (optionData.type === EPointmallTargetType.goods) {
        const goodsItems = goodsTypeInputRef.value?.getGoodsSelectedRows() || [];
        console.debug('goodsItems', goodsItems);
        optionData.items = [
          ...optionData.items,
          ...goodsItems.map((item) => ({
            skuId: item.id,
            price: (params.type === EPointmallType.pointAndPrice && item.cprice) || 0,
            point: item.cpoint,
            stock: item.cstock,
          })),
        ];
        params.targetId = goodsItems[0].itemId;
        params.name = goodsItems[0].item?.name || '';
        params.image = goodsItems[0].item?.image || '';
      }

      if (optionData.type === EPointmallTargetType.coupon) {
        const couponItems = goodsTypeInputRef.value?.getCouponSelectedRows() || [];
        console.debug('couponItems', couponItems);
        optionData.items = [
          ...optionData.items,
          ...couponItems.map((item) => ({
            skuId: item.id,
            price: (params.type === EPointmallType.pointAndPrice && item.cprice) || 0,
            point: item.cpoint,
            stock: item.cstock,
          })),
        ];
        params.targetId = couponItems[0].item?.id || 0;
        params.name = couponItems[0].item?.name || '';
        params.image = couponItems[0].item?.image || '';
      }

      params.optionData = optionData;
      params.targetType = optionData.type;
      params.group = params.group instanceof Array ? params.group.join(',') : params.group;

      let result = {};
      if (unref(isUpdate)) {
        console.debug('isUpdate params=========>', params);
        result = await updateApi(updateId.value, params as IPointmallParams);
      } else {
        console.debug('params=========>', params);
        result = await createApi({ ...params } as IPointmallParams);
      }
      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  function onValidateFields(name: string[]) {
    const timer = setTimeout(() => {
      validateFields(name);
      clearTimeout(timer);
    }, 10);
  }
</script>
