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
var handlebars = require('express-handlebars').create({defaultLayout:'main',
helpers:{
    section: function (name, options) {
        if(!this._sections){
            this._sections = {}
        }
        this._sections[name] = options.fn(this);
        return null;
    }
}});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//引入表单处理中间件 body-parser
var bodyParser = require('body-parser');
//处理文件上传的模块
var formidable = require('formidable');
app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year:now.getFullYear(),
        month:now.getMonth()
    })
});
app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if(err){
            return res.redirect(303, '/error');
        }
        //console.log('received fileds: ' + fields);
        //console.log('received files: '+ files);
        console.log('=================')
        for(var i in fields ){
            //console.log('fields字段的值')
            console.log(i + ':' + fields[i])
        }
        console.log('=================')
        for(var j in files ){
            //console.log('files字段的值')
            console.log(j + ':' + files[j])
        }
        res.redirect(303, '/thank-you');
    })
})



// Express 靠中间件处理静态文件和视图
// static 中间件可以将一个或多个目 录指派为包含静态资源的目录
app.use(express.static(__dirname + '/public'));

// 引入外部文件  必须加./ 否则到node_module中找  会出错
var fortune = require('./lib/fortune.js');
var getWeather = require('./lib/weather.js');


app.use(bodyParser.urlencoded({extended:false}));
app.get('/newsletter', function (req, res) {
    res.render('newsletter', {csrf:'CSRF goes here'});
})
app.post('/process', function (req, res) {
    console.log('Form (from querry string): ' + req.query.form);
    console.log('csrf (from querry string): ' + req.body._csrf);
    console.log('name (from querry string): ' + req.body.name);
    console.log('email (from querry string): ' + req.body.email);

    if(req.xhr || req.accepts('json, html') === 'json'){
        // 错误 时发送 {error:'error description'}
        res.send({success:true});
    }else{
        // 错误的话 重定向到错误页
        res.redirect(303, '/thank-you');
    }
})

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

    //发送随机内容
    res.render('about', {fortune:fortune.getFortune()});
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


/**
 * req. query
 一个对象， 包含以键值对存放的查询字符串参数
 * req. body
 一个对象， 包含 POST 请求参数。 这样命名是因 为 POST 请求参数在 REQUEST 正文中 传
 递， 而不像查询字符串在 URL 中传递。
 req. ip
 客户端的 IP 地址。
 • req. path
 请求路径（不包含协议、 主机、 端口 或查询字符串）
 req. route
 关于当前匹配路由的信息。 主要用于路由调试。
 • req. cookies/req. singnedCookies
 一个对象， 包含从客户端传递过来的 cookies 值。 详见第 9 章。
 • req. headers
 从客户端接收到的请求报头
 */

// 学习handlebars 局部模板
// 创建中间件
app.use(function (req, res, next) {
    if(!res.locals.partials){
        res.locals.partials = {}
    }
    res.locals.partials.weather = getWeather.getWeatherData();
    next();
})

