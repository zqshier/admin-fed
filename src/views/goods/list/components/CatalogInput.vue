<template>
  <div>
    <div class="inp-wrap flex-1" style="flex-wrap: wrap">
      <a-tag v-for="item in selectedList" :key="item.key">{{ item.title }}</a-tag>
      <a-button class="mt-1" @click="showPop">添加分组</a-button>
    </div>
    <BasicModal @register="registerModal" title="选择分组" @ok="handleSubmit">
      <BasicTree
        v-if="treeData.length > 0"
        ref="treeRef"
        defaultExpandAll
        toolbar
        checkable
        search
        checkStrictly
        :treeData="treeData"
      />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { Tag as ATag } from 'ant-design-vue';
  import { onMounted, ref, toRaw, watch } from 'vue';
  import { catalogsList } from '/@/api/app/goods';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree/index';
  import { isArray } from '/@/utils/is';

  const props = defineProps({
    value: {
      type: Array as PropType<number[]>,
      default: () => {
        return [];
      },
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const [registerModal, { openModal, closeModal }] = useModal();

  const treeData = ref<TreeItem[]>([]);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  const selectedList = ref<TreeItem[]>([]);
  const treeDataMap = {};

  async function getData() {
    const res: any = await catalogsList({} as any);
    treeData.value = res.map((item: Recordable) => mapFields(item));
  }

  async function showPop() {
    openModal();
    await getData();
    showChecked(props.value, true);
  }

  function mapFields(item: Recordable) {
    item.children = item.children || [];
    const _item = {
      key: item.id,
      title: item.name,
      children: item.children.map((child: Recordable) => mapFields(child)),
    };
    treeDataMap[_item.key] = _item;
    return _item;
  }

  async function showChecked(ids: number[], setKey: Boolean = false) {
    ids = ids || [];
    const list: TreeItem[] = ids.map((id) => treeDataMap[id]);
    selectedList.value = list;
    if (setKey) {
      if (!treeRef.value) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return showChecked(ids, setKey);
      }
      treeRef.value.setCheckedKeys(ids);
    }
  }

  function handleSubmit() {
    if (treeRef.value) {
      const keys: Recordable = toRaw(treeRef.value.getCheckedKeys());
      console.log(keys);

      const ids = isArray(keys) ? keys : keys.checked || [];

      emit('change', ids);
      emit('update:value', ids);
      showChecked(ids);
      closeModal();
    }
  }

  onMounted(async () => {
    await getData();
    showChecked(props.value);
  });

  watch(
    () => props.value,
    () => {
      showChecked(props.value);
    },
  );
</script>

<style lang="less" scoped>
  .inp-wrap {
    display: flex;
    align-items: center;
    :deep(.ant-tag) {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
</style>
