<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="跳转"
    width="800px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  export interface ModifyInfo {
    callback: Function | null;
    values: {};
  }
</script>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const stateInfo: ModifyInfo = { callback: null, values: {} };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: ModifyInfo) => {
    resetFields();
    console.debug('DetailEditLinkModal data=', data);
    stateInfo.callback = data.callback;
    setFieldsValue({ ...data.values });
  });

  const [registerForm, { validate, setFieldsValue, resetFields }] = useForm({
    labelWidth: 80,
    schemas: [
      {
        field: 'linkType',
        label: '跳转类型',
        component: 'RadioGroup',
        defaultValue: 'path',
        componentProps: {
          options: [
            { label: '小程序路径', value: 'path' },
            { label: '外部H5', value: 'h5' },
          ],
        },
      },
      {
        field: 'link',
        label: '跳转路径',
        component: 'Input',
        // rules: [
        //   {
        //     required: true,
        //     validator: (_, value) => {
        //       console.debug('ddd', _, value);
        //       // if (values.linkType === 'path') {
        //       //   if (value && value.charAt(0) !== '/') return Promise.reject('找不到页面路径');
        //       // }
        //       // if (values.linkType === 'h5') {
        //       //   if (value && value.slice(0, 4) !== 'https') return Promise.reject('找不到页面路径');
        //       // }
        //       return Promise.resolve();
        //     },
        //   },
        // ],
        dynamicRules: ({ values }) => {
          return [
            {
              required: true,
              validator: (_, value) => {
                if (values.linkType === 'path') {
                  if (value && value.charAt(0) !== '/') return Promise.reject('找不到页面路径');
                }
                if (values.linkType === 'h5') {
                  if (value && value.slice(0, 5) !== 'https')
                    return Promise.reject('找不到页面路径');
                }
                return Promise.resolve();
              },
            },
          ];
        },
      },
    ],
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      stateInfo.callback?.(values);
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
