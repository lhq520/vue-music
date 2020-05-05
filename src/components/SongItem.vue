<template>
  <li class="songitem" @click="$emit('tanslate-song', songItem)">
    <span class="order" v-if="options.order !== undefined">{{options.order + 1}}</span>
    <div class="main" v-if="songItem.song" :style="{marginLeft: options.order !== undefined? '0px':'10px'}">
      <h3>
        {{songItem.name}}
        <span class="alias">{{songItem.song.alias[0]}}</span>
      </h3>
      <div class="info" v-if="options.info !== false">
        <i class="icon icon-quality"></i>
        <span class="artists">{{joinArtists(songItem.song.artists)}}</span>
        <span class="album">-{{songItem.song.album.name}}</span>
      </div>
    </div>
     <!-- 热歌榜 -->
     <div class="main" v-else-if="songItem.ar" :style="{marginLeft: options.order !== undefined? '0px':'10px'}">
      <h3>
        {{songItem.name}}
        <span class="alias" v-show="songItem.alia.length">({{songItem.alia[0]}})</span>
      </h3>
      <div class="info" v-if="options.info !== false">
        <i class="icon icon-quality"></i>
        <span class="artists">{{songItem.ar[0].name}}</span>

        <span class="album">-{{songItem.al.name}}</span>
      </div>
    </div>
     <!-- 搜索列表 -->
    <div class="main" v-else :style="{marginLeft: options.order !== undefined? '0px':'10px'}">
      <h3>
        {{songItem.name}}
        <span class="alias">{{songItem.alia}}</span>
      </h3>
      <div class="info" v-if="options.info !== false">
        <i class="icon icon-quality"></i>
        <span class="artists">{{joinArtists(songItem.artists)}} </span>
        <span class="album">-{{songItem.album.name}}</span>
      </div>
    </div>
    <img
      class="icon icon-play"
      style="background:none"
      v-if="currentSong && songItem.id === currentSong.id"
      src="../assets/playing.svg"
      alt
    />
    <i v-else class="icon icon-play"></i>
  </li>
</template>

<script>
export default {
  props: {
    options: Object,
    songItem: [Object,Array],
    currentSong: Object,
    playing:Boolean
  },
  methods: {
    joinArtists: function(artists) {
      return artists.map(artist => artist.name).join(" / ");
    },
  },
  created(){
    // console.log(this.songItem.id);
    // console.log(this.currentSong)
  },
  watch:{
    
  }
};
</script>

<style lang="less" scoped>
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
.songitem {
  display: flex;
  margin: 10px 0;
  align-items: center;
  .order {
    font-size: 18px;
    width: 2em;
    // background: red;
    text-align: center;
    color: rgb(189, 189, 189);
  }
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
</style>