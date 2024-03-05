import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export enum AriticleState {
  pending = 'pending',
  approve = 'approve',
  reject = 'reject',
  delete = 'delete',
}

export enum AriticlePublicType {
  user = 'user',
  admin = 'admin',
}

export type AriticleRelationType = 'goods';

export interface AriticleParams extends BasicPageParams {
  id: number;
  state: AriticleState;
  userId: number;
  userType: string; // 用户类型
  publicType: AriticlePublicType; // 发布方式 user用户 admin后台
  startDate: Date;
  endDate: Date;
  likes: number;
}

export type ContentsDetailType = 'image' | 'video' | 'text';

export interface contentsDetail {
  type: ContentsDetailType;
  content: string;
}

export interface relationsDetail {
  v: any;
  type: AriticleRelationType;
}

export interface AriticleListItem {
  id: number;
  appId: string;
  userId: number;
  title: string;
  text: string; // 正文
  contents: contentsDetail[];
  state: AriticleState;
  relationType: AriticleRelationType;
  relations: relationsDetail[]; // 关联Id
  readCount: number; // 阅读次数
  shareCount: number; // 阅读次数
  publicTime: Date | null; // 发布时间
  publicType: AriticlePublicType; // 发布类型
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}

export type AriticleListResultModel = BasicFetchResult<AriticleListItem>;

export interface AriticleInfo {
  id?: number;
  userId: number;
  userType: string; // 用户类型
  contents: contentsDetail[];
  title: string;
  text?: string; // 正文
  relations: relationsDetail[]; // 关联Id
  publicType: AriticlePublicType; // 发布类型
  deleteContentIds: number[]; // 文章删除id
}

export enum UsersType {
  official = 'official',
  personal = 'personal',
  user = 'user',
}

export enum UsersState {
  disabled = 'disabled',
  enabled = 'enabled',
}

export interface UsersParams extends BasicPageParams {
  type?: UsersType;
  nickname?: string; // 用户类型
  state?: UsersState;
}

export type UsersListResultModel = BasicFetchResult<UsersListItem>;

export interface UsersListGoodsItem {
  type: AriticleRelationType;
  id: number;
  title: string;
  image: string;
}

export interface UsersListCounterItem {
  numOfGoods: number;
  numOfArticles: number;
  numOfLikes: number;
}

export interface UsersListItem {
  id: number;
  userId: number;
  nickname: string;
  avatar: string;
  type: UsersType;
  state: UsersState;
  description: string;
  counter: UsersListCounterItem;
  // createdAt: Date;
  // updatedAt: Date;
  // appId: string;
}

export interface UsersInfo {
  id?: number;
  nickname: string;
  avatar: string;
  type: UsersType;
  state: UsersState;
  description: string;
  goods: UsersListGoodsItem[];
}

export interface IQuestionnaireListParams extends BasicPageParams {
  title: string;
  state: EQuestionnaireState;
}

export enum EQuestionnaireState {
  notStarted,
  processing,
  finished,
}
export enum IQuestionnaireItemType {
  radio = 0,
  checkBox = 1,
}
export interface IQuestionnaireItemOption {
  value: string;
  ext: string;
}

export interface IQuestionnaireItemQuestions {
  // values: any;
  //题目内容
  id?: number; //主键ID
  questionnaireId?: number; //问卷id
  title: string; //题目
  type?: IQuestionnaireItemType; //类型 0:单选 1:多选
  image: string; //图片
  options: IQuestionnaireItemOption[]; //选项
  sort?: number; //排序
  createdAt?: Date; //创建时间
}
export interface IQuestionnaireItem {
  id: number; //主键ID
  title: string; //问卷备注
  start: Date; //开始时间
  end: Date; //结束时间
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
  questions: IQuestionnaireItemQuestions[];
  state: EQuestionnaireState; //问卷状态
  answer_num: number; //完成问卷人数
}
export type IQuestionnaireResultModel = BasicFetchResult<IQuestionnaireItem>;

export interface IQuestionnaireParams {
  title: string; //题目
  start: Date;
  end: Date;
  questions: IQuestionnaireItemQuestions[]; //选项
}

export interface IQuestionnaireRecordListParams extends BasicPageParams {
  questionnaireId: number;
  startAt: Date;
  endAt: Date;
  userId: number;
}

export interface IQuestionnaireRecordItem {
  id: number;
  questionnaireId: number;
  userId: number;
  content: {
    questionId: number;
    answer: [
      {
        key: number;
        value: string;
      },
    ];
  }[];
  createdAt: Date;
}
export type IQuestionnaireRecordItemResultModel = BasicFetchResult<IQuestionnaireRecordItem>;
