<template>
  <div>
    <a-textarea
      v-model:value="editValue"
      placeholder="请输入内容"
      :rows="6"
      @change="handleChange"
    />
    <!-- <Tinymce
      v-model="editValue"
      :showImageUpload="false"
      :options="options"
      @change="handleChange"
      width="100%"
      height="300"
    /> -->
  </div>
</template>

<script lang="ts" setup>
  // import { Tinymce } from '/@/components/Tinymce/index';
  import { computed } from 'vue';

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const editValue = computed({
    get() {
      return props.value;
    },
    set(v: string) {
      emit('update:value', v);
      emit('change', v);
    },
  });

  // const options = ref({
  //   menubar: false,
  //   toolbar:
  //     'undo redo | fontsizeselect | formatselect | ' +
  //     'bold italic forecolor backcolor | alignleft aligncenter ' +
  //     'alignright alignjustify | bullist numlist outdent indent | ' +
  //     'removeformat ',
  // });

  function handleChange() {
    console.log(props.value);
  }
</script>

<style lang="less" scoped></style>
