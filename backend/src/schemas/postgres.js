const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();



const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  logging: false, // Disable logging for cleaner output
});

console.log('Sequelize connected...');


try {
    sequelize.authenticate();
    // sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize; // create Database Tables
// export default sequelize;