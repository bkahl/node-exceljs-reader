var express = require('express');
var Excel = require('exceljs');
var router = express.Router();

var date = new Date();
var workbook = new Excel.Workbook();
var filename = '../data.xlsx';

// home page
router.get('/', function(req, res) {
    res.render('index', { title: 'User Registration Page' });
});

router.get('/removeuser/:id', function(req,res) {
  var removeUserID = req.params.id;
  console.log('remove user id ',removeUserID);

  workbook.xlsx.readFile(__dirname + '/' + filename).then(function() {
    // Get the 1st worksheet
    var worksheet = workbook.getWorksheet(1);

    // remove deleted user from excel spreadsheet
    worksheet.spliceRows(removeUserID,1);

    workbook.xlsx.writeFile(__dirname + '/' + filename).then(function() {
      console.log('user deleted from spreadsheet');
    });

    res.redirect('/registeredusers');
  });
});

router.get('/registeredusers', function(req, res) {
    var registeredUsers = [];

    // Reading excel file
  	workbook.xlsx.readFile(__dirname + '/' + filename).then(function() {
  		// Get the 1st worksheet
  		var worksheet = workbook.getWorksheet(1);

      //worksheet.spliceRows(1,1);

      // Iterate over all rows that have values in a worksheet
      worksheet.eachRow(function(row, rowNumber) {
        var user = {
          id: rowNumber,
          fname: row.values[1],           // first name
          lname: row.values[2],           // last name
          lname: row.values[3],           // last name
          paidboolean: 'no',              // did user pay boolean
          dateregistered: row.values[4]   // date user signed up
          // paidboolean: row.values[4]
        }

        registeredUsers.push(user);
      });

      console.log('registered users: ', registeredUsers);

      // inside readfile fuction to avoid empty render of async call of registeredUsers
      res.render('registeredusers', {
        title: 'Registered Users',
        users: registeredUsers
      });
    });
});

router.post('/registered', function(req, res) {
    var fname = req.body.fname;         // pull the fname value from the form post
    var lname = req.body.lname;         // pull the lanme value from the form post
    var email = req.body.email;         // pull the email value from the form post

    console.log(fname, lname, email);

  	// Reading excel file
  	workbook.xlsx.readFile(__dirname + '/' + filename).then(function() {
  		// Get the 1st worksheet
  		var worksheet = workbook.getWorksheet(1);

      // get the number or rows used in the spreadsheet
  		var rowCount = worksheet.rowCount;
  		console.log('next available row ',rowCount+1);

      // next empty row within spreadsheet
  		var row = worksheet.getRow(rowCount+1);

      // set row cells with the variables posted from the form
  		row.getCell(1).value = fname;
  		row.getCell(2).value = lname;
  		row.getCell(3).value = email;
      row.getCell(4).value = 'no';
      row.getCell(5).value = date;
      //row.getCell(4).value = paidboolean;

  		// Iterate over all rows that have values in a worksheet
  		worksheet.eachRow(function(row, rowNumber) {
        //console.log('Row ' + rowNumber + ' = ' + row.values[1]);
  		  console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
  		});

  		// Save the content in a new file (formulas re-calculated)
  		workbook.xlsx.writeFile(__dirname + '/' + filename).then(function() {
  			console.log('spreadsheet updated');
  		});
  	});

    res.render('thankyou', { title: 'Thank you for registering, ' + fname + ' ' + lname + '!' });
});

module.exports = router;
