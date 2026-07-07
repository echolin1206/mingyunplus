// 纯内存数据库 - 适配 Vercel Serverless 环境
// 无需 sqlite3 原生模块，零编译依赖

const tables = {
    users: [],
    orders: [],
    divination_records: [],
    daily_almanac: [],
    tarot_cards: []
};

const autoIncrement = {
    users: 0,
    orders: 0,
    divination_records: 0,
    daily_almanac: 0,
    tarot_cards: 0
};

// 模拟 SQLite 的 db.run 方法
function run(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    // 内存数据库不需要执行 SQL，所有操作通过专用 API
    if (callback) setTimeout(() => callback(null), 0);
}

// 模拟 db.get 方法
function get(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    // 解析 SQL 找到表名和 WHERE 条件（简化版）
    const table = parseTable(sql);
    const where = parseWhere(sql, params);
    
    let row = null;
    if (table && tables[table]) {
        row = tables[table].find(r => matchWhere(r, where));
    }
    
    if (callback) setTimeout(() => callback(null, row), 0);
    return row;
}

// 模拟 db.all 方法
function all(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    const table = parseTable(sql);
    const where = parseWhere(sql, params);
    
    let rows = [];
    if (table && tables[table]) {
        rows = tables[table].filter(r => matchWhere(r, where));
    }
    // 排序：默认按 created_at 降序
    if (sql.includes('ORDER BY') && sql.includes('created_at')) {
        rows = rows.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
    }
    // 限制
    if (sql.includes('LIMIT')) {
        const limitMatch = sql.match(/LIMIT\s+(\d+)/);
        if (limitMatch) {
            rows = rows.slice(0, parseInt(limitMatch[1]));
        }
    }
    
    if (callback) setTimeout(() => callback(null, rows), 0);
    return rows;
}

// 插入数据
function insert(table, data) {
    if (!tables[table]) tables[table] = [];
    autoIncrement[table]++;
    const row = { ...data, id: autoIncrement[table] };
    tables[table].push(row);
    return row;
}

// 更新数据
function update(table, where, data) {
    if (!tables[table]) return 0;
    let count = 0;
    for (const row of tables[table]) {
        if (matchWhere(row, where)) {
            Object.assign(row, data);
            count++;
        }
    }
    return count;
}

// 解析 SQL 表名
function parseTable(sql) {
    const match = sql.match(/FROM\s+(\w+)/i);
    return match ? match[1] : null;
}

// 解析 WHERE 条件（简化版）
function parseWhere(sql, params) {
    const where = {};
    const match = sql.match(/WHERE\s+(.+?)(?:ORDER|LIMIT|$)/i);
    if (!match) return where;
    
    const conditions = match[1].split(/AND/i).map(c => c.trim());
    let paramIdx = 0;
    
    for (const cond of conditions) {
        const eq = cond.match(/(\w+)\s*=\s*\?/);
        if (eq && params[paramIdx] !== undefined) {
            where[eq[1]] = params[paramIdx];
            paramIdx++;
        }
    }
    return where;
}

function matchWhere(row, where) {
    for (const [key, val] of Object.entries(where)) {
        if (row[key] !== val) return false;
    }
    return true;
}

module.exports = {
    run,
    get,
    all,
    insert,
    update,
    tables,
    autoIncrement
};
