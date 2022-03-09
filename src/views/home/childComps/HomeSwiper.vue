<template>
  <div id="home-swiper">
    <swiper>
      <swiper-item v-for="(item, index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" @load="imgLoaded" alt="" />
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";
// 轮播图组件
export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isLoaded: false
    }
  },
  methods: {
    // 图片加载
    imgLoaded() {
      // 只需要一张图片加载，就知道了轮播图高度-偏移距离
      if(!this.isLoaded) {
        this.$emit("swiperLoaded");  // 父子组件通信
        this.isLoaded = true;
      }
    }
  },
  components: {
    Swiper,
    SwiperItem,
  },
};
</script>

<style scoped>
</style>