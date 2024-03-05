<template>
  <a-cascader
    v-model:value="picks"
    placeholder="请选择"
    :options="options"
    :field-names="fieldNames"
    :disabled="disabled"
  />
</template>

<script lang="ts" setup>
  import { Cascader as ACascader } from 'ant-design-vue';
  import level from 'province-city-china/dist/level.json';
  import { computed } from 'vue';

  const props = defineProps({
    value: [String, Number],
    disabled: { type: Boolean, default: false },
    name: String,
  });

  const fieldNames = { label: 'name', value: 'code', children: 'children' };

  const emit = defineEmits(['update:value']);

  const options = computed(() => {
    return level;
  });

  const areaData: any[] = [];

  level.forEach((_province: any) => {
    if (_province.children && _province.children.length > 0) {
      _province.children.forEach((_city: any) => {
        if (_city.children && _city.children.length > 0) {
          _city.children.forEach((_area: any) => {
            _area.province = _province.code;
            _area.city = _city.code;
            _area.area = _area.code;
            _area.addr = _province.name + _city.name + _area.name;
            areaData.push(_area);
          });
        } else {
          _city.province = _province.code;
          _city.city = _city.code;
          _city.area = '';
          _city.addr = _province.name + _city.name;
          areaData.push(_city);
        }
      });
    } else {
      _province.province = _province.code;
      _province.city = '';
      _province.area = '';
      _province.addr = _province.name;
      areaData.push(_province);
    }
  });

  const picks = computed({
    get() {
      const _value = props.value;
      const _name = props.name;
      console.debug('_value', _value);
      console.debug('_name', _name);
      if (!_value) return [];
      let _area = areaData.find((item) => item.code === _value);
      if (!_area) _area = areaData.find((item) => item.name.includes(_name));
      if (!_area) return [];

      let arr: string[] = [];
      if (_area.province) arr.push(_area.province);
      if (_area.city) arr.push(_area.city);
      if (_area.area) arr.push(_area.area);

      return arr;
    },
    set(val) {
      emit('update:value', val?.length ? val[val.length - 1] : '');
    },
  });

  const getPickAddr = () => {
    let _area = areaData.find((item) => item.code === props.value);
    if (!_area) _area = areaData.find((item) => item.name.includes(props.name));
    console.debug('_area', _area);
    if (!_area) return '';
    return _area.addr;
  };

  defineExpose({ getPickAddr });
</script>
