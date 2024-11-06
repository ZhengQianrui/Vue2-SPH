import { reqGetCode, reqRegister, reqLogin, reqUserInfo, reqLogout } from '@/api'

//登录和注册的模块
const state = {
    code: '',
    token: localStorage.getItem('token'),
    userInfo: {}
};
const mutations = {
    GETCODE(state, data) {
        state.code = data
    },
    SETTOKEN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    CLEAR(state) {
        state.token = ''
        state.userInfo = {}
        localStorage.removeItem('token')
    }
};
const actions = {
    async getCode({ commit }, phone) {
        let { data } = await reqGetCode(phone)
        commit('GETCODE', data)
    },
    async UserRegister({ commit }, user) {

        let result = await reqRegister(user)
        if (result.code === 200) {
            return 'ok'
        } else return Promise.reject(new Error('fail register'))
    },
    async UserLogin({ commit }, data) {
        let result = await reqLogin(data)
        console.log(result);
        commit('SETTOKEN', result.token)

        localStorage.setItem('token', result.token)
    },
    async getUserInfo({ commit }) {
        let result = await reqUserInfo()
        if (result.code === 200)
            commit('GETUSERINFO', result.data)
        else {
            alert('登录失效'); commit('CLEAR')
        }
    },
    async UserLogout({ commit }) {

        commit('CLEAR')
        return 'ok'

    }
};
const getters = {};
export default {
    state,
    mutations,
    actions,
    getters
}