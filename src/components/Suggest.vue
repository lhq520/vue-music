<template>
  <div class="searchresult">
    <h3 class="title">搜索结果</h3>
    <!-- <section class="songlist">
      <ul>
        <li v-for="(item,index) in searchlist" :key="index">
          <div class="main">
            <h3>
              {{item.name}}
              <span class="alias"> {{item.alia}} </span>
            </h3>
            <div class="info">
              <i class="icon icon-quality"></i>
              <span class="artists"> {{joinArtists(item.artists)}} </span>
              <span class="album">-{{item.album.name}} </span>
            </div>
          </div>
          <i class="icon icon-play"></i>
        </li>
      </ul>
    </section>-->
    <SongItem
      v-for="(item, index) in searchlist"
      :key="index"
      :songItem="item"
      @tanslate-song="$emit('tanslate-song', $event)"
      :options="{info:true}"
       :currentSong="currentSong"
    ></SongItem>
  </div>
</template>

<script>
import SongItem from "@/components/SongItem";
export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    currentSong: Object
  },
  data() {
    return {
      searchlist: []
    };
  },
  components: {
    SongItem
  },
  methods: {
    getSearch() {
     if(this.query){
        this.axios
        .get(`http://music.kele8.cn/search?keywords=${this.query}`)
        .then(res => {
          this.searchlist = res.data.result.songs;
          console.log(this.searchlist);
           window.localStorage.setItem(
            "searchlists",
            // 过期时间1小时
            JSON.stringify({
              expire: Date.now() + 1* 60* 60 * 1000,
              result: res.data.result.songs
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
     }
    }
  },

  created() {
        // 每次创建组件都拿数据 太频繁 本地存储
    const cacheSearchlists = JSON.parse(
      window.localStorage.getItem("searchlists")
    );
    if (cacheSearchlists && cacheSearchlists.expire > Date.now()) {
      // 存在并且还没有过期
      this.searchlist = cacheSearchlists.result;
    } else {
      // 已经过期
      this.getSearch();
    } 
  },
  watch: {
    query(val) {
      if (val === "") {
        this.searchlist = [];
      } else {
        this.getSearch();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.searchresult {
  .title {
    margin-left: 10px;
    font-size: 10px;
    line-height: 16px;
    color: blue;
  }
  .songlist {
    ul {
      width: 100%;
      li {
        display: flex;
        margin: 10px 0;
        align-items: center;
        .main {
          flex: 1;
          width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 10px;
          h3 {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .alias {
              color: rgb(189, 189, 189);
            }
          }
          .info {
            font-size: 12px;
            line-height: 2em;
            color: rgb(189, 189, 189);
          }
        }
      }
    }
    .icon {
      background-image: url("../assets/index_icon_2x.png");
      display: inline-block;
      background-size: 166px auto;
      &.icon-quality {
        width: 12px;
        height: 8px;
        margin: 0 5px 0 2px;
      }
      &.icon-play {
        width: 25px;
        height: 25px;
        background-position-x: -23px;
        margin: 0 10px;
      }
    }
  }
}
</style>