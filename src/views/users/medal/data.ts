import { formatToDateTime } from '/@/utils/dateUtil';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { Popconfirm, Switch } from 'ant-design-vue';
import { medalsConfigsGroup } from '/@/api/app/medals';
import { EMedalsConfigsGroup } from '/@/api/app/model/medalsModel';

export const primaryKey = 'group';
export const pageTitle = '会员勋章';

const demandOptions = [
  { label: '商品品类下单', value: EMedalsConfigsGroup.goodskindorder },
  { label: '商品评分', value: EMedalsConfigsGroup.goodsrate },
  { label: '商品收藏', value: EMedalsConfigsGroup.goodsfavorite },
  { label: '商品分享', value: EMedalsConfigsGroup.goodsshare },
  { label: '连续签到', value: EMedalsConfigsGroup.signin },
  { label: '扫码验真', value: EMedalsConfigsGroup.scancode },
  { label: '积分兑换', value: EMedalsConfigsGroup.pointorder },
  { label: '好友邀请', value: EMedalsConfigsGroup.invitemember },
  { label: '活动参与', value: EMedalsConfigsGroup.joinactivity },
  { label: '调查问卷', value: EMedalsConfigsGroup.questionanswer },
  { label: '年度挚友', value: EMedalsConfigsGroup.annualmember },
];

//表格列配置
export const columns: BasicColumn[] = [
  { title: '勋章序号', dataIndex: 'idx' },
  { title: '勋章主题名称', dataIndex: 'topic' },
  {
    title: '勋章要求',
    dataIndex: 'group',
    customRender: ({ text }: Recordable) =>
      demandOptions.find((i) => i.value === text)?.label || '',
  },
  { title: '勋章数量', dataIndex: 'total' },
  {
    title: '是否上下架',
    dataIndex: 'disabled',
    width: 150,
    customRender: ({ record }: Recordable) => {
      return h(
        Popconfirm,
        {
          title: `确定要${!!!record.disabled ? '下架' : '上架'}吗？`,
          onConfirm: () => {
            const disabled = !!!record.disabled;
            return medalsConfigsGroup({ disabled, group: record.group, subgroup: record.subgroup })
              .then(() => {
                record.disabled = disabled;
              })
              .catch(() => (record.disabled = false));
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
  { title: '排序', dataIndex: 'sort', edit: true, width: 150 },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'topic',
    label: '勋章主题名称',
    component: 'Input',
    componentProps: { maxlength: 30, showCount: true },
  },
  {
    required: true,
    field: 'group',
    label: '勋章要求',
    component: 'Select',
    componentProps: { options: demandOptions },
  },
  {
    required: true,
    field: 'grantTips',
    label: '未完成按钮展示',
    component: 'Input',
    componentProps: { maxlength: 10, showCount: true },
  },
  {
    field: 'link',
    label: '跳转路径',
    component: 'Input',
    componentProps: { maxlength: 99, showCount: true },
  },
  {
    required: true,
    field: 'year',
    label: '选择年份',
    component: 'DatePickerEx',
    componentProps: { picker: 'year', format: 'YYYY' },
    ifShow: ({ values }) => values.group === EMedalsConfigsGroup.annualmember,
  },
  {
    required: true,
    field: 'kindId',
    label: '选择品类',
    component: 'Input',
    slot: 'kindsSlot',
    ifShow: ({ values }) => values.group === EMedalsConfigsGroup.goodskindorder,
  },
  {
    field: 'medals',
    label: ' ',
    slot: 'demandSlot',
    component: 'Input',
    ifShow: ({ values }) => !!values.group,
    rules: [
      {
        validator: (_, value) => {
          // console.error('value', value);
          // 排除没有数据的校验
          if (!value?.length) return;
          let falg = true;
          let countFalg = true;
          value.forEach((item, index) => {
            if (
              !(
                item?.name &&
                (item?.condition?.count || item?.condition?.level) &&
                item?.description &&
                item?.image1 &&
                item?.image2
              )
            )
              falg = false;

            // 校验完成条件
            let preVal,
              cVal = '';
            if (index && item?.condition?.count) {
              preVal = value[index - 1].condition?.count;
              cVal = item?.condition?.count;
              if (cVal < preVal) countFalg = false;
            }
          });
          if (!falg) return Promise.reject('请完善勋章要求列表');
          if (!countFalg)
            return Promise.reject('每行完成条件数值，都需要比上一行的数值大，请重新检查');
          return Promise.resolve();
        },
        // message: '请完善勋章要求列表',
      },
    ],
  },
];
export const recordColumns: BasicColumn[] = [
  { title: '勋章主题名称', dataIndex: 'topic' },
  { title: '勋章名称', dataIndex: 'name' },
  // { title: '完成条件', dataIndex: 'wctj' },
  {
    title: '用户ID',
    dataIndex: 'userId',
    customRender({ value }) {
      if (!value) return '';
      return h(OperatorInfo, {
        id: value,
        type: 'user',
        showType: false,
        block: true,
        showId: true,
      });
    },
  },
  {
    title: '获取时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
];

//搜索表单配置
export const recordSearchFormSchema: FormSchema[] = [
  { field: 'userId', label: '用户ID/手机号', component: 'Input' },
  { field: 'topic', label: '勋章主题名称', component: 'Input' },
  { field: 'name', label: '勋章名称', component: 'Input' },
  {
    field: '[createdAtStart,createdAtEnd]',
    label: '获取时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
];
