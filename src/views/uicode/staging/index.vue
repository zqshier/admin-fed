<template>
  <PageWrapper contentBackground contentClass="p-4" :contentFullHeight="true">
    <div class="text-lg">扫码绑定商品</div>
    <a-row class="layout-top mt-5 pb-4 w-full">
      <a-col :span="6">
        <BasicForm @register="registerForm">
          <template #radioSlot="{ model, field }">
            <a-radio-group v-model:value="model[field]" @change="handleRadioChange">
              <a-radio :value="scanAction.sn">新增绑定</a-radio>
              <a-radio :value="scanAction.productCode">查询明码</a-radio>
            </a-radio-group>
          </template>
          <template #searchSlot="{ model, field }">
            <a-input
              v-model:value="model[field]"
              placeholder="请将光标放在这扫描/输入条码"
              maxLength="13"
              ref="searchInput"
              @change="onSearch"
            />
          </template>
        </BasicForm>
      </a-col>
      <a-col :span="12">
        <div class="message-box h-full flex flex-col items-center justify-center">
          <div class="flex flex-1 items-center justify-center pb-1">
            <ScaleImage
              v-if="messageInfo.data?.product?.qrPhoto"
              class="mr-2"
              :size="100"
              :src="messageInfo.data.product.qrPhoto"
              mode="cover"
            />
            <div class="flex flex-1 flex-col">
              <span
                :class="[
                  `msg-${messageInfo.status}`,
                  { 'font-bold': messageInfo.status !== EMessageColor.defalut },
                  '',
                ]"
                >{{ messageInfo.tips }}</span
              >
              <template v-if="messageInfo.data">
                <span v-show="messageInfo.ctype === EScanType.CODE" class="text-1xl pt-2">{{
                  `${messageInfo.data?.product?.name} (${messageInfo.data?.product?.code}) - ${messageInfo.data?.product?.barcode}`
                }}</span>
                <span v-show="messageInfo.ctype === EScanType.SN" class="text-1xl pt-2">{{
                  `明码${messageInfo.data?.sn}暂存绑定商品：${
                    messageInfo.data?.product?.name || ''
                  }`
                }}</span>
              </template>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row class="pt-4 w-full h-full">
      <a-col :span="12" class="flex h-full">
        <BasicTable @register="registerStagingTable" :data-source="pendingStore.rootTableRows">
          <template #expandedRowRender="{ record }">
            <BasicTable
              class="sns"
              @register="registerStagingSnsTable"
              :data-source="pendingStore.childTableRows(record)"
            >
              <template #bodyCell="{ column, record: snrecord }">
                <template v-if="column.key === 'action'">
                  <TableAction
                    :actions="[
                      {
                        icon: 'ic:outline-delete-outline',
                        label: '删除',
                        color: 'error',
                        popConfirm: {
                          title: '是否确认删除该记录？',
                          confirm: () => pendingStore.deleteRow(snrecord), //handleDeleteSn.bind(null, snrecord, fIndex),
                        },
                      },
                    ]"
                  />
                </template>
              </template>
            </BasicTable>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                :stopButtonPropagation="true"
                :actions="[
                  {
                    icon: 'ic:outline-delete-outline',
                    label: '删除',
                    color: 'error',
                    popConfirm: {
                      title: '是否确认删除该记录？',
                      confirm: () => pendingStore.deleteRow(record, true), // handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </template>
          <template #toolbar>
            <span v-show="stagingToolbar">{{ stagingToolbar }}</span>
            <a-button type="primary" size="mini" @click="openRecordModal(true, {})"
              >扫码日志</a-button
            >
            <a-button type="primary" :disabled="pendingStore.rowsTotal <= 0" @click="onCommit"
              >提交</a-button
            >
          </template>
        </BasicTable>
      </a-col>
      <a-col :span="12">
        <BasicTable @register="registerComfirmTable" :data-source="commitedStore.rootTableRows">
          <template #expandedRowRender="{ record }">
            <BasicTable
              class="sns"
              @register="registerComfirmSnsTable"
              :data-source="commitedStore.childTableRows(record)"
            />
          </template>
          <template #toolbar>
            <span v-show="comfirmToolbar">{{ comfirmToolbar }}</span>
          </template>
        </BasicTable>
      </a-col>
    </a-row>

    <RecordModal @register="registerRecordModal" />
    <CommitRecordModal @register="registerCommitRecordModal" @update="onCommitRecordModalUpdate" />

    <Loading :loading="loading" tip="加载中..." />
  </PageWrapper>
</template>

<script setup lang="ts" name="UIcodeStaging">
  import {
    Col as ACol,
    Radio as ARadio,
    RadioGroup as ARadioGroup,
    Row as ARow,
  } from 'ant-design-vue';
  import { debounce } from 'lodash-es';
  import { computed, nextTick, onActivated, onMounted, reactive, ref } from 'vue';
  import { useProductStore } from '../product.store';
  import { useStagingCommitedStore, useStagingPendingStore } from '../staging.store';
  import CommitRecordModal from './components/CommitRecordModal.vue';
  import RecordModal from './components/RecordModal.vue';
  import {
    comfirmSnsTableSchema,
    comfirmTableSchema,
    formSchema,
    scanAction,
    stagingSnsTableSchema,
    stagingTableSchema,
  } from './data';
  import { IProductsListItem, IStagingItem, IStagingParams } from '/@/api/app/model/uicodeModel';
  import { codesQuery } from '/@/api/app/uicode';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Loading } from '/@/components/Loading';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import ScaleImage from '/@/views/components/ScaleImage.vue';

  const productStore = useProductStore();
  const pendingStore = useStagingPendingStore();
  const commitedStore = useStagingCommitedStore();

  enum EScanType {
    CODE = 'code',
    SN = 'sn',
  }

  enum EMessageColor {
    defalut = 'defalut',
    success = 'success',
    fail = 'fail',
  }

  interface IMessageInfo {
    type: EScanType;
    ctype: EScanType;
    data?: { product?: IProductsListItem; sn?: string } | null;
    tips: string;
    status: EMessageColor;
  }

  export interface _IStagingItem extends IStagingItem {
    sns: { sn: string; creator: string; id: number; committedAt: Date }[];
  }

  const defalutMsg = '请进行扫描操作商品69码';
  const messageInfo = reactive<IMessageInfo>({
    type: EScanType.CODE,
    ctype: EScanType.CODE,
    data: null,
    tips: defalutMsg,
    status: EMessageColor.defalut,
  });
  const scanParams = reactive<IStagingParams>({ sn: '', productCode: '' });
  const searchInput = ref<any>(null);
  const loading = ref(false);

  const stagingToolbar = computed((): string => {
    return `共扫码${pendingStore.rowsTotal}个明码，绑定了${pendingStore.productTotal}个商品`;
  });

  const comfirmToolbar = computed((): string => {
    // 最后一次提交时间：${lastTime}，条码数：${total}`;
    return `今日共提交了${commitedStore.rowsTotal}个明码，绑定了${commitedStore.productTotal}个商品，最后一次提交时间：${commitedStore.lastTime}`;
  });

  onMounted(async () => {
    await productStore.load();
    await pendingStore.load();
    await commitedStore.load();
  });

  onActivated(() => {
    nextTick(() => {
      searchInput.value?.focus && searchInput.value?.focus();
    });
  });

  const [registerForm, { validate, setFieldsValue, clearValidate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 22 },
  });

  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  const [registerCommitRecordModal, { openModal: openCommitRecordModal }] = useModal();

  const [registerStagingTable] = useTable({
    rowKey: 'id',
    title: '暂存区',
    bordered: true,
    columns: stagingTableSchema,
    pagination: false,
    showTableSetting: true,
    tableSetting: { redo: false },
    showIndexColumn: false,
    expandRowByClick: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  const [registerStagingSnsTable] = useTable({
    rowKey: 'id',
    columns: stagingSnsTableSchema,
    pagination: false,
    showIndexColumn: false,
    bordered: true,
    size: 'small',
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  const [registerComfirmTable] = useTable({
    title: '已提交',
    bordered: true,
    columns: comfirmTableSchema,
    expandRowByClick: true,
    pagination: false,
    showIndexColumn: false,
  });

  const [registerComfirmSnsTable] = useTable({
    rowKey: 'id',
    columns: comfirmSnsTableSchema,
    pagination: false,
    showIndexColumn: false,
    bordered: true,
    size: 'small',
  });

  const onSearch = debounce(async () => {
    try {
      const values = await validate();
      const { type } = values;
      if (type === scanAction.sn) {
        if (messageInfo.type === EScanType.CODE) {
          await handleCheckProdut();
        } else {
          await getCreateApi();
        }
      } else {
        await getCodesQuery();
      }
    } catch (err: any) {
      console.debug('e', err);
    }
  }, 300);

  const onCommit = () => openCommitRecordModal(true, pendingStore.rows);
  const onCommitRecordModalUpdate = () => {
    pendingStore.load();
    commitedStore.load();
  };

  const handleCheckProdut = async () => {
    loading.value = true;
    try {
      const values = await validate();
      const { value: barcode } = values;
      if (barcode.length < 13) return;
      const product = await productStore.findProduct(barcode);
      if (!product) throw new Error('该商品不存在，请重新输入');
      changeMsgInfo({
        tips: '扫描商品69码成功',
        data: { product },
        status: EMessageColor.success,
        type: EScanType.SN,
        ctype: EScanType.CODE,
      });

      scanParams.productCode = product.code;
      setDefaultFieldsValue();
    } catch (err: any) {
      changeMsgInfo({
        tips: '该69码不存在请重新输入',
        data: null,
        status: EMessageColor.fail,
        type: EScanType.CODE,
        ctype: EScanType.CODE,
      });
      scanParams.sn = '';
      scanParams.productCode = '';
    } finally {
      loading.value = false;
    }
  };

  function setDefaultFieldsValue(type = EScanType.SN) {
    setFieldsValue({ type, value: '' });
    clearValidate();
  }

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setDefaultFieldsValue(value);
    changeMsgInfo();
    clearValidate();
    setTimeout(() => {
      searchInput.value?.focus && searchInput.value?.focus();
    }, 300);
  };

  const getCreateApi = async () => {
    loading.value = true;
    try {
      const values = await validate();
      const { value: sn } = values;
      if (sn.length < 13) return;
      const result = await pendingStore.addRow(sn, scanParams.productCode);
      changeMsgInfo({
        tips: '扫描明码成功',
        data: result,
        status: EMessageColor.success,
        type: EScanType.CODE,
        ctype: EScanType.SN,
      });

      scanParams.sn = '';
      scanParams.productCode = '';
      setDefaultFieldsValue();
    } catch (err: any) {
      const tips = err?.message ? err.message : defalutMsg;
      changeMsgInfo({
        tips,
        data: null,
        status: EMessageColor.fail,
        type: EScanType.SN,
        ctype: EScanType.SN,
      });
    } finally {
      loading.value = false;
    }
  };

  const getCodesQuery = async () => {
    let curSn = '';
    try {
      const values = await validate();
      const { value: sn } = values;
      if (sn.length < 13) return;
      curSn = sn;
      const result = await codesQuery({ sn }, 'none');

      changeMsgInfo();

      if (result.productCode && result.productBoundAt) {
        const tips = `明码${sn}已永久绑定商品${result.product.name}，提交于${formatToDateTime(
          result.productBoundAt,
        )}`;
        return changeMsgInfo({ ...messageInfo, tips });
      }

      const pendingRow = pendingStore.findRow(sn);
      if (pendingRow) {
        const tips = `明码${sn}在暂存区，已绑定商品：${pendingRow.product.barcode} - ${pendingRow.product.name}`;
        return changeMsgInfo({ ...messageInfo, tips });
      }

      changeMsgInfo({ ...messageInfo, tips: `明码${result.sn}尚未绑定商品` });
    } catch (err: any) {
      console.error(err);
      changeMsgInfo({
        ...messageInfo,
        tips: `${curSn}不存在请重新输入`,
        status: EMessageColor.fail,
      });
    }
  };

  function changeMsgInfo(info: IMessageInfo | null = null) {
    if (!info) {
      messageInfo.type = EScanType.CODE;
      messageInfo.data = null;
      messageInfo.status = EMessageColor.defalut;
      messageInfo.tips = defalutMsg;
      return;
    }
    Object.assign(messageInfo, { ...info });
  }
</script>
<style lang="less" scoped>
  .layout-top {
    border-bottom: 1px solid @border-color-base;
  }

  .sns {
    :deep(.ant-table) {
      margin: 0 !important;
    }
  }

  .message-box {
    border: 1px solid @border-color-base;
  }

  .msg-success {
    border-color: @success-color;
    color: @success-color;
  }
  .msg-fail {
    border-color: @error-color;
    color: @error-color;
  }
</style>
