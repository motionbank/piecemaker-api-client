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

var role, user, group, events = [];

var noop = pm.createCallback(function(){});

pm.listRoles( pm.createCallback( function ( rr ) {
	
	print( rr );

	pm.createRole( 'group_user', 'user', '', pm.createCallback( function ( r ) {

		print( r );

		role = r;

		pm.addPermissionToRole( role.id, 'create_new_event', 	noop );
		pm.addPermissionToRole( role.id, 'update_event', 		noop );
		pm.addPermissionToRole( role.id, 'delete_event', 		noop );
		pm.addPermissionToRole( role.id, 'get_my_event_groups', noop );
		pm.addPermissionToRole( role.id, 'get_events', 			noop );

		pm.createUser( 'Test user', (new Date().getTime())+'-user@motionbank.org', 'user', 
			pm.createCallback( function ( u ) {
				user = u;

				pm.createGroup( 'Test group', '... no description', pm.createCallback( function ( g ) {
					group = g;

					pm.addUserToGroup( group.id, user.id, 'group_user', pm.createCallback( function(){

						print( 'Logging in as temp user' );

						pm.login( user.email, user.password, pm.createCallback( function(){

							var next = function () {
								var eventData = new Packages.java.util.HashMap();
								eventData.put( 'type', 			'test-event');
								eventData.put( 'utc_timestamp', new Date().getTime());
								eventData.put( 'duration', 		1);
								pm.createEvent( group.id, eventData, 
									pm.createCallback( function ( e ) {
										events.push(e);
										if ( events.length < 100 ) next();
										else cleanUp();
									}));
							}
							next();
						}));
					}));
				}));
			}));
	}));
}));

var cleanUp = function () {
	pm = new PieceMakerApi(
      this, 
      config.host,
      config.super_admin.api_key
   );

	pm.deleteGroup( group.id, pm.createCallback( function(){ print( 'Group deleted' ); }));
	pm.deleteUser(  user.id,  pm.createCallback( function(){ print( 'User deleted' );  }));
	pm.deleteRole(  role.id,  pm.createCallback( function(){ print( 'Role deleted' );  }));
}