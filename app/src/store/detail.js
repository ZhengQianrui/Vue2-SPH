import { reqAddOrUpdateShopCart, reqGoodsInfo } from "@/api"
const state = {
    goodInfo: {},
}
const actions = {
    async GetgoodInfo({ commit }, skuid) {
        let result = await reqGoodsInfo(skuid);
        if (result.code === 200) {
            commit('GETGOODINFO', result.data)
        }
    },
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        let result = await reqAddOrUpdateShopCart(skuId, skuNum);
        if (result.code == 200) {
            return 'ok';
        } else {
            return Promise.reject(new Error('fail了'));
        }
    },
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo;
    }
}
const getters = {
    categoryView(state) {
        return state.goodInfo.categoryView || {};
    },
    skuInfo(state) {
        return state.goodInfo.skuInfo || {};
    },
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || [];
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}