var express = require('express');
var router = express.Router();
var address_dal = require('../model/address_dal');
var address_dal = require('../model/address_dal');


// View All addresss
router.get('/all', function(req, res) {
    address_dal.getAll(function(err, result){
        if(err) {
            console.log(err)
            console.log(result)
            console.log('ERR X')
            res.send(err);
        }
        else {
            res.render('address/addressViewAll', { 'result':result });
        }
    });

});

// View the address for the given id
router.get('/', function(req, res){
    if(req.query.address_id == null) {
        res.send('address_id is null');
    }
    else {
        address_dal.getById(req.query.address_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('address/addressViewById', {'result': result});
            }
        });
    }
});

// Return the add a new address form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    address_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('address/addressAdd', {'address': result});
        }
    });
});

// View the address for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.street == null) {
        res.send('A street name must be provided.');
    }
    else if(req.query.zip_code == null) {
        res.send('A zip code must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        address_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/address/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.address_id == null) {
        res.send('A address id is required');
    }
    else {
        address_dal.edit(req.query.address_id, function(err, result){
            res.render('address/addressUpdate', {address: result[0][0], address: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.address_id == null) {
        res.send('A address id is required');
    }
    else {
        address_dal.getById(req.query.address_id, function(err, address){
            res.render('address/addressUpdate', {address: address[0]});
        });
    }

});

router.get('/update', function(req, res){
    address_dal.update(req.query, function(err, result){
        res.redirect(302, '/address/all');
    });
});

// Delete a address for the given address_id
router.get('/delete', function(req, res){
    if(req.query.address_id == null) {
        res.send('address_id is null');
    }
    else {
        address_dal.delete(req.query.address_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/address/all');
            }
        });
    }
});

module.exports = router;
