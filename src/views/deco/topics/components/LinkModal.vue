<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="添加链接"
    width="600px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm">
        <template #link="{ model, field }">
          <div class="flex items-center">
            <div class="flex-1">
              <a-input v-model:value="model[field]" :disabled="linkDisabled" />
            </div>
            <div class="ml-2"><a-button @click="handleGoodsPick()">选择商品</a-button></div>
          </div>
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { inject, computed, reactive } from 'vue';

  const openGoodsPick: Function | undefined = inject('openGoodsPick');

  const formSchemas: FormSchema[] = [
    {
      required: true,
      field: 'name',
      component: 'Input',
      label: '标题',
    },
    {
      required: true,
      field: 'link',
      component: 'Input',
      label: '跳转链接',
      slot: 'link',
      itemProps: {
        autoLink: false,
      },
    },
    {
      field: 'subtitle',
      component: 'Input',
      label: '副标题',
    },
    {
      required: true,
      field: 'image',
      component: 'ImageUploadGroup',
      defaultValue: [],
      label: '封面图',
      itemProps: {
        autoLink: false,
      },
    },
  ];

  const [registerForm, { validate, setFieldsValue, resetFields }] = useForm({
    labelWidth: 90,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  interface IOpenData {
    data?: any;
    callback?: (values: any) => void;
    // itemId?: number;
  }

  const openData = reactive<IOpenData>({ data: {} });

  const linkDisabled = computed(() => {
    return openData.data?.itemType === 'goods';
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    resetFields();
    openData.data = {};
    openData.callback = data.callback;
    if (data.data) {
      openData.data = data.data;
      setFieldsValue({
        ...data.data,
        image: data.data.image.split(',').map((item: string) => ({ url: item })),
      });
    }
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      values.image = values.image.map((item: Recordable) => item.url).join(',');
      console.debug('handleSubmit', values, openData.data);
      openData.callback?.({ ...openData.data, ...values });
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function handleGoodsPick() {
    openGoodsPick?.(true, {
      type: 'single',
      callback: (data: any) => {
        const goods = data.rows[0];
        openData.data.itemId = goods.id;
        openData.data.itemType = 'goods';
        setFieldsValue({
          name: goods.name,
          image: goods.image.split(',').map((url: string) => ({ url })),
          link: `/packageA/pages/goodsDetail/goodsDetail?id=${goods.id}`,
        });
      },
    });
  }
</script>
