import { h } from 'vue';
import { Popconfirm, Switch, InputNumber, RadioGroup, Input, Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { isArray, isEmpty } from '/@/utils/is';
import { formatToDateTime } from '/@/utils/dateUtil';
import { friendPowerUpdateApi as updateApi } from '/@/api/app/friendPower';
import { FormActionType } from '/@/components/Form/index';
import { ImageUpload } from '/@/components/ImageUpload';

export const primaryKey = 'id';
export const pageTitle = '助力活动';

export enum FriendIdentity {
  unlimited,
  newuser,
}

export enum EAddCustomer {
  no,
  yes,
}

export interface StepActionType extends FormActionType {
  initData: any;
}

export function timeRender(text: string) {
  if (!text) return '-';
  return formatToDateTime(text);
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '活动编号',
    dataIndex: 'id',
  },
  {
    title: '活动名称',
    dataIndex: 'name',
  },
  {
    title: '助力人数要求',
    dataIndex: 'condition',
  },
  {
    title: '活动有效期',
    dataIndex: 'start',
    width: 300,
    customRender: ({ record }: Recordable) => {
      return `${timeRender(record.start)} 至 ${timeRender(record.end)}`;
    },
  },
  {
    title: '当前活动剩余发起数',
    dataIndex: 'circleTotalCount',
    customRender: ({ record }: Recordable) =>
      (record?.counter && +record.circleTotalCount - +record?.counter?.cycleUsageCount) || 0,
  },
  {
    title: '活动发起码',
    dataIndex: 'invitationCode',
    customRender: ({ record }: Recordable) => {
      const tag = { color: 'green', label: record.invitationCode };
      if (!record?.useInvitationCode) (tag.color = 'red'), (tag.label = '否');
      return h(Tag, { color: tag?.color }, () => tag?.label);
    },
  },

  {
    title: '活动发起数',
    dataIndex: 'counter.cycleCount',
    customRender: ({ record }: Recordable) => (record?.counter && record.counter.cycleCount) || 0,
  },
  {
    title: '活动完成数',
    dataIndex: 'counter.completedCount',
    customRender: ({ record }: Recordable) =>
      (record?.counter && record.counter.completedCount) || 0,
  },
  {
    title: '助力人数',
    dataIndex: 'counter.powerCount',
    customRender: ({ record }: Recordable) => (record?.counter && record.counter.powerCount) || 0,
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
            const disabled = !record.disabled;
            return updateApi(record.id, { disabled } as any)
              .then((res) => {
                record.disabled = res.disabled;
              })
              .catch(() => (record.disabled = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record.disabled,
              checkedChildren: '上架',
              unCheckedChildren: '下架',
            }),
        },
      );
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '活动名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '活动名称',
    component: 'Input',
    componentProps: {
      maxlength: 20,
      showCount: true,
    },
  },
  {
    required: true,
    field: 'image',
    label: '活动头图',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/png',
      maxCount: 1,
      maxImageSize: 5,
    },
    rules: [{ required: true, message: '请上传活动头图' }],
  },
  {
    required: true,
    field: '[start,end]',
    label: '活动时间',
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
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          for (const v of value) {
            if (!v) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整活动时间',
      },
    ],
  },
  {
    required: true,
    field: 'initiatorAward',
    label: '发起人奖励',
    component: 'Input',
    itemProps: { autoLink: false },
    slot: 'initiatorAward',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          for (const v of value) {
            if (!v.value) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整发起人奖励',
      },
    ],
  },
  {
    required: true,
    field: 'rewardImage',
    label: '奖品图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/png',
      maxCount: 1,
      maxImageSize: 5,
    },
    rules: [{ required: true, message: '请上传奖品图片' }],
  },
  {
    required: true,
    field: 'expireTime',
    label: '助力有效期',
    helpMessage: ['用户开始助力后，需要在有效期内完成，超时则任务失败'],
    component: 'InputNumber',
    componentProps: {
      addonAfter: '小时',
      min: 1,
      max: 999,
    },
  },
  {
    required: true,
    field: 'condition',
    label: '助力人数',
    component: 'InputNumber',
    componentProps: {
      addonAfter: '人',
      min: 1,
      max: 10,
    },
  },
  {
    required: true,
    field: 'times',
    label: '活动限制',
    component: 'InputNumber',
    componentProps: {
      addonBefore: '每人可发起',
      addonAfter: '次',
      min: 1,
      max: 99,
    },
  },
  {
    required: true,
    field: '[friendIdentity,friendPowerPerDay,friendPowerTotal]',
    label: '好友助力要求',
    component: 'Input',
    defaultValue: 0,
    render({ model, field, schema }) {
      // console.debug('model', model);
      const disabled: boolean = (schema?.dynamicDisabled as boolean) || false;

      let noDemandBox: any = [];

      if (model[field][0] === FriendIdentity.unlimited) {
        noDemandBox = [
          h(InputNumber, {
            value: model[field][1],
            class: 'mt-2 mb-2',
            style: { width: '250px' },
            max: 99,
            min: 1,
            disabled,
            addonBefore: '每人每天只能助力',
            addonAfter: '次',
            onChange: (value) => (model[field][1] = value || 1),
          }),
          h(InputNumber, {
            value: model[field][2],
            style: { width: '250px' },
            min: 1,
            max: 99,
            disabled,
            addonBefore: '每人总助力',
            addonAfter: '次',
            onChange: (value) => (model[field][2] = value || 1),
          }),
        ];
      }

      return h('div', { class: 'flex flex-col pt-1 pb-1' }, [
        h(RadioGroup, {
          options: [
            { label: '无需求', value: FriendIdentity.unlimited },
            { label: '新用户', value: FriendIdentity.newuser },
          ],
          value: model[field][0],
          disabled,
          onChange: (event) => (model[field][0] = event.target.value),
        }),
        [...noDemandBox],
      ]);
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          // console.debug('value', value);
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          if (value[0] === 0) {
            if (isEmpty(value[1]) || isEmpty(value[2])) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整好友助力要求',
      },
    ],
  },
  {
    required: true,
    field: 'friendAward',
    label: '好友助力奖励',
    component: 'Input',
    itemProps: { autoLink: false },
    slot: 'friendAward',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          for (const v of value) {
            if (!v.value) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整好友助力奖励',
      },
    ],
  },
  {
    required: true,
    field: 'friendRewardImage',
    label: '好友助力奖品图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/png',
      maxCount: 1,
      maxImageSize: 5,
    },
    rules: [{ required: true, message: '请上传好友助力奖品图片' }],
  },
  {
    required: false,
    field: 'share-content',
    label: '活动分享内容',
    component: 'Input',
    slot: 'share-content',
  },
  {
    required: false,
    field: 'shareTitle',
    label: '分享标题',
    component: 'Input',
    componentProps: {
      maxlength: 20,
      showCount: true,
    },
  },
  {
    required: false,
    field: 'shareImage',
    label: '分享图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/png',
      maxCount: 1,
      maxImageSize: 2,
    },
  },
];

// step1 表单配置
export const formSchemaStep1: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '活动名称',
    component: 'Input',
    componentProps: {
      maxlength: 20,
      showCount: true,
    },
  },
  {
    required: true,
    field: 'image',
    label: '活动头图',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpg,image/png,image/gif',
      maxCount: 1,
      maxImageSize: 5,
    },
    rules: [{ required: true, message: '请上传活动头图' }],
  },
  {
    required: true,
    field: '[start,end]',
    label: '活动时间',
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
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          for (const v of value) {
            if (!v) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整活动时间',
      },
    ],
  },
  {
    field: '[useInvitationCode, invitationCode]',
    label: '活动发起码',
    component: 'Input',
    defaultValue: [false, ''],
    render: ({ model, field }) => {
      let bottomBox: any = [];
      if (model[field][0]) {
        bottomBox = [
          h(Input, {
            class: 'pt-1',
            addonBefore: '请输入4位活动发起码',
            style: 'width:70%',
            maxlength: 4,
            value: model[field][1],
            onChange: (event) => (model[field][1] = event.target.value),
          }),
        ];
      }
      return h('div', { class: `flex flex-col ${bottomBox.length > 0 ? 'pt-2' : ''}` }, [
        h('div', { class: 'flex' }, [
          h(RadioGroup, {
            options: [
              { label: '否', value: false },
              { label: '是', value: true },
            ],
            value: model[field][0],
            onChange: (event) => (model[field][0] = event.target.value),
          }),
        ]),
        [...bottomBox],
      ]);
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          const [useInvitationCode, invitationCode] = value;
          if (useInvitationCode && (invitationCode?.length < 4 || !Number(invitationCode)))
            return Promise.reject('请输入4位数字的活动发起码');
          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: true,
    field: 'circleTotalCount',
    label: '活动可发起次数',
    component: 'InputNumber',
    componentProps: {
      addonAfter: '次',
      min: 1,
      max: 99999,
    },
  },
  {
    required: true,
    field: 'initiatorAward',
    label: '发起人奖励',
    component: 'Input',
    itemProps: { autoLink: false },
    slot: 'initiatorAward',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          for (const v of value) {
            if (!v.value) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整发起人奖励',
      },
    ],
  },
  {
    required: true,
    field: 'rewardImage',
    label: '奖品图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpg,image/png,image/gif',
      maxCount: 1,
      maxImageSize: 5,
    },
    rules: [{ required: true, message: '请上传奖品图片' }],
  },
  {
    required: true,
    field: 'expireTime',
    label: '助力有效期',
    helpMessage: ['用户开始助力后，需要在有效期内完成，超时则任务失败'],
    component: 'InputNumber',
    componentProps: {
      addonAfter: '小时',
      min: 1,
      max: 999,
    },
  },
  {
    required: true,
    field: 'condition',
    label: '助力人数',
    component: 'InputNumber',
    componentProps: {
      addonAfter: '人',
      min: 1,
      max: 10,
    },
  },
  {
    required: true,
    field: 'times',
    label: '活动限制',
    component: 'InputNumber',
    componentProps: {
      addonBefore: '每人可完成',
      addonAfter: '次',
      min: 1,
      max: 99,
    },
  },
  {
    required: true,
    field: '[friendIdentity,friendPowerPerDay,friendPowerTotal]',
    label: '好友助力要求',
    component: 'Input',
    defaultValue: 0,
    render({ model, field, schema }) {
      // console.debug('model', model);
      const disabled: boolean = (schema?.dynamicDisabled as boolean) || false;

      let noDemandBox: any = [];

      if (model[field][0] === FriendIdentity.unlimited) {
        noDemandBox = [
          h(InputNumber, {
            value: model[field][1],
            class: 'mt-2 mb-2',
            style: { width: '250px' },
            max: 99,
            min: 1,
            disabled,
            addonBefore: '每人每天只能助力',
            addonAfter: '次',
            onChange: (value) => (model[field][1] = value || 1),
          }),
          h(InputNumber, {
            value: model[field][2],
            style: { width: '250px' },
            min: 1,
            max: 99,
            disabled,
            addonBefore: '每人总助力',
            addonAfter: '次',
            onChange: (value) => (model[field][2] = value || 1),
          }),
        ];
      }

      return h('div', { class: 'flex flex-col pt-1 pb-1' }, [
        h(RadioGroup, {
          options: [
            { label: '无需求', value: FriendIdentity.unlimited },
            { label: '新用户', value: FriendIdentity.newuser },
          ],
          value: model[field][0],
          disabled,
          onChange: (event) => (model[field][0] = event.target.value),
        }),
        [...noDemandBox],
      ]);
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          // console.debug('value', value);
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          if (value[0] === 0) {
            if (isEmpty(value[1]) || isEmpty(value[2])) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整好友助力要求',
      },
    ],
  },
  {
    required: true,
    field: 'friendAward',
    label: '好友助力奖励',
    component: 'Input',
    itemProps: { autoLink: false },
    slot: 'friendAward',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          for (const v of value) {
            if (!v.value) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整好友助力奖励',
      },
    ],
  },
  {
    required: true,
    field: 'friendRewardImage',
    label: '好友助力奖品图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpg,image/png,image/gif',
      maxCount: 1,
      maxImageSize: 5,
    },
    rules: [{ required: true, message: '请上传好友助力奖品图片' }],
  },
];

// step2 表单配置
export const formSchemaStep2: FormSchema[] = [
  {
    required: true,
    field: '[sendMustAddContact,contactUrl]',
    label: '是否添加企微',
    component: 'Input',
    defaultValue: [false, ''],
    render({ model, field }) {
      // console.debug('model', model);

      let noDemandBox: any = [];

      if (model[field][0] === Boolean(EAddCustomer.no)) model[field][1] = '';

      if (model[field][0] === Boolean(EAddCustomer.yes)) {
        noDemandBox = [
          h(ImageUpload, {
            accept: 'image/jpg,image/png,image/gif',
            maxCount: 1,
            maxImageSize: 2,
            value: model[field][1],
            class: 'mt-2 mb-2',
            onChange: (value) => (model[field][1] = value || ''),
          }),
        ];
      }

      return h('div', { class: 'flex flex-col pt-1 pb-1' }, [
        h(RadioGroup, {
          options: [
            { label: '否', value: Boolean(EAddCustomer.no) },
            { label: '是', value: Boolean(EAddCustomer.yes) },
          ],
          value: model[field][0],
          onChange: (event) => (model[field][0] = event.target.value),
        }),
        [...noDemandBox],
      ]);
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          // console.debug('value', value);
          if (!isArray(value) || value.length <= 0) return Promise.reject('请选择是否添加企微');
          const [type, imageUrl] = value;
          if (type === Boolean(EAddCustomer.yes)) {
            if (isEmpty(imageUrl)) return Promise.reject('请上传企微图片');
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: false,
    field: 'share-content',
    label: '活动分享内容',
    component: 'Input',
    slot: 'share-content',
  },
  {
    required: false,
    field: 'shareTitle',
    label: '分享标题',
    component: 'Input',
    componentProps: {
      maxlength: 20,
      showCount: true,
    },
  },
  {
    required: false,
    field: 'shareImage',
    label: '分享图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpg,image/png,image/gif',
      maxCount: 1,
      maxImageSize: 2,
    },
  },
  {
    required: true,
    field: 'sharePosterImage',
    label: '活动分享海报',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpg,image/png,image/gif',
      maxCount: 1,
      maxImageSize: 2,
    },
  },
  {
    field: 'orginDetails',
    label: '活动详情',
    component: 'Input',
    slot: 'details',
  },
];

// 增减活动数量
export const formSchemaModifyActiveNum: FormSchema[] = [
  {
    field: 'count',
    label: '活动剩余发起数量：',
    component: 'Input',
    defaultValue: '',
    labelWidth: 120,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
  {
    field: 'addCount',
    label: '在剩余数量基础上增加/减少：',
    helpMessage: ['增加数量直接填写数量，减少数量需在数量前填写"-"'],
    component: 'Input',
    slot: 'InputCount',
    labelWidth: 220,
  },
  {
    field: 'baseCount',
    label: '编辑后剩余活动发起数：',
    component: 'Input',
    labelWidth: 150,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
];
