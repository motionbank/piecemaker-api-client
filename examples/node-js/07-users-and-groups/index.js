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

var group, role;
var user, admin;
var events = [];

pm.createUser( 'Test group admin', 
  (new Date().getTime())+'-user@motionbank.org', 
  'user',
  function ( u ) {
		admin = u;
		pm.createUser(
			'Normal user',
  			(new Date().getTime())+'-user@motionbank.org', 
			'user',
			function ( u ) {
				user = u;
				createUserRole();
			}
		);
  });

var createUserRole = function () {
	pm.createRole( 'group_user', 'user', 'An event creator', function ( r ) {
		role = r;
		pm.addPermissionToRole( role.id, 'create_new_event' );
		pm.addPermissionToRole( role.id, 'update_event' );
		pm.addPermissionToRole( role.id, 'delete_event' );
		pm.addPermissionToRole( role.id, 'get_my_event_groups' );
		pm.addPermissionToRole( role.id, 'get_events' );
		createGroup();
	});
}

var createGroup = function () {
	pm.createGroup( 'A test group', 'No description', function ( g ) {
		group = g;

		pm.addUserToGroup( group.id, admin.id, 'group_admin', function () {
			console.log( arguments );

			pm.login( admin.email, admin.password, addUserToGroup);
		});
	});
};

var addUserToGroup = function () {
	pm.addUserToGroup( group.id, user.id, role.id, function () {
		pm.login( user.email, user.password, createSomeEvents);
	});
}

var createSomeEvents = function () {
	for ( var i = 0; i < 100; i++ ) {
		pm.createEvent( group.id, {
			type : 'test-event',
			utc_timestamp : new Date(),
			duration: (1 + parseInt(Math.random() * 100, 10))
		}, function ( e ) {
			events.push( e );
			if ( events.length === 100 ) {
				listEvents();
			}
		});
	}
}

var listEvents = function () {
	pm.listEvents( group.id, function ( ee ) {
		console.log( ee );

		pm.login( admin.email, admin.password, removeUserFromGroup);
	});
}

var removeUserFromGroup = function () {
	pm.removeUserFromGroup( group.id, user.id, function () {
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
		pm.deleteUser( user.id );
		pm.deleteGroup( group.id );
		pm.deleteUser( admin.id );
		pm.deleteRole( role.id );
		console.log( 'I think it is all done.' );
	});
}