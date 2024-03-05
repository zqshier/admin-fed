import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IProductsListItem } from '/@/api/app/model/uicodeModel';
import { productsList } from '/@/api/app/uicode';

export const useProductStore = defineStore('product-store', () => {
  const products = ref<Map<string, IProductsListItem>>(new Map());

  async function load() {
    if (products.value.size) return;
    const { list } = await productsList({ page: 1, perPage: 1000 });
    for (const o of list) {
      products.value.set(o.barcode, o);
    }
  }

  async function findProduct(barcode: string) {
    let product = products.value.get(barcode);
    if (!product) {
      const { list } = await productsList({ barcode, page: 1, perPage: 1 });
      if (list.length) {
        product = list[0];
        products.value.set(product.barcode, product);
      }
    }
    return product;
  }

  return { load, findProduct };
});
