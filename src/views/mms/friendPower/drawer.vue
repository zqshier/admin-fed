<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="60%"
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
      <Step1
        ref="refStep1"
        :editData="editData"
        :is-readonly="canMofify"
        v-show="stepState.currentStep === 0"
      />
      <Step2
        ref="refStep2"
        :editData="editData"
        :is-readonly="canMofify"
        v-show="stepState.currentStep === 1"
      />
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
  import { cloneDeep } from 'lodash-es';
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import { TypeEnum } from './components/AwardInput.vue';
  import Step1 from './components/DrawerStep1.vue';
  import Step2 from './components/DrawerStep2.vue';
  import { StepActionType, pageTitle, primaryKey } from './data';
  import {
    friendPowerCreateApi as createApi,
    friendPowerDetailApi as detailApi,
    friendPowerUpdateApi as updateApi,
  } from '/@/api/app/friendPower';
  import {
    FriendPowerListItem,
    FriendPowerListItemRewards,
    FriendPowerUpdateData,
    FriendPowerListItemRewardsTo as RewardsTo,
  } from '/@/api/app/model/friendPowerModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(false);
  const canMofify = ref<boolean>(false);

  const stepState = reactive({
    currentStep: 0,
    initSetp2: false,
    initSetp3: false,
    submitLoading: false,
  });

  const refStep1 = ref<StepActionType>();
  const refStep2 = ref<StepActionType>();
  const lastResult = ref<Recordable>({});
  const editData = ref<FriendPowerListItem>({} as FriendPowerListItem);
  const oldId = ref(0);

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  //弹窗
  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    stepState.currentStep = 0;
    stepState.submitLoading = false;

    // 默认值
    editData.value = {
      id: 0, //主键ID
      name: '', //活动名
      image: '', //活动头图
      start: null, //开始时间
      end: null, //结束时间
      rewardImage: '', //奖品展示图
      expireTime: '' as unknown as number, //活动发起后过期时间(小时)
      condition: '' as unknown as number, //邀请n人完成任务
      times: '' as unknown as number, //每人可发起n次
      friendIdentity: 0, //被邀请人身份限制，0 无限制，1 仅新用户
      friendPowerPerDay: 1, //被邀请人每天助力限制
      friendPowerTotal: 1, //被邀请人总助力限制
      disabled: false, //是否下架
      rewards: [{ type: TypeEnum.coupon, value: '', to: '', displayName: '' }], //奖励配置
      initiatorAward: [], //发起人奖励
      friendAward: [], //好友助力奖励
      friendRewardImage: '', //好友助力奖励图
      shareTitle: '', //分享标题
      shareImage: '', //分享图
      circleTotalCount: 1, //活动可发起次数
      sendMustAddContact: false, //是否需要加企业号
      orginDetails: { rows: [], deleteIds: [] },
      details: [],
      contactUrl: '',
      sharePosterImage: '',
      useInvitationCode: false,
      invitationCode: '',
    };

    lastResult.value = {};
    oldId.value = 0;

    refStep1.value?.initData();

    isUpdate.value = !!data?.isUpdate;

    refStep1.value?.resetFields();
    refStep2.value?.resetFields();

    if (unref(isUpdate)) {
      const result = await detailApi(data.record[primaryKey]);
      oldId.value = data.record.id;
      // console.log('goodsInfo result', result);

      const record: any = { ...editData.value, ...mapRecord(result) };
      console.debug('record', record);

      editData.value = { ...record };
      lastResult.value = { ...record };
    }

    // 活动开始后，时间和奖励不可修改
    if (!unref(isUpdate.value) || !editData.value.start) {
      canMofify.value = true;
    } else {
      canMofify.value = new Date(editData.value.start).getTime() > Date.now();
    }

    refStep1.value?.updateSchema([
      {
        required: canMofify.value,
        field: 'circleTotalCount',
        dynamicDisabled: !canMofify.value,
      },
      {
        required: canMofify.value,
        field: '[start,end]',
        dynamicDisabled: !canMofify.value,
      },
      {
        required: canMofify.value,
        field: 'expireTime',
        dynamicDisabled: !canMofify.value,
      },
      {
        required: canMofify.value,
        field: 'condition',
        dynamicDisabled: !canMofify.value,
      },
      {
        required: canMofify.value,
        field: 'times',
        dynamicDisabled: !canMofify.value,
      },
      {
        required: canMofify.value,
        field: '[friendIdentity,friendPowerPerDay,friendPowerTotal]',
        dynamicDisabled: !canMofify.value,
      },
    ]);

    console.debug('editData', editData.value);

    refStep1.value?.setFieldsValue(editData.value);
    refStep2.value?.setFieldsValue(editData.value);

    refStep1.value?.clearValidate();
    refStep2.value?.clearValidate();
  });

  function mapRecord(record: FriendPowerListItem) {
    for (const key of ['start', 'end']) {
      if (record[key]) {
        record[key] = dayjs(record[key]);
      }
    }

    if (record.details && record.details.length > 0) {
      record.orginDetails = { rows: record.details, deleteIds: [] };
    }

    handleRewards(record);
    return { ...record };
  }

  function handleRewards(record: any) {
    if (!record.rewards) return;
    const initiatorAward: { type: string; value: string; displayName: string }[] = []; //发起人奖励
    const friendAward: { type: string; value: string; displayName: string }[] = []; //好友助力奖励
    for (const r of record.rewards) {
      if (r.to === RewardsTo.initiator) {
        const idx = initiatorAward.findIndex((item) => item.type === r.type);
        if (initiatorAward[idx]) {
          initiatorAward[idx].type = r.type;
          initiatorAward[idx].value = r.value && `${initiatorAward[idx].value},${r.value}`;
          initiatorAward[idx].displayName =
            r.displayName && `${initiatorAward[idx].displayName},${r.displayName}`;
        } else {
          initiatorAward.push({ type: r.type, value: r.value, displayName: r.displayName });
        }
      }
      if (r.to === RewardsTo.friend) {
        const idx = friendAward.findIndex((item) => item.type === r.type);
        if (friendAward[idx]) {
          friendAward[idx].type = r.type;
          friendAward[idx].value = r.value && `${initiatorAward[idx].value},${r.value}`;
          friendAward[idx].displayName =
            r.displayName && `${friendAward[idx].displayName},${r.displayName}`;
        } else {
          friendAward.push({ type: r.type, value: r.value, displayName: r.displayName });
        }
      }
    }

    record.initiatorAward = initiatorAward;
    record.friendAward = friendAward;
  }

  function handleRewardsParams(row: any, to: RewardsTo) {
    const rewards: { type: TypeEnum; value: string; to: RewardsTo; displayName: string }[] = [];

    for (const item of row) {
      if (item.type === TypeEnum.coupon) {
        const values = item.value.split(',');
        rewards.push(
          ...values.map((i, index) => ({
            to,
            type: item.type,
            value: i,
            displayName: item.displayName.split(',')[index],
          })),
        );
      }
      if (item.type === TypeEnum.point)
        rewards.push({ to, type: item.type, value: item.value, displayName: item.displayName });
    }

    return rewards;
  }

  async function handleNext(isSave = false) {
    try {
      stepState.submitLoading = true;
      await refStep1.value?.validate();

      // const values: any = refStep1.value?.getFieldsValue();

      // const disabled = editData.value.disabled;

      // let result: FriendPowerListItem = {} as FriendPowerListItem;

      // if (unref(isUpdate)) {
      //   //编辑
      //   const { name, image, rewardImage, friendRewardImage } = values;
      //   const params: FriendPowerUpdateData = {
      //     name,
      //     image,
      //     rewardImage,
      //     disabled,
      //     friendRewardImage,
      //   };
      //   result = await updateApi(oldId.value, params);
      // } else {
      //   //新增
      //   const params = { ...editData.value, ...cloneDeep(values) };
      //   let rewards: FriendPowerListItemRewards[] = [];
      //   if (params.initiatorAward && params.initiatorAward.length > 0) {
      //     const initiatorAward = cloneDeep(params.initiatorAward);
      //     rewards = rewards.concat(handleRewardsParams(initiatorAward, RewardsTo.initiator));
      //     delete params.initiatorAward;
      //   }
      //   if (params.friendAward && params.friendAward.length > 0) {
      //     const friendAward = cloneDeep(params.friendAward);
      //     rewards = rewards.concat(handleRewardsParams(friendAward, RewardsTo.friend));
      //     delete params.friendAward;
      //   }

      //   console.debug('handleNext', params);
      //   result = await createApi({ ...params, disabled, rewards } as FriendPowerListItem);
      // }

      // lastResult.value = result;

      //第一步提交后都是更新
      // isUpdate.value = true;
      // editData.value = mapRecord(result);

      // refStep1.value?.setFieldsValue({ ...editData.value });

      if (isSave) {
        //第一步中点保存
        return;
      }

      stepState.currentStep++;
      stepState.initSetp2 = true;
      await nextTick();
      refStep2.value?.resetFields();
      refStep2.value?.setFieldsValue({ ...editData.value });
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

  async function handleSubmit(isSave = false) {
    try {
      stepState.submitLoading = true;

      await refStep2.value?.validate();
      const step1Values: any = refStep1.value?.getFieldsValue();
      const step2Values: any = refStep2.value?.getFieldsValue();

      const params: FriendPowerListItem = {
        ...handleStep1Params(step1Values),
        ...handleStep2Params(step2Values),
      };

      console.debug('handleSubmit params', params);
      if (unref(isUpdate)) {
        await updateApi(editData.value.id, params);
      } else {
        await createApi({ ...params });
      }

      closeDrawer();
      emit('success');
      message.success('提交成功');
    } catch (e: any) {
      console.error('e', e);
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

  function handleStep1Params(values) {
    const disabled = editData.value.disabled;
    console.error('values', values);
    if (unref(isUpdate)) {
      //编辑
      const { name, image, rewardImage, friendRewardImage, useInvitationCode, invitationCode } =
        values;
      const params: FriendPowerUpdateData = {
        name,
        image,
        rewardImage,
        disabled,
        friendRewardImage,
        useInvitationCode,
        invitationCode,
      };
      return params;
    } else {
      //新增
      const params = { ...editData.value, ...cloneDeep(values) };
      let rewards: FriendPowerListItemRewards[] = [];
      if (params.initiatorAward && params.initiatorAward.length > 0) {
        const initiatorAward = cloneDeep(params.initiatorAward);
        rewards = rewards.concat(handleRewardsParams(initiatorAward, RewardsTo.initiator));
        delete params.initiatorAward;
      }
      if (params.friendAward && params.friendAward.length > 0) {
        const friendAward = cloneDeep(params.friendAward);
        rewards = rewards.concat(handleRewardsParams(friendAward, RewardsTo.friend));
        delete params.friendAward;
      }

      console.debug('handleStep1Params', { ...params, disabled, rewards });
      return { ...params, disabled, rewards };
    }
  }

  function handleStep2Params(values) {
    const { orginDetails } = values;

    const params: FriendPowerUpdateData = {
      sendMustAddContact: values.sendMustAddContact,
      contactUrl: values.contactUrl,
      shareTitle: values.shareTitle,
      shareImage: values.shareImage,
      sharePosterImage: values.sharePosterImage,
    };

    orginDetails.rows && orginDetails.rows.length > 0
      ? (params.details = orginDetails.rows.filter((item) => item.content !== ''))
      : '';

    console.log('handleStep2Params', params);
    return params;
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
