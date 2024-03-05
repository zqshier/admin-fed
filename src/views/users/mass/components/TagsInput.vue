<template>
  <div>
    <div><a-button @click="addTags">添加标签</a-button></div>
    <div class="tags-list">
      <div class="tag-item" v-for="(item, index) in state.tags" :key="item.id">
        <a-tag closable @close.prevent
          >{{ item.name }}
          <template #closeIcon>
            <a-popconfirm @confirm="delTag(index)" :title="`确认删除？`">
              <CloseOutlined />
            </a-popconfirm>
          </template>
        </a-tag>
      </div>
    </div>
    <TagsPickModal @register="registerTagsPickModal" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import { Tag as ATag, Popconfirm as APopconfirm } from 'ant-design-vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import TagsPickModal from './TagsPickModal.vue';
  import { useModal } from '/@/components/Modal';

  const props = defineProps<{
    value?: number[];
  }>();

  const emit = defineEmits(['update:value', 'change']);

  const state = reactive<{
    tags: any[];
  }>({
    tags: [],
  });

  const [registerTagsPickModal, { openModal: openTagsPick }] = useModal();

  function updateValue() {
    let v = state.tags.map((item) => item.id);

    emit('update:value', v);
    emit('change', v);
  }

  function addTags() {
    openTagsPick(true, {
      ids: [],
      success: ({ rows }) => {
        rows.forEach((item: any) => {
          if (state.tags.findIndex((i) => i.id === item.id) === -1) {
            state.tags.push(item);
          }
        });
        updateValue();
      },
    });
  }

  function delTag(index: number) {
    state.tags.splice(index, 1);
    updateValue();
  }

  watch(
    () => props.value,
    (v) => {
      if (!v) {
        state.tags = [];
      }
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped>
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .tag-item {
      margin-bottom: 10px;
      :deep(.ant-tag) {
        padding-top: 4px;
        padding-bottom: 4px;
        display: flex;
        align-items: center;
        cursor: default;
        user-select: none;

        .ant-tag-close-icon {
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
