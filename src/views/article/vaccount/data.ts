import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, TableImg } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { UsersType, UsersState } from '/@/api/app/model/articleModel';

export const primaryKey = 'id';
export const pageTitle = '账号';

export const AccountStatus = [
  { label: '全部', value: '' },
  { label: '官方账号', value: UsersType.official },
  { label: '个人账号', value: UsersType.personal },
];

export const stateColors = (status: string) => {
  switch (status) {
    case UsersState.enabled:
      return 'success';
    case UsersState.disabled:
      return 'error';
  }
  return 'default';
};

export const stateNames = {
  [UsersState.enabled]: '启用',
  [UsersState.disabled]: '禁止',
};

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'SID',
    dataIndex: 'sid',
  },
  {
    title: '账号名称',
    dataIndex: 'nickname',
    ellipsis: false,
  },
  {
    title: '账号头像',
    dataIndex: 'avatar',
    customRender({ text, record }: Recordable) {
      if (record.srcType === 'video') {
        text += '?x-oss-process=video/snapshot,t_100,f_jpg,w_0,h_0,m_fast';
      }
      return h(TableImg, {
        size: 60,
        imgList: [text],
      });
    },
  },
  {
    title: '账号类型',
    dataIndex: 'type',
    customRender({ text }) {
      return (
        {
          [UsersType.official]: '官方账号',
          [UsersType.personal]: '个人账号',
        }[text] || '-'
      );
    },
  },
  {
    title: '账号描述',
    dataIndex: 'description',
    width: 250,
  },
  {
    title: '关联商品数',
    dataIndex: 'goods',
    customRender({ record }: Recordable) {
      const value = record.counter || {};
      return value?.numOfGoods;
    },
  },
  {
    title: '内容数',
    dataIndex: 'content',
    customRender({ record }: Recordable) {
      const value = record.counter || {};
      return value?.numOfArticles;
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    customRender({ text }: Recordable) {
      return h(Tag, { color: stateColors(text) }, () => stateNames[text]);
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'nickname',
    label: '账号名称',
    component: 'Input',
  },
  {
    field: 'type',
    label: '账号类型',
    component: 'Select',
    componentProps: {
      options: AccountStatus,
    },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'nickname',
    label: '账号名称',
    componentProps: {
      maxlength: 20,
      showCount: true,
    },
    component: 'Input',
  },
  {
    required: true,
    field: 'avatar',
    label: '账号头像',
    component: 'FileUpload',
    rules: [{ required: true, message: '请上传展头像' }],
  },
  {
    required: true,
    field: 'type',
    label: '账号类型',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '官方账号', value: UsersType.official },
        { label: '个人账号', value: UsersType.personal },
      ],
    },
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
    field: 'description',
    label: '账号描述',
    component: 'InputTextArea',
    componentProps: {
      rows: 3,
      placeholder: '请输入账号描述',
      maxlength: 99,
      showCount: true,
    },
  },
];
