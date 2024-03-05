<template>
  <div>
    <a-button
      v-if="pickGoodsInfo?.length"
      :style="{ padding: 0, 'white-space': 'normal', 'text-align': 'left' }"
      @click="showPick"
      type="link"
      :disabled="disabled"
      >{{ pickName }}</a-button
    >
    <a-button v-else :disabled="disabled" @click="showPick">选择</a-button>
    <QuestionnairePickModal @register="registerPick" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watchEffect } from 'vue';
  import { questionnaireDetail } from '/@/api/app/article';
  import { IQuestionnaireItem } from '/@/api/app/model/articleModel';
  import { useModal } from '/@/components/Modal';
  import QuestionnairePickModal from '/@/views/components/QuestionnairePickModal.vue';

  const [registerPick, { openModal: openGoodsPick }] = useModal();

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'single' },
  });

  const pickGoodsInfo = ref<IQuestionnaireItem[]>([]);

  const emit = defineEmits(['update:value', 'change']);

  const pickName = computed(() => {
    const itemIds = [props.value] || [];
    const data = pickGoodsInfo.value.filter((item) => itemIds.some((id) => item.id == +id));
    const names = data.map((item) => item.title || item.id);
    return names.join() || '选择';
  });

  watchEffect(async () => {
    console.error(
      'props.value && pickGoodsInfo.value.length',
      props.value,
      pickGoodsInfo.value.length,
    );
    if (!props.value) return;
    if (props.value && pickGoodsInfo.value.length > 0) return;
    const targetIds = props.value.split(',');
    for (const id of targetIds) {
      const item = await questionnaireDetail(+id);
      pickGoodsInfo.value.push(item);
    }
  });

  const updateValue = (value: Recordable) => {
    emit('update:value', value);
    emit('change', value);
  };

  function showPick() {
    openGoodsPick(true, {
      ids: [+props.value] || [],
      callback: async (data) => {
        console.debug('openGoodsPick callback data', data);
        updateValue(data.ids.join(','));
        pickGoodsInfo.value = data.rows;
      },
    });
  }

  async function initGoodsInfo() {}

  defineExpose({ initGoodsInfo });
</script>
