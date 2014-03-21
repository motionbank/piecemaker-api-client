
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

var cb = function (pm,fn) {
	return pm.createCallback(fn);
}

var user = null;

pm.createUser( 'Test user', (new Date().getTime())+'-test-user@motionbank.org', 'user', cb(pm,function ( u ) {
	
	user = u;
	
	pm.login( user.email, user.password, cb(pm,function ( api_key ) {

		print( 'Logged in as '+user.name, user, api_key );
		pm = null;

		var pm2 = new PieceMakerApi(
			this,
			config.host,
			config.super_admin.api_key
		);

		pm2.deleteUser( user.id, cb(pm2,function () {

			pm2.whoAmI( cb(pm2,function ( me ) {

				print('Logged in as '+me.name, me);
			}));
		}));
	}));
}));