
var PieceMakerApi = require(__dirname+'/../../src-js/api');

var pm = new PieceMakerApi({
	// host : 'http://infinite-sands-4012.herokuapp.com',
	// api_key : '0310XFCmtPNXLcx3'
	// host : 'http://peaceful-journey-9399.herokuapp.com',
	// api_key : '0310XAWuIcSRggIS'
	host : 'http://localhost:9292',
	api_key : '0310X4Tsm0JPGPTj',
});

pm.listGroups(function(groups){
	console.log( groups );
});

// pm.listEventsOfType(2,'video',function(events){
// 	console.log( events.length );
// });

pm.findEvents(3,{type:'data',fields:{'data-type':'kinect3d'}},function(events){
	console.log( events );
});