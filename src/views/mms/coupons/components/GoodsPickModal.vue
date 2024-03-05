<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择商品"
    :width="1000"
    @ok="handleSubmit"
    wrapClassName="goods-pick-wrap"
  >
    <div class="flex">
      <div class="border-r-1 border-x-gray-700 p-8px flex-shrink-0 w-130px">
        <a-radio-group v-model:value="pickType" @change="onTypeChange">
          <a-radio
            v-for="item in pickTypeList"
            style="display: flex; height: 30px; line-height: 30px"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
      </div>
      <div class="flex-1">
        <div class="p-8px">
          <BasicTable v-if="pickType === TypeEnum.Goods" @register="registerGoodsTable" />
          <BasicTable v-if="pickType === TypeEnum.Catalogs" @register="registerCatalogsTable" />
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // import { useForm } from '/@/components/Form/index';
  import { Radio as ARadio, RadioGroup as ARadioGroup } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import { catalogsList, goodsList } from '/@/api/app/goods';
  import { CatalogsListItem } from '/@/api/app/model/goodsModel';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';

  const dataValue = ref({
    catalogIds: [],
    itemIds: [],
    skuIds: [],
  });

  const emit = defineEmits(['success']);

  enum TypeEnum {
    Goods,
    Catalogs,
    None,
  }

  const pickTypeList = [
    { label: '选择商品', value: TypeEnum.Goods },
    { label: '选择分组', value: TypeEnum.Catalogs },
  ];

  const pickType = ref(TypeEnum.Goods);

  const goodsTableSchema: BasicColumn[] = [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      width: 160,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 160,
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'storeCode',
      label: '商品分组',
      component: 'ApiSelect',
      componentProps: {
        api: catalogsList,
        immediate: false,
        resultField: 'list',
        valueField: 'code',
        labelField: 'name',
      },
    },

    {
      field: 'name',
      label: '商品名称',
      component: 'Input',
    },
    {
      field: 'sn',
      label: '商品编码',
      component: 'Input',
    },
  ];

  const catalogsTableSchema: BasicColumn[] = [
    {
      title: '分组名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '分组下商品数',
      dataIndex: 'num',
      width: 200,
    },
  ];

  const searchCatalogsSchema: FormSchema[] = [
    {
      field: 'name',
      label: '分组名称',
      component: 'Input',
    },
  ];

  //商品选择表格
  const [
    registerGoodsTable,
    { getSelectRowKeys: getGoodsSelected, setSelectedRowKeys: setGoodsSelected },
  ] = useTable({
    title: '',
    rowKey: 'id',
    api: goodsList,
    columns: goodsTableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'checkbox', preserveSelectedRowKeys: true },
    useSearchForm: true,
    formConfig: {
      schemas: searchGoodsSchema,
      labelWidth: 80,
      baseColProps: {
        span: 6,
      },
    },
    afterFetch: (data) => {
      console.log(data);
    },
  });

  //分组选择表格
  const [
    registerCatalogsTable,
    {
      getSelectRowKeys: getCatalogSelected,
      setSelectedRowKeys: setCatalogSelected,
      expandAll: catalogsExpandAll,
    },
  ] = useTable({
    title: '',
    rowKey: 'id',
    api: catalogsList,
    columns: catalogsTableSchema,
    pagination: true,
    showIndexColumn: false,
    clickToRowSelect: false,
    defaultExpandAllRows: true,
    isTreeTable: true,
    size: 'small',
    rowSelection: {
      type: 'checkbox',
      onSelect(v) {
        console.log(v);
      },
    },
    useSearchForm: true,
    formConfig: {
      schemas: searchCatalogsSchema,
      labelWidth: 80,
      baseColProps: {
        span: 12,
      },
    },
    afterFetch: (list: CatalogsListItem[]) => {
      setTimeout(catalogsExpandAll, 100);
      return list.filter((item) => item.sys !== 1);
    },
  });

  const goodsSelected: any = computed({
    get() {
      return getGoodsSelected();
    },
    set(v) {
      setGoodsSelected(v);
    },
  });

  const catalogSelected: any = computed({
    get() {
      return getCatalogSelected();
    },
    set(v) {
      setCatalogSelected(v);
    },
  });

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    console.log(data);
    if (data) {
      Object.assign(dataValue.value, data);
      if (data.itemIds && data.itemIds.length > 0) {
        pickType.value = TypeEnum.Goods;
      } else if (data.catalogIds && data.catalogIds.length > 0) {
        pickType.value = TypeEnum.Catalogs;
      } else {
        pickType.value = TypeEnum.Goods;
      }
      onTypeChange();
    }
  });

  function onTypeChange() {
    setTimeout(() => {
      if (pickType.value === TypeEnum.Goods) {
        const items = dataValue.value?.itemIds || [];
        goodsSelected.value = [...items];
      } else if (pickType.value === TypeEnum.Catalogs) {
        const catalogs = dataValue.value?.catalogIds || [];
        catalogSelected.value = [...catalogs];
      }
    }, 100);
  }

  async function handleSubmit() {
    if (pickType.value === TypeEnum.Goods) {
      emit('success', { itemIds: [...goodsSelected.value], catalogIds: [] });
    } else if (pickType.value === TypeEnum.Catalogs) {
      emit('success', { itemIds: [], catalogIds: [...catalogSelected.value] });
    }
    pickType.value = TypeEnum.None;
    closeModal();
  }
</script>

<style lang="less">
  .goods-pick-wrap {
    .scroll-container {
      padding: 0 !important;
    }
    .scrollbar__wrap {
      margin-bottom: 0 !important;
    }
    .vben-basic-table-form-container {
      .ant-form {
        margin-bottom: 0;
        padding-top: 0;
      }
    }
  }
</style>
