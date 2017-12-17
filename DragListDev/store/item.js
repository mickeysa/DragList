var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var item = new Schema({
    label:{type:String,required:true },
    seq:{type:Number,required:true,default:-1},
    root:{type:Boolean,required:true,default:false},
    children:{type:[ObjectId],required: false},
    updateDate: {type: Number, required: false},///date when information updated
    createDate: {type: Number, required: true}
});

exports.Item = mongoose.model('Item', item);