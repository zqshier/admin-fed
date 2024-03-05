import { ImageUploadGroup } from '/@/components/ImageUploadGroup';
import { h } from 'vue';
import { InputNumber } from 'ant-design-vue';
import { BasicColumn } from '/@/components/Table';
import ImageUpload from '/@/components/ImageUpload/src/ImageUpload.vue';
import ScaleImage from '/@/views/components/ScaleImage.vue';

export const primaryKey = 'id';
export const pageTitle = '等级';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '会员等级',
    dataIndex: 'level',
    width: 100,
  },
  {
    title: '会员图片',
    dataIndex: 'image2',
    customRender: ({ record, text: value }: Recordable) => {
      if (!record.editable) {
        if (!value) return '';

        return h(ScaleImage, {
          size: 80,
          src: record.image2,
          mode: 'cover',
          style: { margin: '0 auto' },
        });
      }

      return h(ImageUpload, {
        value,
        accept: 'image/jpeg,image/jpeg,image/png',
        maxCount: 1,
        multiple: false,
        onChange: (url) => (record.image2 = url),
      });
    },
  },
  {
    title: '会员卡面',
    dataIndex: 'image',
    customRender: ({ record, text: value }: Recordable) => {
      if (!record.editable)
        return h(ScaleImage, {
          size: 80,
          src: record.image,
          mode: 'cover',
          style: { margin: '0 auto' },
        });

      return h(ImageUpload, {
        value,
        accept: 'image/jpeg,image/jpeg,image/png',
        maxCount: 1,
        multiple: false,
        onChange: (url) => (record.image = url),
      });
    },
  },
  {
    title: '会员名称',
    dataIndex: 'alias',
    editRow: true,
    editRule: true,
    editComponentProps: { maxlength: 10 },
  },
  {
    title: '升级条件',
    dataIndex: 'threshold',
    customRender: ({ record, text: value }: Recordable) => {
      if (!record.editable || record.level === 1)
        return h('div', value === 0 ? '无门槛' : `消费满 ${value} 元`);
      const min = record.level === 1 ? 0 : 1,
        max = 99999;
      return h('div', { class: 'flex items-center' }, [
        h(InputNumber, {
          value,
          min,
          max,
          controls: false,
          onChange: (value) => (record.threshold = value === null ? min : value),
          addonBefore: '消费满',
          addonAfter: '元',
        }),
      ]);
    },
  },
  {
    title: '会员权益',
    dataIndex: 'pointsRate',
    children: [
      {
        title: '积分倍率',
        dataIndex: 'pointsRate',
        width: 120,
        customRender: ({ record, text: value }: Recordable) => {
          if (!record.editable) return h('div', `${value} 倍`);
          const min = 1,
            max = 10;
          return h('div', { class: 'flex items-center' }, [
            h(InputNumber, {
              value,
              min,
              max,
              controls: false,
              precision: 1,
              onChange: (value) => (record.pointsRate = value === null ? min : value),
              addonAfter: '倍',
            }),
          ]);
        },
      },
    ],
  },
  {
    title: '升级礼包',
    dataIndex: 'gifts',
    children: [
      {
        title: '送积分',
        dataIndex: 'gifts.points',
        width: 140,
        customRender: ({ record }: Recordable) => {
          if (record.level === 1) return '';

          const value = record?.gifts?.points || 0;

          if (!record.editable) return h('div', `${value} 积分`);
          const min = 0,
            max = 99999;
          return h('div', { class: 'flex items-center' }, [
            h(InputNumber, {
              value,
              min,
              max,
              controls: false,
              onChange: (value) =>
                record?.gifts && (record.gifts.points = value === null ? min : value),
              addonAfter: '积分',
            }),
          ]);
        },
      },
      {
        title: '送优惠券',
        dataIndex: 'gifts.coupons',
      },
    ],
  },
  {
    title: '会员权益说明',
    dataIndex: 'rules',
    customRender: ({ record, text: value }: Recordable) => {
      if (!record.editable) {
        if (!value?.length) return '';
        const box: any = [];
        value.forEach((item) => {
          const itm = h(ScaleImage, {
            size: 80,
            src: item.url,
            mode: 'cover',
            style: { margin: '4px auto' },
          });
          box.push(itm);
        });

        return h('div', { class: 'flex flex-col' }, [[...box]]);
      }

      return h(ImageUploadGroup, {
        value,
        tip: '图片建议尺寸750*750，大小不超过2M，最多9张，可拖拽图片调整显示顺序',
        onChange: (urls) => (record.rules = urls),
      });
    },
  },
];
