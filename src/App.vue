<template>
  <div id="app" @touchstart="touchstart" @touchend="touchend">
    <!-- 一级路由出口 -->
    <keep-alive>
      <router-view @tanslate-song="currentSong = $event" @nextSong="nextPlay" @preSong="prePlay" :currentSong="currentSong"></router-view>
    </keep-alive>

    <!-- 播放器 边栏 -->
    <PlayBar @tanslate-song="currentSong = $event" @nextSong="nextPlay" @preSong="prePlay" v-if="currentSong" :currentSong="currentSong"></PlayBar>
  </div>
</template>
<script>
import PlayBar from "@/components/PlayBar";
export default {
  components: {
    PlayBar
  },
  data: function() {
    return {
      currentSong: null,
      touchstartX: 0
    };
  },
  methods: {
    touchstart: function(event) {
      // console.log("开始", event.changedTouches[0].clientX);
      this.touchstartX = event.changedTouches[0].clientX;
      this.touchstartY = event.changedTouches[0].clientY;
    },
    touchend: function(event) {
      // console.log("结束", event.changedTouches[0].clientX);
      // 判断左滑动 返回上一页
      if (event.changedTouches[0].clientX - this.touchstartX > 50) {
        // console.log("从左到右");
        this.touchstartX = 0;
        this.touchstartY = 0;
        this.routerBack();
      }
      if (event.changedTouches[0].clientX - this.touchstartX < -50) {
        // console.log("从右到左");
        this.routerForward();
      }
    },
    routerBack: function() {
      this.$router.back();
    },
    routerForward: function() {
      this.$router.forward();
    },
    nextPlay(data){
      this.currentSong=data
      console.log(data); 
    },
    prePlay(data){
      this.currentSong=data
      console.log(data); 
    }
  },
  watch: {
    // 当前播放id变化
    currentSongId: function() {},
    

  }
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-bottom: 50px;
}
</style>