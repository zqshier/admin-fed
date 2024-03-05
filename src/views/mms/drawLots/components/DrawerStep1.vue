<template>
  <BasicForm @register="registerForm">
    <template #goodsConfig="{ model, field }">
      <GoodsInput
        v-model:value="model[field]"
        :disabled="dateDisabled(model['endAt'])"
        @remove="onRemoveItem"
        @change="() => validate([field])"
      />
    </template>
    <template #startAtDatePicker="{ model, field }">
      <div class="flex items-center">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :showTime="{ format: 'HH:mm:ss' }"
          v-model:value="model[field]"
          :disabled="dateDisabled(model[field])"
        />
        <Tooltip placement="top" title="参与抽签前30分钟不支持修改该时间">
          <Icon
            icon="akar-icons:question"
            color="#888888"
            size="24"
            :style="{ marginLeft: '10px' }"
          />
        </Tooltip>
      </div>
    </template>
    <template #endAtDatePicker="{ model, field }">
      <div class="flex items-center">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :showTime="{ format: 'HH:mm:ss' }"
          v-model:value="model[field]"
          :disabled="dateDisabled(model[field])"
        />
        <Tooltip placement="top" title="抽签截止前30分钟不支持修改该时间">
          <Icon
            icon="akar-icons:question"
            color="#888888"
            size="24"
            :style="{ marginLeft: '10px' }"
          />
        </Tooltip>
      </div>
    </template>
    <template #finishAtDatePicker="{ model, field }">
      <div class="flex items-center">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :showTime="{ format: 'HH:mm:ss' }"
          v-model:value="model[field]"
          :disabled="dateDisabled(model['endAt'])"
        />
        <Tooltip placement="top" title="抽签截止前30分钟不支持修改该时间">
          <Icon
            icon="akar-icons:question"
            color="#888888"
            size="24"
            :style="{ marginLeft: '10px' }"
          />
        </Tooltip>
      </div>
    </template>
  </BasicForm>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { DatePicker, Tooltip } from 'ant-design-vue';
  import { formSchemaStep1 } from '../data';
  import Icon from '/@/components/Icon';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import GoodsInput from './GoodsInput.vue';

  const props = defineProps({
    editData: {
      type: Object,
    },
    isDisabled: {
      type: Boolean,
    },
  });

  const deleteGoodsIds = ref<number[]>([]);

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
      labelWidth: 140,
      schemas: formSchemaStep1,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  const onRemoveItem = (row: { id: number }) => {
    // console.debug(row);
    deleteGoodsIds.value = Array.from(new Set([...deleteGoodsIds.value, row.id]));
  };

  // function endAtDateDisabled(time) {
  //   if (!props.isDisabled) return false;
  //   const nowTime = new Date().getTime();
  //   const cTime = new Date(time).getTime();
  //   if (nowTime > cTime) return true;
  //   return false;
  // }

  function dateDisabled(time) {
    if (!props.isDisabled) return false;
    const deltaTime = 30 * 60 * 1000;
    const nowTime = new Date().getTime();
    const cTime = new Date(time).getTime();
    if (nowTime > cTime) return true;
    return cTime - nowTime < deltaTime ? true : false;
  }

  defineExpose({ resetFields, setFieldsValue, validate, getFieldsValue, clearValidate });
</script>

<style lang="less" scoped></style>
