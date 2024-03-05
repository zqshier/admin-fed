<template>
  <div class="image-item-wrap" v-if="src">
    <div class="img" v-if="src">
      <a-image :preview="{ visible: previewVisible, onVisibleChange }" :src="src" />
    </div>
    <div class="mask">
      <div class="action" @click="onPreview"><EyeOutlined /></div>
      <div class="action" @click="onEdit" v-if="editable"><EditOutlined /></div>
      <a-popconfirm
        v-if="showDelIcon"
        :title="deleteTips || '确认删除此图片？'"
        @confirm="onDelete"
      >
        <div class="action"><DeleteOutlined /></div>
      </a-popconfirm>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons-vue';
  import { Image as AImage, Popconfirm as APopconfirm } from 'ant-design-vue';
  import { ref } from 'vue';

  defineProps({
    src: String as PropType<string>,
    editable: Boolean as PropType<boolean>,
    deleteTips: String as PropType<string>,
    showDelIcon: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  });

  const emit = defineEmits(['delete', 'edit']);
  const previewVisible = ref(false);

  function onVisibleChange(val: boolean) {
    previewVisible.value = val;
  }

  function onEdit() {
    emit('edit');
  }

  function onDelete() {
    emit('delete');
  }

  function onPreview() {
    previewVisible.value = true;
  }
</script>

<style lang="less" scoped>
  .image-item-wrap {
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    position: relative;
    width: 104px;
    height: 104px;
    .img {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      :deep(.ant-image) {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
    }
    &:hover {
      .mask {
        display: flex;
      }
    }

    .mask {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      .action {
        cursor: pointer;
        margin: 0 5px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      }

      &.loading {
        display: flex;
        .action {
          font-size: 20px;
          cursor: default;
        }
      }
    }
  }
</style>
