<template>
  <div>
    <div class="flex">
      <a-button :disabled="disabled" @click="showPop" v-bind="$attrs">{{
        selectedCard.name || '选择品类'
      }}</a-button>
    </div>
    <KindsPicker @register="registerKindsPick" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import KindsPicker from './KindsPicker.vue';
  import { kindsList as listApi } from '/@/api/app/goods';
  import { useModal } from '/@/components/Modal';

  const props = defineProps({
    value: { type: Number, default: 0 },
    items: { type: Object, default: () => {} },
    disabled: { type: Boolean, defalut: false },
  });

  const emit = defineEmits(['update:value', 'change']);

  const selectedCard = ref<{ id?: number; name?: string }>({} as {});

  const [registerKindsPick, { openModal }] = useModal();

  watchEffect(() => {
    // 没有值 重置
    if (!props?.value) selectedCard.value = {};
    if (!selectedCard.value?.id) {
      if (props?.items) {
        selectedCard.value = { ...props.items };
      } else {
        getKindsData();
      }
    }
  });

  async function showPop() {
    openModal(true, {
      id: props.value,
      cb: (cards: Recordable) => {
        selectedCard.value = cards;
        updateValue();
      },
    });
  }

  function updateValue() {
    const id = selectedCard.value?.id;
    if (!id) return;
    emit('change', id);
    emit('update:value', id);
  }

  async function getKindsData() {
    if (!props?.value) return;
    const { list = null } = await listApi({ ids: `${props.value}`, page: 1, perPage: 100 });
    if (!list) return;
    const { name, id } = list.shift()!;
    selectedCard.value = { name, id };
  }

  // onMounted(() => {
  //   getKindsData();
  // });
</script>

<style lang="less" scoped></style>
