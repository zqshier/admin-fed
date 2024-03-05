<template>
  <div class="detail-edit">
    <div class="edit-con" v-show="!props.disabled">
      <div v-if="detailList.length === 0">
        <div class="ctrl-wrap">
          <a-button type="link" size="small" @click="addItem('image', 0)">添加图片/视频</a-button>
          <a-button v-show="showTextBtn" type="link" size="small" @click="addItem('text', 0)"
            >添加文字</a-button
          >
        </div>
      </div>
      <div class="item-con-wrap" v-for="(item, index) in detailList" :key="index">
        <div class="ctrl-wrap">
          <div class="title">{{ typeName[item.type] || '' }}</div>
          <a-button type="link" size="small" @click="showNavigateToModal(index)">跳转</a-button>
          <a-button type="link" size="small" @click="itemMoveUp(index)">上移</a-button>
          <a-button type="link" size="small" @click="itemMoveDown(index)">下移</a-button>
          <a-button type="link" size="small" @click="itemMoveTop(index)">置顶</a-button>

          <a-dropdown>
            <a-button type="link" size="small">添加</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="addItem('image', index)">向上添加图片/视频</a-menu-item>
                <a-menu-item
                  v-if="maxCreateTextLen && maxCreateTextLen > textItemLen"
                  @click="addItem('text', index)"
                  >向上添加文字</a-menu-item
                >
                <a-menu-item @click="addItem('image', index + 1)">向下添加图片/视频</a-menu-item>
                <a-menu-item
                  v-if="maxCreateTextLen && maxCreateTextLen > textItemLen"
                  @click="addItem('text', index + 1)"
                  >向下添加文字</a-menu-item
                >
              </a-menu>
            </template>
          </a-dropdown>
          <a-popconfirm
            title="确认删除？"
            placement="topRight"
            @confirm="delItem(index, item.id || 0)"
          >
            <a-button type="link" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <div class="item-con" v-if="item.type === 'text'">
          <detail-text-edit v-model:value="item.content" />
        </div>
        <div class="item-con" v-if="item.type === 'image' || item.type === 'video'">
          <image-upload
            size="fullwidth"
            v-model:value="item.content"
            :multiple="true"
            :max-image-size="maxImageSize"
            :max-video-size="maxVideoSize"
            @creat="(imageUrls) => onCreatImageItem(imageUrls, index)"
          />
        </div>
      </div>
    </div>
    <div class="preview-con" v-if="detailList.length > 0">
      <div class="title">预览</div>
      <div class="preview">
        <div class="item-con" v-for="(item, index) in detailList" :key="index">
          <img v-if="item.type === 'image'" :src="item.content" alt="" />
          <div v-if="item.type === 'text'" class="text">
            {{ item.content }}
            <!-- <div v-dompurify-html="item.content"></div> -->
          </div>
          <div v-if="item.type === 'video'" class="text">
            <video controls :src="item.content"></video>
          </div>
        </div>
      </div>
    </div>

    <DetailEditLinkModal @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  import DetailTextEdit from './DetailTextEdit.vue';
  import {
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
    Popconfirm as APopconfirm,
  } from 'ant-design-vue';
  import { ImageUpload } from '/@/components/ImageUpload';
  import {
    GoodsDetailItemInfo,
    GoodsDetailItemType,
    GoodsDetailParams,
  } from '/@/api/app/model/goodsModel';

  import DetailEditLinkModal from './DetailEditLinkModal.vue';
  // import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html';
  import { isEmpty, cloneDeep } from 'lodash-es';
  import { watch, ref, nextTick, onMounted, computed } from 'vue';
  import { useModal } from '/@/components/Modal';

  // const vDompurifyHtml = buildVueDompurifyHTMLDirective();

  const props = defineProps({
    value: {
      type: Object as PropType<GoodsDetailParams>,
    },
    maxCreateTextLen: {
      type: Number || null,
      default: 10,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxVideoSize: {
      type: Number,
      default: 20,
    },
    maxImageSize: {
      type: Number,
      default: 2,
    },
    showTextBtn: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const detailList = ref<GoodsDetailItemInfo[]>([]);
  const deleteIds = ref<number[]>([]);
  const isUpdateValue = ref(false);

  const typeName = {
    image: '图片',
    video: '视频',
    text: '文字',
  };

  const textItemLen = computed(() => {
    const list = detailList.value.filter((item) => item.type === 'text');
    return list.length;
  });

  watch(
    () => detailList.value,
    () => {
      updateValue();
    },
    { deep: true },
  );

  watch(
    () => props.value,
    () => {
      if (!isUpdateValue.value) {
        initValue();
      }
    },
    { deep: true },
  );

  function initValue() {
    // if (props.value?.rows?.length && !detailList.value.length) {
    console.log('initValue', props.value);
    const value: GoodsDetailParams = cloneDeep(props.value)!;
    if (props.value) {
      detailList.value = value.rows || [];
      deleteIds.value = value.deleteIds;
    }
    // }
  }

  function updateValue() {
    isUpdateValue.value = true;

    const value: GoodsDetailParams = {
      rows: [...detailList.value],
      deleteIds: [...deleteIds.value],
    };

    emit('update:value', value);
    emit('change', value);

    nextTick(() => (isUpdateValue.value = false));
  }

  function addItem(type: GoodsDetailItemType, index: number) {
    const item: GoodsDetailItemInfo = {
      id: 0,
      type: type,
      content: '',
      meta: {},
    };
    if (index <= 0) {
      detailList.value.unshift(item);
    } else {
      detailList.value.splice(index, 0, item);
    }
  }

  function delItem(index: number, id: number) {
    if (id && id !== 0) {
      deleteIds.value.push(id);
    }
    detailList.value.splice(index, 1);
  }

  function itemMoveUp(index: number) {
    if (index === 0) {
      return;
    }
    const indexUp = index - 1;
    const arr = detailList.value;
    [arr[indexUp], arr[index]] = [arr[index], arr[indexUp]];
  }

  function itemMoveDown(index: number) {
    if (index === detailList.value.length - 1) {
      return;
    }
    const indexUp = index + 1;
    const arr = detailList.value;
    [arr[indexUp], arr[index]] = [arr[index], arr[indexUp]];
  }

  function itemMoveTop(index: number) {
    const del = detailList.value.splice(index, 1);
    detailList.value.unshift(del[0]);
  }

  function onCreatImageItem(imageUrls: string[], index: number) {
    // console.debug('onCreatImageItem', index, imageUrls);
    if (isEmpty(imageUrls)) return;

    const [f, ...urls] = imageUrls;
    // 更新当前模块数据
    detailList.value[index].content = f;
    detailList.value[index].type = f.endsWith('.mp4') ? 'video' : 'image';

    if (!urls.length) return;
    const adds: GoodsDetailItemInfo[] = urls.map((url) => ({
      id: 0,
      type: url.endsWith('.mp4') ? 'video' : 'image',
      content: url,
    }));
    // console.debug('onCreatImageItem adds', adds);
    detailList.value.splice(index + 1, 0, ...adds);
  }

  const [registerModal, { openModal: openLinkModify }] = useModal();

  function showNavigateToModal(index) {
    const { meta = {} } = detailList.value[index];
    console.debug('meta', meta);
    openLinkModify(true, {
      callback: (values) => {
        detailList.value[index].meta = values;
      },
      values: {
        linkType: meta?.linkType || 'path',
        link: meta?.link || '',
      },
    });
  }

  onMounted(() => initValue());
</script>

<style lang="less" scoped>
  .detail-edit {
    display: flex;
    margin-top: 3px;
    .edit-con {
      width: 50%;
    }
    .preview-con {
      width: 50%;
      padding-left: 10px;
      .title {
        margin-bottom: 5px;
      }
      .preview {
        border: 1px solid #d9d9d9;
        padding: 5px;
        img {
          width: 100%;
        }
        .text {
          white-space: pre-wrap;
        }
      }
    }
    .item-con-wrap {
      margin-bottom: 10px;
      .ctrl-wrap {
        margin-bottom: 5px;
      }
    }
    .ctrl-wrap {
      display: flex;
      align-items: center;

      .title {
        flex: 1;
      }
    }
  }
</style>

<style lang="css">
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
</style>
