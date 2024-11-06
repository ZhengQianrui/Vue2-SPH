import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index"

Vue.use(VueRouter);



const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/Home'
        },
        {
            path: '/Home',
            component: () => import("@/pages/Home"),
            meta: { show: true }
        },
        {
            path: '/Register',
            component: () => import("@/pages/Register")
        },
        {
            path: '/Login',
            component: () => import("@/pages/Login"),
            meta: { show: false }
        },
        {
            name: "search",
            path: '/Search/:keyword?',
            component: () => import("@/pages/Search"),
            meta: { show: false }
        },
        {
            name: 'Detail',
            path: '/Detail/:skuId',
            component: () => import("@/pages/Detail"),
            meta: { show: true },


        },
        {
            path: '/AddCartSuccess',
            component: () => import("@/pages/AddCartSuccess"),
            meta: { show: true },

        },
        {
            path: '/ShopCart',
            component: () => import("@/pages/ShopCart"),
            meta: { show: true }
        },
        {
            path: '/Trade',
            component: () => import("@/pages/Trade"),
            meta: { show: true },
            beforeEnter(to, from, next) {

                if (from.path === '/shopCart' || from.path === '/') {
                    next()
                } else {
                    next('/shopCart')
                }
            }

        },
        {
            path: '/pay',
            component: () => import("@/pages/Pay"),
            meta: { show: true }
        },
        {
            path: '/paysuccess',
            component: () => import("@/pages/PaySuccess"),
            meta: { show: true }
        },
        {
            path: '/center',
            component: () => import("@/pages/Center"),
            meta: { show: true }
        }
    ],
    scrollBehavior() {
        return { y: 0 }
    }
})

router.beforeEach((to, from, next) => {


    let token = store.state.user.token
    if (token) {
        store.dispatch('getUserInfo');
        if (to.path == "/Login" || to.path == "/Register") {
            next("/Home")
        }
        //登录了，但去的不是Login
        else {
            next()
        }
    }
    //未登录
    else {
        //如果去的是购物车等需要登录的页面
        if (to.path == "/trade" || to.path == "/pay" || to.path == "/ShopCart") next("/Login")
    }

    next()

})

export default router