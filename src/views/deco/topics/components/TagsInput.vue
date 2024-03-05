<template>
  <div class="tags-input-wrap">
    <div class="tags-wrap">
      <draggable class="flex" v-model="tagsList" item-key="id" tag="div">
        <template #item="{ element, index }">
          <a-tag closable @close.prevent
            >{{ element.name }}
            <template #closeIcon>
              <pop-input @confirm="onEditTag" :item="element" :value-key="'name'">
                <EditOutlined class="mr-1" />
              </pop-input>
              <a-popconfirm @confirm="delItem(index)" :title="`确认删除？`">
                <CloseOutlined />
              </a-popconfirm>
            </template>
          </a-tag>
        </template>
      </draggable>
      <pop-input @confirm="addTag">
        <a-button type="default">添加tab</a-button>
      </pop-input>
    </div>
    <div class="tags-cont-wrap">
      <div class="tags-cont" v-for="(item, index) in tagsList" :key="index">
        <div class="title"
          >{{ item.name }}
          <!-- <a-button @click="addGoods(item)" class="btn" type="default">添加商品</a-button> -->
          <a-button @click="addLink(item)" class="btn" type="default">添加链接</a-button>
        </div>
        <div class="item-list" v-if="item.items">
          <div class="item" v-for="(goods, goodsIndex) in item.items" :key="goods.id">
            <TagItem
              v-model:item="item.items[goodsIndex]"
              @delete="delItemGoods(goodsIndex, item)"
              @edit="editItem(goodsIndex, item)"
            />
          </div>
        </div>
      </div>
    </div>
    <GoodsPickModal @register="registerGoodsPick" />
    <LinkModal @register="registerLinkModal" />
  </div>
</template>

<script lang="ts" setup>
  import { PopInput } from '/@/components/PopInput';
  import draggable from 'vuedraggable';
  import { Tag as ATag, Popconfirm as APopconfirm } from 'ant-design-vue';
  import { onMounted, provide, ref, watch } from 'vue';
  import { CloseOutlined, EditOutlined } from '@ant-design/icons-vue';

  import GoodsPickModal from '/@/views/components/GoodsPickModal.vue';
  import { useModal } from '/@/components/Modal';
  // import { GoodsPickData } from '/@/views/components/GoodsPickModal.vue';
  import { TopicsTagsItem } from '/@/api/app/mms';
  import LinkModal from './LinkModal.vue';
  import TagItem from './TagItem.vue';

  const props = defineProps({
    value: {
      type: Array as PropType<TopicsTagsItem[]>,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const [registerGoodsPick, { openModal: openGoodsPick }] = useModal();
  const [registerLinkModal, { openModal: openLinkModal }] = useModal();

  const tagsList = ref<TopicsTagsItem[]>([]);

  function delItem(index: number) {
    tagsList.value.splice(index, 1);
  }

  function addTag(value: string) {
    tagsList.value.push({
      name: value,
      items: [],
    });
  }

  function onEditTag(value: string, item: TopicsTagsItem) {
    item.name = value;
  }

  // function addGoods(item: TopicsTagsItem) {
  //   openGoodsPick(true, {
  //     ids: item.items.filter((o) => o.itemType === 'goods').map((o) => o.itemId),
  //     callback: (data: GoodsPickData) => {
  //       const rows = data.rows || [];
  //       for (const row of rows) {
  //         // 不添加重复的商品
  //         if (item.items.find((o) => o.itemId === row.id && o.itemType === 'goods')) {
  //           continue;
  //         }
  //         item.items.push({
  //           itemId: row.id,
  //           itemType: 'goods',
  //           name: row.name,
  //           image: row.image,
  //           link: '',
  //         });
  //       }
  //     },
  //   } as GoodsPickData);
  // }

  function addLink(item: TopicsTagsItem) {
    openLinkModal(true, {
      callback: (data: Recordable) => {
        item.items.push({
          itemId: data.itemId,
          itemType: data.itemId ? 'goods' : 'link',
          name: data.name,
          image: data.image,
          link: data.link,
        });
      },
    });
  }

  function delItemGoods(index: number, item: TopicsTagsItem) {
    item.items?.splice(index, 1);
  }

  function editItem(index: number, item: TopicsTagsItem) {
    console.debug('editItem', index, item.items[index]);
    openLinkModal(true, {
      data: item.items[index],
      callback: (res: Recordable) => {
        Object.assign(item.items[index], res);
      },
    });
  }

  function updateValue() {
    emit('update:value', tagsList.value);
    emit('change', tagsList.value);
  }

  function initValue() {
    console.log('initvalue', props.value);
    if (props.value) {
      tagsList.value = props.value;
    }
  }

  watch(
    () => tagsList.value,
    () => updateValue(),
    { deep: true },
  );

  watch(
    () => props.value,
    () => initValue(),
    { deep: true },
  );

  onMounted(() => initValue());

  provide('openGoodsPick', openGoodsPick);
</script>

<style lang="less" scoped>
  .tags-input-wrap {
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
    .tags-wrap {
      display: flex;
    }

    .tags-cont {
      padding: 10px;
      border: 1px solid @border-color-base;
      border-radius: 3px;
      margin-top: 10px;
      .title {
        .btn {
          margin-left: 10px;
        }
      }
      .item-list {
        .item {
          margin-bottom: 4px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
