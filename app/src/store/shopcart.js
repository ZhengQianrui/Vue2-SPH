import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from "@/api"
import { update } from "lodash"

const state = {
    cartInfoList: []
}
const mutations = {
    GETCARTLIST(state, cartInfoList) {
        state.cartInfoList = cartInfoList
    }
}
const actions = {
    async getCartList({ commit }) {

        let result = await reqCartList();

        if (result.code === 200) {
            commit('GETCARTLIST', result.data[0].cartInfoList)
        }
    },
    async deleteCartById(_, skuId) {
        let result = await reqDeleteCartById(skuId)
        if (result.code === 200) {
            return 'ok'
        } else return Promise.reject(new Error('fail to delete'))
    },
    async updateCartChecked(_, { skuId, isChecked }) {
        console.log(isChecked);
        let result = await reqUpdateCheckedById(skuId, isChecked)
        console.log(result);
    },
    async updataAllCartChecked({ dispatch }, { cartList, isChecked }) {
        await cartList.forEach(cartInfo => {
            if (cartInfo.isChecked !== isChecked ? 1 : 0) dispatch('updateCartChecked', { skuId: cartInfo.skuId, isChecked: isChecked ? 1 : 0 })
        });
    }
}
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}