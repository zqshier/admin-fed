import { formatToDateTime } from '/@/utils/dateUtil';
import { addHours, endOfToday, startOfToday } from 'date-fns';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IStagingItem, IStagingListParams, IStagingStatus } from '/@/api/app/model/uicodeModel';
import { stagingList, stagingBatchUpdate, stagingCreate } from '/@/api/app/uicode';

interface IRootStagingItem extends IStagingItem {
  childrenNum: number;
}

const setup = (status: IStagingStatus) => () => {
  const rows = ref<IStagingItem[]>([]);
  const keyOf = (row: IStagingItem) => `${row.distributorCode}-${row.productCode}`;
  const childTableRows = computed(() => (row: IStagingItem) => {
    const key = keyOf(row);
    return rows.value.filter((o) => keyOf(o) === key);
  });
  const rootTableRows = computed(() => {
    const set = new Set<string>();
    const res: IRootStagingItem[] = [];
    for (const row of rows.value) {
      const key = keyOf(row);
      if (set.has(key)) continue;
      set.add(key);
      res.push({ ...row, childrenNum: childTableRows.value(row).length });
    }
    return res;
  });

  const rowsTotal = computed(() => rows.value.length);
  const productTotal = computed(() => new Set(rows.value.map((o) => o.productCode)).size);
  const lastTime = computed(
    (): string => (rows.value[0]?.updatedAt && formatToDateTime(rows.value[0]?.updatedAt)) || '',
  );

  async function load() {
    rows.value.splice(0, rows.value.length);
    const end = status === IStagingStatus.pending ? new Date() : endOfToday();
    const start = status === IStagingStatus.pending ? addHours(end, -24) : startOfToday();
    const params: IStagingListParams = { start, end, status };
    const result = await stagingList(params).catch((err) => {
      console.error('getListApi err=', err);
      return { list: [], total: 0 };
    });

    rows.value.push(...result.list);
  }

  async function addRow(sn: string, productCode) {
    const row = await stagingCreate({ sn, productCode });
    rows.value.push(row);
    return row;
  }

  async function deleteRow(row: IStagingItem, all = false) {
    const key = keyOf(row);
    const ids = all ? rows.value.filter((o) => keyOf(o) === key).map((item) => item.id) : [row.id];
    try {
      await stagingBatchUpdate({ ids, status: IStagingStatus.deleted });
    } catch (err) {
      console.error('deleteRow err=', err);
      return;
    }

    for (const id of ids) {
      const idx = rows.value.findIndex((item) => item.id === id);
      if (idx > -1) rows.value.splice(idx, 1);
    }
  }

  function findRow(sn: string) {
    return rows.value.find((o) => o.sn === sn);
  }

  return {
    rows,
    rootTableRows,
    childTableRows,
    rowsTotal,
    productTotal,
    lastTime,
    load,
    addRow,
    deleteRow,
    findRow,
  };
};

export const useStagingPendingStore = defineStore(
  'staging-pending-store',
  setup(IStagingStatus.pending),
);

export const useStagingCommitedStore = defineStore(
  'staging-commited-store',
  setup(IStagingStatus.commited),
);
