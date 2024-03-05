<template>
  <div class="keyword-inp-wrap">
    <a-tag v-for="(item, index) in tagList" closable :key="index" @close.prevent="delTag(index)">{{
      item
    }}</a-tag>

    <a-input
      ref="inputRef"
      v-model:value="keyword"
      placeholder="添加关键词"
      style="width: 150px; margin-right: 10px"
      @press-enter="inpEnter"
      @blur="isShowInput = false"
      v-if="isShowInput"
    />

    <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
      <plus-outlined />
      添加关键词
    </a-tag>
  </div>
</template>

<script lang="ts" setup>
  import { Tag as ATag, Input as AInput } from 'ant-design-vue';

  import { onMounted, ref, watch, nextTick } from 'vue';

  import { PlusOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const tagList = ref<string[]>([]);
  const keyword = ref('');
  const isShowInput = ref(false);

  const inputRef = ref();

  function showInput() {
    isShowInput.value = true;
    nextTick(() => inputRef.value.focus());
  }

  function inpEnter() {
    if (keyword.value !== '') {
      tagList.value.push(keyword.value);
      keyword.value = '';
      setChange();
    }
  }

  function delTag(index: number) {
    tagList.value.splice(index, 1);
    setChange();
  }

  function setChange() {
    emit('change', tagList.value.join(','));
    emit('update:value', tagList.value.join(','));
  }

  function initValue() {
    if (props.value !== '') {
      tagList.value = props.value.split(',');
    } else {
      tagList.value = [];
    }
  }

  onMounted(() => {
    initValue();
  });

  watch(
    () => props.value,
    () => {
      initValue();
    },
  );
</script>

<style lang="less" scoped>
  .keyword-inp-wrap {
    :deep(.ant-tag) {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
</style>
