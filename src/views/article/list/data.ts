import { h } from 'vue';
import { format } from 'date-fns';
import { isArray } from '/@/utils/is';
import { AriticleState, AriticlePublicType, UsersType } from '/@/api/app/model/articleModel';
import { BasicColumn, TableImg } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { TabsOptionItem } from '/@/components/TabsOption';

export const primaryKey = 'id';
export const pageTitle = '内容';

export const tabsOptionList: TabsOptionItem[] = [
  { key: 0, tab: '全部' },
  { key: 1, tab: '待审核' },
  { key: 2, tab: '审核通过' },
  { key: 3, tab: '审核拒绝' },
];

export const tabsOptionListParams = [
  {},
  { states: AriticleState.pending },
  { states: AriticleState.approve },
  { states: AriticleState.reject },
];

export const articleStatus = [
  { label: '全部', value: '' },
  { label: '待审核', value: AriticleState.pending },
  { label: '审核通过', value: AriticleState.approve },
  { label: '审核拒绝', value: AriticleState.reject },
  { label: '已删除', value: AriticleState.delete },
];

export const stateNames = {
  [AriticleState.pending]: '待审核',
  [AriticleState.approve]: '审核通过',
  [AriticleState.reject]: '审核拒绝',
  [AriticleState.delete]: '已删除',
};

export const ReleaseModes = [
  { label: '全部', value: '' },
  { label: '小程序发布', value: AriticlePublicType.user },
  { label: '后台发布', value: AriticlePublicType.admin },
];

export const ReleaseAccount = [
  { label: '全部', value: '' },
  { label: '官方账号', value: UsersType.official },
  { label: '个人账号', value: UsersType.personal },
  { label: '其他', value: UsersType.user },
];

export const stateColors = (status: string) => {
  switch (status) {
    case AriticleState.pending:
      return 'warning';
    case AriticleState.approve:
      return 'success';
    case AriticleState.reject:
      return 'error';
    case AriticleState.delete:
      return 'error';
  }
  return 'default';
};

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 50,
  },
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: false,
  },
  {
    title: '发布者',
    dataIndex: 'operator',
    width: 150,
  },
  {
    title: '图片内容',
    dataIndex: 'image',
    key: 'image',
    customRender({ record }: Recordable) {
      const imgList = record.contents
        .map((item) => {
          if (item.type === 'image') return item.content;
        })
        .filter((i) => i && i.trim());
      return h(TableImg, {
        size: 60,
        imgList: imgList || [],
        simpleShow: true,
      });
    },
  },
  {
    title: '文字内容',
    dataIndex: 'contents',
    key: 'text',
    ellipsis: true,
    customRender({ text }: Recordable) {
      const texts = text
        .map((item) => {
          if (item.type === 'text') return item.content;
        })
        .filter((s) => s && s.trim());
      return (texts && texts.join()) || '';
    },
  },
  {
    title: '关联商品',
    dataIndex: 'relations',
    width: 300,
  },
  {
    title: '阅读次数',
    dataIndex: 'readCount',
    width: 100,
  },
  {
    title: '点赞数',
    dataIndex: 'likes',
    width: 100,
  },
  {
    title: '分享人数',
    dataIndex: 'shareCount',
    width: 100,
  },
  {
    title: '发布方式',
    dataIndex: 'publicType',
    customRender({ text }) {
      return (
        {
          user: '小程序发布',
          admin: '后台发布',
        }[text] || '-'
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '发布时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
  {
    title: '排序',
    dataIndex: 'priority',
    edit: true,
    width: 100,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'title',
    label: '标题',
    component: 'Input',
  },
  {
    field: 'states',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: articleStatus,
    },
  },
  {
    field: '[startDate, endDate]',
    label: '发布时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'publicType',
    label: '发布方式',
    component: 'Select',
    componentProps: {
      options: ReleaseModes,
    },
  },
  {
    field: 'userType',
    label: '发布账号',
    component: 'Select',
    componentProps: {
      options: ReleaseAccount,
    },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'title',
    label: '标题',
    component: 'Input',
  },
  {
    required: true,
    field: 'usersInfo',
    label: '发布者',
    component: 'Input',
    slot: 'usersInfo',
    itemProps: {
      autoLink: false,
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          // console.warn('value', value);
          const { ids = [] } = value;
          if ((!ids && !isArray(ids)) || ids.length === 0) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择发布者',
      },
    ],
  },
  {
    field: 'correlation',
    label: '关联商品',
    slot: 'corGoodsConfig',
    component: 'Input',
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: true,
    field: 'editor',
    label: '内容',
    slot: 'editor',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          const { rows = [] } = value;
          const errorText1 = '未填写文字内容';
          const errorText2 = '未填写图片/视频内容';
          if ((!rows && !isArray(rows)) || rows.length === 0)
            return Promise.reject('请填写完整内容信息');

          let errorText = '';
          rows.forEach((row) => {
            if (!row.content) {
              if (row.type === 'image' || row.type === 'video') {
                errorText = errorText2;
              }
              if (row.type === 'text') {
                errorText = errorText1;
              }
            }
          });

          if (!errorText) {
            if (rows.find((item) => item.type === 'text') === undefined) {
              return Promise.reject(errorText1);
            }
            if (rows.find((item) => item.type === 'image' || item.type === 'video') === undefined) {
              return Promise.reject(errorText2);
            }
          }

          if (errorText) return Promise.reject(errorText);

          return Promise.resolve();
        },
      },
    ],
    itemProps: { autoLink: false },
  },
  {
    field: 'state',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: articleStatus,
    },
    dynamicDisabled: true,
    ifShow: false,
  },
];
