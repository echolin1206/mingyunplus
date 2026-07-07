// 纯内存数据库初始化（无需 sqlite3）
const db = require('./db');

console.log('内存数据库已初始化! 表结构:', Object.keys(db.tables).join(', '));
