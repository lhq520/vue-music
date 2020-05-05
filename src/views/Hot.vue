<template>
  <div class="hot">
    <HomeLink></HomeLink>
    <div class="hotop">
      <div class="hotopct">
        <div class="u-hmsprt hoticon"></div>
        <div class="hottime">更新日期: {{timesTamp(this.hotlists.updateTime)}} </div>
      </div>
    </div>
    <ul>
        <SongItem
        v-for="(item, index) in randomHotlist()"
          :key="index"
          :songItem="item"
          @tanslate-song="$emit('tanslate-song', $event)"
          :options="{order: index, info:true}"
          :currentSong="currentSong"
        ></SongItem>
      </ul>
  </div>
</template>
<script>
import HomeLink from "@/components/HomeLink.vue";
import SongItem from "@/components/SongItem.vue";
export default {
  props: {
    currentSong: Object
  },
  data() {
    return {
      hotlist:[],
      hotlists:[],
    };
  },
  components: {
    HomeLink,
     SongItem
  },
  methods:{
      getHotlist(){
         this.axios
        .get("http://music.kele8.cn/top/list?idx=1")
        .then(response => {
          // 如果数据正确
          // console.log(response);
          this.hotlists=response.data.playlist;
          //  console.log(this.hotlists);
          this. hotlist = this.hotlists.tracks;
          // 获取到的数据放入本地存储
          window.localStorage.setItem(
            " hotlists",
            // 过期时间1小时
            JSON.stringify({
              expire: Date.now() + 1 * 60 * 60 * 1000,
              result: response.data.playlist.tracks
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
      },
      randomHotlist(){
        return [...this.hotlist].splice(0,20)
      },
      timesTamp(timestamp){
         var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
        var D = date.getDate()+'日';
        return M+D;
      }
  },
  created() {
     // 每次创建组件都拿数据 太频繁 本地存储
    const cacheHotlists = JSON.parse(
      window.localStorage.getItem("hotlists")
    );
    if (cacheHotlists && cacheHotlists.expire > Date.now()) {
      // 存在并且还没有过期
      this. hotlist = cacheHotlists.result;
    } else {
      // 已经过期
      this. getHotlist();
    } 
  }
};
</script>
<style lang="less" scoped>
.hotop {
  position: relative;
  padding-top: 38.9%;
  overflow: hidden;
  background: url("../assets/hot_music_bg_2x.jpg") no-repeat;
  background-size: contain;
  .hotopct {
    // display: flex;
    // justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    padding-left: 20px;
    box-sizing: border-box;
    .u-hmsprt {
      background: url("../assets/index_icon_2x.png") no-repeat;
      background-size: 166px 97px;
    }
    .hoticon {
      width: 142px;
      height: 67px;
      margin-top: 15px;
      background-position: -24px -30px;
    }
    .hottime {
      margin-top: 10px;
      color: hsla(0, 0%, 100%, 0.8);
      font-size: 12px;
    }
  }
}
.hotop:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(0,0,0,.2);
}
</style>
