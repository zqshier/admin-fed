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
      <div :style="{ color: '#8c8c8c', paddingLeft: '13px' }"
        >截止到{{ format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss') }}</div
      >
      <BasicForm @register="registerForm">
        <template #InputCount="{ model, field }">
          <a-input-number
            v-model:value="model[field]"
            :min="0"
            :precision="0"
            @change="handleChange(model)"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>

<script lang="ts">
  export enum ModifyTypes {
    booking,
    join,
  }
  export interface ModifyInfo {
    callback: Function | null;
    type: ModifyTypes;
    values: Recordable;
  }
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { format } from 'date-fns';
  import { InputNumber as AInputNumber, message } from 'ant-design-vue';
  import { formSchemaModifyBooking, formSchemaModifyJoin } from '../data';
  import { DrawLotsItems, drawLotsUpdate } from '/@/api/app/mms';
  import { bookingUpdate as updateApi } from '/@/api/app/booking';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const title = ref('');
  const stateInfo: ModifyInfo = {
    callback: null,
    type: ModifyTypes.booking,
    values: {},
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: ModifyInfo) => {
    console.log(data);
    stateInfo.callback = data.callback;
    stateInfo.type = data.type;
    stateInfo.values = data.values;
    const _values: any = {};
    if (stateInfo.type === ModifyTypes.booking) {
      title.value = '修改预约人数';
      _values.bookingCount = data.values.bookingCount || 0;
      _values.addCount = '';
      _values.baseCount = data.values.bookingBase || 0;
      setProps({
        schemas: formSchemaModifyBooking,
      });
    } else if (stateInfo.type == ModifyTypes.join) {
      title.value = '修改参与人数';
      _values.participantCount = data.values.participantCount || 0;
      _values.addCount = '';
      _values.baseCount = data.values.participantBase || 0;
      setProps({
        schemas: formSchemaModifyJoin,
      });
    }
    setFieldsValue({ ..._values });
  });

  const [registerForm, { validate, setProps, setFieldsValue }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
  });

  function handleChange(row) {
    const count = stateInfo.type === ModifyTypes.booking ? row.bookingCount : row.participantCount;
    row.baseCount = +row.addCount + +count;
    setFieldsValue({ ...row });
  }

  async function handleSubmit() {
    try {
      const values = await validate();
      // console.debug('handleSubmit values=', values);
      if (!values.addCount) {
        return message.warn('请输入增加人数');
      }
      setModalProps({ confirmLoading: true });

      let result;
      if (stateInfo.type === ModifyTypes.booking) {
        await updateApi(stateInfo.values.bookingId, {
          counterBase: +values.baseCount,
        } as any);
        result = { ...stateInfo.values, bookingBase: +values.baseCount };
      } else {
        const params = { participantBase: +values.baseCount };
        result = await drawLotsUpdate(stateInfo.values.id, params as DrawLotsItems);
      }

      message.success('操作成功');
      stateInfo.callback?.(result);
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
