/**
 * Created by thinkpad on 2016/12/17.
 */
var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:'+ app.get('port')+ ';press Ctrl-C to terminate.');
})

//设置handlebar 模板引擎
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Express 靠中间件处理静态文件和视图
// static 中间件可以将一个或多个目 录指派为包含静态资源的目录
app.use(express.static(__dirname + '/public'));



//路由
app.get('/', function (req, res) {
    // 不再指定内容类型和状态码了： 视图引擎默认会返回 text/html 的内容类型和 200 的状态码
    //res.type('text/plain');
    //res.send('my travel site');

    res.render('home');
})

app.get('/about', function (req, res) {
    //res.type('text/plain');
    //res.send('about page');
   var rand = fortunes[Math.floor(Math.random() * fortunes.length)];
    //发送随机内容
    res.render('about', {fortune:rand});
})


//404
app.use(function (req, res, next) {
    //res.type('text/plain');
    res.status(404);
    //res.send('404 not found');

    res.render('404')
})

//500
app.use(function (err, req, res, next) {
    console.log(err.stack);
    //res.type('text/plain');
    res.status(500);
    //res.send('500 Server Error');

    res.render('500')
});


var fortunes = [
    " Conquer your fears or they will conquer you. " ,
    " Rivers need springs. " ,
    " Do not fear what you don' t know. " ,
    " You will have a pleasant surprise. " ,
    " Whenever possible, keep it simple. "
]