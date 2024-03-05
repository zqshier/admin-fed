<template>
  <PageWrapper contentBackground contentClass="p-4">
    <div class="text-lg">短链生成</div>
    <div class="mt-3 w-full">
      <BasicForm @register="registerForm">
        <template #action>
          <div class="flex mt-2 mb-4" v-if="showEnvRadio">
            <a-radio-group v-model:value="envVersion">
              <a-radio :value="item.value" v-for="item in envList" :key="item.value">{{
                item.label
              }}</a-radio>
            </a-radio-group>
          </div>

          <div class="flex">
            <a-space>
              <a-button :loading="submitLoadingUrl" type="primary" class="mr-6" @click="submitUrl"
                >生成URL Link</a-button
              >
              <a-button
                :loading="submitLoadingMarket"
                type="primary"
                class="mr-6"
                @click="submitMarket"
                >生成营销链接</a-button
              >
              <a-button :loading="submitLoadingWxcode" type="primary" @click="submitWxCode"
                >生成太阳码</a-button
              >
            </a-space>
          </div>
        </template>
        <template #tip>
          <div class="flex text-gray-500">
            <div>Tips：</div>
            <div>
              <div>URL Link可用于微信内使用，有效期为30天</div>
              <div>营销链接用于短信发放使用，生成后永久有效</div>
            </div>
          </div>
        </template>
      </BasicForm>
    </div>
    <a-modal
      v-model:visible="modalState.visible"
      :title="modalState.title"
      :okButtonProps="{ style: { display: 'none' } }"
      :cancelText="'返回'"
    >
      <div class="p-10">
        <div>
          <a-alert message="生成成功" type="success" show-icon />
        </div>
        <div class="flex items-center mt-4">
          <a-input v-model:value="modalState.link" class="flex-1" readonly />
          <a-button @click="copyText(modalState.link)" class="ml-4">复制</a-button>
        </div>
      </div>
    </a-modal>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './data';
  import { linksCreate, linksCreateURL, linksCreateWxCode } from '/@/api/app/mms';
  import { LinksItem, envVersion as ENV_VERSION } from '/@/api/app/model/mmsModel';
  import { reactive, ref, unref, computed } from 'vue';
  import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import {
    Input as AInput,
    message,
    Modal as AModal,
    Alert as AAlert,
    Space as ASpace,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
  } from 'ant-design-vue';
  import { createImgPreview } from '/@/components/Preview/index';

  const envList = [
    { label: '正式版', value: ENV_VERSION.RELEASE },
    { label: '体验版本', value: ENV_VERSION.TRIAL },
    { label: '开发版', value: ENV_VERSION.DEVELOP },
  ];

  const { currentRoute } = useRouter();
  const { query } = unref(currentRoute);

  const modalState = reactive({
    visible: false,
    title: '生成',
    link: '',
  });

  const [registerForm, { resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const submitLoadingUrl = ref(false);
  const submitLoadingMarket = ref(false);
  const submitLoadingWxcode = ref(false);
  const envVersion = ref(ENV_VERSION.DEVELOP);

  const showEnvRadio = computed(() => !!Number(query.debug));

  async function submitUrl() {
    try {
      const values = await validate();
      showEnvRadio.value ? (values.envVersion = envVersion.value) : '';
      submitLoadingUrl.value = true;
      const result = await linksCreateURL(values as LinksItem);
      modalState.title = '生成URL Link';
      modalState.link = result.link;
      modalState.visible = true;
      resetFields();
      ``;
    } finally {
      submitLoadingUrl.value = false;
    }
  }

  async function submitMarket() {
    try {
      const values = await validate();
      showEnvRadio.value ? (values.envVersion = envVersion.value) : '';
      submitLoadingMarket.value = true;
      const result = await linksCreate(values as LinksItem);
      modalState.title = '生成营销链接';
      modalState.link = result.link;
      modalState.visible = true;
      resetFields();
    } finally {
      submitLoadingMarket.value = false;
    }
  }

  async function submitWxCode() {
    try {
      const values = await validate();
      showEnvRadio.value ? (values.envVersion = envVersion.value) : '';
      submitLoadingWxcode.value = true;
      const result = await linksCreateWxCode(values as LinksItem);
      // modalState.title = '生成营销链接';
      // modalState.link = result.link;
      // modalState.visible = true;
      // resetFields();
      const imgSrc = window.URL.createObjectURL(result);
      createImgPreview({
        imageList: [imgSrc],
        defaultWidth: 700,
        rememberState: true,
      });
    } finally {
      submitLoadingWxcode.value = false;
    }
  }

  async function copyText(text: string) {
    try {
      copyTextToClipboard(text);
      message.success('复制成功');
    } catch (e) {
      message.error('复制失败');
    }
  }
</script>
