import requests from "./request";
//发送请求返回结果Promis对象

//http://localhost:3000
export const reqCategoryList = () => requests({ url: 'http://gmall-h5-api.atguigu.cn/api/product/getBaseCategoryList', method: 'get' });
//获取搜索模块数据
//给服务器传递参数，至少是一个空对象
export const reqGetSearchInfo = (params) => requests({ url: 'http://gmall-h5-api.atguigu.cn/api/list', data: params, method: 'post' });

export const reqGoodsInfo = (skuid) => requests({ url: `http://gmall-h5-api.atguigu.cn/api/item/${skuid}`, method: 'get' });



//获取验证码
export const reqGetCode = (phone) => requests({ url: `http://localhost:3000/api/user/passport/sendCode/${phone}`, method: 'get' })

export const reqRegister = (data) => requests({ url: 'http://localhost:3000/api/user/passport/register', data, method: 'post' })

export const reqLogin = (data) => requests({ url: 'http://localhost:3000/api/user/passport/login', data, method: 'post' })

export const reqUserInfo = () => requests({ url: 'http://localhost:3000/user/passport/auth/getUserInfo', method: 'get' })

export const reqLogout = () => requests({ url: 'http://gmall-h5-api.atguigu.cn/api/user/passport/logout', method: 'get' })

//获取购物车信息
export const reqCartList = () => requests({ url: 'http://localhost:3000/cart/cartList', method: 'get' })

export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({ url: `http://localhost:3000/cart/addToCart/${skuId}/${skuNum}`, method: 'post' });

export const reqDeleteCartById = (skuId) => requests({ url: `http://localhost:3000/cart/deleteCart/${skuId}`, method: 'delete' })

//修改商品的选中状态
export const reqUpdateCheckedById = (skuId, isChecked) => requests({ url: `http://localhost:3000/cart/checkCart/${skuId}/${isChecked}`, method: 'get' })


//获得用户地址信息
export const reqAddressInfo = () => requests({ url: `/api/user/userAddress/auth/findUserAddressList`, method: 'get' })

//获取商品清单
export const reqOrderInfo = () => requests({ url: `http://localhost:3000/order/auth/trade`, method: 'get' })

//提交订单
export const reqSubmitOrder = (data) => requests({ url: `http://localhost:3000/order/auth/submitOrder`, data, method: 'post' })

//获取订单信息
export const reqGetOrders = (pageNo) => requests({ url: `http://localhost:3000/order/auth/getOrders/${pageNo}`, method: 'get' })

//模拟支付成功
export const reqPaySuccess = (tradeNo) => requests({ url: `http://localhost:3000/order/auth/paySuccess/${tradeNo}`, method: 'get' })
