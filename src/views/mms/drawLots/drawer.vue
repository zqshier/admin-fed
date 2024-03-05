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
        <a-step title="订阅通知" />
      </a-steps>
    </div>

    <div class="mt-5">
      <Step1
        ref="refStep1"
        :editData="editData"
        v-show="stepState.currentStep === 0"
        :isDisabled="isUpdate"
      />
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
  import { ref, computed, unref, reactive, nextTick } from 'vue';
  import { message, Steps as ASteps, Step as AStep } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash-es';
  import { StepActionType, IGoodsInputDataInfo } from './data';
  import { DrawLotsItems } from '/@/api/app/model/mmsModel';
  import {
    drawLotsCreate as createApi,
    drawLotsUpdate as updateApi,
    drawLotsDetail as detailApi,
  } from '/@/api/app/mms';
  import { skuStockList } from '/@/api/app/goods';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import Step1 from './components/DrawerStep1.vue';
  import Step2 from './components/DrawerStep2.vue';

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
  const editData = ref<Recordable>({});
  const oldId = ref(0);

  //弹窗
  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    console.debug('data', data);
    stepState.currentStep = 0;
    stepState.submitLoading = false;

    // 默认值
    editData.value = {
      name: '',
      drawCount: 0,
      startAt: '',
      endAt: '',
      finishAt: '',
      bookingTemplateId: '',
      bookingTemplateData: [],
      pickOnTemplateId: '',
      pickOnTemplateData: [],
      waitingPaymentTemplateId: '',
      waitingPaymentTemplateData: [],
      targetData: { goodsId: 0, skuId: 0 },
      target: 'goodsSku',
      goods: [],
    } as unknown as DrawLotsItems;

    oldId.value = 0;

    refStep1.value?.resetFields();
    refStep2.value?.resetFields();

    isUpdate.value = !!data?.isUpdate;
    isCopy.value = !!data?.isCopy;

    if (unref(isUpdate) || unref(isCopy)) {
      const result = await detailApi(data.record.id);
      oldId.value = data.record.id;

      // 获取详情商品sku数据
      const goods: IGoodsInputDataInfo[] = [];
      try {
        const { list } = await skuStockList({
          skuIds: data.record.targetData.skuId,
          perPage: 1,
          page: 1,
        });
        for (const row of list) {
          const { item, id: skuId, price, name, stock, itemId } = row;
          goods.push({
            goodsId: itemId!,
            skuId,
            enableLimit: true,
            goodsName: item.name,
            goodsSku: name,
            goodsPrice: price,
            goodsStock: stock,
            quantity: data.record.drawCount,
            price: String(price),
          });
        }
      } catch (error) {
        console.error('skuStockList error=', error);
      }
      const record = { ...editData.value, ...mapRecord(result), goods };
      console.debug('record', record);
      editData.value = { ...record };

      refStep1.value?.setFieldsValue(record);
      refStep2.value?.setFieldsValue(record);
    } else {
      refStep1.value?.setFieldsValue({ ...editData.value });
      refStep2.value?.setFieldsValue({ ...editData.value });
    }

    refStep1.value?.clearValidate();
    refStep2.value?.clearValidate();

    // if (unref(isCopy)) {
    //   delete editData.value.id;
    //   // delete editData.value.code;
    //   // for (const image of editData.value.images) {
    //   //   delete image.id;
    //   // }
    // }
  });

  function mapRecord(record: Recordable) {
    for (const key of ['startAt', 'endAt', 'finishAt', 'createdAt', 'updatedAt']) {
      if (record[key]) {
        record[key] = dayjs(record[key]).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    return { ...record };
  }

  // 弹窗标题
  const title = computed(() =>
    !unref(isUpdate) ? (unref(isCopy) ? '复制抽签商品' : '添加抽签商品') : '编辑抽签商品',
  );

  async function handleNext(isSave = false) {
    try {
      stepState.submitLoading = true;
      const values = await refStep1.value?.validate();
      console.debug('handleNext refStep1 values=', values);

      const { startAt, endAt, finishAt, goods } = values as DrawLotsItems;
      const delta = 10 * 60 * 1000;
      const deltaTime = dayjs(new Date().getTime() + delta).format('YYYY-MM-DD HH:mm:ss');
      // 判断参与抽签、抽签截止、公布结果时间
      if (!unref(isUpdate) && startAt <= deltaTime) {
        return message.error('参与抽签时间距当前时间太短，至少要10分钟');
      }
      if (startAt >= endAt) {
        return message.error('抽签截止时间必须晚于参与抽签时间');
      }
      if (finishAt <= endAt) {
        return message.error('公布结果时间必须晚于抽签截止时间');
      }

      let drawCount = 0;
      const targetData = { goodsId: 0, skuId: 0 };
      if (goods?.length) {
        goods.forEach((item, index) => {
          if (index === 0) {
            drawCount = item.quantity ? +item.quantity : 0;
            targetData.goodsId = item.goodsId ? item.goodsId : 0;
            targetData.skuId = item.skuId ? item.skuId : 0;
          }
        });
      }
      editData.value = { ...editData.value, ...values, drawCount, targetData };
      refStep1.value?.setFieldsValue({ ...editData.value });

      if (isSave) {
        //第一步中点保存
        return;
      }

      stepState.currentStep++;
      stepState.initSetp2 = true;
      await nextTick();
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

  async function handleSubmit(isSave = false) {
    try {
      stepState.submitLoading = true;

      const values = await refStep2.value?.validate();

      console.log('handleSubmit values', values);
      console.log('handleSubmit editData', editData.value);

      const params = cloneDeep({ ...editData.value, ...values });
      delete params.goods;
      console.log('handleSubmit', params);
      // return;
      let result: Recordable = {};

      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(params.id, params);
      } else if (unref(isCopy)) {
        delete params.id;
        //复制
        result = await createApi({ ...params, appId: '', alias: '' });
      } else {
        //新增
        result = await createApi(params);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
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
