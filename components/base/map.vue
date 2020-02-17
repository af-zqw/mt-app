<template>
  <div :id="id"
       :style="{width:width+'px',height:height+'px'}"
       class="map-index">
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 300
    },
    width: {
      type: Number,
      default: 300
    },
    point: {
      type: Array,
      default() {
        return [116.46, 39.92]
      }
    }
  },
  data() {
    return {
      id: `map`,
      key: '036485e36815b4b76ace876c17040435'
    }
  },
  watch: {
    point(val, old) {
      this.map.setCenter(val) // 设置地图显示的中心点
      this.marker.setPosition(val) // 设置点标记位置
    }
  },
  mounted() {
    let _this = this
    _this.id = `map${Math.random().toString().slice(4, 6)}`

    window.onmaploaded = () => {
      // 声明地图类
      let map = new window.AMap.Map(_this.id, {
        resizeEnable: true,
        zomm: 11,
        center: this.point
      })
      _this.map = map
      // 插件
      window.AMap.plugin('AMap.ToolBar', () => { // 缩放条
        let toolbar = new window.AMap.ToolBar()
        map.addControl(toolbar)
      })
      // marker为地图上的标记物
      let marker = new window.AMap.Marker({
        icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: _this.point
      })
      _this.marker = marker
      marker.setMap(map) //为Marker指定目标显示地图
    }
    // 声明script标签
    const url = `https://webapi.amap.com/maps?v=1.4.15&key=${_this.key}&callback=onmaploaded`
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
}
</script>