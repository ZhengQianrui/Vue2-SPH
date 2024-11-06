import { reqGetSearchInfo } from "@/api"

//home模块的小仓库
const state = {
    searchList: {},
}
//action | 用户处理派发action地方的，可以书写异步语句、自己逻辑地方
const actions = {
    async getSearchList({ commit }, params = {}) {
        //当前这个函数在调用获取服务数据的时候，至少传递一个参数
        let result = await reqGetSearchInfo(params);
        console.log(params);
        if (result.code == 200) {
            commit("GETSEARCHLIST", result.data);
        }
    },

}
//mutations是唯一修改state的地方
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList;
    },
}
//计算属性，在项目当中，为了简化数据而生
const getters = {
    goodsList(state) {
        return state.searchList.goodsList || [];
    },
    trademarkList(state) {
        return state.searchList.trademarkList;
    },
    attrsList(state) {
        return state.searchList.attrsList;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}