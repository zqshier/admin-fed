<template>
  <a-button type="link" :style="{ ...blockStyle, ...props.style }" @click="handleView">
    <span v-if="showType">{{ typeNames[type] }}: </span>
    <span>{{ name }}</span>
  </a-button>
  <AddTagsModal @register="registerAddTagsModal" />
  <PointsModal @register="registerPointsModal" />
  <CouponModal @register="registerCouponModal" />
  <Drawer @register="registerDrawer" />
</template>

<script lang="ts" setup>
  import { Modal } from 'ant-design-vue';
  import { computed, withDefaults } from 'vue';
  import { useRequest } from 'vue-request';
  import AddTagsModal from '../users/list/components/AddTagsModal.vue';
  import CouponModal from '../users/list/components/CouponModal.vue';
  import PointsModal from '../users/list/components/PointsModal.vue';
  import Drawer, { ActionsType } from '../users/list/drawer.vue';
  import { guidesInfo } from '/@/api/app/stores';
  import { updateUserStatus, userDetail } from '/@/api/app/users';
  import { getStaffInfo } from '/@/api/sys/user';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';

  interface Props {
    type: string;
    id: number;
    showType?: boolean; // 是否显示类型
    showId?: boolean; // 是否显示ID
    style?: any;
    block?: boolean;
    field?: string; // 显示字段
  }

  const props = withDefaults(defineProps<Props>(), {
    showType: true,
    showId: false,
    style: {},
    block: false,
    field: 'name',
  });

  const blockStyle = computed(() => {
    return (props.block && { padding: 0, height: 'auto', lineHeight: 'initial' }) || {};
  });

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerAddTagsModal, { openModal: openAddTagsModal }] = useModal();
  const [registerPointsModal, { openModal: openPointsModal }] = useModal();
  const [registerCouponModal, { openModal: openCouponModal }] = useModal();

  const typeNames = {
    user: '用户',
    guide: '导购',
    manager: '管理员',
  };

  const req = async (type: string, id: number) => {
    switch (type) {
      case 'user': {
        const res = await userDetail(props.id);
        return { ...res, name: res.nickname || res.name };
      }

      case 'guide': {
        const res = await guidesInfo(props.id);
        return { ...res };
      }

      case 'manager': {
        const res = await getStaffInfo(props.id);
        return { ...res, name: res.nickname || '' };
      }

      default:
        return { name: `${type}: ${id}` };
    }
  };

  const { data } = useRequest(() => req(props.type, props.id), {
    cacheKey: `user:info:${props.id}`,
    cacheTime: 1200 * 1000,
    refreshDeps: [() => props.type, () => props.id],
  });

  const name = computed(() => {
    const val = data.value?.[props.field];
    if (props.showId) {
      return val ? `${val}(${props.id})` : props.id;
    }
    return val;
  });

  function handleDetailAction(action: ActionsType, userId: number, nickname: string) {
    const data: Recordable = {
      record: {
        userIds: [userId],
        params: {},
        total: 0,
        info: { userId, nickname },
      },
    };
    return new Promise((resolve) => {
      data.record.resolve = () => resolve(action);
      switch (action) {
        case 'tag':
          openAddTagsModal(true, data);
          break;
        case 'coupon':
          openCouponModal(true, data);
          break;
        case 'point':
          openPointsModal(true, data);
          break;
        case 'erase':
          openEarse(data);
          break;
      }
    });
  }

  function openEarse(data: Recordable) {
    Modal.confirm({
      title: '提醒',
      content: '确认要注销该用户吗，注销后该用户积分、优惠券将全部清空',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        console.debug('注销用户', data);
        await updateUserStatus(data.record.userIds[0], 2);
        data.record.resolve?.();
      },
    });
  }

  function handleView() {
    if (!props.id) return;
    openDrawer(true, { record: { id: props.id, handle: handleDetailAction } });
  }
</script>
