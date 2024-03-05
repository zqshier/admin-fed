<template>
  <div class="tags-picker-wrap">
    <div class="list-wrap">
      <div
        class="tag"
        @click="toggleTag(tag)"
        :class="{ on: tag.checked }"
        v-for="tag in tagList"
        :key="tag.id"
        >{{ tag.name }}</div
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { userTagList, UserTagModel } from '/@/api/app/users';
  import { ref, watch } from 'vue';

  const props = defineProps({
    value: {
      type: Array as PropType<number[]>,
    },
  });

  const emits = defineEmits(['update:value', 'change']);

  interface TagItem extends UserTagModel {
    checked?: boolean;
  }

  const tagList = ref<TagItem[]>([]);

  async function getData() {
    const data = await userTagList({ perPage: 100, page: 1 });
    tagList.value = data.list;
    initValue();
  }

  function toggleTag(tag: TagItem) {
    if (tag.checked) {
      tag.checked = false;
    } else {
      tag.checked = true;
    }
    updateValue();
  }

  function updateValue() {
    const ids = tagList.value.filter((item) => item.checked).map((item) => item.id);
    emits('change', ids);
    emits('update:value', ids);
  }

  function initValue() {
    if (props.value) {
      tagList.value.forEach((item) => {
        if (props.value?.includes(item.id as number)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    } else {
      tagList.value.forEach((item) => (item.checked = false));
    }
  }

  watch(
    () => props.value,
    () => initValue(),
    { deep: true },
  );

  getData();
</script>

<style lang="less" scoped>
  .tags-picker-wrap {
    padding: 4px 0;
    .list-wrap {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
    }
    .tag {
      border: 1px solid #d9d9d9;
      padding: 2px 4px;
      min-width: 80px;
      text-align: center;
      color: @text-color;
      line-height: 22px;
      border-radius: 2px;
      cursor: pointer;
      &.on {
        color: @primary-color;
        border-color: @primary-color;
      }
    }
  }
</style>
