<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="80%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #awards="{ model, field }">
        <AwardsInput
          v-model:value="model[field]"
          ref="awardsInputRef"
          @update:value="inputValidate"
          :disabled="isUpdate"
        />
      </template>
      <template #mission="{ model, field }">
        <div class="mt-3 w-full pl-3">
          <div class="mt-3">
            <div class="flex" v-for="(item, index) in model[field]" :key="item.code">
              <MissionItem v-model:item="model[field][index]" />
              <div class="flex flex-col w-50px ml-2">
                <a-button class="mb-2" size="small" @click="itemMoveUp(model[field], index)"
                  >上移</a-button
                >
                <a-button class="mb-2" size="small" @click="itemMoveDown(model[field], index)"
                  >下移</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';
  // import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash-es';
  import AwardsInput from './components/AwardsInput.vue';
  import MissionItem from './components/MissionItem.vue';
  import { formSchema, pageTitle } from './data';
  import { batchUpdate, missionsList as detailApi } from '/@/api/app/mission';
  import {
    GroupCode,
    MissionCodeEnum,
    MissionEnum,
    MissionsGroupsListItem,
    RewardType,
  } from '/@/api/app/model/missionModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const record = ref<Recordable>({});
  const awardsInputRef = ref<any>(null);

  //表单
  const [registerForm, { setFieldsValue, validate, getFieldsValue, resetFields, clearValidate }] =
    useForm({
      labelWidth: 140,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();

    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    // 默认值
    Object.assign(record.value, {
      id: 0,
      code: 0,
      awards: {},
      mission: [
        {
          code: MissionCodeEnum.subwxoa,
          type: MissionEnum.lifetime,
          name: '关注公众号',
          disabled: false,
          desc: '',
          rewardType: RewardType.lotteryTicket,
          rewardValue: '1',
          link: '',
          position: 20,
          action: 'subwxoa',
        },
        {
          code: MissionCodeEnum.invitemember,
          type: MissionEnum.daily,
          name: '邀请新用户',
          disabled: false,
          desc: '',
          condition: 1,
          rewardType: RewardType.lotteryTicket,
          rewardValue: '1',
          meta: {
            inviteeRewardValue: 1,
          },
          times: 1,
          timesTotal: 1,
          position: 10,
          action: 'invite',
        },
        {
          code: MissionCodeEnum.signin,
          type: MissionEnum.daily,
          name: '每日领取',
          disabled: false,
          desc: '',
          rewardType: RewardType.lotteryTicket,
          rewardValue: '1',
          position: 9,
          action: MissionCodeEnum.signin,
        },
        {
          code: MissionCodeEnum.pageview,
          type: MissionEnum.daily,
          name: '浏览指定页面',
          disabled: false,
          desc: '',
          rewardType: RewardType.lotteryTicket,
          rewardValue: '1',
          link: '',
          position: 8,
          action: MissionCodeEnum.pageview,
        },
      ],
    });

    if (unref(isUpdate)) {
      const awards = {
        id: data.record?.relatedId,
        name: data.record?.name,
        code: '',
      };

      let mission = cloneDeep(record.value.mission);

      try {
        const { list } = await detailApi({
          groupCode: GroupCode.lottery,
          groupRelatedId: data.record?.relatedId,
        });

        for (const m of mission) {
          const o = list.find((l) => m.code === l.code);
          if (o) {
            for (const key in m) {
              m[key] = o[key];
            }
          }
        }
      } catch (error) {}

      Object.assign(record.value, {
        ...data.record,
        awards,
        mission: mission.sort((a, b) => b.position - a.position),
      });
    }

    console.debug('record', record.value);

    setFieldsValue(record.value);
    clearValidate();
    setTimeout(() => {
      awardsInputRef.value?.initAwardsInfo ? awardsInputRef.value.initAwardsInfo() : '';
    }, 100);
  });

  async function inputValidate() {
    try {
      await validate(['awards']);
    } catch (e) {}
  }

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      console.debug(values);

      setDrawerProps({ confirmLoading: true });

      const { id, name } = values.awards;
      const params = {
        list: values.mission.map((i, index) => ({ ...i, position: values.mission.length - index })),
        groupCode: GroupCode.lottery,
        groupName: name,
        groupRelatedId: id,
      } as MissionsGroupsListItem;

      if (id) {
        params.list = params.list.map((item) => ({ ...item, rewardId: id }));
      }

      // console.debug('params=', params);
      let result = {};
      result = await batchUpdate(params);

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  const itemMoveUp = (rows: Recordable, index: number) => {
    if (index === 0) return;
    const indexUp = index - 1;
    [rows[indexUp], rows[index]] = [rows[index], rows[indexUp]];
  };

  const itemMoveDown = (rows: Recordable, index: number) => {
    if (index === rows.length - 1) return;
    const indexUp = index + 1;
    [rows[indexUp], rows[index]] = [rows[index], rows[indexUp]];
  };
</script>
