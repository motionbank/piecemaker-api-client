var PieceMakerApi = require( __dirname + '/../../../releases/piecemaker-api-client-current'),
	PieceMakerApiDebug = require( __dirname + '/../../../src-js/api'),
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

var user = null;

pm.createUser( 'Test user', (new Date().getTime())+'-test-user@motionbank.org', 'user', function ( u ) {
	
	user = u;
	
	pm.login( user.email, user.password, function ( api_key ) {

		console.log( 'Logged in as '+user.name, user, api_key );
		pm = null;

		var pm2 = new PieceMakerApi({
			host : config.host,
			api_key : config.super_admin.api_key,
			context : {
				pieceMakerError : function () {
					console.log( arguments );
					throw( 'PieceMakerApi exception' );
				}
			}
		});

		pm2.deleteUser( user.id, function () {

			pm2.whoAmI(function ( me ) {

				console.log('Logged in as '+me.name, me);
			});
		});
	});
});