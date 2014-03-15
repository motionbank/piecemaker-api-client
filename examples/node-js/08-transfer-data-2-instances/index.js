var PieceMakerApi = require( __dirname + '/../../../releases/piecemaker-api-client-current'),
	config = require( __dirname + '/../config/config' );

var pmSrc = new PieceMakerApi({
	host : config.host,
	api_key : config.super_admin.api_key,
	context : {
		pieceMakerError : function () {
			console.log( arguments );
			throw( 'PieceMakerApi (src) exception' );
		}
	}
});

var pmDst = new PieceMakerApi({
	host : 'http://XXXXXXXXXXXXXXXXXXXXXXXXX.herokuapp.com',
	api_key : 'XXXXXXXXXXXXXXXXXXXXXXXXX',
	context : {
		pieceMakerError : function () {
			console.log( arguments );
			throw( 'PieceMakerApi (dest) exception' );
		}
	}
});

pmDst.createGroup( 'Test group', 'No description', function ( dest_grp ) {

	pmSrc.getGroup( 24, function ( src_group ) {

		pmSrc.listEvents( src_group.id, function ( src_events ) {

			var dest_events = [];
			for ( var e in src_events ) {

				pmDst.createEvent( dest_grp.id, src_events[e], function ( de ) {

					dest_events.push( de );

					if ( dest_events.length === src_events.length ) {
						console.log( 'All done!' );
					}
				});
			}
		});
	});
});