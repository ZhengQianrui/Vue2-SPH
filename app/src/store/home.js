import { reqCategoryList } from "@/api"

//home模块的小仓库
const state = {
    //home仓库中存储三级菜单的数据
    categoryList: [],
}
//action | 用户处理派发action地方的，可以书写异步语句、自己逻辑地方
const actions = {
    async categoryList({ commit }) {
        let result = await reqCategoryList();

        if (result.code == 200) {
            commit('CATEGORYLIST', result.data)
        }
    }

}
//mutations是唯一修改state的地方
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList;
    },
}
const getters = {}

export default {
    state,
    actions,
    mutations,
    getters
}