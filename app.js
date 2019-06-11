var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: false }))

app.post("/reset",function(req, res){
    var mysql_connect = mysql.createConnection({
        host: '192.168.1.3',
        user: 'test',
        password: '34281762',
        database: 'db_boot'
    });
    mysql_connect.connect();
    var resetSql = "UPDATE db_boot.db_study SET Done = 0 ORDER BY `Index` DESC LIMIT 1";
    mysql_connect.query(resetSql);
    mysql_connect.end();
    setTimeout(function(){
        res.send(200);
    },1000)
});

app.post("/submitted",function(req, res){
    var mysql_connect = mysql.createConnection({
        host: '192.168.1.3',
        user: 'test',
        password: '34281762',
        database: 'db_boot'
    });
    mysql_connect.connect();
    var userAddSql = "INSERT INTO db_boot.db_study(Done, Name, Location, Href) VALUES(?, ?, ?, ?)";
    var userAddSql_Params = [true, req.body.data.Name, req.body.data.Location, req.body.data.Href];
    mysql_connect.query(userAddSql, userAddSql_Params);
    mysql_connect.end();
    setTimeout(function(){
        res.send(200);
    },1000)
});

app.get("/data",function(req, res){
    var mysql_connect = mysql.createConnection({
        host: '192.168.1.3',
        user: 'test',
        password: '34281762',
        database: 'db_boot'
    });
    mysql_connect.connect();
    var resData = {data:{
        "Done": false,
        "Name": "#",
        "Location": "#",
        "Href": "#",
        "Submission": false
    }};
    mysql_connect.query('SELECT * FROM db_boot.db_study ORDER BY `Index` DESC LIMIT 1', function (error, results) {
        if(results !== undefined && results.length > 0){
            resData.data.Done = parseFloat(results[0].Done) === 1;
            resData.data.Name = results[0].Name;
            resData.data.Location = results[0].Location;
            resData.data.Href = results[0].Href;
        }
        res.send(resData);
        mysql_connect.end();
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;