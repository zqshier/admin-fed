import { ref } from 'vue';
import { IMission } from '/@/api/app/model/missionModel';

export enum MissionEnum {
  daily = 'daily',
  lifetime = 'lifetime',
}

export enum MissionCodeEnum {
  signin = 'signin',
  share = 'share',
  saveimage = 'saveimage',
  invitemember = 'invitemember',
  subwxoa = 'subwxoa',
  userinfo = 'userinfo',
}

// export interface IMission {
//   id: number;
//   type: MissionEnum;
//   code: MissionCodeEnum;
//   name: string;
//   image: string;
//   desc: string;
//   action: 'signin';
//   condition: 1;
//   times: 1;
//   points: 50;
//   disabled: boolean;
//   position: 0;
//   title?: string;
// }

export const memberMissionList = ref<IMission[]>([
  // {
  //   code: 'm1',
  //   type: MissionEnum.Point,
  //   title: '会员信息',
  //   enabled: true,
  //   desc: '',
  //   point: 20,
  // },
  // {
  //   code: 'm2',
  //   type: MissionEnum.Point,
  //   title: '关注公众号',
  //   enabled: true,
  //   desc: '',
  //   point: 20,
  // },
]);

export const dailyMissionList = ref<IMission[]>([
  // {
  //   code: 'd1',
  //   type: MissionEnum.Point,
  //   title: '每日签到',
  //   enabled: true,
  //   desc: '',
  //   point: 50,
  // },
  // {
  //   code: 'd2',
  //   type: MissionEnum.Point,
  //   title: '分享',
  //   enabled: true,
  //   desc: '',
  //   point: 50,
  // },
  // {
  //   code: 'd3',
  //   type: MissionEnum.Point,
  //   title: '日签',
  //   enabled: true,
  //   desc: '',
  //   point: 50,
  // },
  // {
  //   code: 'd4',
  //   type: MissionEnum.Invite,
  //   title: '邀请新朋友',
  //   enabled: true,
  //   desc: '',
  //   point: 50,
  //   invite: 1,
  //   inviteMax: 3,
  // },
]);
