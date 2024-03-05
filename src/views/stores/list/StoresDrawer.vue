<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #district="{ model, field }">
        <DistrictPicker ref="districtPicker" v-model:value="model[field]" />
      </template>
      <template #loca="{ model }">
        <a-button color="success" @click="locaOnMap(model)">地图选点</a-button>
      </template>
      <template #map>
        <MapPicker ref="mapPicker" @change="locaChange" />
      </template>
      <template #upload="{ model, field }">
        <ImageUpload v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './stores.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import DistrictPicker from './components/DistrictPicker.vue';
  import MapPicker from './components/MapPicker.vue';
  import { message } from 'ant-design-vue';
  import ImageUpload from '/@/components/ImageUpload/src/ImageUpload.vue';
  import { storesCreate, storesUpdate } from '/@/api/app/stores';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const isReadonly = ref(false);
  const mapPicker = ref();
  const districtPicker = ref();

  //表单
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 80,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    isReadonly.value = !!data?.isReadonly;

    formSchema.forEach((item) => {
      updateSchema({
        field: item.field,
        dynamicDisabled: false,
      });
    });

    updateSchema({
      field: 'map',
      ifShow: false,
    });

    updateSchema({
      field: 'code',
      dynamicDisabled: unref(isUpdate),
    });

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加门店' : '编辑门店'));

  // 地图上标志点
  async function locaOnMap(model: any) {
    if ((!model.address || !model.district) && (!model.longitude || !model.latitude)) {
      message.warning('请先填写地址或者经纬度');
      return;
    }

    updateSchema({
      field: 'map',
      ifShow: true,
    });

    if (!mapPicker.value) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (model.longitude && model.latitude) {
      mapPicker.value.markPoint(model.longitude, model.latitude);
    } else {
      mapPicker.value?.searchAddr(districtPicker.value.getPickAddr() + model.address);
    }
  }

  // 地图选点变化
  function locaChange(value: any) {
    console.log(value);
    setFieldsValue({
      longitude: value.lng,
      latitude: value.lat,
    });
  }

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });

      values.longitude = Number(values.longitude);
      values.latitude = Number(values.latitude);
      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await storesUpdate(values.code, values);
      } else {
        //新增
        result = await storesCreate(values);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
