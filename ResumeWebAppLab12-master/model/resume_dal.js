var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view resume_view as
 select s.*, a.street, a.zipcode from resume s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getAllX = function(callback) {
    var query = 'SELECT r.resume_id, r.resume_name, a.* ' +
        'FROM resume r ' +
        'LEFT JOIN account a ON r.account_id = a.account_id ' +
        'GROUP BY r.resume_id';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT * FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.getByIdX = function(resume_id, callback) {
    var query = 'SELECT r.resume_id, r.resume_name, a.* ' +
        'WHERE r.resume_id = ? ' +
        'GROUP BY r.resume_id';
    var queryData = [resume_id];


    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

// var query = 'INSERT INTO company (company_name) VALUES (?)';
// var queryData = [params.company_name];
// connection.query(query, params.company_name, function(err, result) {
//     var company_id = result.insertId;
//     var query = 'INSERT INTO company_address (company_id, address_id) VALUES ?';
//     var companyAddressData = [];
//     for(var i=0; i < params.address_id.length; i++) {
//         companyAddressData.push([company_id, params.address_id[i]]);
//     }
//     connection.query(query, [companyAddressData], function(err, result){
//         callback(err, result);
//     });
// });

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?);'
    var queryData = [params.resume_name, params.account_id];
    connection.query(query, queryData, function(err, result) {
        var resume_id = result.insertId;
        var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?;'
        var queryData = [];
        for(var i=0; i < params.skill_id.length; i++) {
            queryData.push([resume_id, params.skill_id[i]]);
        }
        connection.query(query, [queryData], function(err, result) {
            var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?;'
            var queryData = [];
            for(var i=0; i < params.school_id.length; i++) {
                queryData.push([resume_id, params.school_id[i]]);
            }
            console.log(params.school_id);
            console.log(queryData);
            connection.query(query, [queryData], function(err, result) {
                var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?;'
                var queryData = [];
                for(var i=0; i < params.company_id.length; i++) {
                    queryData.push([resume_id, params.company_id[i]]);
                }
                connection.query(query, [queryData], function(err, result) {
                    callback(err, result);
                });
            });
        });
    });

};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ?, account_id = ?WHERE resume_id = ?';
    var queryData = [params.resume_name, params.account_id, params.resume_id];
    connection.query(query, queryData, function(err, result) {
        updateAll(params.resume_id, params.skill_id, params.school_id, params.company_id, function(err, result) {
            callback(err, result);
        })
    });
};

var updateAll = function(resume_id, skillIDArray, schoolIDArray, companyIDArray, callback) {
    updateResumeSkill(resume_id, skillIDArray, schoolIDArray, companyIDArray, function(err, result) {
        console.log("Getting ALL for resume.");
        callback(err,result);
    });
};
module.exports.updateAll = updateAll;

var updateResumeSkill = function(resume_id, skillIDArray, schoolIDArray, companyIDArray, callback) {
    resumeSkillDeleteAll(resume_id, function(err, result) {
        console.log("Deleted from resume_skill.");
        if (skillIDArray != null) {
            console.log("Inserted into resume_skill.");
            resumeSkillInsert(resume_id, skillIDArray, function(err, result) {
                if (schoolIDArray != null) {
                    updateResumeSchool(resume_id, schoolIDArray, function(err, result) {
                        callback(err, result);

                    })
                }
                else {
                    callback(err, result);
                }
            });
        }
        else {
            console.log("Nothing to insert into resume_skill.");
            if (schoolIDArray != null) {
                updateResumeSchool(resume_id, schoolIDArray, companyIDArray, function(err, result) {
                    callback(err, result);
                });
            }
            else {
                callback(err, result);
            }
        }
    });
};
module.exports.updateResumeSkill = updateResumeSkill;

var resumeSkillInsert = function(resume_id, skillIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    for(var i=0; i < skillIdArray.length; i++) {
        resumeSkillData.push([resume_id, skillIdArray[i]]);
    }
    connection.query(query, [resumeSkillData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillInsert = resumeSkillInsert;

//declare the function so it can be used locally
var resumeSkillDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillDeleteAll = resumeSkillDeleteAll;

var updateResumeSchool = function(resume_id, schoolIDArray, companyIDArray, callback) {
    resumeSchoolDeleteAll(resume_id, function(err, result) {
        console.log("Deleted from resume_school.");
        if (schoolIDArray != null) {
            console.log("Inserted into resume_school.");
            resumeSchoolInsert(resume_id, schoolIDArray, function(err, result) {
                if (companyIDArray != null) {
                    updateResumeCompany(resume_id, companyIDArray, function(err, result) {
                        callback(err, result);
                    });
                }
                else {
                    console.log("Nothing to insert into resume_school.");
                    callback(err, result);
                }
            });
        }
        else {
            if (companyIDArray != null) {
                updateResumeCompany(resume_id, companyIDArray, function(err, result) {
                    callback(err, result);
                });
            }
            else {
                callback(err, result);
            }
        }
    });
};
module.exports.updateResumeSchool = updateResumeSchool;

var resumeSchoolInsert = function(resume_id, schoolIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSchoolData = [];
    for(var i=0; i < schoolIdArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIdArray[i]]);
    }
    connection.query(query, [resumeSchoolData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSchoolInsert = resumeSchoolInsert;

//declare the function so it can be used locally
var resumeSchoolDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSchoolDeleteAll = resumeSchoolDeleteAll;

var updateResumeCompany = function(resume_id, companyIDArray, callback) {
    resumeCompanyDeleteAll(resume_id, function(err, result) {
        console.log("Deleted from resume_company.");
        if (companyIDArray != null) {
            console.log("Inserted into resume_company.");
            resumeCompanyInsert(resume_id, companyIDArray, function(err, result) {
                callback(err, result);
            });
        }
        else {
            console.log("Nothing to insert into resume_company.");
            callback(err, result);
        }
    });
};
module.exports.updateResumeCompany = updateResumeCompany;

var resumeCompanyInsert = function(resume_id, companyIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeCompanyData = [];
    for(var i=0; i < companyIdArray.length; i++) {
        resumeCompanyData.push([resume_id, companyIdArray[i]]);
    }
    connection.query(query, [resumeCompanyData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeCompanyInsert = resumeCompanyInsert;

//declare the function so it can be used locally
var resumeCompanyDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeCompanyDeleteAll = resumeCompanyDeleteAll;

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS resume_getinfo;

 DELIMITER //
 CREATE PROCEDURE resume_getinfo (resume_id int)
 BEGIN
 SELECT * FROM resume WHERE resume_id = resume_id;
 SELECT a.*, resume_id FROM address a
 LEFT JOIN resume s on s.address_id = a.address_id;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL resume_getinfo (4);

 */

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};