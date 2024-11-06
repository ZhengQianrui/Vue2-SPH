import { reqGetOrders } from "@/api"
const state = {
    orders: {}
}
const actions = {
    async getOrders({ commit }, pageNo) {
        let { data } = await reqGetOrders(pageNo);
        commit('GETORDERS', data)
    }
}
const mutations = {
    GETORDERS(state, data) {
        state.orders = data
    }
}
const getters = {

}

export default {
    state,
    actions,
    mutations,
    getters
}