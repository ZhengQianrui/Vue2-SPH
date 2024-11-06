const express = require('express')
var router = express.Router()

const db = require('./db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//获取三级联动数据
router.get('/api/product/getBaseCategoryList', (req, res) => {

    const query1 = 'SELECT * FROM category1 ORDER BY id';
    const query2 = 'SELECT * FROM category2 ORDER BY id';
    const query3 = 'SELECT * FROM category3 ORDER BY id';
    var result2, result3, categoryTree = {};
    db.query(query3, (err, result) => {
        if (err) {
            console.error('查询失败:', err);
            return res.status(500).json({ error: '数据库查询失败' });
        }
        result3 = result.map(item => ({
            parent2: item.parent2,
            categoryId: item.id,
            categoryName: item.name,
        }));
    });
    db.query(query2, (err, result) => {
        if (err) {
            console.error('查询失败:', err);
            return res.status(500).json({ error: '数据库查询失败' });
        }
        result2 = result.map(item => ({
            parent1: item.parent1,
            categoryId: item.id,
            categoryName: item.name,
            categoryChild: result3.filter((e) => e.parent2 === item.id)
        }));

        db.query(query1, (err, result) => {
            if (err) {
                console.error('查询失败:', err);
                return res.status(500).json({ error: '数据库查询失败' });
            }
            categoryTree = result.map(item => ({
                categoryId: item.id,
                categoryName: item.name,
                categoryChild: result2.filter((e) => e.parent1 === item.id)
            }));
            // 返回 JSON 响应
            res.json({ code: 200, data: categoryTree });
        })
    });


});
//获取商品信息
router.post('/api/list', (req, res) => {

    const { categoryName, category1Id, category2Id, category3Id } = req.body;
    let sqlstr = ""
    if (category1Id) sqlstr = `SELECT * FROM goodslist WHERE categoryName LIKE "%${categoryName}%" AND 
    category1Id = ${category1Id} `;
    else if (category2Id) sqlstr = `SELECT * FROM goodslist WHERE categoryName LIKE "%${categoryName}%" AND 
    category2Id = ${category2Id} `;
    else sqlstr = `SELECT * FROM goodslist WHERE categoryName LIKE "%${categoryName}%" AND 
    category3Id = ${category3Id} `;
    db.query(sqlstr, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        res.json({
            code: 200, data: {
                total: results.length,
                goodsList: results
            }
        })
    })

})
//获取验证码
var verificationCodes = {}//存储账号和验证码的映射
router.get(`/api/user/passport/sendCode/:phone`, (req, res) => {
    const verificationCode = parseInt(Math.random() * (999999 - 100000) + 100000).toString();
    verificationCodes[req.params.phone] = verificationCode;
    res.json({ code: 200, data: verificationCode })
});
//注册模块
router.post('/api/user/passport/register', (req, res) => {

    let { phone, code, password } = req.body
    if (!phone || !password) return res.json({ status: 1, message: "用户名或密码不能为空!" });
    const sqlstr = `SELECT * FROM user WHERE phone=${phone}`;

    db.query(sqlstr, (err, results) => {
        if (err) {
            return res.json({ status: 1, message: err.message })
        }
        if (results.length > 0) {
            return res.json({ status: 1, message: "用户名被占用,请更换!" })
        }
        //todo
        password = bcrypt.hashSync(password, 10)
        //检验验证码
        if (code === verificationCodes[phone]) {
            delete verificationCodes[phone]

            db.query(`INSERT INTO user set?`, { phone: phone, password: password }, (err, results) => {
                if (err) {
                    return res.json({ status: 1, message: err.message })
                }
                if (results.affectedRows !== 1) {
                    return res.json({ status: 1, message: "注册用户失败，请稍后再试" })
                }
                res.json({ code: 200, message: "注册成功！" })
            })
        }
    });

});
//登录模块
router.post('/api/user/passport/login', (req, res) => {

    let { phone, password } = req.body
    const sqlstr = `SELECT * FROM user WHERE phone=${phone}`
    db.query(sqlstr, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        if (results.length !== 1) return res.json({ status: 1, message: "登录失败!" })
        const compareResult = bcrypt.compareSync(password, results[0].password)
        if (!compareResult) return res.json({ status: 1, message: "密码错误!" })
        const user = { ...results[0], password: "" }
        const token = jwt.sign(user, 'SASIOVERLXRD', {
            expiresIn: '1h'
        })
        res.json({
            code: 200,
            token: token,
            message: "登陆成功"
        })
    })
})
//获取用户信息
router.get('/user/passport/auth/getUserInfo', (req, res) => {

    const userInfo = req.auth
    if (!userInfo) return res.json({ status: 1, message: "登录过期" })
    db.query(`SELECT * FROM user WHERE id=${userInfo.id}`, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        const result = { ...results[0], password: "" }
        return res.json({ code: 200, data: result })
    })
})

//退出登录
// router.get('/api/user/passport/logout', (req, res) => { })

//获取购物车信息
router.get('/cart/cartList', (req, res) => {
    const userInfo = req.auth
    db.query(`SELECT * FROM goodslist,shopcar WHERE phone=${userInfo.phone} AND shopcar.skuId=goodslist.id`, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        else
            res.json({ code: 200, data: [{ cartInfoList: results }] })
    })
})
//加入购物车操作
router.post('/cart/addToCart/:skuId/:skuNum', (req, res) => {
    const { skuId, skuNum } = req.params
    const userInfo = req.auth

    db.query(`SELECT * FROM shopcar WHERE phone=${userInfo.phone} AND skuId=${skuId}`, (err, results) => {
        if (results.length === 0) {
            db.query(`INSERT INTO shopcar SET ?`, { phone: userInfo.phone, skuId, skuNum }, (err, results) => {
                if (err) return res.json({ status: 1, message: err.message })
                if (results.affectedRows === 1) return res.json({ code: 200, data: null, message: "加入成功!" })
            })
        }
        else db.query(`UPDATE shopcar SET skuNum=skuNum+${skuNum} WHERE phone=${userInfo.phone}`, (err, results) => {
            if (err) return res.json({ status: 1, message: err.message })
            if (results.affectedRows === 1) return res.json({ code: 200, data: null, message: "加入成功!" })
        })
    })
})
//修改商品的选中状态
router.get('/cart/checkCart/:skuId/:isChecked', (req, res) => {
    const userInfo = req.auth
    const { skuId, isChecked } = req.params
    db.query(`UPDATE shopcar SET isChecked=${isChecked} WHERE phone=${userInfo.phone} AND skuId=${skuId}`, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        if (results.affectedRows === 1) return res.json({ code: 200, data: null, message: "修改成功!" })
    })
})
//从购物车移除商品
router.delete(`/cart/deleteCart/:skuId`, (req, res) => {
    const userInfo = req.auth
    const { skuId } = req.params
    db.query(`DELETE FROM shopcar WHERE phone=${userInfo.phone} AND skuId=${skuId}`, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        if (results.affectedRows === 1) res.json({ code: 200, message: "移除成功!" })
    })
})


//获取订单信息
router.get('/order/auth/trade', (req, res) => {
    const userInfo = req.auth
    db.query(`SELECT * FROM shopcar,goodslist WHERE phone=${userInfo.phone} AND isChecked=1 AND shopcar.skuId=goodslist.id`, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        let originalTotalAmount = 0;
        let totalNum = results.reduce((totalNum, e) => {
            originalTotalAmount += e.skuNum * e.skuPrice
            return totalNum += e.skuNum
        }, 0)
        res.json({
            code: 200, data: {
                tradeNo: Math.random().toString(36).substr(2),
                originalTotalAmount,
                totalNum,
                totalAmount: originalTotalAmount,
                detailArrayList: results
            }
        })

    })
})

//提交订单
router.post(`/order/auth/submitOrder`, (req, res) => {

    const orderInfo = req.body

    db.query(`INSERT INTO orders SET ?`, { tradeNo: orderInfo.tradeNo, totalPrice: orderInfo.totalAmount, status: 0 }, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        if (results.affectedRows === 1) {
            try {
                orderInfo.detailArrayList.forEach((e) => {
                    db.query(`INSERT INTO order_items SET ?`, { order_id: orderInfo.tradeNo, order_skuId: e.skuId, order_skuNum: e.skuNum }, (err, results) => {
                        if (err) throw new Error("提交失败")
                    })
                })
            } catch (e) {
                console.log(e);
            }
        }
        res.json({ code: 200, data: { tradeNo: orderInfo.tradeNo, totalAmount: orderInfo.totalAmount }, message: "提交成功!" })
    })
})

//获取订单记录
router.get(`/order/auth/getOrders/:pageNo`, (req, res) => {
    const { pageNo } = req.params

    db.query(`SELECT * FROM orders,user WHERE order_phone=phone ORDER BY orders.id DESC`, (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        let total = results.length
        const promises = results.map(order => {
            return new Promise((resolve, reject) => {
                db.query(`SELECT * FROM order_items, goodslist WHERE order_id=? AND order_skuId=goodslist.id`, [order.tradeNo], (e, result) => {
                    if (e) return reject(e);
                    order['items'] = result;
                    resolve();
                });
            });
        });

        // 使用 Promise.all 等待所有的查询完成
        Promise.all(promises)
            .then(() => {
                let splitResults = []
                while (results.length !== 0) splitResults.push(results.splice(0, 5))
                res.json({ code: 200, data: { total, ordersList: splitResults[pageNo - 1] } });
            })
            .catch(e => {
                res.json({ status: 1, message: e.message });
            });

    })
})

//支付请求
router.get('/order/auth/paySuccess/:tradeNo', (req, res) => {
    const { tradeNo } = req.params
    db.query(`UPDATE orders SET status=1 WHERE tradeNo=?`, [tradeNo], (err, results) => {
        if (err) return res.json({ status: 1, message: err.message })
        if (results.affectedRows === 1) return res.json({ code: 200, message: "支付成功" })
    })
})
module.exports = router
