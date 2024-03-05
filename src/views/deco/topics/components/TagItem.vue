<template>
  <div class="tab-item">
    <Row class="top-info">
      <Col class="title" :span="10">{{ item?.name }}</Col>
      <Col class="link" :span="12">链接：{{ item?.link }}</Col>
      <Col class="edit" @click="handleEdit" :span="2"><EditOutlined /></Col>
    </Row>
    <div class="img-list">
      <ImageItem
        class="img"
        v-for="(img, index) in imgList"
        :key="img"
        :src="img"
        deleteTips="确认删除此链接？"
        @delete="delImg(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { EditOutlined } from '@ant-design/icons-vue';
  import { computed } from 'vue';
  import { ITagsItem } from '/@/api/app/mms';
  import ImageItem from '/@/components/ImageUpload/src/components/ImageItem.vue';
  import { Row, Col } from 'ant-design-vue';

  const props = defineProps({
    item: {
      type: Object as PropType<ITagsItem>,
    },
  });

  const emit = defineEmits(['update:item', 'delete', 'edit']);

  const imgList = computed(() => {
    if (props.item?.image) {
      return props.item?.image.split(',');
    }
    return [];
  });

  const delImg = (index: number) => {
    if (imgList.value.length === 1) {
      emit('delete');
      return;
    }
    const list = imgList.value;
    list.splice(index, 1);
    const image = list.join(',');
    emit('update:item', { ...props.item, image });
  };

  const handleEdit = () => {
    emit('edit');
  };
</script>

<style lang="less" scoped>
  .tab-item {
    padding: 10px 0;
    .top-info {
      padding-bottom: 4px;
      .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .link {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .edit {
      }
    }
    .img-list {
      display: flex;
      flex-wrap: wrap;
      .img {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
</style>
