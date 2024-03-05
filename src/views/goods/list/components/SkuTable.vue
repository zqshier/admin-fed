<template>
  <div>
    <div class="border border-gray-300 py-2 px-2">
      <template v-for="(sku, skuIndex) in skuList" :key="sku.id">
        <div class="bg-sky-50 py-1 px-2 flex items-center">
          <div
            >规格名：<span>{{ sku.name }}</span></div
          >
          <div class="flex-1"></div>
          <a-popconfirm
            title="确认删除此规格？删除后规格明细将会清空"
            placement="left"
            @confirm="delSku(skuIndex)"
          >
            <DeleteOutlined class="cursor-pointer" />
          </a-popconfirm>
        </div>
        <div class="py-1 px-2 pt-2 flex items-center mb-4" style="flex-wrap: wrap">
          <div>规格值：</div>
          <draggable
            class="flex flex-1"
            style="flex-wrap: wrap"
            v-model="sku.values"
            item-key="id"
            tag="div"
          >
            <template #item="{ element, index }">
              <div class="mb-1">
                <a-tag closable @close.prevent
                  >{{ element.name }}
                  <template #closeIcon>
                    <a-popconfirm
                      @confirm="delSkuValue(sku, index)"
                      :title="`确认删除“${element.name}”？`"
                    >
                      <CloseOutlined />
                    </a-popconfirm>
                  </template>
                </a-tag>
              </div>
            </template>
          </draggable>
          <pop-input :item="sku" @confirm="addSkuValueConfirm">
            <a-button type="link">添加规格值</a-button>
          </pop-input>
        </div>
      </template>
      <div class="bg-sky-50 py-1 px-2 flex items-center" v-if="skuList.length < skuMaxLength">
        <pop-input @confirm="addSkuConfirm">
          <a-button size="small">添加规格名</a-button>
        </pop-input>
      </div>
    </div>
    <div class="mt-3" v-if="detailDataList.length > 0">
      <div>规格明细</div>
      <a-table
        size="small"
        :columns="detailColumns"
        :data-source="detailDataList"
        :pagination="false"
        style="flex-wrap: wrap"
        bordered
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="/^extra/.test(column.dataIndex)">{{ text }}</template>
          <template v-else-if="column.dataIndex === 'image'">
            <ImageUpload
              @change="updateValue"
              size="small"
              v-model:value="record[column.dataIndex]"
            />
          </template>
          <template v-else>
            <a-form-item
              :class="{
                'no-require':
                  !['price', 'stock'].includes(column.dataIndex) || record[column.dataIndex],
              }"
            >
              <a-input-number
                v-if="['price', 'stock', 'guidePrice'].includes(column.dataIndex)"
                :disabled="column.dataIndex === 'stock'"
                @change="updateValue"
                v-model:value="record[column.dataIndex]"
                :precision="2"
                :min="0.0"
                :max="999999"
              />
              <a-input v-else @change="updateValue" v-model:value="record[column.dataIndex]" />
            </a-form-item>
          </template>
        </template>
      </a-table>
      <div class="mt-2 flex">
        <div>批量操作：</div>
        <pop-input item="price" @confirm="changeTableInputBat">
          <a-button type="link" size="small">修改价格</a-button>
        </pop-input>
        <pop-input item="guidePrice" @confirm="changeTableInputBat">
          <a-button type="link" size="small">修改划线价</a-button>
        </pop-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { CloseOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import {
    FormItem as AFormItem,
    Input as AInput,
    InputNumber as AInputNumber,
    Popconfirm as APopconfirm,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';
  import { nextTick, onMounted, ref, unref, watch } from 'vue';
  import draggable from 'vuedraggable';
  import PopInput from './PopInput.vue';
  import { skuKeysCreate, skuKeysValuesCreate } from '/@/api/app/goods';
  import { SkuDetail, SkuItem, SkuValueItem } from '/@/api/app/model/goodsModel';
  import { ImageUpload } from '/@/components/ImageUpload';

  const props = defineProps({
    value: {
      type: Array,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const baseColumns: TableColumnType[] = [
    {
      title: '*价格(元)',
      dataIndex: 'price',
      align: 'center',
      width: '120px',
    },
    {
      title: '划线价',
      dataIndex: 'guidePrice',
      align: 'center',
      width: '120px',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      align: 'center',
      width: '120px',
    },
    {
      title: 'sku编码',
      dataIndex: 'sn',
      align: 'center',
    },
    {
      title: '条形码',
      dataIndex: 'barcode',
      align: 'center',
    },
    {
      title: '规格图片',
      dataIndex: 'image',
      align: 'center',
      width: '100px',
    },
  ];

  const skuList = ref<SkuItem[]>([]);
  const detailColumns = ref<TableColumnType[]>([]);
  const detailDataList = ref<SkuDetail[]>([]);
  const skuMaxLength = ref(3);
  let extraColumns: TableColumnType[] = [];
  const isInitValue = ref(false);
  const isUpdateValue = ref(false);

  watch(
    () => props.value,
    () => {
      if (!isUpdateValue.value) {
        initValue();
      }
    },
    {
      deep: true,
    },
  );

  watch(
    () => skuList.value,
    () => {
      if (!isInitValue.value) {
        showDetailTable();
      }
    },
    {
      deep: true,
    },
  );

  // watch(
  //   () => detailDataList.value,
  //   () => {
  //     if (!isInitValue.value) {
  //       updateValue();
  //     }
  //   },
  //   {
  //     deep: true,
  //   },
  // );

  onMounted(() => {
    initValue();
  });

  async function initValue() {
    isInitValue.value = true;

    if (props.value && props.value.length > 0) {
      skuList.value = props.value[0] as SkuItem[];
      await showDetailTable();
      await nextTick();
      detailDataList.value = (props.value[1] as SkuDetail[]).map((item) => {
        console.log('comb', item, item.comb);
        return {
          ...item,
          extra_0: item.comb[0]?.v || '',
          extra_1: item.comb[1]?.v || '',
          extra_2: item.comb[2]?.v || '',
        };
      });
    } else {
      skuList.value = [];
      detailDataList.value = [];
    }
    nextTick(() => (isInitValue.value = false));
  }

  function updateValue() {
    isUpdateValue.value = true;
    let newList = [unref(skuList), unref(detailDataList)];
    if (skuList.value.length === 0) {
      newList = [];
    }

    console.log('updateValue', newList);
    emit('update:value', newList);
    emit('change', newList);
    nextTick(() => {
      isUpdateValue.value = false;
    });
  }

  async function showDetailTable() {
    extraColumns = [];
    const _skuList = [...unref(skuList)].filter((item) => item.values.length > 0);
    if (_skuList.length === 0) {
      detailDataList.value = [];
      return;
    }

    const _valueArr: SkuValueItem[][] = [];
    const _colSpanLen: number[] = [0, 0, 0];

    _skuList.forEach((item, index) => {
      _valueArr.push(item.values);
      _colSpanLen[index] = item.values.length;
    });

    _colSpanLen[0] = _colSpanLen[1] * (_colSpanLen[2] || 1);
    _colSpanLen[1] = _colSpanLen[2];
    _colSpanLen[2] = 0;

    _skuList.forEach((item, index) => {
      extraColumns.push({
        title: item.name,
        dataIndex: 'extra_' + index,
        align: 'center',
        customCell: (_, rowIndex: number) => {
          if (_colSpanLen[index] !== 0) {
            if (rowIndex % _colSpanLen[index] === 0) {
              return { rowSpan: _colSpanLen[index] };
            } else {
              return { rowspan: 0 };
            }
          }
          return {};
        },
      });
    });

    const combList: SkuValueItem[][] = [];
    _valueArr[0].forEach((item0) => {
      if (_valueArr[1]) {
        _valueArr[1].forEach((item1) => {
          if (_valueArr[2]) {
            _valueArr[2].forEach((item2) => {
              combList.push([item0, item1, item2]);
            });
          } else {
            combList.push([item0, item1]);
          }
        });
      } else {
        combList.push([item0]);
      }
    });

    const detailList: SkuDetail[] = [];
    combList.forEach((comb: SkuValueItem[]) => {
      const _detail: SkuDetail = {
        extra_0: '',
        extra_1: '',
        extra_2: '',
        price: null,
        guidePrice: null,
        cost: null,
        stock: null,
        weight: null,
        sn: '',
        barcode: '',
        comb: [],
        image: '',
      };
      comb.forEach((item, index) => {
        let sku: SkuItem = _skuList[index];
        _detail['extra_' + index] = item.name;
        _detail.comb.push({
          k: sku.name,
          kId: sku.id,
          v: item.name,
          vId: item.id,
        });
      });
      detailList.push(_detail);
    });

    detailList.forEach((item) => {
      let old = detailDataList.value.find(
        (d) =>
          d.extra_0 === item.extra_0 && d.extra_1 === item.extra_1 && d.extra_2 === item.extra_2,
      );
      if (old && old.id) {
        item.id = old.id;
      }

      // if (!old) {
      //   old = detailDataList.value.find(
      //     (d) => d.extra_0 === item.extra_0 && d.extra_1 === item.extra_1,
      //   );
      // }

      // if (!old) {
      //   old = detailDataList.value.find((d) => d.extra_0 === item.extra_0);
      // }

      if (old) {
        item.price = old.price;
        item.cost = old.cost;
        item.guidePrice = old.guidePrice;
        item.stock = old.stock;
        item.sn = old.sn;
        item.barcode = old.barcode;
        item.image = old.image;
      } else {
        item.stock = 0;
      }
    });

    detailColumns.value = [...extraColumns, ...baseColumns];

    console.log('detailList', detailList);
    detailDataList.value = [];
    await nextTick();
    detailDataList.value = detailList;
    console.log(detailDataList.value);
    // detailDataListCache = cloneDeep(toRaw(detailDataList));
  }

  async function addSkuConfirm(name: string) {
    if (skuList.value.find((item) => item.name === name)) {
      return;
    }
    const resp: SkuItem = await skuKeysCreate(name);

    skuList.value.push({
      id: resp.id,
      name,
      values: [],
    });

    updateValue();
  }

  async function addSkuValueConfirm(name: string, item: SkuItem) {
    if (item.values.find((_item) => _item.name === name)) {
      return;
    }
    console.log('item', item);

    const resp: SkuValueItem = await skuKeysValuesCreate(name, item.id);
    item.values.push({
      id: resp.id,
      name,
    });

    updateValue();
  }

  function delSkuValue(sku: SkuItem, index: number) {
    const [o] = sku.values.splice(index, 1);
    detailDataList.value = detailDataList.value.filter((v) => !v.comb.find((c) => c.vId === o.id));
    updateValue();
  }

  function delSku(index: number) {
    skuList.value.splice(index, 1);
    updateValue();
  }

  function changeTableInputBat(value: string, item: string) {
    detailDataList.value.forEach((detail) => {
      detail[item] = value;
    });
    updateValue();
  }
</script>

<style lang="less" scoped>
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
  .no-require {
    :deep(.ant-input) {
      border-color: #d9d9d9 !important;
      box-shadow: none !important;
    }
  }
</style>
