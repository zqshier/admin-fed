<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择地区"
    :width="500"
    @ok="handleSubmit"
    wrap-class-name="common-modal-wrap"
  >
    <BasicTree ref="treeRef" toolbar checkable search :treeData="treeData" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ref } from 'vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { getRegionData } from '../data';
  const treeData = ref<TreeItem[]>([]);
  const treeRef = ref<Nullable<TreeActionType>>(null);

  let submitCallback: Function;

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    if (data) {
      submitCallback = data.cb;

      treeData.value = getRegionData(data.exclude || []);

      setTimeout(() => {
        treeRef.value?.setCheckedKeys(data.selected || []);
        treeRef.value?.setExpandedKeys([]);
      }, 100);
    }
  });

  function handleSubmit() {
    const list = treeRef.value?.getCheckedKeys() || [];
    submitCallback && submitCallback(list);
    closeModal();
  }
</script>
