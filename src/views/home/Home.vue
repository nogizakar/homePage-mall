<template>
  <div id="home">
    <!-- 顶部主题 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!-- tab切换栏的吸顶效果是通过条件显隐展示的 -->
    <tab-control
      ref="topTab"
      v-show="showTabControl"
      class="tab-top"
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
    />
    <!-- 滑动大栏,监听滑动事件 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @pullingUp="loadMore"
      @scroll="contentScroll"
      :pull-up-load="true"
    >
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperLoaded="swiperLoaded" />
      <!-- 推荐栏 -->
      <recommend-view :recommends="recommends" />
      <!-- 特色栏，实际为大图 -->
      <feature-view />
      <!-- tab切换栏 -->
      <tab-control
        ref="contentTab"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
      />
      <!-- 货物展示栏 -->
      <goods-list :goods="showGoodsList" />
    </scroll>
    <!-- 下滑一定距离后显示返回按钮，组件事件上需要.native -->
    <back-top v-show="showBackTop" @click.native="backTop" />
  </div>
</template>

<script>
// 导入组件
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";

// 导入路由
import { getHomeMultidata, getHomeGoods } from "network/home";
import { TOP_DISTANCE } from "common/const";
export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    BackTop,
    Scroll,
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
      showBackTop: false,
      showTabControl: false,
      offsetTop: 0,
      saveY: 0,
    };
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
  mounted() {
    // this.tabOffsetTop = this.$refs.tabControl.offsetTop
    const refresh = this.debounce(this.$refs.scroll.refresh, 500);
    // 监听一些事件
    this.$bus.$on("imgLoad", () => {
      // console.log("refresh");
      // this.$refs.scroll.refresh();
      refresh();
    });
  },
  destroyed() {
    console.log("home destroyed");
  },
  // 切换时滑动到退出位置
  activated() {
    // 和生命周期有关 初始没有bscroll对象
    // console.log("activated");
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh()
  },
  // 退出时保存滑动位置
  deactivated() {
    // console.log("deactivated");
    this.saveY = this.$refs.scroll.getScrollY();
  },
  methods: {
    /**
     * 防抖动函数
     */
    debounce(func, delay) {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
          // console.log("refresh");
        }, delay);
      };
    },
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
        this.$refs.scroll.finishPullUp();
      });
    },

    /**
    事件监听的相关方法
     */
    // 切换tabcontrol,并显示对应商品列表
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
        default:
          this.currentType = "pop";
      }
      // 同步两个tabControl
      this.$refs.topTab.currentIndex = index;
      this.$refs.contentTab.currentIndex = index;
    },
    // 滑动事件
    contentScroll(position) {
      // console.log(position)
      // 判断显示backTop
      this.showBackTop = position.y <= -TOP_DISTANCE;
      // 判断显示吸顶效果
      this.showTabControl = (-position.y) >= this.offsetTop;
    },
    // 轮播图加载后保存contentTab偏移距离
    swiperLoaded() {
      this.offsetTop = this.$refs.contentTab.$el.offsetTop;
      // console.log(this.$refs.contentTab.$el.offsetTop);
    },
    // 点击返回顶部按钮，快速返回顶部
    backTop() {
      console.log("backTop");
      // 不要直接调子组件的原生方法，简单包装一下
      // this.$refs.scroll.scroll.scrollTo(0, 0);
      // console.log(this.$refs.scroll.scroll.scrollTo);
      this.$refs.scroll.scrollTo(0, 0);
    },
    loadMore() {
      console.log("home load more");
      this._getHomeGoods(this.currentType);
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999; */
}
.tab-top {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
/* 自动吸顶，大部分移动端浏览器支持，IE不支持,使用了better-scroll之后该属性无法生效*/
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 999;
  background-color: #fff;
} */
.content {
  /* height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>