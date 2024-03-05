import { Popconfirm, Switch } from 'ant-design-vue';
import { format } from 'date-fns';
import { isEmpty } from 'lodash-es';
import { h } from 'vue';
import { MissionCodeEnum, MissionEnum } from '/@/api/app/model/missionModel';
import { missionsGroupsUpdate } from '/@/api/app/mission';
import { BasicColumn, FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '关联奖池';

export enum RewardType {
  point = 'point',
  lotteryTicket = 'lotteryTicket',
}

export interface IMission {
  type: MissionEnum;
  code: MissionCodeEnum;
  name: string;
  image: string;
  desc: string;
  condition: number;
  times: number;
  timesTotal: number;
  points: number;
  rewardType: RewardType;
  rewardId: string;
  rewardValue: string;
  action: string;
  disabled: boolean;
  isClient: boolean;
  position: 0;
  meta: {
    inviteeRewardValue: number;
  };
  link: string;
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'relatedId',
    width: 150,
  },
  {
    title: '关联奖池名称',
    dataIndex: 'name',
  },
  {
    title: '是否上下架',
    dataIndex: 'disabled',
    width: 150,
    customRender: ({ record }: any) => {
      return h(
        Popconfirm,
        {
          title: `确定要${!!!record.disabled ? '下架' : '上架'}吗？`,
          onConfirm: () => {
            const disabled = !!!record.disabled;
            return missionsGroupsUpdate({ id: record.id, params: { disabled } })
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
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'awards',
    label: '关联奖池',
    component: 'Input',
    slot: 'awards',
    defaultValue: {},
    rules: [
      {
        validator: (_, value) => {
          // console.debug('value', value);
          if (!value || !value.id) {
            return Promise.reject('请配关联奖池');
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: true,
    field: 'mission',
    label: '抽奖任务',
    component: 'Input',
    slot: 'mission',
    itemProps: { autoLink: false },
    rules: [
      {
        validator: (_, value) => {
          // console.debug(value);
          if (!value || !value.length) {
            return Promise.reject('请配置抽奖任务');
          }
          let disabledNum = 0;
          for (const item of value) {
            if (item.disabled === false) {
              for (const key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                  let itm = item[key];
                  if (typeof itm === 'number') itm = itm + '';
                  if (key !== 'disabled' && isEmpty(itm)) {
                    return Promise.reject(`请配置完善抽奖任务信息: ${key}`);
                  }
                }
              }
            } else {
              disabledNum++;
            }
          }
          if (value.length === disabledNum) {
            return Promise.reject('请选择抽奖任务');
          }
          return Promise.resolve();
        },
      },
    ],
  },
];

export const inviteColumns: BasicColumn[] = [
  {
    title: '邀请人ID',
    dataIndex: 'memberFromUserId',
    width: 150,
  },
  {
    title: '邀请人手机号',
    dataIndex: 'memberFromUserPhone',
    customRender({ text }) {
      return (text && text.phone) || '';
    },
  },
  {
    title: '受邀人ID',
    dataIndex: 'id',
  },
  {
    title: '受邀人手机号',
    dataIndex: 'phone',
    customRender({ text }) {
      return (text && text.phone) || '';
    },
  },
  {
    title: '受邀人注册会员时间',
    dataIndex: 'memberCreatedAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'fromUserId',
    label: '邀请人ID/手机号',
    component: 'Input',
  },
  {
    field: 'userId',
    label: '受邀请人ID/手机号',
    component: 'Input',
  },
];
