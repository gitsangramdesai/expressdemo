var connectionString = process.env.DATABASE_URL || 'postgres://postgres:sangram@localhost:5432/poc';
module.exports = connectionString;