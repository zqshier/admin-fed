<template>
  <div>
    <a-button
      style="padding: 0"
      v-if="props.value?.ids?.length"
      @click="showUsersPick"
      type="link"
      :disabled="disabled"
    >
      <OperatorInfo type="user" :id="pickId" />
    </a-button>
    <a-button @click="showUsersPick" v-else>选择发布者</a-button>
    <usersPickModal @register="registerUsersPick" @success="pickSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import usersPickModal from './usersPickModal.vue';
  import { useModal } from '/@/components/Modal';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  const [registerUsersPick, { openModal: openGoodsPick }] = useModal();

  const props = defineProps({
    value: {
      type: Object as PropType<{ ids: number[]; rows: any }>,
      default: null,
    },
    disabled: { type: Boolean, default: false },
  });

  const emit = defineEmits(['update:value', 'change']);
  const pickId = computed(() => props.value.ids[0] || 0);

  const updateValue = (value: Recordable) => {
    emit('update:value', value);
    emit('change', value);
  };

  function pickSuccess(value: Recordable) {
    updateValue(value);
  }

  function showUsersPick() {
    const itemIds = (props.value && props.value.ids) || [];
    openGoodsPick(true, { type: 'single', ids: itemIds, disabled: props.disabled });
  }
</script>
