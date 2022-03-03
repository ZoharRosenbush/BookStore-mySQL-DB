var mysql = require('mysql');
const logger = require('./logger.service');
const fs = require('fs');

// Working with xammp phpmyadmin

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bookshop',
  insecureAuth: true
});


connection.connect(err => {
  if (err) {
    logger.error('Failed to connect SQL server', err);
    throw new Error('mySql failed connection');
  }
  console.log('connected to SQL server');
});

function runSQL(sqlCommand) {
  return new Promise((resolve, reject) => {
    connection.query(sqlCommand, (error, results) => {
      if (error) {
        logger.error('Failed to execute query', err);
        reject(error);
      } else resolve(results);
    });
  });
}

function runSqlEscape(sqlCommand, escapeValues) {
  return new Promise((resolve, reject) => {
    connection.query(sqlCommand, escapeValues, (error, results) => {
      if (error) {
        logger.error('Failed to execute query', error);
        reject(error);
      } else resolve(results);
    });
  });
}

module.exports = {
  runSQL,
  runSqlEscape,
};
