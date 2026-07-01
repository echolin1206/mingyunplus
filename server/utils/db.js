const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : path.join(__dirname, '../../config/mingyunplus.db');

if (!isVercel) {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
}

const db = new sqlite3.Database(dbPath);

db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        union_id TEXT UNIQUE,
        nickname TEXT,
        avatar TEXT,
        phone TEXT,
        is_vip INTEGER DEFAULT 0,
        vip_expire INTEGER,
        created_at INTEGER DEFAULT (strftime('%s','now'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        order_no TEXT UNIQUE,
        product_type TEXT,
        amount REAL,
        status INTEGER DEFAULT 0,
        pay_channel TEXT DEFAULT 'alipay',
        pay_time INTEGER,
        created_at INTEGER DEFAULT (strftime('%s','now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS divination_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        input_data TEXT,
        result_data TEXT,
        is_free INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s','now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS daily_almanac (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE,
        yi TEXT,
        ji TEXT,
        lucky_color TEXT,
        lucky_color_value TEXT,
        blessing TEXT,
        fortune_score INTEGER,
        created_at INTEGER DEFAULT (strftime('%s','now'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tarot_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        name_en TEXT,
        arcana TEXT,
        number INTEGER,
        image TEXT,
        keywords TEXT,
        upright_meaning TEXT,
        reversed_meaning TEXT,
        element TEXT,
        constellation TEXT
    )`);
});

module.exports = db;
