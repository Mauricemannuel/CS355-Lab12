var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view skill_view as
 select s.*, a.street, a.zipcode from skill s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM skill;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(skill_id, callback) {
    var query = 'SELECT * FROM skill WHERE skill_id = ?';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.getByIdR = function(resume_id, callback) {
    var query = 'SELECT a.*, aaa.name, aaa.description, aaa.skill_id FROM resume a ' +
        'LEFT JOIN resume_skill aa ON a.resume_id = aa.resume_id ' +
        'LEFT JOIN skill aaa ON aa.skill_id = aaa.skill_id ' +
        'WHERE a.resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO skill (name, description) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.name, params.description];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.delete = function(skill_id, callback) {
    var query = 'DELETE FROM skill WHERE skill_id = ?';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.update = function(params, callback) {
    var query = 'UPDATE skill SET name = ?, description = ? WHERE skill_id = ?';
    var queryData = [params.name, params.description, params.skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS skill_getinfo;

 DELIMITER //
 CREATE PROCEDURE skill_getinfo (skill_id int)
 BEGIN
 SELECT * FROM skill WHERE skill_id = skill_id;
 SELECT a.*, skill_id FROM address a
 LEFT JOIN skill s on s.address_id = a.address_id;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL skill_getinfo (4);

 */

exports.edit = function(skill_id, callback) {
    var query = 'CALL skill_getinfo(?)';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};