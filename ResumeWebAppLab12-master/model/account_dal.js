var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view account_view as
 select s.*, a.street, a.zipcode from account s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM account;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(account_id, callback) {
    var query = 'SELECT * FROM account WHERE account_id = ?';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.getByIdR = function(resume_id, callback) {
    var query = 'SELECT * FROM resume a ' +
        'LEFT JOIN account aa ON a.account_id = aa.account_id ' +
        'WHERE a.resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO account (email, first_name, last_name) VALUES (?, ?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.email, params.first_name, params.last_name];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.delete = function(account_id, callback) {
    var query = 'DELETE FROM account WHERE account_id = ?';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.update = function(params, callback) {
    var query = 'UPDATE account SET email = ?, first_name = ?, las_name = ? WHERE account_id = ?';
    var queryData = [params.email, params.first_name, params.last_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS account_getinfo;

 DELIMITER //
 CREATE PROCEDURE account_getinfo (account_id int)
 BEGIN
 SELECT * FROM account WHERE account_id = account_id;
 SELECT a.*, account_id FROM address a
 LEFT JOIN account s on s.address_id = a.address_id;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL account_getinfo (4);

 */

exports.edit = function(account_id, callback) {
    var query = 'CALL account_getinfo(?)';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};