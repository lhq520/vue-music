<template>
  <div class="playbar">
    <!-- bottom -->
    <div class="playbarbottom" @click="showFullscreen=!showFullscreen" v-if="currentSong.song">
      <img class="thumb" :class="{active: playing}" :src="currentSong.picUrl" alt />
      <div class="info">
        <h5>{{currentSong.name}}</h5>
        <span>{{joinArtists(currentSong.song.artists)}}</span>
      </div>
      <div class="progress" @click.stop="playing = !playing">
        <canvas width="36" height="36" id="canvas"></canvas>
        <i v-if="playing" class="fa fa-pause"></i>
        <i v-else class="fa fa-play"></i>
      </div>
      <div class="playlist" @click.stop="showPlayList=!showPlayList">
        <i class="fa fa-bars" aria-hidden="true"></i>
      </div>
    </div>
    <!-- 热歌播放 -->
    <div class="playbarbottom" @click="showFullscreen=!showFullscreen" v-else-if="currentSong.al">
      <img class="thumb" :class="{active: playing}" :src="currentSong.al.picUrl" alt />
      <div class="info">
        <h5>{{currentSong.name}}</h5>
        <span>{{currentSong.ar[0].name}}</span>
      </div>
      <div class="progress" @click.stop="playing = !playing">
        <canvas width="36" height="36" id="canvas"></canvas>
        <i v-if="playing" class="fa fa-pause"></i>
        <i v-else class="fa fa-play"></i>
      </div>
      <div class="playlist" @click.stop="showPlayList=!showPlayList">
        <i class="fa fa-bars" aria-hidden="true"></i>
      </div>
    </div>
    <!-- 搜索播放 -->
    <div class="playbarbottom" @click="showFullscreen=!showFullscreen" v-else>
      <img class="thumb" :class="{active: playing}" src="../assets/sing.png" alt />
      <div class="info">
        <h5>{{currentSong.name}}</h5>
        <span>{{joinArtists(currentSong.artists)}}</span>
      </div>
      <div class="progress" @click.stop="playing = !playing">
        <canvas width="36" height="36" id="canvas"></canvas>
        <i v-if="playing" class="fa fa-pause"></i>
        <i v-else class="fa fa-play"></i>
      </div>
      <div class="playlist" @click.stop="showPlayList=!showPlayList">
        <i class="fa fa-bars" aria-hidden="true"></i>
      </div>
    </div>
    <!-- 播放列表 -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <ul v-if="showPlayList" class="defaultPlayList">
        <SongItem
          v-for="(item, index) in defaultPlayList"
          :key="index"
          :songItem="item"
          :options="{order: index, info: false}"
          @tanslate-song="$emit('tanslate-song', $event)"
          :currentSong="currentSong"
        ></SongItem>
      </ul>
    </transition>

    <!-- fullscreen -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="showFullscreen" class="fullscreenplay">
        <div
          class="mask"
          v-if="currentSong.song"
          :style="{backgroundImage: `url(${currentSong.picUrl})`}"
        ></div>
        <div
          class="mask"
          v-else-if="currentSong.al"
          :style="{backgroundImage: `url(${currentSong.al.picUrl})`}"
        ></div>
        <div class="mask" v-else :style="{backgroundImage:'url('+mask+')'}"></div>
        <header>
          <i class="fa fa-arrow-left" @click="showFullscreen=false"></i>
        </header>

        <div
          v-show="showCircle"
          class="circle"
          :class="{active: playing}"
          @click="showCircle = false"
        >
          <div class="needle"></div>

          <div v-if="currentSong.song" class="glue">
            <img :src="currentSong.picUrl" alt />
          </div>

          <div v-else-if="currentSong.al" class="glue">
            <img :src="currentSong.al.picUrl" alt />
          </div>
          <div v-else class="glue">
            <img src="../assets/sing.png" alt />
          </div>
        </div>
        <div v-show="!showCircle" class="lyric-box" @click="showCircle = true">
          <ul class="scroll" :style="{transform: `translateY(${-currentLyricIndex * 28}px)`}">
            <li
              v-for="(item, index) in parsedLyric"
              :class="{active: index===currentLyricIndex}"
              :key="index"
            >{{item.text}}</li>
          </ul>
        </div>
        <footer>
          <div class="top">
            <span class="time-l">{{this.result}}</span>
            <div class="mp3-progress">
              <div class="now-progress" :style="{width:this.progress}"></div>
            </div>
            <span class="time-r">{{totalTime()}}</span>
          </div>
          <div class="content">
            <div class="mode">
              <img src="../assets/loop2.png" alt />
            </div>
            <div class="pre" @click="pre()">
              <img src="../assets/previous.png" alt />
            </div>
            <div class="pause" @click.stop="playing = !playing">
              <img v-if="playing" src="../assets/pause.png" alt />
              <img v-else src="../assets/play2.png" alt />
            </div>
            <div class="next" @click="next()">
              <img src="../assets/next.png" alt />
            </div>
            <div class="heart" @click="getHeart(num)">
              <img v-if="!this.heartlist[num].heart" src="../assets/白心.png" alt />
              <img v-else src="../assets/红心.png" alt />
            </div>
          </div>
        </footer>
      </div>
    </transition>
    <audio :src="currentSongUrl" autoplay controls height="30"></audio>
  </div>
</template>

<script>
import axios from "axios";
import SongItem from "@/components/SongItem";
export default {
  props: {
    currentSong: Object
  },
  components: {
    SongItem
  },
  data: function() {
    return {
      mask: require("../assets/mask.jpg"),
      playing: false,
      showFullscreen: false,
      showCircle: false,
      currentLyric: null,
      currentLyricIndex: 0,
      showPlayList: false,
      defaultPlayList: [this.currentSong],
      heart: false,
      heartlist: [{ id: "", heart: false }],
      num: 1,
      Song: this.currentSong,
      totaltime: "",
      result: "",
      progress:0
    };
  },
  methods: {
    addHeart() {
      let Heart = { id: this.currentSong.id, heart: false };
      this.heartlist.push(Heart);
      let obj = {};
      this.heartlist = this.heartlist.reduce((cur, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
        return cur;
      }, []);
      // console.log(this.heartlist);
    },
    isHeart() {
      var curId = this.currentSong.id;
      this.num = this.heartlist.findIndex(item => {
        return item.id == curId;
      });
    },
    getHeart(n) {
      if (this.heartlist[n].heart) {
        this.heartlist[n].heart = false;
      } else {
        this.heartlist[n].heart = true;
      }
      //     console.log(n, this.heartlist[n].heart)
    },
    pre() {
      if (this.defaultPlayList) {
        var curId = this.currentSong.id;
        let index = this.defaultPlayList.findIndex(item => {
          return item.id == curId;
        });
        if (index == 0) {
          this.Song = this.defaultPlayList[this.defaultPlayList.length - 1];
        } else {
          this.Song = this.defaultPlayList[index - 1];
        }
        this.$emit("preSong", this.Song);
        console.log(index);
      }
    },
    next() {
      console.log(this.defaultPlayList);
      if (this.defaultPlayList) {
        var curId = this.currentSong.id;
        let index = this.defaultPlayList.findIndex(item => {
          return item.id == curId;
        });
        if (index == this.defaultPlayList.length - 1) {
          this.Song = this.defaultPlayList[0];
        } else {
          this.Song = this.defaultPlayList[index + 1];
        }
        this.$emit("nextSong", this.Song);
      }
    },

    joinArtists: function(artists) {
      return artists.map(artist => artist.name).join(" / ");
    },
    totalTime() {
      if (this.currentSong.song) {
        var duration = this.currentSong.song.duration; // eslint-disable-line no-unused-vars
      } else {
        duration = this.currentSong.dt;
      }
      var date = new Date(duration); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      var s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    },
    drawProgress: function() {
      var canvas = this.$el.querySelector("#canvas");
      var audio = this.$el.querySelector("audio");

      if (this.currentSong.song) {
        var duration = this.currentSong.song.duration; // eslint-disable-line no-unused-vars
      } else {
        duration = this.currentSong.dt;
      }

      audio.ontimeupdate = () => {
        /** @type {HTMLCanvasElement} */
        // console.log(canvas);
        // 获取canvas元素
        var context = canvas.getContext("2d");
        // console.log(( audio.currentTime * 1000) / duration);
        context.clearRect(0, 0, 36, 36);
        context.beginPath();
        context.arc(18, 18, 17, 0, 2 * Math.PI);
        context.closePath();
        context.strokeStyle = "gray";
        // 描边样式
        context.lineWidth = "1";
        // 描边宽度
        context.stroke(); // 路径描边
        context.beginPath();
        context.arc(
          18,
          18,
          17,
          -0.5 * Math.PI,
          -0.5 * Math.PI +
            2 * Math.PI * ((audio.currentTime * 1000) / duration)
        );
        // context.closePath();
        context.strokeStyle = "rgba(255,0,0,0.7)";
        // 描边样式
        context.lineWidth = "1";
        // 描边宽度
        context.stroke(); // 路径描边
        // 滚动歌词
        // this.currentTime
        // currentLyricIndex
        let index;
        // console.log(this.parsedLyric.length)
        for (let i = 0; i < this.parsedLyric.length; i++) {
          if (audio.currentTime + 0.15 < this.parsedLyric[i].time) {
            index = i - 1;
            // console.log(this.parsedLyric[i].time)
            break;
          }
        }
        if (index === undefined) {
          index = this.parsedLyric.length - 1;
        }
        this.currentLyricIndex = index;
        //  nowtime
        var s = parseInt(audio.currentTime);
        var middle = 0;
        if (s >= 60) {
          middle = parseInt(s / 60);
          s = parseInt(s % 60);
          middle = middle.toString().length == 1 ? "0" + middle : middle;
          s = s.toString().length == 1 ? "0" + s : s;
          this.result = middle + ":" + s;
        } else {
          s = s.toString().length == 1 ? "0" + s : s;
          this.result = "00" + ":" + s;
        }
        //now-progress
        var durnum=(audio.currentTime * 1000) / duration;
         var durnums=(durnum*100).toFixed(4);
         if(durnums>=100){
           this.progress=0
         }
         durnums+='%';
         this.progress=durnums
        //  console.log(this.progress)
      };
    },
    getLyric: function() {
      var cachedLyric = window.localStorage.getItem(
        "lyric" + this.currentSong.id
      );
      if (cachedLyric) {
        this.currentLyric = cachedLyric;
      } else {
        axios
          .get("http://music.kele8.cn/lyric", {
            params: {
              id: this.currentSong.id
            }
          })
          .then(response => {
            this.currentLyric = response.data.lrc.lyric;
            window.localStorage.setItem(
              "lyric" + this.currentSong.id,
              response.data.lrc.lyric
            );
          });
      }
    }
  },
  computed: {
    currentSongUrl: function() {
      // console.log(this.currentSong)
      if (this.currentSong)
        return `https://music.163.com/song/media/outer/url?id=${this.currentSong.id}.mp3`;
      else return "";
    },
    parsedLyric: function() {
      if (this.currentLyric) {
        return this.currentLyric.split("\n").map(item => {
          // console.log(item);
          var regex = /\d{2}:\d{2}\.\d+/i;
          if (item.search(regex) !== -1) {
            var time = item.match(regex)[0];
            var m = time.substr(0, 2);
            var s = time.substr(3, 2);
            var n = time.substr(5);
            return {
              time: Number(m) * 60 + Number(s) + Number(n),
              text: item.substr(11) || "---------"
            };
          } else {
            return {};
          }
        });
      } else {
        return null;
      }
    }
  },
  mounted() {
    // console.log(this.parsedLyric)
    var audio = this.$el.querySelector("audio");
    this.drawProgress();
    // this.nowTime();
    audio.onplay = () => {
      // console.log("开始播放");
      this.playing = true;
    };
    audio.onpause = () => {
      // console.log("暂停播放");
      this.playing = false;
    };
  },
  watch: {
    playing: function(value) {
      var audio = this.$el.querySelector("audio");
      if (value) {
        audio.play();
      } else {
        audio.pause();
      }
    },
    currentSong: function(value) {
      this.getLyric();
      // 加入列表 需要过滤重复
      this.totalTime();
      // this.defaultPlayList.push(value);
      let isExist = this.defaultPlayList.some(item => {
        return item.id == value.id;
      });
      // console.log(isExist);
      if (!isExist) this.defaultPlayList.push(value);
      this.addHeart();
      this.isHeart();
    },
    "$route.path": function(newVal, oldVal) {
      //  console.log(newVal,oldVal)
      if (newVal !== oldVal) {
        this.showPlayList = false;
      }
    }
  },
  created() {
    this.getLyric();
    this.addHeart();
  }
};
</script>

<style lang="less" scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.playbarbottom {
  padding: 5px 0;
  background: white;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  .margin () {
    margin: 0 10px;
  }
  .thumb {
    .margin;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    animation: rotate 6s linear infinite;
    animation-play-state: paused;
    &.active {
      animation-play-state: running;
      color: blue;
    }
  }
  .info {
    flex: 1;
    font-size: 12px;
    line-height: 18px;
    h5 {
    }
    span {
      color: gray;
    }
  }
  .progress {
    .margin;
    width: 28px;
    height: 28px;
    // background: lightgray;
    position: relative;
    #canvas {
      width: 100%;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      color: lightgray;
      font-size: 12px;
      display: block;
      margin-top: -6px;
      margin-left: -6px;
      line-height: 1em;
      width: 12px;
      height: 12px;
      text-align: center;
    }
  }
  .playlist {
    .margin;
    width: 28px;
    height: 28px;
    // background: red;
    position: relative;
    border: 1px solid lightgray;
    border-radius: 50%;
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      color: lightgray;
      font-size: 12px;
      display: block;
      margin-top: -6px;
      margin-left: -6px;
      line-height: 1em;
      width: 12px;
      height: 12px;
      text-align: center;
    }
  }
}
.defaultPlayList {
  position: fixed;
  bottom: 65px;
  left: 2.5%;
  width: 95%;
  background: rgb(72, 104, 175);
  border-radius: 15px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.3);
  z-index: 9;
  color: black;
}
.fullscreenplay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .mask {
    filter: blur(30px) brightness(0.5);
    transform: scale(2);
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    z-index: -1;
  }
  header {
    height: 50px;
    // background: lightblue;
    .fa {
      color:#DED7D7;
      margin-left: 5px;
    }
  }
  .circle {
    flex: 1;
    text-align: center;
    position: relative;
    .glue {
      padding: 54px;
      // background: red;
      background-image: url("../assets/disc_light-ip6.png"),
        url("../assets/disc-ip6.png");
      background-size: 100%;
      border-radius: 50%;
      display: inline-block;
      margin-top: 84px;
      animation: rotate 6s linear infinite;
      animation-play-state: paused;
      img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    .needle {
      width: 96px;
      height: 137px;
      background-image: url("../assets/needle.png");
      // background-color: lightblue;
      background-size: 100%;
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 1;
      margin-left: -16px;
      transform: rotate(-12deg);
      transform-origin: 16px 0;
      transition: all 0.3s;
    }
    &.active {
      .needle {
        transform: rotate(0deg);
      }
      .glue {
        animation-play-state: running;
      }
    }
  }
  .lyric-box {
    flex: 1;
    overflow: hidden;
    position: relative;
    .scroll {
      text-align: center;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      margin-top: -1em;
      transition: transform 0.3s;
      li {
        line-height: 2em;
        font-size: 14px;
        height: 2em;
        color: gray;
        &.active {
          color: white;
        }
      }
    }
  }
  footer {
    height: 100px;
    width: 100%;
    position: relative;
    .top {
      width: 100%;
      height: 20px;
      display: flex;
      // font-size: 12px;
      color: black;
      align-items: center;
      // background-color: yellowgreen;
      .time-l {
        flex: 1;
        height: 20px;
        margin: 0 10px;
      }
      .mp3-progress {
        flex: 5;
        height: 6px;

        overflow: hidden;
        background-color: gray;
        .now-progress {
          height: 6px;
          background-color: red;
        }
      }
      .time-r {
        flex: 1;
        height: 20px;
        margin: 0 10px;
      }
    }
    .content {
      width: 100%;
      height: 50px;
      display: flex;
      margin-top: 10px;
      align-items: center;
      justify-content: center;
      text-align: center;
      // background-color: #766b73;

      .mode {
        flex: 1;
        img {
          width: 25px;
          height: 25px;
        }
      }
      .pre {
        flex: 1;
      }
      .pause {
        flex: 1;
        img {
          width: 35px;
          height: 35px;
        }
      }
      .next {
        flex: 1;
      }
      .heart {
        flex: 1;
        img {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
.fadeIn {
  animation-duration: 0.3s;
}
</style>