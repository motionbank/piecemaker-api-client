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

var user, admin;

pm.createUser( 
	'Herr Administrator', 
   (new Date().getTime())+'-admin@motionbank.org', 
   'super_admin',
   function ( a ) {
   	 admin = a;
   	 pm.login( admin.email, admin.password, function ( api_key ) {
   	 	
   	 	pm.createUser( 
   	 		'Herr Normalo', 
   	 		(new Date().getTime())+'-user@motionbank.org', 
   	 		'user', function ( u ) {
   	 			user = u;
   	 			pm.updateUser( 
   	 				user.id, 'Der Herr Normalo', 
   	 				user.email, user.user_role_id, false, true, 
   	 				function ( u2 ) {
   	 					console.log( user, u2 );
   	 					user = u2;
   	 					pm.login( user.email, user.password, 
   	 						function ( api_key ) {
   	 							cleanUp();
   	 				});
   	 			});
   	 		});
   	 	})
   });

var cleanUp = function () {
	pm = new PieceMakerApi({
		host : config.host,
		api_key : config.super_admin.api_key,
		context : {
			pieceMakerError : function () {
				console.log( arguments );
				throw( 'PieceMakerApi exception' );
			}
		}
	});

	pm.deleteUser( user.id, function(){ console.log( 'User deleted' ); });
	pm.deleteUser( admin.id, function(){ console.log( 'Temp admin deleted' ); });
}