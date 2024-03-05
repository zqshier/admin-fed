<template>
  <div class="flex flex-wrap user-tags-wrap">
    <a-tag v-for="(item, index) in tagList" :key="index" closable @close.prevent
      >{{ item.tagName }}
      <template #closeIcon>
        <a-popconfirm @confirm="delItem(index)" :title="`确认删除？`">
          <CloseOutlined />
        </a-popconfirm>
      </template>
    </a-tag>
  </div>
</template>

<script setup lang="ts">
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { Popconfirm as APopconfirm, Tag as ATag } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import { userTagUnbind } from '/@/api/app/users';

  const props = defineProps({
    tags: {
      type: Array as PropType<TagModel[]>,
      default: () => [],
    },
    userId: {
      type: Number,
      default: 0,
    },
  });

  watch(
    () => props.tags,
    (val) => {
      tagList.value = val;
    },
  );

  interface TagModel {
    tagId: number;
    tagName: string;
  }

  const tagList = ref<TagModel[]>(props.tags || []);

  async function delItem(index: number) {
    await userTagUnbind({
      userIds: [props.userId],
      tagIds: [tagList.value[index].tagId],
    });
    tagList.value.splice(index, 1);
  }
</script>

<style lang="less" scoped>
  .user-tags-wrap {
    :deep(.ant-tag) {
      padding-top: 4px;
      padding-bottom: 4px;
      display: flex;
      align-items: center;
      cursor: default;
      user-select: none;
      margin-bottom: 4px;

      .ant-tag-close-icon {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
