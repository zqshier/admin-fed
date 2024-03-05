<template>
  <PageWrapper contentBackground contentClass="p-4">
    <div class="text-lg">运费模版</div>
    <div class="mt-3">
      <DeliveryItem
        v-for="(item, index) in dataList"
        :key="index"
        @edit="handleEdit(item)"
        v-model:value="dataList[index]"
      />
    </div>
    <div class="mt-3">
      <a-button @click="handleAdd" type="primary">添加模版</a-button>
    </div>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import DeliveryItem from './components/DeliveryItem.vue';
  import { deliveryTemplatesList, DeliveryTemplates } from '/@/api/app/system';
  import { ref } from 'vue';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const dataList = ref<DeliveryTemplates[]>([]);

  function handleAdd() {
    openDrawer(true, { isUpdate: false });
  }

  async function getData() {
    const data = await deliveryTemplatesList();
    dataList.value = data.list;
  }

  function handleSuccess({ values }) {
    console.log(values);
    getData();
  }

  function handleEdit(row: DeliveryTemplates) {
    openDrawer(true, { isUpdate: true, record: row });
  }

  getData();
</script>
