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
      <slot name="header"></slot>
      <BasicForm @register="registerForm">
        <template #InputCount="{ model, field }">
          <a-input-number
            v-model:value="model[field]"
            :min="minLen"
            :max="maxLen"
            :precision="0"
            @change="handleChange(model)"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>

<script lang="ts">
  export interface ModifyInfoValues {
    count: string | number;
    addCount: string | number;
    baseCount: string | number;
  }

  export interface ModifyInfo {
    callback?: Function | null;
    ok: Function | null;
    values: ModifyInfoValues;
    title: string;
    schemas: FormSchema[];
    showTime?: boolean;
    warnTips?: string;
    maxLen?: number;
    minLen?: number;
  }
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { InputNumber as AInputNumber, message } from 'ant-design-vue';
  import { FormSchema } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const title = ref('');
  const maxLen = ref(99999);
  const minLen = ref(0);

  let stateInfo: ModifyInfo = {
    callback: null,
    ok: null,
    values: {
      count: '',
      addCount: '',
      baseCount: '',
    },
    title: '',
    schemas: [],
    showTime: false,
    warnTips: '请输入增加人数',
    maxLen: 99999,
    minLen: 0,
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: ModifyInfo) => {
    console.log(data);
    stateInfo = { ...stateInfo, ...data };
    title.value = stateInfo.title;
    stateInfo.maxLen ? (maxLen.value = stateInfo.maxLen) : '';
    stateInfo.minLen ? (minLen.value = stateInfo.minLen) : '';

    setProps({
      schemas: stateInfo.schemas,
    });

    setFieldsValue({ ...stateInfo.values });
  });

  const [registerForm, { validate, setProps, setFieldsValue }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
  });

  function handleChange(row: ModifyInfoValues) {
    row.baseCount = +row.addCount + +row.count;
    setFieldsValue({ ...row });
  }

  async function handleSubmit() {
    try {
      const values = await validate();
      // console.debug('handleSubmit values=', values);

      if (!values.addCount) return message.warn(stateInfo.warnTips);

      setModalProps({ confirmLoading: true });

      stateInfo.ok ? stateInfo.ok(values) : '';
    } finally {
      // setModalProps({ confirmLoading: false });
    }
  }

  defineExpose({ setProps, closeModal, setModalProps });
</script>
