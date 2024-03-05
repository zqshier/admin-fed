import {
  CheckboxGroup,
  Input,
  InputNumber,
  Popconfirm,
  RadioGroup,
  Select,
  Switch,
  Tag,
} from 'ant-design-vue';
import { h } from 'vue';
import { missionsUpdate as updateApi } from '/@/api/app/mission';
import {
  IMission,
  MissionCodeEnum,
  MissionEnum as EMissionEnum,
} from '/@/api/app/model/missionModel';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_MISSION_CODE } = getAppEnvConfig();

export const primaryKey = 'id';
export const pageTitle = '任务';

const _missionCodeOptions = [
  {
    label: '商品评分',
    value: MissionCodeEnum.goodsrate,
    code: MissionCodeEnum.goodsrate,
    type: EMissionEnum.daily,
    choosable: 'rule,desc,times,image',
    addonBefore: '评分',
    addonAfter: '个商品',
  },
  {
    label: '分享商品',
    value: MissionCodeEnum.share,
    code: MissionCodeEnum.share,
    type: EMissionEnum.daily,
    choosable: 'rule,desc,times,image',
    addonBefore: '分享',
    addonAfter: '个商品',
  },
  {
    label: '收藏商品',
    value: MissionCodeEnum.goodsfav,
    code: MissionCodeEnum.goodsfav,
    type: EMissionEnum.daily,
    choosable: 'rule,desc,times,image',
    addonBefore: '收藏',
    addonAfter: '个商品',
  },
  {
    label: '邀请好友',
    value: MissionCodeEnum.invitemember,
    code: MissionCodeEnum.invitemember,
    type: EMissionEnum.daily,
    choosable: 'rule,desc,times,image',
    addonBefore: '邀请',
    addonAfter: '个新用户',
  },
  {
    label: '上传订单截图获得小火苗',
    value: MissionCodeEnum.uploadorder,
    code: MissionCodeEnum.uploadorder,
    type: EMissionEnum.daily,
    choosable: 'link,desc,image',
    addonBefore: '跳转',
    addonAfter: '页面',
  },
  {
    label: '浏览指定页面',
    value: MissionCodeEnum.pageview,
    code: MissionCodeEnum.pageview,
    type: EMissionEnum.daily,
    choosable: 'pRule,desc,image',
    addonBefore: '浏览',
    addonAfter: '页面',
  },
  {
    label: '日签',
    value: MissionCodeEnum.saveimage,
    code: MissionCodeEnum.saveimage,
    type: EMissionEnum.daily,
    choosable: 'oRule,desc',
    addonBefore: '日签',
    addonAfter: '积分',
  },
  {
    label: '每日签到',
    value: MissionCodeEnum.signin,
    code: MissionCodeEnum.signin,
    type: EMissionEnum.daily,
    choosable: 'oRule,desc',
    addonBefore: '每日签到',
    addonAfter: '积分',
  },
  {
    label: '完善个人信息',
    value: MissionCodeEnum.userinfo,
    code: MissionCodeEnum.userinfo,
    type: EMissionEnum.lifetime,
    choosable: 'uRule,desc,image',
    addonBefore: '首次完善个人信息完成任务，奖励',
    addonAfter: '积分',
  },
  {
    label: '关注公众号',
    value: MissionCodeEnum.subwxoa,
    code: MissionCodeEnum.subwxoa,
    type: EMissionEnum.lifetime,
    choosable: 'oRule,desc,image',
    addonBefore: '关注公众号',
    addonAfter: '积分',
  },
  {
    label: '浏览指定页面',
    value: MissionCodeEnum.pageview,
    code: MissionCodeEnum.pageview,
    type: EMissionEnum.lifetime,
    choosable: 'pRule,desc,image',
    addonBefore: '浏览',
    addonAfter: '页面',
  },
  {
    label: '完成问答',
    value: MissionCodeEnum.question,
    code: MissionCodeEnum.question,
    type: EMissionEnum.lifetime,
    choosable: 'qRule,desc,image',
    addonBefore: '完成问卷后奖励',
    addonAfter: '积分',
  },
  {
    label: '添加企微好友',
    value: MissionCodeEnum.wxwkcontact,
    code: MissionCodeEnum.wxwkcontact,
    type: EMissionEnum.lifetime,
    choosable: 'oRule,desc,image',
    addonBefore: '添加企业微信，奖励',
    addonAfter: '积分',
  },
];

export const missionTypeOptions = [
  { label: '每日任务', value: EMissionEnum.daily },
  { label: '一次性任务', value: EMissionEnum.lifetime },
];

export function missionCodeOptionsFun() {
  const codes = VITE_GLOB_MISSION_CODE ? VITE_GLOB_MISSION_CODE.split(',') : _missionCodeOptions;
  const result: any = [];
  for (const code of codes) {
    if (typeof code === 'string') {
      const [type, mcode] = code.split('-');
      const obj = _missionCodeOptions.find((o) => o.code === mcode && o.type === type);
      obj && result.push(obj);
    } else {
      result.push(code);
    }
  }
  return result;
}

const missionCodeOptions = missionCodeOptionsFun();
//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
  },
  {
    title: '任务类型',
    dataIndex: 'type',
    customRender: ({ record }: Recordable) =>
      missionTypeOptions.find((i) => i.value === record.type)?.label,
  },
  {
    title: '任务规则',
    dataIndex: 'rule',
    customRender: ({ record }: Recordable) => {
      const list = missionCodeOptions.filter((o) => o.type === record.type);
      const obj = list.find((i) => i.code === record.code);
      if (obj?.choosable && obj.choosable.indexOf('rule') > -1) {
        return `${obj?.addonBefore}${record.condition}${obj?.addonAfter}，奖励${record.rewardValue}积分`;
      } else if (obj?.choosable && obj.choosable.indexOf('link') > -1) {
        return `${obj?.addonBefore} ${record.link} ${obj?.addonAfter}`;
      } else if (obj?.choosable && obj.choosable.indexOf('pRule') > -1) {
        return `${obj?.addonBefore} ${record.link} ${obj?.addonAfter}，奖励${record.rewardValue}积分`;
      } else if (obj?.choosable && obj.choosable.indexOf('uRule') > -1) {
        return `${obj?.addonBefore}${record.rewardValue}${obj?.addonAfter}`;
      } else if (obj?.choosable && obj.choosable.indexOf('qRule') > -1) {
        return `${obj?.addonBefore}${record.rewardValue}${obj?.addonAfter}`;
      } else if (obj?.choosable && obj.choosable.indexOf('oRule') > -1) {
        return `${obj.addonBefore}${record.rewardValue}${obj?.addonAfter}`;
      }
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender({ record }: Recordable) {
      let color = 'green';
      let txt = '进行中';
      if (record.disabled) {
        color = 'default';
        txt = '已下架';
      } else {
        const now = Date.now();
        const s = new Date(record.startDate || '1970-01-01').getTime();
        const e = new Date(record.endDate || '2999-01-01').getTime();
        if (now > e) {
          color = 'red';
          txt = '已过期';
        } else if (now < s) {
          color = 'orange';
          txt = '未开始';
        }
      }
      return h(Tag, { color }, () => txt);
    },
  },
  {
    title: '任务上架时间',
    dataIndex: 'startDate',
    customRender({ record }: Recordable) {
      if (!record.startDate || !record.endDate) return '-';
      const color = new Date().getTime() > new Date(record.endDate).getTime() ? 'gray' : '';
      return h('div', { style: { color } }, [
        h('div', `${formatToDateTime(record.startDate)}`),
        h('div', `${formatToDateTime(record.endDate)}`),
      ]);
    },
  },
  {
    title: '上下架',
    dataIndex: 'disabled',
    width: 100,
    customRender: ({ record }: Recordable) => {
      return h(
        Popconfirm,
        {
          title: `确定要${record.disabled ? '上架' : '下架'}吗？`,
          onConfirm: () => {
            return updateApi(record.id, { disabled: !record.disabled } as IMission).then(() => {
              record.disabled = !record.disabled;
            });
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record.disabled,
              checkedChildren: '已上架',
              unCheckedChildren: '已下架',
            }),
        },
      );
    },
  },
  {
    title: '排序(降序)',
    dataIndex: 'position',
    edit: true,
    width: 150,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '任务名称',
    component: 'Input',
  },
  {
    field: 'status',
    label: '任务状态',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'type',
    label: '任务类型',
    component: 'RadioGroup',
    defaultValue: EMissionEnum.daily,
    componentProps: ({ formModel }) => ({
      options: missionTypeOptions,
      onchange: () => {
        formModel.name = '';
        formModel.code = undefined;
        formModel.image = '';
        formModel.desc = '';
        formModel['[condition, link, rewardValue]'] = [1, '', '1'];
        formModel.times = 1;
      },
    }),
  },
  {
    required: true,
    field: 'code',
    label: '选择任务',
    component: 'Input',
    render: ({ model, schema }) => {
      const options = missionCodeOptions.filter((o) => o.type === model.type);
      return h(Select, {
        placeholder: '请选择任务',
        options,
        value: model.code,
        disabled: schema?.dynamicDisabled as boolean,
        onChange: (value) => (model.code = value),
      });
    },
  },
  {
    required: true,
    field: 'name',
    label: '任务名称',
    component: 'Input',
    componentProps: { maxlength: 10, showCount: true },
    ifShow: ({ model }) => !!model.code,
  },
  {
    required: true,
    field: 'meta.targetId',
    label: '选择问卷',
    component: 'Input',
    slot: 'questionnaireSlot',
    ifShow: ({ model }) => model.code === MissionCodeEnum.question,
  },
  {
    required: true,
    field: '[condition, link, rewardValue]',
    label: '任务规则',
    component: 'Input',
    render: ({ model, field }) => {
      console.debug('[condition, link, rewardValue] model=', model);
      const min = 1;
      const max = 1000;
      const options = missionCodeOptions.filter((o) => o.type === model.type);
      const boxInfo = options.find((i) => i.code === model.code);
      if (!boxInfo?.value) return '';
      // 商品评分、分享商品、收藏商品、邀请好友
      if (boxInfo.choosable.indexOf('rule') > -1) {
        return h('div', { class: 'flex items-end' }, [
          h(InputNumber, {
            addonBefore: boxInfo.addonBefore,
            addonAfter: boxInfo.addonAfter + '完成任务',
            value: model[field][0],
            precision: 0,
            min,
            max,
            onChange: (value) => (model[field][0] = value === null ? min : value),
          }),
          h('span', { class: 'pl-2 pr-2' }, ','),
          h(InputNumber, {
            addonBefore: '获得',
            addonAfter: '积分',
            value: model[field][2],
            precision: 0,
            min,
            max,
            onChange: (value) => (model[field][2] = value === null ? min : value),
          }),
        ]);
      }

      // 上传订单截图获得小火苗
      if (boxInfo.choosable.indexOf('link') > -1) {
        return h('div', { class: 'flex items-end' }, [
          h(Input, {
            addonBefore: boxInfo.addonBefore,
            addonAfter: boxInfo.addonAfter,
            maxlength: 100,
            showCount: true,
            placeholder: '页面路径',
            value: model[field][1],
            onChange: (event) => (model[field][1] = event.target.value),
          }),
        ]);
      }

      // 浏览商城、浏览指定页面
      if (boxInfo.choosable.indexOf('pRule') > -1) {
        return h('div', { class: 'flex items-end' }, [
          h(Input, {
            addonBefore: boxInfo.addonBefore,
            addonAfter: boxInfo.addonAfter,
            value: model[field][1],
            placeholder: '页面路径',
            onChange: (event) => (model[field][1] = event.target.value),
          }),
          h('span', { class: 'pl-2 pr-2' }, ','),
          h(InputNumber, {
            addonBefore: '获得',
            addonAfter: '积分',
            value: model[field][2],
            min,
            max,
            onChange: (value) => (model[field][2] = value === null ? min : value),
          }),
        ]);
      }

      // 完善个人信息 关注公众号 调查问卷 添加企微好友
      if (
        boxInfo.choosable.indexOf('uRule') > -1 ||
        boxInfo.choosable.indexOf('qRule') > -1 ||
        boxInfo.choosable.indexOf('oRule') > -1
      ) {
        return h(InputNumber, {
          addonBefore: boxInfo.addonBefore,
          addonAfter: boxInfo.addonAfter,
          value: model[field][2],
          min,
          max,
          onChange: (value) => (model[field][2] = value === null ? min + '' : value + ''),
        });
      }

      // 关注公众号
      // if (boxInfo.choosable.indexOf('oRule') > -1) {
      //   return h(InputNumber, {
      //     addonBefore: boxInfo.addonBefore,
      //     addonAfter: boxInfo.addonAfter,
      //     value: model[field][2],
      //     min: 1,
      //     max: 99999,
      //     onChange: (value) => (model[field][2] = value === null ? min : value),
      //   });
      // }

      return '';
    },
    ifShow: ({ model }) => !!model.code,
    dynamicRules: ({ model }) => {
      const { code = '' } = model;
      let checkFields = ['condition', 'rewardValue'];
      if (code === MissionCodeEnum.uploadorder) checkFields = ['link']; // 上传订单截图获得小火苗 验证
      if (code === MissionCodeEnum.pageview) checkFields = ['link', 'rewardValue']; // 浏览指定页面 浏览商城 验证
      if (
        code === MissionCodeEnum.subwxoa ||
        code === MissionCodeEnum.userinfo ||
        code === MissionCodeEnum.question
      )
        checkFields = ['rewardValue']; // 完善个人信息 验证

      return [
        {
          required: true,
          validator: (_, value) => {
            const [condition, link, rewardValue] = value;
            for (const key in checkFields) {
              if (Object.prototype.hasOwnProperty.call(checkFields, key)) {
                const field = checkFields[key];
                if (field === 'condition' && condition <= 0)
                  return Promise.reject('请完善任务规则');

                if (field === 'rewardValue' && rewardValue <= 0)
                  return Promise.reject('请完善任务规则');

                if (field === 'link' && !link) return Promise.reject('请完善任务规则');

                if (field === 'link' && link.charAt(0) !== '/')
                  return Promise.reject('请填写正确的页面路径');
              }
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    field: 'desc',
    label: '任务描述',
    component: 'Input',
    componentProps: { placeholder: '例如：+10小火苗', maxlength: 30, showCount: true },
    ifShow: ({ model }) => {
      const options = missionCodeOptions.filter((o) => o.type === model.type);
      const option = options.find((i) => i.code === model.code);
      return !!model.code && !!(option?.choosable && option.choosable.indexOf('desc') > -1);
    },
  },
  {
    field: 'jumpLink',
    label: '跳转路径',
    component: 'Input',
    componentProps: { placeholder: '请输入跳转路径', maxlength: 100, showCount: true },
    ifShow: ({ model }) => {
      return (
        !!model.code &&
        ![MissionCodeEnum.uploadorder, MissionCodeEnum.pageview].includes(model.code)
      );
    },
  },
  {
    required: true,
    field: 'times',
    label: '每日完成上限',
    component: 'InputNumber',
    componentProps: { min: 1, max: 99, addonAfter: '次', precision: 0 },
    ifShow: ({ model }) => {
      const options = missionCodeOptions.filter((o) => o.type === model.type);
      const option = options.find((i) => i.code === model.code);
      return !!model.code && !!(option?.choosable && option.choosable.indexOf('times') > -1);
    },
  },
  {
    required: true,
    field: 'image',
    label: '任务图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/png,image/gif',
      maxCount: 1,
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) return Promise.reject();
          return Promise.resolve();
        },
        message: '请上传任务图片',
      },
    ],
    ifShow: ({ model }) => {
      const options = missionCodeOptions.filter((o) => o.type === model.type);
      const option = options.find((i) => i.code === model.code);
      return !!model.code && !!(option?.choosable && option.choosable.indexOf('image') > -1);
    },
  },
  {
    field: '[meta.placement, meta.remind]',
    label: '额外展示位置',
    component: 'Input',
    defaultValue: [[], true],
    render: ({ model, field }) => {
      let bottomBox: any = [];
      if (model[field][0] && model[field][0].includes('个人中心')) {
        bottomBox = [
          h('span', { class: 'pt-1 pb-1' }, '未完成提醒'),
          h(RadioGroup, {
            options: [
              { label: '提示', value: true },
              { label: '不提示', value: false },
            ],
            value: model[field][1],
            onChange: (event) => (model[field][1] = event.target.value),
          }),
        ];
      }
      return h('div', { class: 'flex flex-col' }, [
        h('div', { class: 'flex' }, [
          // h(Checkbox, { disabled: true, checked: true }, '积分商城'),
          h(CheckboxGroup, {
            options: ['积分商城', '个人中心'],
            value: model[field][0],
            onChange: (value) => (model[field][0] = value),
          }),
        ]),
        [...bottomBox],
      ]);
    },
  },
  {
    field: 'meta.hideAfterComplete',
    label: '完成后任务不显示',
    component: 'RadioGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '否', value: false },
        { label: '是', value: true },
      ],
    },
    ifShow: ({ model }) => model.type === EMissionEnum.lifetime,
  },
  {
    required: true,
    field: '[startDate, endDate]',
    label: '上架时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          const [startDate, endDate] = value;
          if (!startDate || !endDate) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择上架时间',
      },
    ],
  },
];
