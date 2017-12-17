/**
 * Create a database connection n return the connection
 * 
 * @imp : please handle database connection exception
 * it throws a Exception in err on connection fail
 * @author Mahesh
 */
var mongoose = require('mongoose');
var config = require('config');
exports.connect = function(callback,errorCallback) {
    var dbConfig = config.get('dbConfig');
	mongoose.connect(dbConfig.url);
	var db = mongoose.connection;
	db.on('error',function(err){//error on connection
		console.error.bind(console, 'connection error:');
		console.error('Mogooose could not connect db server.');
		if(typeof (errorCallback)=='function'){
			errorCallback(err)
		}
	});
	db.once('open', function() {//connection done
		console.log('-------------Mogooose is connected to db server-------------');
		callback();
	});
	
};