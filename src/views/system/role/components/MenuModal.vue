<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="菜单权限设置"
    :width="500"
    @ok="handleSubmit"
    wrap-class-name="common-modal-wrap"
  >
    <BasicTree ref="treeRef" toolbar checkable search :treeData="treeData" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { ref, toRaw } from 'vue';
  import { menuList as listApi } from '/@/api/app/system';
  import { updateRoles } from '/@/api/sys/role';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree/index';

  const treeData = ref<TreeItem[]>([]);
  const treeRef = ref<Nullable<TreeActionType>>(null);

  let dataInfo: Recordable = {};

  const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data) => {
    if (data) {
      if (data.record) dataInfo = { ...data.record, success: data.success };

      await getData();
      setTimeout(() => {
        treeRef.value?.setCheckedKeys(checkIsSelectPid(dataInfo.menuIds.split(','), '进入') || []);
        treeRef.value?.setExpandedKeys([]);
      }, 100);
    }
  });

  async function getData() {
    const res = await listApi();
    treeData.value = res.app.children.map((item: Recordable) => mapFields(item)) || [];
  }

  function mapFields(item: Recordable) {
    item.children = item.children || [];
    const _item = {
      key: item.id,
      title: item.title,
      children: item.children.map((child: Recordable) => mapFields(child)),
    };
    return _item;
  }

  function checkIsSelectPid(ids: string[], action: '进入' | '提交') {
    console.debug('checkIsSelectPid arg', ids, action);
    if (!treeData.value.length) return;
    for (const item of treeData.value) {
      let count = 0;
      if (action === '进入' && ids.includes(`${item.key}`)) {
        const maxLen = item.children!.length;
        item.children?.forEach((i) => {
          if (ids.includes(`${i.key}`)) count++;
        });
        if (maxLen > count) {
          const dIdx = ids.findIndex((o) => o === `${item.key}`);
          ids.splice(dIdx, 1);
          count = 0;
        }
      }
      if (action === '提交') {
        item.children?.forEach((i) => {
          if (ids.includes(`${i.key}`)) count++;
        });
        if (count > 0) {
          ids.push(`${item.key}`);
          count = 0;
        }
      }
    }
    console.debug('ids after', ids);
    return [...new Set(ids.map(Number).sort((a, b) => a - b))];
  }

  async function handleSubmit() {
    try {
      const menuIds: Recordable = toRaw(treeRef.value?.getCheckedKeys()) || [];
      if (!menuIds.length) return message.warn('未选中任何菜单权限');
      setModalProps({ confirmLoading: true });
      await updateRoles(dataInfo.roleName, {
        appId: dataInfo.appId,
        domainId: dataInfo.domainId,
        menuIds: checkIsSelectPid(menuIds.map(String), '提交'),
      });
      dataInfo.success?.();
      closeModal();
      message.success('菜单权限设置成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
