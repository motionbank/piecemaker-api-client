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

var user, admin;

pm.createUser( 
	'Herr Administrator', 
   (new Date().getTime())+'-admin@motionbank.org', 
   'super_admin',
   pm.createCallback( function ( a ) {
   	 admin = a;
   	 pm.login( 
         admin.email, 
         admin.password, 
         pm.createCallback( function ( api_key ) {
      	 	pm.createUser( 
      	 		'Herr Normalo', 
      	 		(new Date().getTime())+'-user@motionbank.org', 
      	 		'user', 
               pm.createCallback( function ( u ) {
      	 			user = u;
      	 			pm.updateUser( 
      	 				user.id, 'Der Herr Normalo', 
      	 				user.email, user.user_role_id, false, true, 
      	 				pm.createCallback( function ( u2 ) {
      	 					print( admin.name, user.name, u2.name );
      	 					user = u2;
      	 					pm.login( 
                           user.email, 
                           user.password, 
      	 						pm.createCallback( function ( api_key ) {
      	 							cleanUp();
      	 				      }));
      	 			   }));
      	 		}));
   	 	}))
   }));

var cleanUp = function () {
	pm = new PieceMakerApi(
      this, 
      config.host,
      config.super_admin.api_key
   );

	pm.deleteUser( user.id,  pm.createCallback( function(){ print( 'User deleted' );       }));
	pm.deleteUser( admin.id, pm.createCallback( function(){ print( 'Temp admin deleted' ); }));
}