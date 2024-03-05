import { FormSchema } from '/@/components/Table';
import levelData from 'province-city-china/dist/level.json';
import { DeliveryTemplatesRule } from '/@/api/app/system';
import type { TableColumnType } from 'ant-design-vue';

export const primaryKey = 'id';

export interface RegionInfo {
  key: string;
  title: string;
  children?: RegionInfo[];
  province?: string;
  disabled?: Boolean;
}

export function getRegionData(exclude: string[] = []): RegionInfo[] {
  const data: RegionInfo[] = [];
  levelData.forEach((_province: Recordable) => {
    if (/(香港|澳门|台湾)/.test(_province.name)) {
      return;
    }
    _province.disabled = false;
    if (exclude.includes(_province.code)) {
      _province.disabled = true;
    }
    if (!/市$/.test(_province.name) && _province.children && _province.children.length > 0) {
      data.push({
        key: _province.code,
        title: _province.name,
        disabled: !!_province.disabled,
        children: _province.children
          .map((_city: Recordable) => {
            return {
              key: _city.code,
              title: _city.name,
              children: [],
              province: _province.code,
            };
          })
          .map((item) => ({ ...item, disabled: exclude.includes(item.key) })),
      });
    } else {
      data.push({
        key: _province.code,
        title: _province.name,
        disabled: !!_province.disabled,
        children: [],
      });
    }
  });
  return data;
}

function addToArr(arr: any[], data: any, key: string) {
  if (!arr.find((item) => item[key] === data[key])) {
    arr.push(data);
  }
}

export function getRegionByCode(codes: string[]) {
  const data = getRegionData();
  const dataMap = {};
  data.forEach((item) => {
    dataMap[item.key] = item;
    item.children?.forEach((child) => {
      dataMap[child.key] = child;
    });
  });

  const provinceList = [];

  codes.forEach((code) => {
    const info = dataMap[code];
    if (info.province) {
      addToArr(provinceList, dataMap[info.province], 'key');
    } else {
      addToArr(provinceList, info, 'key');
    }
  });

  provinceList.map((province: RegionInfo) => {
    if (province.children?.find((child: RegionInfo) => !codes.includes(child.key))) {
      province.children = province.children.filter((child: RegionInfo) =>
        codes.includes(child.key),
      );
    } else {
      province.children = [];
    }
    return province;
  });

  return provinceList
    .map((item: RegionInfo) => {
      if (item.children && item.children.length > 0) {
        return (
          item.title +
          '【' +
          item.children.map((child: RegionInfo) => child.title).join('、') +
          '】'
        );
      } else {
        return item.title;
      }
    })
    .join('、');
}

//表格列配置
export const columns: TableColumnType[] = [
  {
    title: '可配送区域',
    dataIndex: 'regions',
    align: 'center',
  },
  {
    title: '首件（个）',
    dataIndex: 'firstAmount',
    align: 'center',
    width: 130,
  },
  {
    title: '运费（元）',
    dataIndex: 'firstFee',
    align: 'center',
    width: 130,
  },
  {
    title: '续件（个）',
    dataIndex: 'additionalAmount',
    align: 'center',
    width: 130,
  },
  {
    title: '续件（元）',
    dataIndex: 'additionalFee',
    align: 'center',
    width: 130,
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '模版名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'threshold',
    label: '包邮条件',
    component: 'Input',
    slot: 'threshold',
  },
  // {
  //   required: true,
  //   field: 'valuationType',
  //   label: '计费模式',
  //   component: 'RadioGroup',
  //   defaultValue: 1,
  //   componentProps: {
  //     options: [
  //       { label: '按件', value: 1 },
  //       { label: '重量', value: 2 },
  //     ],
  //   },
  // },
  {
    required: true,
    field: 'valuationRules',
    label: '配送区域',
    component: 'Input',
    slot: 'rules',
    itemProps: {
      autoLink: false,
    },
    rules: [
      {
        required: true,
        validator: (_, value: DeliveryTemplatesRule[]) => {
          if (!value || value.length === 0) {
            return Promise.reject();
          }
          let hasNone = false;
          value.forEach((item) => {
            if (
              !item.regions ||
              item.regions.length == 0 ||
              !item.firstAmount ||
              typeof item.firstFee === 'undefined' ||
              !item.additionalAmount ||
              typeof item.additionalFee === 'undefined'
            ) {
              hasNone = true;
            }
          });
          if (hasNone) {
            return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请配置配送区域',
      },
    ],
  },
];
