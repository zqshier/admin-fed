<template>
  <div class="mission-item" v-if="item">
    <a-checkbox v-model:checked="checked">{{ item.name }}</a-checkbox>
    <div class="con" v-if="item.code === MissionCodeEnum.invitemember">
      <div class="item">
        <span class="w-50px">每邀请</span>
        <a-input-number v-model:value="state.condition" />
        <span class="ml-1 mr-1">人，获得</span>
        <a-input-number v-model:value="state.rewardValue" />
        <span class="ml-1">积分</span>
      </div>
      <div class="item">
        <span class="w-50px">上限</span>
        <a-input-number v-model:value="state.times" />
        <span class="ml-1 mr-1">次奖励</span>
      </div>
      <div class="item">
        <span class="w-50px">描述：</span>
        <a-input class="inp" v-model:value="state.desc" />
      </div>
    </div>
    <div class="con" v-else>
      <div class="item">
        <span>完成后赠送：</span>
        <a-input-number v-model:value="state.rewardValue" />
        <span class="ml-1">积分</span>
      </div>
      <div class="item">
        <span>描述：</span>
        <a-input class="inp" v-model:value="state.desc" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    Checkbox as ACheckbox,
    InputNumber as AInputNumber,
    Input as AInput,
  } from 'ant-design-vue';
  import { computed } from 'vue';
  import { MissionCodeEnum, IMission } from '/@/api/app/model/missionModel';

  const props = defineProps<{
    item: IMission;
  }>();

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
</script>

<style lang="less" scoped>
  .mission-item {
    border: 1px solid #e8e8e8;
    padding: 12px;
    margin-bottom: 15px;
    width: 500px;
    .title {
    }
    .con {
      padding-left: 24px;
      .item {
        min-height: 40px;
        display: flex;
        align-items: center;
        .inp {
          width: 400px;
        }
      }
    }
  }
</style>
