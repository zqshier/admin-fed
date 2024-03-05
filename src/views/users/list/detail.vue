<template>
  <PageWrapper :title="`用户` + userId + `的资料`" contentBackground @back="goBack">
    <div class="user-info-wrap">
      <Avatar :size="50" :src="userInfo?.avatar" />
      <div class="user-box ml-4" style="height: 50px">
        <div class="user-id">{{ userInfo?.id }}</div>
        <div class="user-name">{{ userInfo?.nickname }}</div>
      </div>
      <div class="user-remark">
        <span>备注：</span>
        <span>{{ userInfo?.remark || '-' }}</span>
      </div>
      <div class="actions">
        <a-button class="btn" size="small" @click="handleAction('tag')">添加标签</a-button>
        <a-button class="btn" size="small" @click="handleAction('coupon')">发放优惠券</a-button>
        <a-button class="btn" size="small" @click="handleAction('point')">修改积分</a-button>
        <a-button class="btn" size="small" @click="handleAction('erase')">注销用户</a-button>
      </div>
    </div>
    <Description
      size="middle"
      title="基本信息"
      :bordered="false"
      :column="3"
      :data="userInfo"
      :schema="detailBaseSchema"
    />
    <Description
      size="middle"
      title="客户资料"
      :bordered="false"
      :column="3"
      :data="userInfo"
      :schema="detailCustomSchema"
    />
    <Description
      size="middle"
      title="交易统计"
      :bordered="false"
      :column="3"
      :data="userInfo?.data"
      :schema="userOrderCustomSchema"
    />
    <AddTagsModal @register="registerAddTagsModal" @success="getUserInfo" />
    <PointsModal @register="registerPointsModal" @success="getUserInfo" />
    <CouponModal @register="registerCouponModal" @success="getUserInfo" />
  </PageWrapper>
</template>

<script lang="ts">
  export type ActionsType = 'tag' | 'coupon' | 'point' | 'erase';
</script>
<script lang="ts" setup>
  import { Avatar, Modal } from 'ant-design-vue';
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import AddTagsModal from './components/AddTagsModal.vue';
  import CouponModal from './components/CouponModal.vue';
  import PointsModal from './components/PointsModal.vue';
  import { detailBaseSchema, detailCustomSchema, userOrderCustomSchema } from './data';
  import { AppUserModel, updateUserStatus, userDetail } from '/@/api/app/users';
  import { Description } from '/@/components/Description';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  const route = useRoute();
  const router = useRouter();
  const { setTitle } = useTabs();

  const userId = ref(route.params?.id);
  const userInfo = reactive<AppUserModel>({} as any);

  const [registerAddTagsModal, { openModal: openAddTagsModal }] = useModal();
  const [registerPointsModal, { openModal: openPointsModal }] = useModal();
  const [registerCouponModal, { openModal: openCouponModal }] = useModal();

  onMounted(async () => {
    setTitle('详情：用户 ' + userId.value);
    await getUserInfo();
  });

  async function getUserInfo() {
    if (!userId.value) return;
    try {
      const res = await userDetail(userId.value as unknown as number);
      Object.assign(userInfo, res);
      // console.log('userDetail', userInfo);
    } finally {
    }
  }

  async function handleAction(action: ActionsType) {
    const { id: userId, nickname } = userInfo;
    const data: Recordable = {
      record: {
        userIds: [userId],
        params: {},
        total: 0,
        info: { userId, nickname },
      },
    };
    return new Promise((resolve) => {
      data.record.resolve = () => resolve(action);
      switch (action) {
        case 'tag':
          openAddTagsModal(true, data);
          break;
        case 'coupon':
          openCouponModal(true, data);
          break;
        case 'point':
          openPointsModal(true, data);
          break;
        case 'erase':
          openEarse(data);
          break;
      }
    });
  }

  function goBack() {
    const { currentRoute } = router;
    const targetKey = currentRoute.value.fullPath;
    useMultipleTabStore().closeTabByKey(targetKey, router);
  }

  //注销用户
  function openEarse(data: Recordable) {
    Modal.confirm({
      title: '提醒',
      content: '确认要注销该用户吗，注销后该用户积分、优惠券将全部清空',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        console.debug('注销用户', data);
        await updateUserStatus(data.record.userIds[0], 2);
        data.record.resolve?.();
      },
    });
  }
</script>

<style lang="less" scoped>
  .user-info-wrap {
    display: flex;
    align-items: center;
    padding: 20px 10px;
    .user-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
    // .user-name {
    //   margin-left: 10px;
    // }
    .user-remark {
      margin-left: 20px;
      display: flex;
      align-items: center;
    }
    .edit-btn {
      margin-left: 5px;
      padding: 0;
    }
    .actions {
      display: flex;
      align-items: center;
      margin-left: 30px;
      .btn {
        margin-right: 10px;
      }
    }
  }
</style>
