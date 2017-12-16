var Item = require('./../store/item').Item;
var AppUtil = require("./../controller/AppUtil");
var async = require('async');
/*
var aItem = new Item({
    label:"Mahesh",
    seq:3,
    updateDate: new Date().getTime(),
    createDate: new Date().getTime()
});
aItem.save(function (err, done) {

});
*/

exports.listAll = function (req, res) {
    Item.find({},'label seq',{sort:{seq:1}},function (err, curr) {
        if(err){
            res.send(500,err);
        }else{
            console.log('res',curr);
            res.render('listAll', { title: 'List',list:curr });
        }
    });
};
exports.saveOrder = function (req, res) {
     var newOrder = req.body.newOrderIds;
     console.log('order ids ',newOrder);
     if(AppUtil.isValidObjectIdArray(newOrder)){
        async.eachLimit(newOrder,3,function (id,callback) {
            var seq = newOrder.indexOf(id);
            Item.update({_id:id},{seq:seq},callback);
        },function (err) {
            res.send(200,"Data saved");
        });
     }else{
         res.send('400',"Not valid ids array");
     }
};