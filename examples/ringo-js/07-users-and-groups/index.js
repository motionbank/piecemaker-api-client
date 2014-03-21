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

var group, role;
var user, admin;
var events = [];

pm.createUser( 'Test group admin', 
  (new Date().getTime())+'-user@motionbank.org', 
  'user',
  pm.createCallback( function ( u ) {
		admin = u;
		pm.createUser(
			'Normal user',
  			(new Date().getTime())+'-user@motionbank.org', 
			'user',
			pm.createCallback( function ( u ) {
				user = u;
				createUserRole();
			})
		);
  }));

var noop = pm.createCallback(function(){});

var createUserRole = function () {
	pm.createRole( 'group_user', 'user', 'An event creator', pm.createCallback(function ( r ) {
		role = r;
		pm.addPermissionToRole( role.id, 'create_new_event', noop);
		pm.addPermissionToRole( role.id, 'update_event', 	 noop);
		pm.addPermissionToRole( role.id, 'delete_event', 	 noop );
		pm.addPermissionToRole( role.id, 'get_my_event_groups', noop );
		pm.addPermissionToRole( role.id, 'get_events', 		 noop );
		createGroup();
	}));
}

var createGroup = function () {
	pm.createGroup( 'A test group', 'No description', pm.createCallback(function ( g ) {
		group = g;

		pm.addUserToGroup( group.id, admin.id, 'group_admin', pm.createCallback(function () {
			
			//print( arguments );

			pm.login( admin.email, admin.password, pm.createCallback(addUserToGroup));
		}));
	}));
};

var addUserToGroup = function () {
	pm.addUserToGroup( group.id, user.id, role.id, pm.createCallback(function () {
		pm.login( user.email, user.password, pm.createCallback(createSomeEvents));
	}));
}

var createSomeEvents = function () {
	print( "Making 100 events" );
	var makeEvent = function () {
		var hash = new Packages.java.util.HashMap();
		hash.put( 'type', 'test-event' );
		hash.put( 'utc_timestamp', new Date().getTime() );
		hash.put( 'duration', (1 + parseInt(Math.random() * 100, 10)) );
		pm.createEvent( group.id, hash, pm.createCallback(function ( e ) {
			events.push( e );
			if ( events.length === 100 ) {
				print( "... done" );
				listEvents();
			} else {
				makeEvent();
			}
		}));
	}
	makeEvent();
}

var listEvents = function () {
	pm.listEvents( group.id, pm.createCallback(function ( ee ) {
		
		print( "Loaded", ee.length, "events" );

		pm.login( admin.email, admin.password, pm.createCallback(removeUserFromGroup));
	}));
}

var removeUserFromGroup = function () {
	print( "Cleaning up" );
	pm.removeUserFromGroup( group.id, user.id, pm.createCallback(function () {
		pm = new PieceMakerApi(
		      this, 
		      config.host,
		      config.super_admin.api_key
		   );
		pm.deleteUser(  user.id, noop );
		pm.deleteGroup( group.id, noop );
		pm.deleteUser(  admin.id, noop );
		pm.deleteRole(  role.id, noop );
		print( '... i think it is all done.' );
	}));
}