
var PieceMakerApi = require(__dirname+'/../../src-js/api');

var pm = new PieceMakerApi({
	host : 	'http://localhost:9292',
	api_key : '0310X0fAvYo04PGK',
});

pm.listGroups(function(groups){
	console.log( groups );
});

// pm.listEventsOfType(2,'video',function(events){
// 	console.log( events.length );
// });

pm.findEvents(40,{type:'data',fields:{'data-type':'kinect3d'}},function(events){
	console.log( events );
});