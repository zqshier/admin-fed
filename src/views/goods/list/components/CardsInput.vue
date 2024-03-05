<template>
  <div>
    <div class="flex">
      <a-button @click="showPop" v-bind="$attrs">{{ selectedCard.name || '添加卡' }}</a-button>
    </div>
    <gift-cards-picker @register="registerGiftCardPick" />
  </div>
</template>

<script lang="ts" setup>
  import { useModal } from '/@/components/Modal';
  import { ref, onMounted } from 'vue';
  import { giftCardList } from '/@/api/app/giftCard';
  import GiftCardsPicker from './GiftCardsPicker.vue';

  const props = defineProps({
    value: {
      type: Number,
      default: 0,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const selectedCard = ref<{ id?: number; name?: string }>({} as {});

  const [registerGiftCardPick, { openModal }] = useModal();

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

  async function getCardData() {
    const { list = null } = await giftCardList({ ids: props.value, page: 1, perPage: 10 });
    if (!list) return;
    const { name, id } = list.shift()!;
    selectedCard.value = { name, id };
  }

  onMounted(async () => {
    if (!props.value) return;
    getCardData();
  });
</script>

<style lang="less" scoped></style>
