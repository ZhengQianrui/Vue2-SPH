<template>
  <div class="pagination">
    <button
      @click="$emit('getPageNo', pageNo - 1)"
      :disabled="pageNo === 1 ? 'disabled' : false"
    >
      上一页
    </button>
    <button
      v-if="startNumAndEndNum.start > 1"
      @click="$emit('getPageNo', 1)"
      :class="{ active: pageNo == 1 }"
    >
      1
    </button>
    <button v-if="startNumAndEndNum.start > 2">...</button>
    <!-- 中间部分 -->

    <button
      v-for="(page, index) in continues > totalPage
        ? (ctn = totalPage)
        : (ctn = continues)"
      :key="index"
      @click="$emit('getPageNo', startNumAndEndNum.end - ctn + page)"
      :class="{ active: pageNo == startNumAndEndNum.end - ctn + page }"
    >
      {{ startNumAndEndNum.end - ctn + page }}
    </button>

    <button v-if="startNumAndEndNum.end < totalPage - 1">···</button>
    <button
      v-if="startNumAndEndNum.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
    >
      {{ totalPage }}
    </button>
    <button
      @click="$emit('getPageNo', pageNo + 1)"
      :disabled="pageNo === totalPage ? 'disabled' : false"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共{{ total }}条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    startNumAndEndNum() {
      const { continues, pageNo, totalPage } = this;
      let start = 0,
        end = 0;
      //总页数没有连续页码多
      if (continues > totalPage) {
        start = 1;
        end = totalPage;
      } else {
        // 正常现象
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);
        // start出现负数或0
        if (start < 1) {
          start = 1;
          end = continues;
        }
        //end数字大于总页码
        if (end > totalPage) {
          end = totalPage;
          start = totalPage - continues + 1;
        }
      }
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>