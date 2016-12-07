var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var skill_dal = require('../model/skill_dal');
var school_dal = require('../model/school_dal');
var company_dal = require('../model/company_dal');


// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAllX(function(err, result){
        if(err) {
            console.log(err)
            console.log(result)
            console.log('ERR X')
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,resume) {
            account_dal.getByIdR(req.query.resume_id, function(err,account) {
                skill_dal.getByIdR(req.query.resume_id, function(err,skill) {
                    school_dal.getByIdR(req.query.resume_id, function(err,school) {
                        company_dal.getByIdR(req.query.resume_id, function(err,company) {
                            if (err) {
                                console.log(err)
                                res.send(err);
                            }
                            else {
                                console.log(school)
                                console.log(account)
                                res.render('resume/resumeViewById', {'resume': resume,'account': account,'skill': skill,'school': school,'company': company});
                            }
                        });
                    });
                });
            });
        });
    }
});

// Return the add a new resume form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    resume_dal.getAll(function(err,resume) {
        account_dal.getAll(function(err,account) {
            skill_dal.getAll(function(err,skill) {
                school_dal.getAll(function(err,school) {
                    company_dal.getAll(function(err,company) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.render('resume/resumeAdd', {'resume': resume,'account': account,'skill': skill,'school': school,'company': company});
                        }
                    });
                });
            });
        });
    });
});

// View the resume for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('A resume name must be provided.');
    }
    else if(req.query.account_id == null) {
        res.send('An account must be chosen.');
    }
    else if(req.query.skill_id == null) {
        res.send('A skill must be chosen.');
    }
    else if(req.query.school_id == null) {
        res.send('A school must be chosen.');
    }
    else if(req.query.company_id == null) {
        res.send('A company must be chosen.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                // console.log(result)
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.edit(req.query.resume_id, function(err, result){
            res.render('resume/resumeUpdate', {resume: result[0][0], address: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err, r){
            account_dal.getAll(function(err,a) {
                skill_dal.getAll(function(err,sk) {
                    skill_dal.getByIdR(req.query.resume_id, function(err,skr) {
                        school_dal.getAll(function(err,sc) {
                            school_dal.getByIdR(req.query.resume_id, function(err,scr) {
                                company_dal.getAll(function(err,c) {
                                    company_dal.getByIdR(req.query.resume_id, function(err,cr) {
                                        console.log(sk);
                                        console.log(skr);
                                        res.render('resume/resumeUpdate', {'resume': r[0],'account': a,'skill': sk,'school': sc,'company': c,'skillr': skr,'schoolr': scr,'companyr': cr});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
});

router.get('/update', function(req, res){
    console.log(req.query);
    //resume_dal.update(req.query, function(err, result){
    resume_dal.delete(req.query.resume_id, function(err, result){
        resume_dal.insert(req.query, function(err,result) {
            res.redirect(302, '/resume/all');
        });
    });
});

// Delete a resume for the given resume_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

module.exports = router;

