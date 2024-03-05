<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="用户详情" width="80%">
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
  </BasicDrawer>
</template>
<script lang="ts">
  export type ActionsType = 'tag' | 'coupon' | 'point' | 'erase';
</script>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { detailBaseSchema, detailCustomSchema, userOrderCustomSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { userDetail, AppUserModel } from '/@/api/app/users';
  import { Description } from '/@/components/Description';
  import { Avatar } from 'ant-design-vue';

  const userInfo = ref<AppUserModel>({} as any);
  let handleFn: Function;

  //弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    setDrawerProps({ loading: true });
    userInfo.value = { ...data.record };
    try {
      const res = await userDetail(data.record.id);
      Object.assign(userInfo.value, res);
      handleFn = data.handle;
      console.log('userDetail', userInfo.value);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  async function handleAction(action: ActionsType) {
    const { id, nickname } = userInfo.value;
    const result = await handleFn?.(action, id, nickname);
    console.log(result);
    if (id) {
      const res = await userDetail(id);
      Object.assign(userInfo, res);
    }
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
