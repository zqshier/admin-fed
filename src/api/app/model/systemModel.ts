import { BasicFetchResult } from '/@/api/model/baseModel';

export interface DeliveryTemplatesRule {
  regions?: string[]; //地区编码

  firstFee?: number; //首件/重(费用)

  firstAmount?: number; //首件/重

  additionalFee?: number; //续件/重(费用)

  additionalAmount?: number; //续件/重

  key?: string;
}

export interface DeliveryTemplates {
  name: string; //模板名称

  threshold: number; //包邮金额

  valuationType: 1 | 2; //计费模式, 1 按件, 2 重量

  valuationRules: DeliveryTemplatesRule[]; //规则

  id?: number; // 模板ID

  createdAt?: string; //创建时间

  updatedAt?: string; // 修改时间
}

export type DeliveryTemplatesGetResultModel = BasicFetchResult<DeliveryTemplates>;

export interface MenuModel {
  id?: number;
  title?: string; //菜单名

  perm?: string; //权限标识

  order?: number; //顺序

  parentId?: number; //父级Id ⤵

  icon?: string; //图标

  description?: string; //描述

  scope?: number; //类型 1 组织菜单, 2 App 菜单 ⤵
}
