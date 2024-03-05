<template>
  <PageWrapper contentBackground contentClass="p-4">
    <div class="text-lg">任务管理</div>
    <div class="mt-3 w-full pl-3">
      <div class="text-sm">会员任务</div>
      <div class="mt-3">
        <MissionItem
          v-for="(item, index) in memberMissionList"
          :key="item.code"
          v-model:item="memberMissionList[index]"
        />
      </div>

      <div class="text-sm">每日任务</div>
      <div class="mt-3">
        <MissionItem
          v-for="(item, index) in dailyMissionList"
          :key="item.code"
          v-model:item="dailyMissionList[index]"
        />
      </div>

      <div class="mt-5">
        <a-space>
          <a-button :loading="submitLoading" type="primary" class="mr-6" @click="handleSave"
            >保存</a-button
          >
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { onMounted, ref } from 'vue';
  import { Space as ASpace, message } from 'ant-design-vue';
  import { memberMissionList, dailyMissionList, MissionEnum } from './data';
  import MissionItem from './components/MissionItem.vue';
  import { missionsList, batchUpdate } from '/@/api/app/mission';
  import { GroupCode, RewardType } from '/@/api/app/model/missionModel';

  const submitLoading = ref(false);

  async function handleSave() {
    console.log(memberMissionList.value, dailyMissionList.value);
    submitLoading.value = true;
    try {
      await batchUpdate({
        list: [...memberMissionList.value, ...dailyMissionList.value],
        groupCode: GroupCode.mission,
        groupName: '任务中心',
        groupRelatedId: 0,
      });
      message.success('保存成功');
    } catch (error) {
      const err = error as any;
      message.success(err.message || '保存失败');
      return;
    } finally {
      submitLoading.value = false;
    }
    await reload();
  }

  function handleCancel() {
    reload();
  }

  async function reload() {
    const res = await missionsList({ groupCode: GroupCode.mission, groupRelatedId: 0 });
    memberMissionList.value = [];
    dailyMissionList.value = [];
    for (const o of res.list) {
      if (!o.rewardType) {
        o.rewardType = RewardType.point;
        o.rewardId = '0';
        o.rewardValue = String(o.points || 0);
      }
      if (!o.meta) o.meta = {};
      if (o.type === MissionEnum.lifetime) {
        memberMissionList.value.push(o);
      } else {
        dailyMissionList.value.push(o);
      }
    }
  }

  onMounted(async () => {
    reload();
  });
</script>
