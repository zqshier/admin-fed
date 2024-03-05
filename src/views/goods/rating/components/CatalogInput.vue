<template>
  <div>
    <div class="inp-wrap">
      <a-tag v-for="item in selectedList" :key="item.key">{{ item.title }}</a-tag>
      <a-button @click="showPop">添加分组</a-button>
    </div>
    <BasicModal @register="registerModal" title="选择分组" @ok="handleSubmit">
      <BasicTree
        v-if="treeData.length > 0"
        ref="treeRef"
        defaultExpandAll
        toolbar
        checkable
        search
        :treeData="treeData"
      />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { ref, toRaw, watch, onMounted, nextTick } from 'vue';
  import { catalogsList } from '/@/api/app/goods';
  import { Tag as ATag } from 'ant-design-vue';
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
  const treeFdatas: number[] = [];

  async function getData() {
    const res: any = await catalogsList({} as any);
    treeData.value = res.map((item: Recordable) => mapFields(item));
  }

  async function showPop() {
    openModal();
    await getData();
    await getTreeFdatas();
    showChecked(props.value, true);
  }

  function getTreeFdatas() {
    for (const data in treeDataMap) {
      if (treeDataMap[data].children.length > 0) {
        treeFdatas.push(treeDataMap[data].key);
      }
    }
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
    ids = [...ids] || [];
    try {
      const list: TreeItem[] = ids.map((id) => treeDataMap[id]);
      selectedList.value = list;
    } catch (e) {
      console.error('showChecked err', e);
    }
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
      const nKeys: number[] = [];
      for (const k of keys as any) {
        if (!treeFdatas.includes(k)) nKeys.push(k);
      }
      console.log(nKeys);

      const ids = isArray(nKeys) ? nKeys : [];

      emit('change', ids);
      emit('update:value', ids);
      showChecked(ids as number[], true);
      closeModal();
    }
  }

  onMounted(async () => {
    await getData();
    showChecked(props.value);
  });

  watch(
    () => props.value,
    async () => {
      nextTick(() => {
        showChecked(props.value);
      });
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
