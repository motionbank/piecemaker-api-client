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

pm.listAllGroups( pm.createCallback( function ( groups ) {
	
	for ( var g in groups ) {
		print( groups[g].id + " " + groups[g].title );
	}
	
} ) );