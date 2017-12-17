var Item = require('./../store/item').Item;
var AppUtil = require("./../controller/AppUtil");
var async = require('async');
/*
var aItem = new Item({
    label: "Mintu ka pota",
    seq: 0,
    updateDate: new Date().getTime(),
    createDate: new Date().getTime()
});
aItem.save(function (err, done) {

});

exports.listAll = function (req, res) {
    var _childFinder = function (mItem, callback) {
        Item.find({_id: mItem.children}, function (err, items) {
            if (err) {
                callback(err);
            } else {
                pushChildrens(mItem, items, callback);
            }
        });
    };

    var pushChildrens = function (mItem, items, callback) {
        mItem.children = [];
        for (var x = 0; x < items.length; x++) {
            var item = items[x];
            mItem.children.push({
                _id: item._id,
                seq: item.seq,
                label: item.label,
                children: item.children
            });
        }
        var limit = Math.min(3, items.length);
        async.eachLimit(mItem.children, limit, function (mItem, callback) {
            if (mItem.children.length) {
                _childFinder(mItem, callback);
            } else {
                callback();
            }
        }, function (err) {
            callback(err);
        });
    };

    Item.find({root: true}, function (err, items) {
        if (err) {
            res.send(500);
        } else {
            var result = {};
            pushChildrens(result, items, function (err) {
                if (err) {
                    res.send(500);
                } else {
                    res.status(200).json(result.children);
                }
                /*if(err){
                    res.send(500,err);
                }else{
                    res.render('listAll', { title: 'List',list:result });
                }*/
            });
        }
    });

    /*Item.find({},'label seq',{sort:{seq:1}},function (err, curr) {
     if(err){
     res.send(500,err);
     }else{
     console.log('res',curr);
     res.render('listAll', { title: 'List',list:curr });
     }
     });*/
};


exports.saveOrder = function (req, res) {
    //console.log('the req body ', req.body);
    var newOrder = req.body.order;
    if (newOrder) {
        var _updater = function (root, newOrder, callback) {
            var limit = Math.min(3, newOrder.length);
            async.eachLimit(newOrder, limit, function (mItem, callback) {
                var seq = newOrder.indexOf(mItem);
                var children = [];
                for (var x = 0; x < mItem.children.length; x++) {
                    children.push(mItem.children[x]._id);
                }
                Item.update({_id: mItem._id}, {
                    seq: seq,
                    label: mItem.label,
                    root: root,
                    children: children,
                    updateDate: new Date().getTime()
                }, function (err, result) {
                    if (err) {
                        console.log('the error ', err);
                        callback(children);
                    } else {
                        if (children.length) {
                            _updater(false, mItem.children, callback);
                        } else {
                            callback();
                        }
                    }
                });
            }, callback);
        };

        _updater(true, newOrder, function (err) {
            if (err) {
                console.log('the error ', err);
                res.send(500);
            } else {
                res.send(200, "Seved!");
            }
        });
    } else {
        res.send('400', "Not valid ids array");
    }


    /*if(AppUtil.isValidObjectIdArray(newOrder)){
     async.eachLimit(newOrder,3,function (id,callback) {
     var seq = newOrder.indexOf(id);
     Item.update({_id:id},{seq:seq},callback);
     },function (err) {
     res.send(200,"Data saved");
     });
     }else{
     res.send('400',"Not valid ids array");
     }*/
};