<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="编辑订单详情"
    width="1000px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #screenshotSlot="{ model, field }">
        <div class="flex items-center text-left">
          <ScaleImage
            v-for="i in model[field]"
            :key="i"
            class="mr-2"
            :size="60"
            :src="i"
            mode="cover"
          />
        </div>
      </template>
      <template #goodsInfoSlot="{ model, field }">
        <GoodsInput v-model:value="model[field]" />
      </template>
      <template #district="{ model, field }">
        <DistrictPicker
          ref="districtPicker"
          v-model:value="model[field]"
          :name="model['receiverInfo.district']"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { cloneDeep, get } from 'lodash-es';
  import { reactive, ref } from 'vue';
  import DistrictPicker from '../../stores/list/components/DistrictPicker.vue';
  import GoodsInput from './components/GoodsInput.vue';
  import { orderRecordFormSchema as formSchema, primaryKey } from './data';
  import { IOrderConversionParams } from '/@/api/app/model/ordersModel';
  import { orderConversionUpdate as updateApi } from '/@/api/app/orders';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import ScaleImage from '/@/views/components/ScaleImage.vue';

  const emit = defineEmits(['refresh']);

  const record = reactive<any>({});
  const updateId = ref<number>(0);
  const districtPicker = ref();

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
      labelWidth: 150,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  const defaults: IOrderConversionParams = {
    orderNo: '',
    orderAmount: '',
    productName: '',
    omsOrderNo: '',
    payAmount: '',
    payTime: null,
    orderStatus: '',
    shopName: '',
    receiverInfo: { name: '', phone: '', province: '', city: '', district: '', address: '' },
    // address: '',
    goodsInfo: [],
  };

  // 弹窗标题

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();

    setDrawerProps({ confirmLoading: false });
    Object.assign(record, { ...defaults });

    if (data.record) {
      let _record = data.record;
      updateId.value = _record?.[primaryKey];
      Object.assign(record, { ..._record });
    }

    console.debug('record', record);
    setFieldsValue(record);
    clearValidate();
  });

  async function handleSubmit() {
    try {
      await validate();
      const values: IOrderConversionParams = getFieldsValue();
      setDrawerProps({ confirmLoading: true });
      console.debug('handleSubmit', values);

      const params = cloneDeep(values);
      params.goodsInfo = params.goodsInfo || [];

      const receiverCode = get(params, 'receiverInfo.districtCode', null);
      if (receiverCode) {
        const receiverInfo = await districtPicker.value.getPickAddr();
        console.debug('当前有地址信息', receiverInfo);
        const regex =
          '(?<province>[^省]+自治区|.*?省|.*?行政区|)(?<city>.*?[市区县盟地区])(?<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?<village>.*)';
        // 匹配结果
        const matchArr = receiverInfo.match(regex) || [];
        console.log('matchArr: ', matchArr);
        const {
          province = '',
          city = '',
          county: district = '',
          village = '',
        } = matchArr?.groups || {};
        const _receiverInfo = { province, city, district: `${district}${village}` };
        if (receiverInfo === '台湾省') _receiverInfo.province = receiverInfo;

        params.receiverInfo
          ? (params.receiverInfo = { ...params.receiverInfo, ..._receiverInfo })
          : '';
      } else {
        params.receiverInfo ? (params.receiverInfo = { ...params.receiverInfo, district: '' }) : '';
      }

      params.receiverInfo = {
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        ...params.receiverInfo,
      };

      console.debug('handleSubmit params=', params);
      await getUpdate(params);
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  async function getUpdate(params: IOrderConversionParams) {
    try {
      await updateApi(updateId.value, params);
      closeDrawer();
      emit('refresh');
      message.success('提交成功');
    } catch (e) {
      //TODO handle the exception
    }
  }
</script>
