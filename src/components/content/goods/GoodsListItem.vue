<template>
  <!-- 判断对象是否存在，实际判断是否有键 -->
  <div
    class="goods-item"
    @click="itemClick"
    v-if="Object.keys(goodsItem).length !== 0"
  >
    <img :src="goodsItem.show.img" alt="" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    itemClick() {
      //1.获取iid
      const iid = this.goodsItem.iid;
      //2.跳转到详情页
      this.$router.push({ path: "detail", query: { iid } });
    },
    // 图片加载消息
    imgLoad() {
      // 消息总线，使用前必须绑定在原型上,见main.js
      this.$bus.$emit("imgLoad");
    },
  },
  computed: {
    showImage() {
      // 多个组件复用，而传入的对象img出现层次不同
      return this.goodsItem.image || this.goodsItem.show.img;
    },
  },
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>