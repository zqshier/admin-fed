import { defHttp, downloadLink } from '/@/utils/http/axios';
import {
  CatalogParams,
  GoodsParams,
  GoodsListGetResultModel,
  CatalogsListItem,
  CatalogsListGetResultModel,
  SkuItem,
  SkuValueItem,
  GoodsInfo,
  GoodsDetailParams,
  SkuListGetResultModel,
  SkuListParams,
  SkuUpdateParams,
  GoodsStatusBatchParams,
  GoodsCatalogBatchParams,
  PropertiesListParams,
  PropertiesListItemGetResultModel,
  PropertiesParams,
  PropertiesListItem,
  RatingListParams,
  RatingListItemGetResultModel,
  RatingParams,
  RelevanceItemParams,
  RelevanceItemParamsGetResultModel,
  RatingRecordParams,
  RatingRecordListItemGetResultModel,
  FavoritesListParams,
  FavoritesItemGetResultModel,
  IKindsListParams,
  IKindsItemGetResultModel,
  IKindsListItem,
  IKindsParams,
} from './model/goodsModel';
import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  GOODS = '/api/pt/app/gms/goods',
  GOODS_STATUS_BATCH = '/api/pt/app/gms/goods/status/batch',
  GOODS_CATALOG_BATCH = '/api/pt/app/gms/goods/catalog/batch',
  CATALOGS = '/api/pt/app/gms/catalogs',
  SKU_KEYS = '/api/pt/app/gms/sku/keys',
  SKU_KEYS_VALUES = '/api/pt/app/gms/sku/keys/{keyId}/values',
  SKU_LIST = '/api/pt/app/gms/sku/list',
  SKU_UPDATE = '/api/pt/app/gms/sku/{id}',
  SKU_STOCK_LIST = '/api/pt/app/gms/sku/stocks',
  PROPERTIES = '/api/pt/app/gms/properties',
  RATING = '/api/pt/app/item-rating',
  FAVORITES = '/api/pt/app/favorites',
  KINDS = '/api/pt/app/gms/kinds',
}

// 商品列表
export const goodsList = (params: GoodsParams) => {
  const { ids, ...others } = params;
  return defHttp.get<GoodsListGetResultModel>(
    { url: Api.GOODS, params: { ...others, ids: ids?.join(',') } },
    { errorMessageMode: 'none' },
  );
};

// 商品分组列表
export const catalogsList = (params: CatalogParams) =>
  defHttp.get<CatalogsListGetResultModel>(
    { url: Api.CATALOGS, params },
    { errorMessageMode: 'none' },
  );

// 新建分组
export const catalogsCreate = (data: CatalogsListItem) => defHttp.post({ url: Api.CATALOGS, data });

// 更新分组
export const catalogsUpdate = (id: number, data: CatalogsListItem) =>
  defHttp.put({ url: `${Api.CATALOGS}/${id}`, data });

// 删除分组
export const catalogsDelete = (id: number) => defHttp.delete({ url: `${Api.CATALOGS}/${id}` });

//预设规格名:新增
export const skuKeysCreate = (name: string) =>
  defHttp.post<SkuItem>({ url: Api.SKU_KEYS, data: { name } });

//预设规格值:新增
export const skuKeysValuesCreate = (name: string, keyId: number) =>
  defHttp.post<SkuValueItem>({
    url: Api.SKU_KEYS_VALUES.replace('{keyId}', keyId + ''),
    data: { name },
  });

//商品新增
export const goodsCreate = (data: GoodsInfo) => defHttp.post({ url: Api.GOODS, data });

//商品更新
export const goodsUpdate = (id: number, data: GoodsInfo) =>
  defHttp.put({ url: `${Api.GOODS}/${id}`, data });

//商品详情
export const goodsInfo = (id: number) => defHttp.get({ url: `${Api.GOODS}/${id}` });

//商品详情页更新
export const goodsDetailUpdate = (id: number, data: GoodsDetailParams) =>
  defHttp.post({ url: `${Api.GOODS}/${id}/details`, data });

//商品详情页
export const goodsDetail = (id: number) => defHttp.get({ url: `${Api.GOODS}/${id}/details` });

//商品状态更新 1 上架, 2 下架
export const goodsStatusUpdate = (id: number, status: 1 | 2) =>
  defHttp.put({ url: `${Api.GOODS}/${id}/status`, data: { saleStatus: status } });

//商品:调整顺序
export const goodsPositionUpdate = (id: number, position: string | number) =>
  defHttp.put({ url: `${Api.GOODS}/${id}/position`, data: { position } });

//商品:批量设置状态
export const goodsStatusUpdateBatch = (data: GoodsStatusBatchParams) =>
  defHttp.post({ url: `${Api.GOODS_STATUS_BATCH}`, data });

//商品:批量增加分组
export const goodsCatalogUpdateBatch = (data: GoodsCatalogBatchParams) =>
  defHttp.post({ url: `${Api.GOODS_CATALOG_BATCH}`, data });

// SKU列表
export const skuList = (params: SkuListParams) =>
  defHttp.get<SkuListGetResultModel>(
    { url: Api.SKU_LIST, params: { ...params, skuIds: params.skuIds?.join(',') } },
    { errorMessageMode: 'none' },
  );

// SKU更新
export const skuUpdate = (id: number, data: SkuUpdateParams) =>
  defHttp.put({ url: Api.SKU_UPDATE.replace('{id}', id + ''), data });

// SKU 库存列表
export const skuStockList = (params: SkuListParams) =>
  defHttp.get<SkuListGetResultModel>(
    { url: Api.SKU_STOCK_LIST, params: { ...params, withStores: true } },
    { errorMessageMode: 'none' },
  );

export const skuStockUpdate = (skuId: number, storeCode: string, stock: number) =>
  defHttp.put(
    { url: Api.SKU_STOCK_LIST, data: { storeCode, skuId, stock } },
    { errorMessageMode: 'none' },
  );

// 商品参数列表
export const propertiesList = (params: PropertiesListParams) =>
  defHttp.get<PropertiesListItemGetResultModel>(
    { url: Api.PROPERTIES, params },
    { errorMessageMode: 'none' },
  );

//商品参数新增
export const propertiesCreate = (data: PropertiesParams) =>
  defHttp.post<PropertiesListItem>({ url: Api.PROPERTIES, data });

//商品参数更新
export const propertiesUpdate = (id: number, data: PropertiesParams) =>
  defHttp.put<PropertiesListItem>({ url: `${Api.PROPERTIES}/${id}`, data });

// 删除商品参数
export const propertiesDelete = (id: number) => defHttp.delete({ url: `${Api.PROPERTIES}/${id}` });

// 评分配置列表
export const ratingList = (params: RatingListParams) =>
  defHttp.get<RatingListItemGetResultModel>(
    { url: `${Api.RATING}/configs`, params },
    { errorMessageMode: 'none' },
  );

//评分配置新增
export const ratingCreate = (data: RatingParams) =>
  defHttp.post<PropertiesListItem>({ url: `${Api.RATING}/configs`, data });

//评分配置更新
export const ratingUpdate = (id: number, data: RatingParams) =>
  defHttp.put<PropertiesListItem>({ url: `${Api.RATING}/configs/${id}`, data });

// 获取已被关联商品
export const relevanceItemList = (params: RelevanceItemParams) =>
  defHttp.get<RelevanceItemParamsGetResultModel>(
    {
      url: `${Api.RATING}/get-relevance-item`,
      params: { ...params, itemIds: params.itemIds.join(',') },
    },
    { errorMessageMode: 'none' },
  );

// 评分配置列表
export const ratingRecordList = (params: RatingRecordParams) =>
  defHttp.get<RatingRecordListItemGetResultModel>(
    { url: `${Api.RATING}/record-list`, params },
    { errorMessageMode: 'none' },
  );

export const ratingRecordExport = async (params: RatingRecordParams) => {
  // const res = await defHttp.get(
  //   { url: `${Api.RATING}/record-export`, params, responseType: 'blob', timeout: 30 * 60 * 1000 },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出评分记录.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(`${Api.RATING}/record-export`, params);
  downloadByUrl({ url });
};

// 商品收藏列表
export const favoritesList = (params: FavoritesListParams) =>
  defHttp.get<FavoritesItemGetResultModel>(
    { url: Api.FAVORITES, params },
    { errorMessageMode: 'none' },
  );

// 商品品类:列表
export const kindsList = (params: IKindsListParams) =>
  defHttp.get<IKindsItemGetResultModel>({ url: Api.KINDS, params }, { errorMessageMode: 'none' });

// 商品品类:创建
export const kindsCreate = (data: IKindsParams) =>
  defHttp.post<IKindsListItem>({ url: Api.KINDS, data });

// 商品品类:更新
export const kindsUpdate = (id: number, data: IKindsParams) =>
  defHttp.put<IKindsListItem>({ url: `${Api.KINDS}/${id}`, data });

// 商品品类:删除
export const kindsDelete = (id: number) => defHttp.delete({ url: `${Api.KINDS}/${id}` });

// 商品品类:绑定商品
export const kindsBind = (data: { itemIds: number[]; kindId: number }) =>
  defHttp.post({ url: `${Api.KINDS}/bind`, data });
