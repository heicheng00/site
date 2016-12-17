/**
 * Created by thinkpad on 2016/12/17.
 */

var fortunes = [
    " Conquer your fears or they will conquer you. " ,
    " Rivers need springs. " ,
    " Do not fear what you don' t know. " ,
    " You will have a pleasant surprise. " ,
    " Whenever possible, keep it simple. "
]

//对外暴露方法  加在express上
exports.getFortune = function () {
    var rand = fortunes[Math.floor(Math.random() * fortunes.length)];
    return rand;
}