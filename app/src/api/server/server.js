const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//配置解析token的中间件
const { expressjwt } = require('express-jwt')
app.use(expressjwt({ secret: 'SASIOVERLXRD', algorithms: ['HS256'] }).unless({
    path: [/^\/api|^\/list/]
}))
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') res.json({ status: 1, message: '身份认证失败！' })

    next();
})

const port = 3000;

const router = require('./router')
app.use(router)

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});