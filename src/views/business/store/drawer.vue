<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看详情" :isDetail="true">
    <div v-if="dataInfo.id" class="p-4">
      <Description
        size="middle"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="detailBaseSchema"
      />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { detailBaseSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description } from '/@/components/Description';

  defineEmits(['success', 'register']);

  const dataInfo = ref<Recordable>({});

  //弹窗
  const [registerDrawer] = useDrawerInner(async (data) => {
    dataInfo.value = Object.assign(dataInfo.value, data.record);
  });
</script>
