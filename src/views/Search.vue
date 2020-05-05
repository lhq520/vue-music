<template>
  <div class="search">
    <HomeLink></HomeLink>
    <div class="m-hmsrch">
      <form class="m-input f-bd" method="get" action="#">
        <div class="inputcover">
          <i class="u-svg-srch"></i>
          <input
            type="text"
            name="search"
            class="input"
            placeholder="搜索歌曲、歌手、专辑"
            autocomplete="off"
            v-model="query"
          />
          <figure class="close" v-if="this.query.length" @click="clearInput()">
            <i class="u-svg-empty"></i>
          </figure>
        </div>
      </form>
      <!-- 热门搜索 -->
      <div class="m-default" v-show="!query">
        <section class="m-hotlist">
          <h3 class="title">热门搜索</h3>
          <ul class="list">
            <li
              class="itemhot f-bd"
              @click="Addquery(item.first)"
              v-for="(item,index) in searchots"
              :key="index"
            >{{item.first}}</li>
          </ul>
        </section>
        <!-- 搜索历史 -->
        <section class="m-history">
          <ul class="list">
            <li class="itemhis" v-for="(item,index) in querylist" :key="index">
              <i class="u-svg-histy"></i>
              <div class="histyr f-bd">
                <span class="link" @click="Addquery(item)">{{item}}</span>
                <figure class="close" @click="Delquerylist(index)">
                  <i class="u-svg-close"></i>
                </figure>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <Suggest  v-show="query" :query="query" 
       :currentSong="currentSong"  @tanslate-song="$emit('tanslate-song', $event)"
       ></Suggest>
    </div>
  </div>
</template>
<script>
import HomeLink from "@/components/HomeLink.vue";
import Suggest from "@/components/Suggest.vue";
export default {
   props: {
    currentSong: Object
  },
  data() {
    return {
      searchots: [],
      query: "",
      list:[],
      querylist:[],
    };
  },
  components: {
    Suggest,
    HomeLink
  },
  methods: {
    getSearchot() {
      this.axios
        .get("http://music.kele8.cn/search/hot")
        .then(response => {
          // 如果数据正确
          // console.log(response);
          this.searchots = response.data.result.hots;
          // 获取到的数据放入本地存储
          window.localStorage.setItem(
            " searchots",
            // 过期时间1小时
            JSON.stringify({
              expire: Date.now() + 1 * 60 * 60 * 1000,
              result: response.data.result.hots
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    Addquery(query) {
      this.query = query;
     
    },
    clearInput() {
      this.query = "";
    },
    Delquerylist(index){
        this.querylist.splice(index,1)
    },

  },
  
  created() {
    
    const cacheSearchot = JSON.parse(window.localStorage.getItem("hotlists"));
    if (cacheSearchot && cacheSearchot.expire > Date.now()) {
      // 存在并且还没有过期
      this.searchots = cacheSearchot.result;
    } else {
      // 已经过期
      this.getSearchot();
    }
 
  },
  watch:{
     query(newQuery){
    this.$emit('query', newQuery)
     if(newQuery!=='' )
     {
       this.querylist.push(newQuery);
       this.querylist=this.querylist.filter((item,index,list)=>{
            return list.indexOf(item)===index
       })
     }
    // console.log(this.querylist)
  }
  }
};
</script>
<style lang="less" scoped>
.m-input {
  width: 100%;
  height: 60px;
  padding: 15px 10px;
  position: relative;
  // background-color: chartreuse;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.f-bd::after {
  width: 200%;
  height: 200%;
  position: absolute;
  z-index: 2;
  content: "";
  top: 0;
  left: 0;
  pointer-events: none;
  box-sizing: border-box;
  transform-origin: top left;
  transform: scale(0.5);
  border: 0 solid rgba(0, 0, 0, 0.1);
}
.inputcover {
  position: relative;
  width: 100%;
  height: 30px;
  padding: 0 30px;
  box-sizing: border-box;
  background: #ebecec;
  border-radius: 30px;
  .u-svg-srch {
    width: 13px;
    height: 13px;
    position: absolute;
    left: 0;
    top: 9px;
    margin: 0 8px;
    vertical-align: middle;
    background-image: url("../assets/search.svg");
    background-position: 0 0;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .input {
    width: 100%;
    height: 30px;
    line-height: 18px;
    background: rgba(0, 0, 0, 0);
    font-size: 14px;
    color: #333;
    outline: none;
    border-radius: 0;
    border: 0;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    .u-svg-empty {
      vertical-align: middle;
      width: 14px;
      height: 14px;
      display: inline-block;
      background-image: url("../assets/close.svg");
      background-position: 0 0;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
.m-default {
  .m-hotlist {
    width: 100%;
    padding: 10px 10px;
    .title {
      font-size: 12px;
      line-height: 12px;
      color: #666;
    }
    .list {
      margin: 10px 0 7px;
      .itemhot {
        display: inline-block;
        height: 32px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 0 14px;
        font-size: 14px;
        line-height: 32px;
        color: #333;
        border: 1px solid #d3d4da;
        border-radius: 32px;
      }
    }
  }
  .m-history {
    .list {
      .itemhis {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        height: 45px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        .u-svg-histy {
          margin: 0 10px;
          width: 15px;
          height: 15px;
          background-image: url("../assets/history.svg");
          display: inline-block;
          vertical-align: middle;
          background-position: 0 0;
          background-size: contain;
          background-repeat: no-repeat;
        }
        .histyr {
          flex: 1;
          width: 1%;
          position: relative;
          display: flex;
          align-items: center;
          height: 45px;
          .link {
            margin-right: 10px;
            flex: 1;
            width: 1%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: normal;
          }
          .close {
            flex: 0 0 auto;
            width: 32px;
            height: 32px;
            line-height: 32px;
            .u-svg-close {
              margin-left: 2px;
              width: 12px;
              height: 12px;
              background-image: url("../assets/delete.svg");
              display: inline-block;
              vertical-align: middle;
              background-position: 0 0;
              background-size: contain;
              background-repeat: no-repeat;
            }
          }
        }
      }
    }
  }
}
</style>
