<template>
  <div id="amapContainer">地图加载中...</div>
</template>

<script lang="ts" setup>
  import { initAMapApiLoader, lazyAMapApiLoaderInstance } from '@vuemap/vue-amap';
  import { useGlobSetting } from '/@/hooks/setting';
  import { message } from 'ant-design-vue';
  import { nextTick, ref, unref } from 'vue';

  const globSetting = useGlobSetting();
  initAMapApiLoader({
    key: globSetting.amapKey || '',
    securityJsCode: globSetting.amapSecret || '',
  });

  const emit = defineEmits(['change']);

  declare var AMap: any;

  let map: any = null;
  let marker: any = null;
  let placeSearch: any = null;
  const isInit = ref<boolean>(false);

  // 初始化地图
  const initMap = async () => {
    if (unref(isInit)) {
      return;
    }

    await nextTick();

    return new Promise((resolve) => {
      lazyAMapApiLoaderInstance.then(() => {
        map = new AMap.Map('amapContainer', {
          center: new AMap.LngLat(114.057939, 22.543527),
          zoom: 10,
        });
        AMap.plugin('AMap.PlaceSearch', () => {
          placeSearch = new AMap.PlaceSearch();
          isInit.value = true;
          resolve('success');
        });
      });
    });
  };

  // 用地址查经纬度
  const searchAddr = async (addr: string) => {
    console.log('searchAddr');
    await initMap();

    placeSearch.search(addr, (status: any, result: any) => {
      if (status && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
        const poi = result.poiList.pois[0];
        markPoint(poi.location.lng, poi.location.lat);
      } else {
        message.error('没有查询到相关地址');
      }
    });
  };

  // 标记到对应经纬度
  const markPoint = async (lng: number, lat: number) => {
    await initMap();

    if (marker) {
      marker.remove();
    }

    marker = new AMap.Marker({
      position: new AMap.LngLat(0, 0),
      map,
      draggable: true,
      cursor: 'pointer',
      ondragend: () => {
        const lnglat = marker.getPosition();
        console.log(lnglat.lng + ',' + lnglat.lat);
      },
    });

    marker.on('dragend', () => {
      const lnglat = marker.getPosition();
      emit('change', {
        lng: lnglat.lng,
        lat: lnglat.lat,
      });
    });

    const point = new AMap.LngLat(lng, lat);
    marker.setPosition(point);
    map.setCenter(point);
    emit('change', {
      lng,
      lat,
    });
  };

  defineExpose({ searchAddr, markPoint });
</script>

<style lang="less" scoped>
  .amap-container {
    height: 400px;
  }
</style>
