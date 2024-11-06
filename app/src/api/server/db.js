const mysql = require('mysql');

// 创建 MySQL 数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 替换为您的数据库用户名
    password: '1234', // 替换为您的数据库密码
    database: 'mydatabase' // 替换为您的数据库名称
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');

});

module.exports = db
