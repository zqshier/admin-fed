import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { store } from '/@/store';

export interface PageStoreModel {
  preData?: Recordable | null; //上一页数据
}

export const usePageStore = defineStore('page', () => {
  const appInfo = reactive<PageStoreModel>({
    preData: null,
  });

  return {
    getPreData: () => {
      const data = appInfo.preData;
      appInfo.preData = null;
      return data;
    },
    setPreData: (data: Recordable | null) => {
      appInfo.preData = data;
    },
  };
});

export const usePageStoreOut = () => {
  return usePageStore(store);
};
