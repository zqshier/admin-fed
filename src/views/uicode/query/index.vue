<template>
  <PageWrapper contentBackground contentClass="p-4" :contentFullHeight="true">
    <div class="text-lg">明码查询</div>
    <div class="mt-3 w-full">
      <BasicForm @register="registerForm">
        <template #searchSlot="{ model, field }">
          <a-input-search
            ref="searchInput"
            v-model:value="model[field]"
            placeholder="请输入13位明码"
            enter-button="查询"
            maxLength="13"
            @search="onSearch"
            @change="onSearch"
          />
        </template>
      </BasicForm>
    </div>

    <div class="pt-4" ref="wrapEl">
      <Description
        size="middle"
        title="码信息"
        :bordered="false"
        :column="2"
        :data="dataInfo"
        :schema="codeSchema"
      />
      <BasicTable @register="registerCodesTable" :data-source="codesDatasource" />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts" name="UIcodeQuery">
  import { InputSearch as AInputSearch } from 'ant-design-vue';
  import { debounce } from 'lodash-es';
  import { nextTick, onActivated, ref } from 'vue';
  import { codeSchema, codesTableSchema, formSchema } from './data';
  import { IDcodesQueryItem, IRecordsItem, IRecordsListParams } from '/@/api/app/model/uicodeModel';
  import { codesQuery, recordsList, wxacode } from '/@/api/app/uicode';
  import { Description } from '/@/components/Description/index';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useLoading } from '/@/components/Loading';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';

  const wrapEl = ref<ElRef>(null);
  const searchInput = ref<any>(null);
  const dataInfo = ref<IDcodesQueryItem>({} as IDcodesQueryItem);
  const codesDatasource = ref<IRecordsItem[]>([]);

  onActivated(() => {
    nextTick(() => {
      searchInput.value?.focus && searchInput.value?.focus();
    });
  });

  const [openWrapLoading, closeWrapLoading] = useLoading({
    target: wrapEl,
    props: {
      tip: '加载中...',
      absolute: true,
    },
  });

  const [registerForm, { validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerCodesTable] = useTable({
    title: '扫码历史',
    bordered: true,
    columns: codesTableSchema,
    pagination: false,
    showIndexColumn: false,
  });

  const onSearch = debounce(async () => {
    openWrapLoading();
    try {
      const values = await validate();
      const result = await codesQuery(values);
      dataInfo.value = result;
      await getWxacode();
      await getCodesRecordsList();
      // console.log('setCodesTableData', setCodesTableData);
    } catch (e) {
      console.error('onSearch err=', e);
      dataInfo.value = {} as IDcodesQueryItem;
      codesDatasource.value = [];
    } finally {
      closeWrapLoading();
    }
  }, 300);

  const getWxacode = async () => {
    try {
      const values = await validate();
      const { sn } = values;
      const urlObj = await wxacode(sn);
      const _wxacode = URL.createObjectURL(new Blob([urlObj]));
      // console.debug('_wxacode', _wxacode);
      dataInfo.value = { ...dataInfo.value, wxacode: _wxacode };
    } catch (e) {
      dataInfo.value = { ...dataInfo.value, wxacode: '' };
    }
  };

  const getCodesRecordsList = async () => {
    let result: IRecordsItem[] = [];
    try {
      const { list } = await recordsList({
        sn: dataInfo.value.sn,
        distributorName: dataInfo.value?.distributor?.name || '',
        productName: dataInfo.value?.product?.name || '',
        page: 1,
        perPage: 1000,
      } as IRecordsListParams);
      result = list.sort(
        (a, b) => new Date(a.createdAt as Date).getTime() - new Date(b.createdAt as Date).getTime(),
      );
    } catch (e) {
      console.error('getCodesRecordsList catch err=', e);
      result = [];
    }
    console.debug('getCodesRecordsList result=', result);
    codesDatasource.value = result;
  };
</script>
