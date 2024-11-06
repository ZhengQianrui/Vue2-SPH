<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          v-for="cartInfo in cartInfoList"
          :key="cartInfo.skuId"
          class="cart-list"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              v-model="cartInfo.isChecked"
              @change="updateCartChecked(cartInfo.skuId, $event.target.checked)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl || cartInfo.defaultImg" />
            <div class="item-msg">
              {{ cartInfo.skuName || cartInfo.title }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cartInfo.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="minusNum(cartInfo)"
              >-</a
            >
            <input
              autocomplete="off"
              type="number"
              :value="cartInfo.skuNum"
              minnum="1"
              class="itxt"
              @change="
                $emit('handler', 'change', $event.target.value, cartInfo)
              "
            />
            <a href="javascript:void(0)" class="plus" @click="addNum(cartInfo)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cartInfo.skuNum * cartInfo.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCart(cartInfo.skuId)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          @click="chooseAll(cartInfoList, $event.target.checked ? 1 : 0)"
          :checked="count === cartInfoList.length"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">
          已选择 <span> {{ count }} </span> 件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ total }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/Trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "ShopCart",
  mounted() {
    this.$store.dispatch("getCartList");
    this.$on("handler", this.handler);
    this.debouncedReqCartList = _.debounce(() => {
      this.$store.dispatch("getCartList");
    }, 500);
  },
  computed: {
    cartInfoList() {
      return this.$store.state.shopcart.cartInfoList || [];
    },
    count() {
      return this.cartInfoList.reduce(
        (count, cartInfo) => (cartInfo.isChecked ? (count += 1) : count),
        0
      );
    },
    total() {
      return this.cartInfoList.reduce(
        (sum, cartInfo) =>
          cartInfo.isChecked ? sum + cartInfo.skuNum * cartInfo.skuPrice : sum,
        0
      );
    },
  },
  methods: {
    chooseAll(cartInfoList, isChecked) {
      cartInfoList.forEach((cart) => {
        if (cart.isChecked !== isChecked) {
          cart.isChecked = isChecked;
          this.$store.dispatch("updateCartChecked", {
            skuId: cart.skuId,
            isChecked,
          });
        }
      });
    },
    minusNum(cartInfo) {
      if (cartInfo.skuNum > 1) cartInfo.skuNum -= 1;
      else return;
      this.$emit("handler", "minus", -1, cartInfo);
    },
    addNum(cartInfo) {
      cartInfo.skuNum += 1;
      this.$emit("handler", "add", 1, cartInfo);
    },

    async handler(type, disNum, cartInfo) {
      switch (type) {
        case "add":
          break;
        case "minus":
          break;
        case "change":
          if (disNum < 1) disNum = 1;
          disNum = parseInt(disNum) - cartInfo.skuNum;
          cartInfo.skuNum += disNum;
          break;
      }
      try {
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cartInfo.skuId,
          skuNum: disNum,
        });

        // this.debouncedReqCartList(); // 调用防抖函数
      } catch (e) {
        console.log(e.message);
      }
    },
    async deleteCart(skuId) {
      try {
        await this.$store.dispatch("deleteCartById", skuId);
        this.$store.dispatch("getCartList");
      } catch (e) {
        console.log(e.message);
      }
    },
    async updateCartChecked(skuId, isChecked) {
      await this.$store.dispatch("updateCartChecked", {
        skuId,
        isChecked: isChecked ? 1 : 0,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 20px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .itxt::-webkit-outer-spin-button,
          .itxt::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
          }

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;
    margin-bottom: 20px;
    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>