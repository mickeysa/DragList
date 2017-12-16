var config = require('config');
var http = require('http');
var https = require('https');
var getNodeEnv = function () {
    return process.env['NODE_ENV'] || 'development';
};
/***
 * Checks if string is valid ObjectId
 * @return {boolean}
 */
var isObjectId = function(id){
	var regX = new RegExp("^[0-9a-fA-F]{24}$");//^[0-9a-fA-F]{24}$
	if(typeof id === 'string') {
        return regX.test(id);
    }else {
        return false;
    }
};
/***
 * Checks if list is valid ObjectId array
 */
var isValidObjectIdArray = function(list){
	if(list instanceof Array){
		for(var x=0;x<list.length ;x++){
			if(!isObjectId(list[x]))
				return false;
		}
		return true;
	}else
		return false;
};

var stringSizeInBytes = function(str){
	 return Buffer.byteLength(str, 'utf8');
};
var isNumber=function(o){
    if (typeof o === 'number')
        return true;
	return ! isNaN (o-0) && o !== null && o.replace(/^\s\s*/, '') !== "" && o !== false;
};

/***
 * Checks if list is valid Number array
 */
var isNumberArray = function(list){
    if(list instanceof Array){
        for(var x=0;x<list.length ;x++){
            if(!isNumber(list[x]))
                return false;
        }
        return true;
    }else
        return false;
};

/***
 * Save all data in db
 */
var saveAllInDocs =function(dataList,callback){
	var data = dataList.pop();
	data.save(function(err){
		if(err){
			console.error(err.message,err);
		}
		if(!dataList.length){
			if(typeof (callback) == 'function'){
				callback(dataList.length);
			}
			return;
		}
		saveAllInDocs(dataList,callback);
	});
};
/**
 * Check if object empty
 */
var isObjectEmpty = function(obj) {
    // null and undefined are "empty"
    if (obj === null || obj===undefined) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
};

var isStringEmpty = function(str){
	if(str===null || str===undefined)return true;
    if (str.length > 0)    return false;
    if (str.length === 0)  return true;
	return true;
};

/**
 * Get first day of thr week
 */
var getFirstDayOfWeek = function(){
	var curr = new Date;
	var first= new Date(curr.setDate(curr.getDate() - curr.getDay()));
	first.setHours(0);first.setMinutes(0);first.setSeconds(0);
	return first;
};
var getDayBeforeYesterday = function(){
	var date = new Date();
	date.setDate(date.getDate() - 1);
	date.setHours(0);date.setMinutes(0);date.setSeconds(0);
	return date;
};
/***
 * change data to yesterday and time to 00:00:00
 */
var getYesterday = function(){
	var date =getYesterdayDate();
	date.setHours(0);date.setMinutes(0);date.setSeconds(0);
	return date ; 
};

/**
 * change the date to yes
 */
var getYesterdayDate = function(){
	var date = new Date();
	date.setDate(date.getDate() - 1);
	return date ; 
};
/**
 * Get the fisrt day of the week
 */
var getMonday = function (d) {
	d = new Date(d);
	var day = d.getDay(),
	diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
	return new Date(d.setDate(diff));
};

var getFistDayOfMonth = function(date){
	if(date=== undefined )
		date = new Date();
	return new Date(date.getFullYear(), date.getMonth(), 1);
};
/**
 * Get all date beween dates
 * @return date[]
 */
var getAllDates = function(from,to){
	var currentDate = from;
	var between = [];
	while (currentDate <= to) {
		between.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}
	return between;
};

/**
 * Get all weeks from date range
 */
var getAllWeeks = function(from,to){
	var between = [];
	var currentDate = getMonday(from);//start from monday
	while (currentDate <= to) {
		between.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 7);
	}
	return between;
};

/**
 * Get all weeks from date range
 */
var getAllHours = function(from,to){
	var between = [];
	var currentDate = getMonday(from);//start from monday
	while (currentDate <= to) {
		between.push(new Date(currentDate));
		currentDate.setHours(currentDate.getHours() + 1);
	}
	return between;
};

/**
 * Get all months from date range
 */
var getAllMonts = function(from,to){
	var between = [];
	to = new Date(to.getFullYear(), to.getMonth() + 1, 1);
	var currentDate = new Date(from.getFullYear(), from.getMonth(), 1);
	while (currentDate <= to) {
		between.push(new Date(currentDate));
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+ 1, 1);
		console.log(currentDate);
	}
	return between;
};

var addMinutesToDate = function(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
};

var addDaysToDate = function (date, days) {
    /* millis,seconds,minutes,hours */
    date.setDate(date.getDate() + days);
    return date;
};

var dateAdd = function (date, interval, units) {
    var ret = new Date(date); //don't change original date
    switch(interval.toLowerCase()) {
        case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
        case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
        case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
        case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
        case 'day'    :  ret.setDate(ret.getDate() + units);  break;
        case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
        case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
        case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
        default       :  ret = undefined;  break;
    }
    return ret;
}
/**
 * get the file name
 * @param file(file)
 * @returns {*}
 */
var getFileNameByFileObject = function (file) {
    if(file.originalname){//for new multer
        return file.originalname;
    }else if(file.name){//for old multer
        return file.name;
    }else{
        console.log('we are not sure which field have the file name');
        return '';
    }
};

/**
 *  get the file ext
 * @param filename
 * @param def
 * @returns {*}
 */
var getExtension = function (filename,def) {
    var a = filename.split(".");
    if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
        return def;
    }
    return a.pop();
};
/**
 * get the file name from url or path
 * @param url
 * @returns {XML|string|void|*|{by}}
 */
var getFilename = function(url){
   return url.replace(/^.*[\\\/]/, '');
};
/**
 * get the file name from a url or path excluding the extention
 * @param url{string}
 * @returns {string}
 */
var getFileNameWithoutExt = function (url) {
    return url.match(/([^\/]+)(?=\.\w+$)/)[0];
};


/**
 * check if file name | path | ulr is image
 * @param fileName{string} file name | path | ulr
 * @returns {boolean}
 */
var isImageFile = function (fileName) {
   return fileName.match(/\.(jpeg|jpg|gif|png)$/i) != null;
};

/**
 * get country name by it's code
 * @param countryCode
 * @returns {String}
 */
var  getCountryName =function(countryCode) {
    countryCode = countryCode.toUpperCase();
    if (config.get('countries').hasOwnProperty(countryCode)) {
        return config.get('countries')[countryCode];
    } else {
        return countryCode;
    }
};

var getBooleanParam = function (value, defVal) {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        return value == "1" || value == "true";
    }
    if (typeof value === 'number') {
        return value == 1;
    }
    return defVal;
};

var getDayOfMonthSuffix = function(n) {
    //checkArgument(n >= 1 && n <= 31, "illegal day of month: " + n);
    if((n >= 1 && n <= 31)) {
        if (n >= 11 && n <= 13) {
            return "th";
        }
        switch (n % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }else{
        throw new Error("illegal day of month: " + n);
    }
};

var dateFormat = function () {
    var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var	_ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    showingDate:"mmm dS -hTT"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
/**
 * get the user last seen time string base on current time
 * like : active 10sec ago
 * @param previous
 * @returns {string}
 */
var  getLastSeenString = function(previous) {
	var current=new Date();
    //var msPerSec = 1000;
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerWeek = msPerHour * 24 * 7;
	var msPerMonth = msPerDay * 30;
	//var msPerYear = msPerDay * 365;
	var elapsed = current - previous;
	if (elapsed < msPerMinute) {
		return 'active ' +(Math.round(elapsed / 1000)<=10?'just now' : Math.round(elapsed / 1000) + 's ago');
	}else if (elapsed < msPerHour) {
		return 'active ' + Math.round(elapsed / msPerMinute) + 'm ago';
	}else if (elapsed < msPerDay) {
		return 'active ' + Math.round(elapsed / msPerHour) + 'h ago';
	}else if (elapsed < msPerMonth && elapsed <= msPerWeek) {
		return 'active ' + (Math.round(elapsed / msPerDay) == 1 ? 'yesterday' : (Math.round(elapsed / msPerDay) + ' days ago'));
	}else if (elapsed < msPerMonth && elapsed >= msPerWeek) {
		return 'active ' + (Math.round(elapsed / msPerDay) <= 7 ? ' 7 days ago' : new Date(previous).format("m/d/yyyy"));
	}else{
        return new Date(previous).format("m/d/yyyy");
    }
    /*else if (elapsed < msPerYear) {
     return 'active ' + (Math.round(elapsed / msPerMonth) == 1 ? 'month ago' : (Math.round(elapsed / msPerMonth) + 'months ago'));
     }else {
     return 'active ' + (Math.round(elapsed / msPerYear) == 1 ? 'year ago' : (Math.round(elapsed / msPerYear) + ' years ago'));
     }*/
};

var cloneObject = function (obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};
var guid =function()  {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
//get first name from the full name
var getFirstName = function(name){
    var ind = name.indexOf(' ');
    return name.substring(0,ind>0?ind:name.length);
};
var MAX_GROUP_NAME_LENGTH = 25;
/**
 * Create the group name
 * name like( Mahesh, Aaina +10)
 * @param rosters {{name:string}[]}
 * @returns {string}
 */
var getGroupName =function(rosters){
    var groupName="";
    for(var x=0;x<rosters.length ;x++){
        var temp="";
        var remainText = ' +'+(rosters.length-x);
        if(groupName!=""){
            temp+=", ";
        }else{
            if((rosters[x].name.length+remainText.length)> MAX_GROUP_NAME_LENGTH){
            }
        }
        temp += getFirstName(rosters[x].name);
        if((groupName.length + temp.length + remainText.length) < MAX_GROUP_NAME_LENGTH){
            groupName += temp;
        }else{
            groupName +=remainText;
            break;
        }
    }
    return groupName;
};


/**
 * remove an object from array
 * @param arr
 * @returns {Array}
 */
var arrayWithout =function(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
};

var stringStartWith =function(string,string2){
    return string.indexOf(string2) === 0;
};
/**
 * check object have all the properties
 * @param obj{Object}
 * @param properties{string[]}
 * @returns {boolean}
 */
var hasAllProperties = function(obj,properties){
    for(var x=0;x<properties.length;x++){
        if(!obj.hasOwnProperty(properties[x])){
            return false;
        }
    }
    return true;
};
/**
 * check two string are equal without worry about cast
 * @param str1{string}
 * @param str2{string}
 * @returns {boolean}
 */
var equalsIgnoreCaseString = function(str1,str2){
    return str1.toUpperCase() === str2.toUpperCase();
};

/**
 * Urlencodes a JSON object of key/value query parameters.
 * @param {Object} parameters Key value pairs representing URL parameters.
 * @return {string} query parameters concatenated together.
 */
var getQueryString = function (parameters) {
    var params = [];
    for (var p in parameters) {
        params.push(encodeURIComponent(p) + '=' +
        encodeURIComponent(parameters[p]));
    }
    return params.join('&');
};

/**
 * Creates a JSON object of key/value pairs
 * @param {string} paramStr A string of Url query parmeters.
 *    For example: max-results=5&startindex=2&showfolders=true
 * @return {Object} The query parameters as key/value pairs.
 */
var unstringifyQueryString = function (paramStr) {
    var parts = paramStr.split('&');

    var params = {};
    for (var i = 0, pair; pair = parts[i]; ++i) {
        var param = pair.split('=');
        params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
    }
    return params;
};
/**
 *  split the first and last name
 * @param name{string}
 * @returns {{FirstName: string, LastName: (string)}}
 */
var splitFirstLastName = function (name) {
    if(isStringEmpty(name)){
        return {
            FirstName:"",
            LastName:""
        }
    }else {
        var parts = name.split(' ');
        return {
            FirstName: parts[0],
            LastName: parts[1] || ''
        };
    }
};
/**
 * Check for valid emaill address
 * @param email
 * @returns {boolean}
 */
var isValidEmail=function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};
/**
 * create the image url by appending the time stamp at the end
 * this fix the caching issue
 * @param url{string}
 * @param [updateDateInt]{number}
 * @returns {string}
 */
var getUpdateUserPicUrl = function (url,updateDateInt) {
    if(updateDateInt == undefined){
        updateDateInt = new Date().getTime();
    }
    if(isStringEmpty(url)){
        return url;
    }else if(url.indexOf('api.exigo.com') !=-1){// url is from Exigo
        return url + "/" + updateDateInt;
    }else if(url.indexOf("?")!=-1){//already contain query string
        return url + "&date=" + updateDateInt;
    }else{
        return url + "?date=" + updateDateInt;
    }
};

/**
 *  Encrypt the text
 * @param messageStr {string}
 * @param passStr {string}
 * @returns {string|*}
 * @private
 */
var encryptMessageText = function (messageStr, passStr) {
    var iv = CryptoJS.enc.Hex.parse('0000000000000000');
    var passSHA256 = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(passStr));
    var encrypted = CryptoJS.AES.encrypt(messageStr, passSHA256, { iv: iv });
    return encrypted.toString();
};
/**
 * Decrypt the text
 * @param messageStr
 * @param passStr
 * @returns {string|*}
 */
var decryptMessageText = function (messageStr, passStr) {
    try {
        var iv = CryptoJS.enc.Hex.parse('0000000000000000');
        var passSHA256 = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(passStr));
        var decrypted = CryptoJS.AES.decrypt(messageStr, passSHA256, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (err) {
        console.log("error in decryption: " + err.message);
        return messageStr;
    }
};

/***
 * Decrypt the auth token for DirectScale
 */
var decryptAuthTokenForDS = function (token) {
    //var tinyUrl = config.get('tinyUrl');
    var iv = CryptoJS.enc.Utf8.parse("6qf98xc9b2s1dfgh");
    var passSHA256 = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse("md!5342%$^&"));
    var decrypted = CryptoJS.AES.decrypt(token, passSHA256, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
};
/***
 * Decrypt the auth token for SaintSwipe
 */
var decryptAuthTokenForSaintSwipe = function (token) {
    var iv = CryptoJS.enc.Hex.parse('6qmlaf98xcmax1dfalu');
    var passSHA256 = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse("M]xWKE9TAt&K$9L"));
    var decrypted = CryptoJS.AES.decrypt(token, passSHA256, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
};
//console.log('the values was ' , decryptAuthTokenForDS("8YwI4myohMt9XBkEyD/n+S0pvWPnIbPY/dn21jSoA/8iBsLENe3o/NOFk97G1c+k"));

/**
 * check if valid json string
 * @param test
 * @returns {boolean}
 */
var isValidJSON = function(test) {
    try {
        JSON.parse(test);
    } catch (ex) {
        console.log(ex);
        return false;
    }
    return true;
};
/**
 * Get the folder name for the media file by its mime type
 * @param mimeType{string}
 * @returns {string}
 */
var getMediaTypeFolderName = function (mimeType) {
    if(stringStartWith(mimeType,"image")){
        return "images/";
    }else if(stringStartWith(mimeType,"video")){
        return "videos/";
    }else if(stringStartWith(mimeType,"audio")){
        return "audios/";
    }else if(stringStartWith(mimeType,"text")){
        return "docs/";
    }else{
        return "others/";
    }
};


/**
 * send a http request
 * @param options
 * @param data
 * @param callback
 */
var sendHttpRequest = function(options,data, callback){
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)        {
        var output = '';
        //console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });
        res.on('end', function() {
            callback(null,res.statusCode, output);
        });
    });

    req.on('error', function(err) {
        callback(err);
    });
    if(options.method == "POST"){
        req.write(data);
    }
    req.end();
};
/**
 * generate new 6 digit random number
 * @returns {number}
 */
var generateNewOtp = function(){
    return Math.floor(100000 + Math.random() * 900000);
};
/**
 * get the hid
 * @param str
 * @returns {*}
 */
var getHiddenPhoneNumber = function (str) {
    if(isStringEmpty(str)){
        return "";
    }else if(str.length>=5){
        var hide = new Array(str.length -5 + 1).join( "*" );
        return str.substring(0,3)+ hide + str.substring(str.length -2,str.length);
    }else{
        return str;
    }
};
/**
 * check if arg is a function
 * @param object
 * @returns {boolean}
 */
var isFunction = function(object){
    return typeof object === 'function'
};
/**
 * check if valid url string
 * @param urlStr{string}
 * @returns {boolean}
 */
var isValidUrlWithProtocol = function(urlStr){
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/.test(urlStr);
};
/**
 * Normalize a port into a number, string, or false.
 * @param val
 * @returns {*}
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
//public access
exports.getNodeEnv = getNodeEnv;
exports.getYesterday = getYesterday;
exports.getAllWeeks = getAllWeeks;
exports.getAllHours = getAllHours;
exports.getAllDates = getAllDates;
exports.getAllMonts = getAllMonts;
exports.getDayBeforeYesterday = getDayBeforeYesterday;
exports.getFirstDayOfWeek =getFirstDayOfWeek ;
exports.isObjectEmpty = isObjectEmpty;
exports.isStringEmpty = isStringEmpty;
exports.isObjectId = isObjectId;
exports.isValidObjectIdArray=isValidObjectIdArray;
exports.isNumber=isNumber;
exports.isNumberArray = isNumberArray;
exports.saveAllInDocs = saveAllInDocs;
exports.getExtension = getExtension;
exports.getCountryName = getCountryName;
exports.getLastSeenString = getLastSeenString;
exports.getBooleanParam = getBooleanParam;
exports.dateFormat = dateFormat;
exports.cloneObject = cloneObject;
exports.guid = guid;
exports.getFirstName = getFirstName;
exports.getGroupName =getGroupName;
exports.arrayWithout = arrayWithout;
exports.stringStartWith = stringStartWith;
exports.hasAllProperties = hasAllProperties;
exports.equalsIgnoreCaseString = equalsIgnoreCaseString;
exports.getQueryString = getQueryString;
exports.unstringifyQueryString = unstringifyQueryString;
exports.splitFirstLastName = splitFirstLastName;
exports.isValidEmail = isValidEmail;
exports.getUpdateUserPicUrl = getUpdateUserPicUrl;
exports.encryptMessageText = encryptMessageText;
exports.decryptMessageText = decryptMessageText;
exports.isImageFile = isImageFile;
exports.getFilename = getFilename;
exports.getFileNameByFileObject = getFileNameByFileObject;
exports.getMediaTypeFolderName = getMediaTypeFolderName;
exports.isValidJSON = isValidJSON;
exports.sendHttpRequest = sendHttpRequest;
exports.generateNewOtp = generateNewOtp;
exports.getHiddenPhoneNumber = getHiddenPhoneNumber;
exports.isFunction = isFunction;
exports.isValidUrlWithProtocol = isValidUrlWithProtocol;
exports.normalizePort = normalizePort;
exports.decryptAuthTokenForDS = decryptAuthTokenForDS;
exports.decryptAuthTokenForSaintSwipe = decryptAuthTokenForSaintSwipe;