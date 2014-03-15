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
	
});