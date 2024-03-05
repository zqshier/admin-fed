<template>
  <div :class="{ 'form-slot': state.type !== GroupUserType.all }">
    <div>
      <a-radio-group v-model:value="state.type" name="radioGroup" @change="onTypeChange">
        <a-radio :value="item.value" v-for="item in GroupUserTypeList" :key="item.value">{{
          item.label
        }}</a-radio>
      </a-radio-group>
    </div>
    <div class="flex items-center mt-4" v-if="state.type !== GroupUserType.all">
      <div v-if="state.type === GroupUserType.include" class="mr-2">可参与用户标签：</div>
      <div v-if="state.type === GroupUserType.exclude" class="mr-2">不可参与用户标签：</div>
      <div v-if="state.tagIds && state.tagIds.length > 0" class="mr-2">
        已选{{ state.tagIds.length }}个标签
      </div>
      <div><a-button @click="handleTags">选择标签</a-button></div>
    </div>
    <TagsPickModal @register="registerTagsPickModal" />
  </div>
</template>

<script setup lang="ts">
  import { Radio as ARadio, RadioGroup as ARadioGroup } from 'ant-design-vue';
  import { reactive, unref, watch } from 'vue';
  import { GroupUserType, GroupUserTypeList } from '../data';
  import TagsPickModal from './TagsPickModal.vue';

  import { useModal } from '/@/components/Modal';

  const [registerTagsPickModal, { openModal: openTagsPick }] = useModal();

  const emit = defineEmits(['update:value', 'change']);

  interface IState {
    type: GroupUserType;
    tagIds: number[];
  }

  const props = defineProps({
    value: {
      type: Object as PropType<IState>,
      default: () => ({
        type: GroupUserType.all,
        tagIds: [],
      }),
    },
  });

  const state = reactive<IState>({
    type: GroupUserType.all,
    tagIds: [],
  });

  function handleTags() {
    openTagsPick(true, {
      ids: state.tagIds,
      success: ({ ids }) => {
        state.tagIds = ids;
        updateValue();
      },
    });
  }

  function updateValue() {
    if (state.type === GroupUserType.all) {
      state.tagIds = [];
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
      if (v) {
        state.type = v.type;
        state.tagIds = v.tagIds;
      }
    },
    { immediate: true },
  );
</script>
