export interface BasicPageParams {
  /** 当前页，从1开始 */
  page: number;
  /** 每页条数 */
  perPage: number;
}

export interface BasicFetchResult<T> {
  list: T[];
  total: number;
}
