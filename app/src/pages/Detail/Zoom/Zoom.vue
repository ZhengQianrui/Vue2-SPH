<template>
  <div class="spec-preview">
    <img :src="skuImageList[currentIndex].imgUrl" />
    <div class="event" @mousemove="zoom"></div>
    <div class="big" ref="big">
      <img :src="skuImageList[currentIndex].imgUrl" ref="bigImg" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  data() {
    return {
      currentIndex: 0,
    };
  },
  props: ["skuImageList"],
  mounted() {
    this.$bus.$on("getCurrentIndex", (currentIndex) => {
      this.currentIndex = currentIndex;
    });
  },
  methods: {
    zoom(e) {
      let mask = this.$refs.mask;
      let big = this.$refs.big;
      let bigImg = this.$refs.bigImg;
      let x = e.offsetX - mask.offsetWidth / 2;
      let y = e.offsetY - mask.offsetHeight / 2;

      if (x <= 0) x = 0;
      else if (x >= big.offsetWidth - mask.offsetWidth)
        x = big.offsetWidth - mask.offsetWidth;

      if (y <= 0) y = 0;
      else if (y >= big.offsetHeight - mask.offsetHeight)
        y = big.offsetHeight - mask.offsetHeight;

      let bigX = (x * bigImg.offsetWidth) / big.offsetWidth;
      let bigY = (y * bigImg.offsetHeight) / big.offsetHeight;

      this.$refs.mask.style.left = x + "px";
      this.$refs.mask.style.top = y + "px";

      this.$refs.bigImg.style.left = -bigX + "px";
      this.$refs.bigImg.style.top = -bigY + "px";
    },
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>