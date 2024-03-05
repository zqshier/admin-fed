<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="60%"
    @ok="handleSubmit"
    :maskClosable="false"
  >
    <!-- <BasicForm @register="registerForm" /> -->
    <div class="step-wrap">
      <a-steps :current="stepState.currentStep">
        <a-step title="基本信息" />
        <a-step title="图文详情" />
      </a-steps>
    </div>

    <div class="mt-5">
      <Step1 ref="refStep1" :editData="editData" v-show="stepState.currentStep === 0" />
      <Step2 ref="refStep2" :editData="editData" v-show="stepState.currentStep === 1" />
    </div>

    <template #footer>
      <a-button class="footer-btn" type="default" @click="handleCancel">取消</a-button>
      <a-button
        class="footer-btn"
        type="primary"
        :loading="stepState.submitLoading"
        @click="handleNext()"
        v-if="stepState.currentStep === 0"
        >下一步</a-button
      >
      <a-button
        class="footer-btn"
        type="default"
        @click="handlePrev"
        v-if="stepState.currentStep > 0"
        >上一步</a-button
      >
      <a-button
        class="footer-btn"
        type="primary"
        @click="handleSubmit()"
        v-if="stepState.currentStep === 1"
        :loading="stepState.submitLoading"
        >保存</a-button
      >
      <a-button
        class="footer-btn"
        type="primary"
        @click="handleSubmitInStep1"
        v-if="stepState.currentStep === 0 && isUpdate"
        :loading="stepState.submitLoading"
        >保存</a-button
      >
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { Step as AStep, Steps as ASteps, message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { cloneDeep, get } from 'lodash-es';
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import Step1 from './components/DrawerStep1.vue';
  import Step2 from './components/DrawerStep2.vue';
  import { StepActionType } from './data';
  import {
    goodsCreate as createApi,
    goodsDetail,
    goodsDetailUpdate,
    goodsInfo,
    goodsUpdate as updateApi,
  } from '/@/api/app/goods';
  import { EGoodsType } from '/@/api/app/model/goodsModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(false);
  const isCopy = ref<boolean>(false);

  const stepState = reactive({
    currentStep: 0,
    initSetp2: false,
    initSetp3: false,
    submitLoading: false,
  });

  const refStep1 = ref<StepActionType>();
  const refStep2 = ref<StepActionType>();
  const lastResult = ref<Recordable>({});
  const editData = ref<Recordable>({});
  const oldId = ref(0);

  // 默认SKU
  const defaultSku = ref<Recordable>({});

  //弹窗
  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    stepState.currentStep = 0;
    stepState.submitLoading = false;

    // 默认值
    editData.value = {
      barcode: '',
      sn: '',
      kindId: 0,
      catalogIds: [],
      images: [],
      skuConfigs: [],
      skus: [],
      paymentExpiration: 30,
      buyLimit: { enabled: false, quantity: 0 },
      meta: { giftCardId: 0, couponCode: '' },
      type: EGoodsType.goods,
      properties: [],
      extends: {},
    };
    lastResult.value = {};
    defaultSku.value = {};
    oldId.value = 0;

    refStep1.value?.resetFields();
    refStep2.value?.resetFields();

    isUpdate.value = !!data?.isUpdate;
    isCopy.value = !!data?.isCopy;

    if (unref(isUpdate) || unref(isCopy)) {
      const result = await goodsInfo(data.record.id);
      oldId.value = data.record.id;
      // console.log('goodsInfo result', result);

      // 保留默认SKU的配置，避免重新生成不同的SKU
      if (unref(isUpdate) && !result.skuConfigs?.length) {
        defaultSku.value = result.skus[0];
      }

      const record = { ...editData.value, ...mapRecord(result) };
      console.debug('record', record);

      editData.value = { ...record };
      lastResult.value = { ...record };

      refStep1.value?.setFieldsValue(record);
      refStep2.value?.setFieldsValue(record);
    } else {
      refStep1.value?.setFieldsValue({ ...editData.value });
      refStep2.value?.setFieldsValue({ ...editData.value });
    }

    refStep1.value?.updateSchema({ field: 'type', dynamicDisabled: isUpdate.value });

    if (unref(isCopy)) {
      delete editData.value.id;
      delete editData.value.code;
      for (const image of editData.value.images) {
        delete image.id;
      }
    }
  });

  function mapRecord(record: Recordable) {
    for (const key of ['onSaleAt', 'openedAt', 'closedAt']) {
      if (record[key]) {
        record[key] = dayjs(record[key]).format('YYYY-MM-DD HH:mm:ss');
      }
    }

    if (record.type === EGoodsType.giftCard || record.type === EGoodsType.coupon) {
      record.skus.length ? (record.meta = record.skus.shift().meta) : '';
    }

    if (record.skuConfigs && record.skuConfigs.length > 0) {
      return { ...record, skus: [record.skuConfigs, record.skus] };
    } else {
      return { ...record, skus: [] };
    }
  }

  // 弹窗标题
  const title = computed(() =>
    !unref(isUpdate) ? (unref(isCopy) ? '复制商品' : '添加商品') : '编辑商品',
  );

  function handleCheckAt(values) {
    return new Promise((resolve, reject) => {
      if (values.closedAt < values.openedAt) {
        message.warning('自动上架时间不能比下架时间晚，请重新选择');
        return reject();
      }
      return resolve(values);
    });
  }

  async function handleNext(isSave = false) {
    try {
      stepState.submitLoading = true;
      const values = await refStep1.value?.validate();
      // 上下架时间校验
      if (values?.openedAt && values?.closedAt) {
        const atChecked = await handleCheckAt(values);
        if (!atChecked) return;
      }

      const params = cloneDeep(values);

      params.sn = params.sn.trim();
      params.barcode = params.barcode.trim();

      const _meta = {
        giftCardId: get(params, 'meta.giftCardId', null),
        couponCode: get(params, 'meta.couponCode', null),
      };

      params.meta = _meta;

      if (!params.skus || params.skus.length === 0) {
        params.skuConfigs = [];
        params.skus = [
          Object.assign(defaultSku.value, {
            price: params.price,
            guidePrice: params.guidePrice || null,
            stock: params.stock || 0,
            weight: params.weight || '',
            sn: params.sn || '',
            barcode: params.barcode || '',
            comb: [{ k: '', kId: 0, v: '', vId: 0 }],
            meta: params.meta,
          }),
        ];
      } else {
        if (params.type === EGoodsType.goods) {
          // 实物商品
          [params.skuConfigs, params.skus] = [params.skus[0], params.skus[1]];
        }
      }

      // if (params.type === EGoodsType.giftCard) {
      //   delete params['cardIds'];
      // }

      params.deliveryTemplateId = 0;

      fixParamsNumber(params);

      if (!params.saleTime) {
        params.saleTime = {};
      }

      let result: Recordable = {};

      if (!params.deleteImages) {
        params.deleteImages = [];
      }

      for (const key of ['onSaleAt', 'openedAt', 'closedAt']) {
        if (params[key]) {
          params[key] = dayjs(params[key]).format();
        }
      }

      const buyLimit = {
        enabled: get(params, 'buyLimit.enabled', false),
        quantity: get(params, 'buyLimit.quantity', 0),
      };
      params.buyLimit = buyLimit;

      const _extends = {
        technology: get(params, 'extends.technology', ''),
        releaseDate: get(params, 'extends.releaseDate', null),
      };

      params.extends = { ...params.extends, ..._extends };

      console.debug('handleNext', params);
      // return;
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(editData.value.id, params);
      } else if (unref(isCopy)) {
        // const oldId = editData.value.id;
        delete editData.value.id;
        //复制
        result = await createApi({ ...editData.value, ...params, appId: '', alias: '' });
        //复制图文
        const oldDetail = await goodsDetail(oldId.value);
        await goodsDetailUpdate(result.id, {
          rows: oldDetail.list.map((item: Recordable) => {
            delete item.id;
            return item;
          }),
          deleteIds: [],
        });
      } else {
        //新增
        result = await createApi(params);
      }

      lastResult.value = result;

      //第一步提交后都是更新
      isUpdate.value = true;
      editData.value = mapRecord(result);

      refStep1.value?.setFieldsValue({ ...editData.value });

      if (isSave) {
        //第一步中点保存
        return;
      }

      stepState.currentStep++;
      stepState.initSetp2 = true;
      await nextTick();
      refStep2.value?.resetFields();
      const detail = await goodsDetail(editData.value.id);
      refStep2.value?.setFieldsValue({
        ...editData.value,
        details: { rows: detail.list, deleteIds: [] },
        videoCover: editData.value.video?.thumb || '',
        shareImageUrl: editData.value.shareImage?.url || '',
      });
      await nextTick();
      refStep2.value?.clearValidate();
    } finally {
      stepState.submitLoading = false;
    }
  }

  async function handlePrev() {
    stepState.currentStep--;
  }

  function handleCancel() {
    closeDrawer();
  }

  function fixParamsNumber(params: Recordable) {
    const fields = ['price', 'guidePrice', 'weight'];
    for (const k of fields) {
      if (typeof params[k] !== 'undefined' && params[k] !== null && params[k] !== '') {
        params[k] = Number(params[k]);
      } else {
        params[k] = null;
      }
    }
  }

  async function handleSubmit(isSave = false) {
    try {
      stepState.submitLoading = true;

      const video = lastResult.value.video;
      const shareImage = lastResult.value.shareImage;
      const values = await refStep2.value?.validate();
      const params = { ...lastResult.value, ...values };

      delete params.details;
      params.deleteImages = refStep2.value?.getDeleteImages();

      // 删除视频
      if (video && !params.video) {
        params.deleteImages?.push(video.id);
      }

      if (shareImage && !params.shareImageUrl) {
        params.deleteImages?.push(shareImage.id);
      }

      const _extends = {
        aftersales: get(params, 'extends.aftersales', null),
      };

      params.extends = { ...params.extends, ..._extends };

      fixParamsNumber(params);

      if (params.videoCover && !params.video) {
        return message.error('上传了视频封面，但没有视频');
      }

      if (params.video) {
        Object.assign(params, { video: { ...params.video, thumb: params.videoCover || '' } });
      }
      delete params.videoCover;

      if (params.shareImageUrl) {
        Object.assign(params, {
          shareImage: { ...params.shareImage, url: params.shareImageUrl },
        });
      } else {
        delete params.shareImage;
      }
      delete params.shareImageUrl;

      console.log('handleSubmit', params);
      await updateApi(editData.value.id, params);

      if (values.details) {
        //图文详情
        await goodsDetailUpdate(editData.value.id, values.details);
      }

      closeDrawer();
      emit('success');
      message.success('提交成功');
    } catch (e: any) {
      if (e && e.errorFields) {
        if (isSave) {
          message.info('下一步中有未填写的必填项，不能保存');
        }
      }
    } finally {
      stepState.submitLoading = false;
    }
  }

  async function handleSubmitInStep1() {
    await handleNext(true);
    await handleSubmit(true);
  }
</script>

<style lang="less" scoped>
  .step-wrap {
    max-width: 400px;
    margin: 0 auto;
  }
  .footer-btn {
    width: 90px;
  }
</style>
