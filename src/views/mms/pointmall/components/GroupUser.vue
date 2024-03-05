<template>
  <div :class="{ 'form-slot': state.tagOptionType !== GroupUserType.all }">
    <div>
      <a-radio-group v-model:value="state.tagOptionType" name="radioGroup" @change="onTypeChange">
        <a-radio :value="item.value" v-for="item in GroupUserTypeList" :key="item.value">{{
          item.label
        }}</a-radio>
      </a-radio-group>
    </div>
    <div class="flex items-center mt-4" v-if="state.tagOptionType !== GroupUserType.all">
      <div v-if="state.tagOptionType === GroupUserType.include" class="mr-2">可兑换用户标签：</div>
      <div v-if="state.tagOptionType === GroupUserType.exclude" class="mr-2"
        >不可兑换用户标签：</div
      >
      <div v-if="state.tagOptionData && state.tagOptionData.length > 0" class="mr-2">
        已选{{ state.tagOptionData.length }}个标签
      </div>
      <div><a-button @click="handleTags">选择标签</a-button></div>
    </div>
    <TagsPickModal @register="registerTagsPickModal" />
  </div>
</template>

<script setup lang="ts">
  import { Radio as ARadio, RadioGroup as ARadioGroup } from 'ant-design-vue';
  import { reactive, unref, watch } from 'vue';
  import TagsPickModal from '../../buyout/components/TagsPickModal.vue';
  import { ETagOptionType as GroupUserType } from '/@/api/app/model/promotionsModel';
  import { useModal } from '/@/components/Modal';

  const GroupUserTypeList = [
    { label: '全部用户', value: GroupUserType.all },
    { label: '部分用户可兑换', value: GroupUserType.include },
    { label: '部分用户不可兑换', value: GroupUserType.exclude },
  ];

  const [registerTagsPickModal, { openModal: openTagsPick }] = useModal();

  const emit = defineEmits(['update:value', 'change']);

  interface IState {
    tagOptionType: GroupUserType;
    tagOptionData: number[];
  }

  const props = defineProps({
    value: {
      type: Object as PropType<IState>,
      default: () => ({
        tagOptionType: GroupUserType.all,
        tagOptionData: [],
      }),
    },
  });

  const state = reactive<IState>({
    tagOptionType: GroupUserType.all,
    tagOptionData: [],
  });

  function handleTags() {
    openTagsPick(true, {
      ids: state.tagOptionData,
      success: ({ ids }) => {
        state.tagOptionData = ids;
        updateValue();
      },
    });
  }

  function updateValue() {
    if (state.tagOptionType === GroupUserType.all) {
      state.tagOptionData = [];
    }

    const v = {
      ...unref(state),
    };

    emit('update:value', v);
    emit('change', v);
  }

  function onTypeChange() {
    updateValue();
  }

  watch(
    () => props.value,
    (v) => {
      console.error('v111111', v);
      if (v) {
        state.tagOptionType = v.tagOptionType;
        state.tagOptionData = v.tagOptionData;
      }
    },
    { immediate: true },
  );
</script>
