<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control :titles="['流行', '新款', '精选']"/>
    <goods-list :goods="showGoodsList" />
  </div>
</template>

<script>

import HomeSwiper from './childComps/HomeSwiper';
import RecommendView from './childComps/RecommendView';
import FeatureView from './childComps/FeatureView'

import NavBar from '@/components/common/navbar/NavBar'
import TabControl from '@/components/content/tabControl/TabControl'
import GoodsList from "components/content/goods/GoodsList";

import {getHomeMultidata, getHomeGoods} from "network/home";






  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          pop: { page: 0, list: [] },
          new: { page: 0, list: [] },
          sell: { page: 0, list: [] },
        },
        currentType: "pop",  // 默认展示商品种类
      }
    },
  computed: {
    // 计算展示商品列表
    showGoodsList() {
      return this.goods[this.currentType].list;
    },
  },
    created() {
    // 请求轮播数据
      this._getHomeMultidata();
    // 请求商品数据
      this._getHomeGoods("pop");
      this._getHomeGoods("new");
      this._getHomeGoods("sell");
    },
    methods: {
    /**
     * 网络请求的相关方法
     */
    // 获取home通用数据并封装
    _getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    // 获取home商品列表,只需传入商品种类，就可自动查出下一页添加并改变页码
    _getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        const newList = res.data.list;
        this.goods[type].list.push(...newList);
        this.goods[type].page += 1;
        // 完成一次上拉加载更多
        this.$refs.scroll.finishedPullUp();
      });
    }
  }
}
</script>

<style scoped>
  .home {
    padding-top: 44px;
  }
  
  .home-nav { 
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;

   }
</style>
