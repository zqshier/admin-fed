<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    :title="title"
    width="800px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm">
        <template #catalog="{ model, field }">
          <catalog-input v-model:value="model[field]" />
        </template>
        <template #kindsSlot="{ model, field }">
          <kinds-input v-model:value="model[field]" />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>

<script lang="ts">
  export enum ModifyTypes {
    status,
    catalog,
    kinds,
  }
  export interface ModifyInfo {
    callback: Function | null;
    type: ModifyTypes;
    values: Recordable;
  }
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { formSchemaModifyCatalog, formSchemaModifyKinds, formSchemaModifyStatus } from '../data';
  import CatalogInput from './CatalogInput.vue';
  import KindsInput from './KindsInput.vue';
  import { goodsCatalogUpdateBatch, goodsStatusUpdateBatch, kindsBind } from '/@/api/app/goods';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const title = ref('');
  const stateInfo: ModifyInfo = {
    callback: null,
    type: ModifyTypes.status,
    values: {},
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: ModifyInfo) => {
    console.log(data);
    resetFields();
    stateInfo.callback = data.callback;
    stateInfo.type = data.type;
    if (stateInfo.type === ModifyTypes.status) {
      title.value = '批量修改状态';
      setProps({
        schemas: formSchemaModifyStatus,
      });
    } else if (stateInfo.type == ModifyTypes.catalog) {
      title.value = '批量修改分组';
      setProps({
        schemas: formSchemaModifyCatalog,
      });
    } else if (stateInfo.type == ModifyTypes.kinds) {
      title.value = '批量修改品类';
      setProps({
        schemas: formSchemaModifyKinds,
      });
    }

    setFieldsValue({ ...data.values });
  });

  const [registerForm, { validate, setProps, setFieldsValue, resetFields }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      if (stateInfo.type === ModifyTypes.status) {
        await goodsStatusUpdateBatch({ itemIds: values.itemIds, saleStatus: values.saleStatus });
      } else if (stateInfo.type === ModifyTypes.catalog) {
        await goodsCatalogUpdateBatch({ itemIds: values.itemIds, catalogIds: values.catalogIds });
      } else if (stateInfo.type === ModifyTypes.kinds) {
        await kindsBind({ itemIds: values.itemIds, kindId: values.kindId });
      }
      stateInfo.callback?.(values);
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
