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

var role, user, group, events = [];

pm.listRoles( function ( rr ) {
	pm.createRole( 'group_user', 'user', '', function ( r ) {

		console.log( r );
		role = r;

		pm.addPermissionToRole( role.id, 'create_new_event' );
		pm.addPermissionToRole( role.id, 'update_event' );
		pm.addPermissionToRole( role.id, 'delete_event' );
		pm.addPermissionToRole( role.id, 'get_my_event_groups' );
		pm.addPermissionToRole( role.id, 'get_events' );

		pm.createUser( 'Test user', (new Date().getTime())+'-user@motionbank.org', 'user', 
			function ( u ) {
				user = u;

				pm.createGroup( 'Test group', '... no description', function ( g ) {
					group = g;

					pm.addUserToGroup( group.id, user.id, 'group_user', function(){

						console.log( 'Logging in as temp user' );

						pm.login( user.email, user.password, function(){

							var next = function () {
								pm.createEvent( group.id, { type: 'test-event', utc_timestamp: new Date().getTime(), duration: 1}, 
									function ( e ) {
										events.push(e);
										if ( events.length < 100 ) next();
										else cleanUp();
									});
							}
							next();
						});
					});
				});
			});
	});
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

	pm.deleteGroup( group.id, function(){ console.log( 'Group deleted' ); });
	pm.deleteUser( user.id, function(){ console.log( 'User deleted' ); });
	pm.deleteRole( role.id, function(){ console.log( 'Role deleted' ); });
}