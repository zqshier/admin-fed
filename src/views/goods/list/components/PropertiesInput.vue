<template>
  <template v-for="(item, index) in propertiesList" :key="index">
    <Row>
      <Col flex="1" class="mb-2 mr-2">
        <span>{{ item.name }}：</span>
        <a-select
          style="width: 330px"
          mode="multiple"
          :value="propertiesData[index]?.values"
          :options="item.values.map((i) => ({ label: i, value: i }))"
          @change="(event) => updateInputData(event, index)"
        />
      </Col>
    </Row>
  </template>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { Row, Col, Select as ASelect } from 'ant-design-vue';
  import {
    propertiesList as propertiesListApi,
    PropertiesListParams,
    PropertiesListItem,
  } from '/@/api/app/goods';

  interface PropertiesData {
    configId: number;
    values: string[];
  }

  const props = defineProps({
    value: {
      type: Array as PropType<PropertiesData[]>,
      default: () => {
        return [];
      },
    },
    catalogIds: {
      type: Array as PropType<number[]>,
      default: () => {
        return [];
      },
    },
  });

  const propertiesList = ref<PropertiesListItem[]>([]);
  const propertiesData = ref<PropertiesData[]>([]);

  const emit = defineEmits(['update:value', 'change']);

  async function getData() {
    try {
      const { list } = await propertiesListApi({
        catalogIds: [...props.catalogIds].join(),
        page: 1,
        perPage: 200,
      } as PropertiesListParams);
      propertiesData.value = handleCombinedData(list);
      propertiesList.value = list;
    } catch (error) {
      console.error('getData error', error);
    }
  }

  function handleCombinedData(list: PropertiesListItem[]) {
    const data: PropertiesData[] = [];
    for (const l of list) {
      const item: PropertiesData = { configId: l.id, values: [] };
      for (const d of propertiesData.value) {
        if (d.configId === l.id) item.values = d.values;
      }
      data.push(item);
    }
    return data;
  }

  function updateInputData(event, fIndex) {
    propertiesData.value[fIndex].values = [...event];
    console.debug('propertiesData', propertiesData.value);
    emit('update:value', propertiesData.value);
    emit('change', propertiesData.value);
  }

  watchEffect(() => {
    propertiesData.value = props.value;
    getData();
  });
</script>

<style lang="less" scoped></style>
