<template>
  <div class="mission-item" v-if="item">
    <a-checkbox v-model:checked="checked">{{ getName(item.code) }}</a-checkbox>
    <div class="con mt-2" v-if="item.code === MissionCodeEnum.invitemember">
      <div class="item">
        <span>标题：</span>
        <a-input
          class="inp"
          v-model:value="state.name"
          placeholder="请输入"
          :maxlength="10"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span>描述：</span>
        <a-input
          class="inp"
          v-model:value="state.desc"
          placeholder="请输入"
          :maxlength="20"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span class="w-50px">邀请</span>
        <a-input-number
          v-model:value="state.condition"
          :min="1"
          :max="99"
          @change="(val) => (!val ? (state.condition = 1) : '')"
        />
        <span class="ml-1 mr-1">位新用户赠送</span>
        <a-input-number
          v-model:value="state.rewardValue"
          :min="1"
          :max="99"
          @change="(val) => (!val ? (state.rewardValue = '1') : '')"
        />
        <span class="ml-1">抽奖机会</span>
      </div>
      <div class="item">
        <span class="w-100px">被邀请人获得</span>
        <a-input-number v-model:value="state.meta.inviteeRewardValue" :min="1" :max="99" />
        <span class="ml-1 mr-1">次抽奖机会</span>
      </div>
      <div class="item">
        <span class="w-150px">每人每日任务完成上限</span>
        <a-input-number v-model:value="state.times" :min="1" :max="99" />
        <span class="ml-1 mr-1">次</span>
      </div>
      <div class="item">
        <span class="w-150px">每人该任务完成总上限</span>
        <a-input-number v-model:value="state.timesTotal" :min="1" :max="99" />
        <span class="ml-1 mr-1">次</span>
      </div>
    </div>
    <div class="con mt-2" v-if="item.code === MissionCodeEnum.subwxoa">
      <div class="item">
        <span>标题：</span>
        <a-input
          class="inp"
          v-model:value="state.name"
          placeholder="请输入"
          :maxlength="10"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span>描述：</span>
        <a-input
          class="inp"
          v-model:value="state.desc"
          placeholder="请输入"
          :maxlength="20"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span>完成后赠送：</span>
        <a-input-number
          v-model:value="state.rewardValue"
          :min="1"
          :max="99"
          @change="(val) => (!val ? (state.rewardValue = '1') : '')"
        />
        <span class="ml-1">抽奖机会</span>
      </div>
      <div class="item">
        <span>跳转链接：</span>
        <a-input class="inp" v-model:value="state.link" placeholder="请输入" />
      </div>
    </div>
    <div class="con mt-2" v-if="item.code === MissionCodeEnum.signin">
      <div class="item">
        <span>标题：</span>
        <a-input
          class="inp"
          v-model:value="state.name"
          placeholder="请输入"
          :maxlength="10"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span>描述：</span>
        <a-input
          class="inp"
          v-model:value="state.desc"
          placeholder="请输入"
          :maxlength="20"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span class="w-120px">每日完成签到赠送</span>
        <a-input-number
          v-model:value="state.rewardValue"
          :min="1"
          :max="99"
          @change="(val) => (!val ? (state.rewardValue = '1') : '')"
        />
        <span class="ml-1 mr-1">次抽奖机会</span>
      </div>
    </div>
    <div class="con mt-2" v-if="item.code === MissionCodeEnum.pageview">
      <div class="item">
        <span>标题：</span>
        <a-input
          class="inp"
          v-model:value="state.name"
          placeholder="请输入"
          :maxlength="20"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span>描述：</span>
        <a-input
          class="inp"
          v-model:value="state.desc"
          placeholder="请输入"
          :maxlength="20"
          :show-count="true"
        />
      </div>
      <div class="item">
        <span class="w-70px">跳转链接：</span>
        <a-input
          class="inp"
          placeholder="请输入"
          v-model:value="state.link"
          :show-count="true"
          :maxlength="100"
          style="width: 300px"
        />
        <span class="ml-1 mr-1">页面赠送</span>
        <a-input-number
          v-model:value="state.rewardValue"
          :min="1"
          :max="10"
          @change="(val) => (!val ? (state.rewardValue = '1') : '')"
        />
        <span class="ml-1 mr-1">次抽奖机会</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    Checkbox as ACheckbox,
    Input as AInput,
    InputNumber as AInputNumber,
  } from 'ant-design-vue';
  import { computed } from 'vue';
  import { IMission } from '../data';
  import { MissionCodeEnum } from '/@/api/app/model/missionModel';

  const props = defineProps<{
    item: IMission;
  }>();

  const codeName = {
    [MissionCodeEnum.invitemember]: '邀请新用户',
    [MissionCodeEnum.subwxoa]: '关注公众号',
    [MissionCodeEnum.signin]: '每日领取',
    [MissionCodeEnum.pageview]: '浏览指定页面',
  } as const;

  const emit = defineEmits(['update:item', 'change']);

  const checked = computed({
    get() {
      return !state.value.disabled;
    },
    set(val) {
      state.value.disabled = !val;
    },
  });

  const state = computed({
    get() {
      return props.item;
    },
    set(val) {
      emit('update:item', val);
      emit('change', val);
    },
  });

  function getName(code) {
    return codeName[code];
  }
</script>

<style lang="less" scoped>
  .mission-item {
    border: 1px solid #e8e8e8;
    padding: 12px;
    margin-bottom: 15px;
    width: 700px;
    .con {
      padding-left: 24px;
      .item {
        min-height: 40px;
        display: flex;
        align-items: center;
        .inp {
          width: 350px;
        }
      }
    }
  }
</style>
