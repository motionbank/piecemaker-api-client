var PieceMakerApi = require( __dirname + '/../../../releases/piecemaker-api-client-current'),
	config = require( __dirname + '/../config/config' );

var pm = new PieceMakerApi({
	host : config.host,
	api_key : config.super_admin.api_key,
	context : {
		pieceMakerError : function () {
			console.log( arguments );
			throw( 'PieceMakerApi exception' );
		}
	}
});

pm.listAllGroups(function ( groups ) {
	
	console.log( groups );

	for ( var g in  groups ) {
		var group = groups[g];
		if ( group.id === 24 ) {
			
			pm.findEvents(group.id,{type:'scene'},function(evts){
				console.log( evts[0] );
			});
		}
	}
	
});