
var PieceMakerApi = require(__dirname+'/../../src-js/api');

var pm = new PieceMakerApi({
	host : 'http://infinite-sands-4012.herokuapp.com',
	api_key : '0310XFCmtPNXLcx3'
});

pm.listGroups(function(groups){
	console.log( groups );
});