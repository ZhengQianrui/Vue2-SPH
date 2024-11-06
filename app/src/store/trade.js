import { reqAddressInfo, reqOrderInfo, reqSubmitOrder } from "@/api"

const state = {
    address: [],
    orderInfo: {}
}
const mutations = {
    GEtUSERADDRESS(state, address) {
        state.address = address
    },
    GETORDERINFO(state, orderInfo) {
        state.orderInfo = orderInfo
    },

}
const actions = {
    async getUserAddress({ commit }) {
        let result = await reqAddressInfo()
        if (result.code === 200) {
            commit('GEtUSERADDRESS', result.data)
        }
    },
    async getOrderInfo({ commit }) {
        let result = await reqOrderInfo()
        if (result.code === 200) {
            commit('GETORDERINFO', result.data)
        }
    },
    async submitOrder(_, data) {
        await reqSubmitOrder(data)
    }
}
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}