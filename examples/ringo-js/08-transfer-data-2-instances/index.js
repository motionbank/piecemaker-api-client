var fs = require('fs');
var cp = '../../../dist/PieceMaker2Lib/library';
var jars = fs.list(cp);
for ( var j in jars ) {
   if ( /\.jar$/i.test(jars[j]) )
      addToClasspath( module.resolve( cp + '/' + jars[j] ) );
}

importPackage( org.piecemaker2.api );
importPackage( org.piecemaker2.models );

var config = require('../config/config.js');

var pm = new PieceMakerApi(
      this, 
      config.host,
      config.super_admin.api_key
   );

var pmSrc = new PieceMakerApi(
      this, 
      config.host,
      config.super_admin.api_key
   );

var pmDst = new PieceMakerApi(
		this,
		'http://XXXXXXXXXXXXXXXXXXXXXXXXX.herokuapp.com',
		'XXXXXXXXXXXXXXXXXXXXXXXXX'
	);

pmDst.createGroup( 'Test group', 'No description', pmDst.createCallback( function ( dest_grp ) {

	pmSrc.getGroup( 24, pmSrc.createCallback( function ( src_group ) {

		pmSrc.listEvents( src_group.id, pmSrc.createCallback( function ( src_events ) {

			var dest_events = [];
			for ( var e in src_events ) {
				pmDst.createEvent( dest_grp.id, src_events[e], pmDst.createCallback( function ( de ) {

					dest_events.push( de );

					if ( dest_events.length === src_events.length ) {
						print( 'All done!' );
					}
				}));
			}
		}));
	}));
}));