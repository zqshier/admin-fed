<template>
  <div class="flex items-center text-left" v-if="info.id">
    <ScaleImage class="mr-2" :size="60" :src="info.image" mode="cover" />
    <span :style="{ 'word-break': 'break-all', 'white-space': 'pre-line' }">{{ info.name }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { ref, watch, withDefaults } from 'vue';
  import { goodsList } from '/@/api/app/goods';
  import { AriticleRelationType } from '/@/api/app/model/articleModel';
  import { GoodsListItem } from '/@/api/app/model/goodsModel';
  import ScaleImage from '/@/views/components/ScaleImage.vue';

  interface Props {
    goodsIds: number[] | null;
    relations: {
      v: any;
      type: AriticleRelationType;
    }[];
  }

  const props = withDefaults(defineProps<Props>(), {
    goodsIds: null,
  });

  const info = ref<GoodsListItem>({} as any);

  async function loadInfo() {
    const goodsIds = props.relations.map((item) => {
      if (item.type === 'goods' && typeof item.v === 'number') return item.v;
    });
    // const goodsIds = [128];
    if (!goodsIds) return;
    const { list } = await goodsList({
      ids: goodsIds as number[],
      perPage: 10,
      page: 1,
    });
    if (isEmpty(list)) return;
    info.value = list.shift() as GoodsListItem;
  }

  loadInfo();

  watch(
    () => [props.relations],
    () => loadInfo(),
  );
</script>
