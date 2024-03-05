<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看详情" :isDetail="true">
    <div class="top-info">
      <div class="title">
        <span class="txt">退款状态:</span>
        <Tag v-if="status" :color="status.color">{{ status.label }}</Tag>
      </div>
    </div>
    <div style="max-width: 1000px">
      <Description
        size="middle"
        :bordered="false"
        :column="3"
        :data="dataInfo"
        :schema="detailBaseSchema"
      />
    </div>

    <CollapseContainer title="详情" v-if="dataInfo.goodsInfo">
      <div class="row-wrap">
        <div class="row-con">
          <div class="title">退款商品</div>
          <div class="con">
            <div class="goods-info">
              <div class="pic">
                <a-image :src="dataInfo.goodsInfo.image" :width="60" :height="60" />
              </div>
              <div class="info">
                <div class="name">{{ dataInfo.goodsInfo.name }}</div>
                <div class="sku">{{ dataInfo.goodsInfo.skuSn }}</div>
                <div class="sku"
                  >{{
                    dataInfo.goodsInfo.comb && dataInfo.goodsInfo.comb.length
                      ? dataInfo.goodsInfo.comb.map((item) => item.v).join(', ')
                      : '单规格'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row-con">
          <div class="title">退款信息</div>
          <div class="con">
            <Description
              size="middle"
              :bordered="false"
              :column="1"
              :data="dataInfo"
              :schema="detailRefundSchema"
            />
          </div>
        </div>
        <div class="row-con">
          <div class="title">备注信息</div>
          <div class="con">
            <Description
              size="middle"
              :bordered="false"
              :column="1"
              :data="dataInfo"
              :schema="detailRefundExtendInfoSchema"
            />
            <div v-if="dataInfo?.extendInfo">
              <div class="title">退款图:</div>
              <div class="pic-row">
                <div v-for="(item, index) in dataInfo.extendInfo.images" :key="index">
                  <div style="">
                    <a-image
                      :src="item"
                      :width="60"
                      :height="60"
                      :style="{ width: '61px', height: '61px' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row-con">
          <div class="title">退款物流</div>
          <div class="con">
            <Description
              size="middle"
              :bordered="false"
              :column="1"
              :data="dataInfo"
              :schema="detailRefundLogisticSchema"
            />
          </div>
        </div>
      </div>
    </CollapseContainer>
    <CollapseContainer title="退款记录" v-if="dataInfo.goodsInfo">
      <div class="timeline-wrap">
        <a-timeline>
          <a-timeline-item color="green" v-for="log in dataInfo.logs" :key="log.id">
            <div class="timeline-con">
              <div>{{ getLogAction(log) }}</div>
              <div class="pl-2 pt-2" v-if="log.action === 'create'">
                <Description
                  size="middle"
                  :bordered="false"
                  :column="1"
                  :data="log"
                  :schema="detailApplySchema"
                />
              </div>
              <div class="time">{{ timeRender({ text: log.createdAt }) }}</div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </div>
    </CollapseContainer>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import {
    detailBaseSchema,
    detailRefundSchema,
    ServiceStatusOptions,
    detailApplySchema,
    detailRefundExtendInfoSchema,
    timeRender,
    detailRefundLogisticSchema,
  } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {
    Tag,
    Image as AImage,
    Timeline as ATimeline,
    TimelineItem as ATimelineItem,
  } from 'ant-design-vue';
  import { aftersaleDetail } from '/@/api/app/orders';
  import { Description } from '/@/components/Description';
  import { CollapseContainer } from '/@/components/Container';

  defineEmits(['success', 'register']);

  const dataInfo = ref<Recordable>({ buyerPhone: '', logs: [] });

  const status = computed(() => {
    if (!dataInfo.value.id) {
      return null;
    }
    return ServiceStatusOptions.find((item) => item.value === dataInfo.value.status);
  });

  function getLogAction(log: Recordable) {
    // 填写地址 'fill_shipment',售后单创建 'create',拒绝退款 'refuse',同意退款 'approve',拒绝退货收货'reject_shipment',接受退货收货 'accept_shipment',取消售后单 'cancel',退款到账 refund_success
    let txt = (log.operatorInfo && log.operatorInfo.name) || '-';
    switch (log.action) {
      case 'create':
        txt += '发起了退款申请';
        break;
      case 'refuse':
        txt += '拒绝退款';
        break;
      case 'fill_shipment':
        txt += '用户填写了物流信息';
        break;
      case 'approve':
        txt += '同意退款';
        break;
      case 'reject_shipment':
        txt += '拒绝退货收货';
        break;
      case 'accept_shipment':
        txt += '接受退货收货';
        break;
      case 'cancel':
        txt += '取消售后单';
        break;
      case 'refund_success':
        txt += '退款到账';
        break;
    }
    return txt;
  }

  //弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    try {
      dataInfo.value = Object.assign(dataInfo.value, data.record);
      setDrawerProps({ loading: true });
      const result = await aftersaleDetail(data.record.afterSaleNo);
      // console.log(result);
      if (result.logs) {
        result.logs = result.logs.reverse();
      }
      dataInfo.value = result;
    } finally {
      setDrawerProps({ loading: false });
    }
  });
</script>

<style lang="less" scoped>
  .top-info {
    margin-bottom: 20px;

    .title {
      font-size: 20px;
      display: flex;
      align-items: center;

      .txt {
        margin-right: 10px;
      }
    }
  }

  .row-wrap {
    display: flex;

    .row-con {
      width: 400px;
      margin-right: 20px;

      .title {
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
      }
    }
  }

  .goods-info {
    display: flex;

    .pic {
      margin-right: 10px;

      img {
        object-fit: scale-down;
      }
    }

    .info {
      text-align: left;
    }
  }

  .pic-row {
    display: flex;
    flex-wrap: wrap;
  }

  .timeline-wrap {
    padding: 20px;
  }

  .timeline-con {
    max-width: 800px;

    .time {
      font-size: 13px;
    }
  }
</style>
