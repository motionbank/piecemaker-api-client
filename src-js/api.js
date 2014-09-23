// Piecemaker 2 API client for Processing and plain Java, JS in the browser and node.js
// ====================================================================================

// This is the JavaScript version.

// Created by fjenett 2012, 2013  
// https://github.com/motionbank/piecemaker-api-client

// Parameters listed in square brackets are optional:
// ```
// api.someMethod( arg1 [, optionalArg2 ] )
// ```

// Because of the asynchronous nature of it all API client methods except 
// for createCallback() do not return any values. Results are passed 
// into an mostly optional callback instead.

// See:  
// http://motionbank.org/  
// http://piecemaker.org/

// Version: ##version##  
// Build: ##build##

(function(){

	var PieceMakerApi = (function(ajaxImpl){

	    // Class PieceMakerApi2
	    // ---------------------

	    // Constructor versions:
	    // ```
	    // new PieceMakerApi( <object> context, <string> host [, <string> api_key ] )
	    // new PieceMakerApi( <object> options )
	    // ```
	    // Where options object has:
	    // ```
	    // {  
	    //   context : <object>,
	    //   host :    <string>,
	    //   api_key : <string> // optional
	    // }
	    // ```
	    //
	    // If the api_key is not present you must use login() before being
	    // able to issue any other calls to the API.

	    var _PieceMakerApi = function ( argContext, argHost, argApiKey ) {

	    	// Public fields

			this.host 	 = undefined;
	    	this.api_key = undefined;
	    	this.context = undefined;

	    	/* parsing the parameters */

			var params = arguments[0];
			
			if ( arguments.length === 1 && typeof params == 'object' ) {
		        this.context 	= params.context || {};
				this.api_key	= params.api_key || false;
				this.host 		= params.host 	 || params.base_url || 'http://localhost:3000';
			} else {
				if ( argContext && typeof argContext == 'object' ) {
					this.context = argContext;
				}
				if ( argHost && typeof argHost == 'string' ) {
					this.host = argHost;
				}
				if ( argApiKey && typeof argApiKey == 'string' ) {
					this.api_key = argApiKey;
				}
			}

			this.host += '/api/v1';
		}

		// Static fields

		_PieceMakerApi.TIMESPAN 	= "utc_timestamp";
		_PieceMakerApi.INTERSECTING = "intersect"
		_PieceMakerApi.CONTAINED 	= "contain";

		// Users
		// ------

		// ###Log a user in

		// If the user has no API key, this will generate one

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_login_format

		// ```
		// api.login( <string> email, <string> password [, <function> callback ] )
		// ```

		// Callback returns API key as string

		_PieceMakerApi.prototype.login = function ( userEmail, userPassword, cb ) {
			var callback = cb || noop, api = this;
			if ( !userEmail || !userPassword ) {
				throw( "PieceMakerApi: need name and password to log user in" );
			}
			var self = this;
		    xhrPost( this, {
		        url: self.host + '/user/login',
		        data: {
		        	email: userEmail,
		        	password: userPassword
		        },
		        success: function ( response ) {
		        	var api_key_new = null;
		        	if ( response && 'api_access_key' in response && response['api_access_key'] ) {
		        		self.api_key = response['api_access_key'];
		        		api_key_new = self.api_key;
		        	}
					callback.call( self.context || cb, api_key_new );
		        }
		    });
		}

		// ###Log a user out

		// Does nothing at the moment, there is no more logging out

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_logout_format

		// ```
		// api.logout( [ <function> callback ] )
		// ```

		_PieceMakerApi.prototype.logout = function ( cb ) {
			var callback = cb || noop;
			callback.call( this.context || cb, null );
		}

		// ###Get all users

		// Returns a list of all users

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/users/GET_api_version_users_format

		// ```
		// api.listUsers( [ <function> callback ] )
		// ```

		// Callback receives array with all users

		_PieceMakerApi.prototype.listUsers = function ( cb ) {
			var callback = cb || noop, api = this;
			var self = this;
		    xhrGet( this, {
		        url: self.host + '/users',
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Get current user

		// Returns the currently logged in user by looking up the active API key

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_me_format

		// ```
		// api.whoAmI( [ <function> callback ] )
		// ```

		// Callback receives current user

		_PieceMakerApi.prototype.whoAmI = function ( cb ) {
			var callback = cb || noop, api = this;
			var self = this;
		    xhrGet( this, {
		        url: self.host + '/user/me',
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Create a user

		// Role id is optional, if none is provided it will be "user" (no permissions)

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_format

		// ```
		// api.createUser( <string> name, <string> email [, <string> role_id ] [, <function> callback ] )
		// ```

		// Callback receives new user object

		_PieceMakerApi.prototype.createUser = function ( userName, userEmail, optionalUserRoleId, cb ) {
			if ( arguments.length === 3 ) {
				cb = optionalUserRoleId;
				optionalUserRoleId = "user";
			}
			var callback = cb || noop, self = this;
			xhrPost( self, {
				url: self.host + '/user',
				data: {
					name: userName, 
					email: userEmail,
					user_role_id: optionalUserRoleId
				},
				success: function ( response ) {
					callback.call( self.context || cb, response );
				}
			});
		}

		// ###Get one user by id

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_id_format

		// ```
		// api.getUser( <int> user_id [, <function> callback ] )
		// ```

		// Callback receives user object

		_PieceMakerApi.prototype.getUser = function ( userId, cb ) {
			var callback = cb || noop, self = this;
		    xhrGet( this, {
		        url: self.host + '/user/' + userId,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Update a user

		// Updating can change name, email or role_id and
		// it can disable a user and recreate a new password.

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/PUT_api_version_user_id_format

		// Versions:
		// ```
		// api.updateUser( <int> user_id, <string> name, <string> email, <function> callback )
		// api.updateUser( <int> user_id, <string> name, <string> email, <boolean> disable, <boolean> refresh_password, <function> callback )
		// ```

		// Callback receives updated user object

		_PieceMakerApi.prototype.updateUser = function ( userId, userName, userEmail, userRoleId_or_cb, 
														 userIsDisabled, userNewPassword, 
														 cb ) {
			if ( arguments.length === 4 ) {
				cb = userRoleId_or_cb;
			} else if ( arguments.length !== 7 ) {
				throw( 'Parameter exception: updateUser() expects 4 or 7 params' );
			}
			var callback = cb || noop, self = this;
			var data = {
				name: userName, 
				email: userEmail
			};
			if ( arguments.length === 7 ) {
				if ( userRoleId_or_cb )
					data.user_role_id = userRoleId_or_cb;
				data.is_disabled = userIsDisabled ? true : false;
				data.new_password = userNewPassword ? true : false;
			};
			xhrPut( self, {
				url: self.host + '/user/' + userId,
				data: data,
				success: function ( response ) {
					callback.call( self.context || cb, response );
				}
			}); 
		}

		// ###Delete one user

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/DELETE_api_version_user_id_format

		// ```
		// api.deleteUser( <int> user_id [, <function> callback ] )
		// ```

		_PieceMakerApi.prototype.deleteUser = function ( userId, cb ) {
			var callback = cb || noop, self = this;
			xhrDelete( this, {
				url: self.host + '/user/' + userId,
				success: function ( response ) {
					callback.call( self.context || cb /*, response*/ );
				}
			});
		}

		// ###Get all groups visible to given user

		// This returns a list of groups that the user belongs to

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_id_groups_format

		// ```
		// api.userGroups( <int> user_id [, <function> callback ] )
		// ```

		_PieceMakerApi.prototype.userGroups = function ( userId, cb ) {
			var callback = cb || noop, self = this;
			xhrDelete( this, {
				url: self.host + '/user/' + userId + '/groups',
				success: function ( response ) {
					callback.call( self.context || cb /*, response*/ );
				}
			});
		}

		// Groups
		// -------

		// Groups are what Piecemaker 1 called a "piece":  
		// a collection of events (markers, videos, recordings, ...)

		// ###Get all groups

		// This returns a list of all groups (super admin only)

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/groups/GET_api_version_groups_format

		// ```
		// api.listGroups( <function> callback )
		// ```

		// Callback receives an array of group objects

		_PieceMakerApi.prototype.listGroups = function ( cb ) {
			var callback = cb || noop, self = this;
		    xhrGet( this, {
		        url: self.host + '/groups',
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Get all groups

		// Get a list of all available groups

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/groups/GET_api_version_groups_all_format

		// ```
		// api.listAllGroups( <function> callback )
		// ```

		// Callback receives an array of group objects

		_PieceMakerApi.prototype.listAllGroups = function ( cb ) {
			var callback = cb || noop, self = this;
		    xhrGet( this, {
		        url: self.host + '/groups/all',
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Create a group

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_format

		// ```
		// api.createGroup( <string> title, <string> description [, <function> callback ] )
		// ```

		// Callback receives new group object

		_PieceMakerApi.prototype.createGroup = function ( groupTitle, groupDescription, cb ) {
			var callback = cb || noop;
			var self = this;
			if ( !groupTitle ) {
				throw( "createGroup(): title can not be empty" );
			}
			xhrPost( self, {
				url: self.host + '/group',
				data: {
					title: groupTitle,
					description: groupDescription || ''
				},
			    success: function ( response ) {
					callback.call( self.context || cb, response );
			    }
			});
		}

		// ###Get a group by id

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_format

		// ```
		// api.getGroup( <int> group_id [, <function> callback ] )
		// ```

		// Callback receives group object

		_PieceMakerApi.prototype.getGroup = function ( groupId, cb ) {
			var callback = cb || noop, self = this;
		    xhrGet( this, {
		        url: self.host + '/group/'+groupId,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Update a group by id

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/PUT_api_version_group_id_format

		// ```
		// api.updateGroup( <int> group_id, <object> data [, <function> callback ] )
		// ```
		// where data is
		// ```
		// {
		//   title : <string>,
		//   text :  <string>
		// }
		// ```

		// Callback receives updated group object

		_PieceMakerApi.prototype.updateGroup = function ( groupId, groupData, cb ) {
			var data = convertData( groupData );
			var callback = cb || noop;
			var self = this;
			xhrPut( self, {
				url: self.host + '/group/'+groupId,
				data: data,
				success: function ( response ) {
					callback.call( self.context || cb, response );
				}
			});
		}

		// ###Delete a group

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/DELETE_api_version_group_id_format

		// ```
		// api.deleteGroup( <int> group_id [, <function> callback ] )
		// ```

		_PieceMakerApi.prototype.deleteGroup = function ( groupId, cb ) {
			var callback = cb || noop, self = this;
			xhrDelete( this, {
					url: self.host + '/group/'+groupId,
					success: function ( response ) {
					callback.call( self.context || cb /*, response*/ );
				}
			});
		}

		// ###Get all users in this group

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_users_format

		// ```
		// api.listGroupUsers( <int> group_id [, <function> callback ] )
		// ```

		// Callback receives an array of all users in that group

		_PieceMakerApi.prototype.listGroupUsers = function ( groupId, cb ) {
			var callback = cb || noop, self = this;
		    xhrGet( this, {
		        url: self.host + '/group/'+groupId+'/users',
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Add a user to a group

		// Expects a user role id to be given as which the user will act in the group

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_event_group_id_user_user_id_format

		// ```
		// api.addUserToGroup( <int> group_id, <int> user_id, <string> role_id [, <function> callback ] )
		// ```

		// Returns: TODO

		_PieceMakerApi.prototype.addUserToGroup = function ( groupId, userId, userRoleId, cb ) {
			var callback = cb || noop, self = this;
		    xhrPost( this, {
		        url: self.host + '/group/'+groupId+'/user/'+userId,
		        data : {
		        	user_role_id : userRoleId
		        },
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Change a users role in a group

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/PUT_api_version_group_event_group_id_user_user_id_format

		// ```
		// api.changeUserRoleInGroup( <int> group_id, <int> user_id, <string> role_id [, <function> callback ] )
		// ```

		// Returns: TODO

		_PieceMakerApi.prototype.changeUserRoleInGroup = function ( groupId, userId, userRoleId, cb ) {
			var callback = cb || noop, self = this;
		    xhrPut( this, {
		        url: self.host + '/group/'+groupId+'/user/'+userId,
		        data : {
		        	user_role_id : userRoleId
		        },
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Remove user from group

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/DELETE_api_version_group_event_group_id_user_user_id_format

		// ```
		// api.removeUserFromGroup( <int> group_id, <int> user_id [, <function> callback ] )
		// ```

		// Returns: TODO

		_PieceMakerApi.prototype.removeUserFromGroup = function ( groupId, userId, cb ) {
			var callback = cb || noop, self = this;
		    xhrDelete( this, {
		        url: self.host + '/group/'+groupId+'/user/'+userId,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// Roles
		// -------

		// A role is a predefined set of permissions. Each user has a global role and 
		// roles per group that he/she is part of. Roles can inherit permissions from
		// other roles.

		// ###List all available roles

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/roles/GET_api_version_roles_format

		// ```
		// api.listRoles( [ <function> callback ] )
		// ```

		// Callback receives an array of all available roles

		_PieceMakerApi.prototype.listRoles = function ( cb ) {
			var callback = cb || noop, self = this;
		    xhrGet( this, {
		        url: self.host + '/roles',
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Add new role

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/POST_api_version_role_format

		// ```
		// api.createRole( <string> role_id [, <string> inherit_role_id ] [, <string> description ] [, <function> callback ] )
		// ```

		// Callback receives new role created

		_PieceMakerApi.prototype.createRole = function ( roleId, optionalInheritRoleId, optionalDescription, cb ) {
			if ( arguments.length === 2 ) {
				cb = optionalInheritRoleId;
				optionalInheritRoleId = undefined;
			} else if ( arguments.length === 3 ) {
				cb = optionalDescription;
				optionalDescription = undefined;
			}
			
			var data = { id: roleId };
			if ( optionalInheritRoleId ) data.inherit_from_id = optionalInheritRoleId;
			if ( optionalDescription ) 	 data.description     = optionalDescription;

			var callback = cb || noop, self = this;
		    xhrPost( this, {
		        url: self.host + '/role',
		        data : data,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Update role

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/PUT_api_version_role_id_format

		// ```
		// api.updateRole( <string> role_id, [, <string> inherit_role_id ] [, <string> description ] [, <function> callback ] )
		// ```

		// Callback receives updated role

		_PieceMakerApi.prototype.updateRole = function ( roleId, optionalInheritRoleId, optionalDescription, cb ) {
			if ( arguments.length === 2 ) {
				cb = optionalInheritRoleId;
				optionalInheritRoleId = undefined;
			} else if ( arguments.length === 3 ) {
				cb = optionalDescription;
				optionalDescription = undefined;
			}
			
			var data = {};
			if ( optionalInheritRoleId ) data.inherit_from_id = optionalInheritRoleId;
			if ( optionalDescription )   data.description     = optionalDescription;

			var callback = cb || noop, self = this;
		    xhrPut( this, {
		        url: self.host + '/role/' + roleId,
		        data : data,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Delete a role

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/DELETE_api_version_role_id_format

		// ```
		// api.deleteRole( <string> role_id [, <function> callback ] )
		// ```

		_PieceMakerApi.prototype.deleteRole = function ( roleId, cb ) {
			var callback = cb || noop, self = this;
		    xhrDelete( this, {
		        url: self.host + '/role/' + roleId,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Get a role by id

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/GET_api_version_role_id_format

		// ```
		// api.getRole( <string> role_id [, <function> callback ] )
		// ```

		// Callback receives role

		_PieceMakerApi.prototype.getRole = function ( roleId, cb ) {
			var callback = cb || noop, self = this;
		    xhrGet( this, {
		        url: self.host + '/role/' + roleId,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// Role permissions
		// --------

		// A permission reflects a certain action on the server that can be triggered through the API.
		// Each permission can be set to allow or forbid one action.
		// Permissions are grouped into roles to allow for fine grained user rights control.

		// Permissions are predefined (hard coded) into the API, use listPermissions() to get a list.

		// ###Get all permissions

		// Only the permissions returned by this call are available

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/permissions/GET_api_version_permissions_format

		// ```
		// api.listPermissions( [ <function> callback ] )
		// ```

		// Callback receives an array of permissions
		
		_PieceMakerApi.prototype.listPermissions = function ( cb ) {
			var callback = cb || noop, self = this;
			xhrGet( this, {
		        url: self.host + '/permissions',
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Add a permission to a role

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/POST_api_version_role_format

		// ```
		// api.addPermissionToRole( <string> role_id, <string> action [, <boolean> isAllowed ] [, <function> callback ] );
		// ```
		// "action" as available through listPermissions()

		// Returns: TODO
		
		_PieceMakerApi.prototype.addPermissionToRole = function ( roleId, action, isAllowed_or_cb, cb ) {
			if ( arguments.length === 3 ) {
				cb = isAllowed_or_cb;
			}
			if ( arguments.length == 2 ) {
				isAllowed_or_cb = true;
			}
			var callback = cb || noop, self = this;
			xhrPost( this, {
		        url: self.host + '/role/' + roleId + '/permission',
		        data : {
		        	action : action,
		        	allowed : (isAllowed_or_cb === true ? 'yes' : 'no')
		        },
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Change a role permission

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/PUT_api_version_role_user_role_id_permission_role_permission_entity_format

		// ```
		// api.changePermissionForRole( <string> role_id, <string> permission, <string> right [, <function> callback ] )
		// ```
		// "permission" as available through listPermissions()
		// "isAllowed" can be true or false

		// Returns: TODO
		
		_PieceMakerApi.prototype.changePermissionForRole = function ( roleId, permission, isAllowed, cb ) {
			var callback = cb || noop, self = this;
			xhrPut( this, {
		        url: self.host + '/role/' + roleId + '/permission/' + permission,
		        data : {
		        	allowed : (isAllowed === true ? 'yes' : 'no')
		        },
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Remove a permission from a role

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/DELETE_api_version_role_user_role_id_permission_role_permission_entity_format

		// ```
		// api.removePermissionFromRole( <string> role_id, <string> permission [, <function> callback ] )
		// ```
		
		_PieceMakerApi.prototype.removePermissionFromRole = function ( roleId, permission, cb ) {
			var callback = cb || noop, self = this;
			xhrDelete( this, {
		        url: self.host + '/role/' + roleId + '/permission/' + permission,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// ###Get a role permission

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/role/GET_api_version_role_user_role_id_permission_role_permission_entity_format

		// ```
		// api.getPermissionFromRole( <string> role_id, <string> permission [, <function> callback ] )
		// ```

		// Callback receives permission
		
		_PieceMakerApi.prototype.getPermissionFromRole = function ( roleId, permission, cb ) {
			var callback = cb || noop, self = this;
			xhrGet( this, {
		        url: self.host + '/role/' + roleId + '/permission/' + permission,
		        success: function ( response ) {
					callback.call( self.context || cb, response );
		        }
		    });
		}

		// Events
		// --------

		// Anything on a timeline is an event in Piecemaker. That includes videos, data, annotations, ...

		// A bare event is a point in time (utc_timestamp), a duration in seconds and a type. 
		// Each event can have an undefined amount of additional fields in the form of {key:value}.
		
		// ###Get all events from a group

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

		// ```
		// api.listEvents( <int> group_id [, <function> callback ] )
		// ```

		// Callback receives an array with all events in the group
		
		_PieceMakerApi.prototype.listEvents = function ( groupId, cb ) {
			var callback = cb || noop, self = this;
			xhrGet( this, {
		        url: self.host + '/group/'+groupId+'/events',
		        success: function ( response ) {
					callback.call( self.context || cb, fixEventsResponse( response ) );
		        }
		    });
		}

		// ###Get all events of a certain type

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

		// ```
		// api.listEventsOfType( <int> group_id, <string> type [, <function> callback ] )
		// ```

		// Callback receives an array of events
		
		_PieceMakerApi.prototype.listEventsOfType = function ( groupId, type, cb ) {
			var callback = cb || noop, self = this;
			xhrGet( this, {
		        url: self.host + '/group/'+groupId+'/events',
		        data: {
		        	type: type
		        },
		        success: function ( response ) {
					callback.call( self.context || cb, fixEventsResponse( response ) );
		        }
		    });
		}

		// ###Get all events that have certain fields (id and value must match)

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format
		
		// Versions:
		// ```
		// api.listEventsOfType( <int> group_id [, <string> key1, <string> value1, ... ] [, <function> callback ] )
		// ```
		// This version is a vararg and takes any amount of key-value pair parameters.
		// ```
		// api.listEventsOfType( <int> group_id [, <object> fields ] [, <function> callback ] )
		// ```
		// This version assumes the second parameter to be an object with key-values:
		// ```
		// {
		//    key1 : value1,
		//    key2 : value2,
		//    ...
		// }
		// ```

		// Callback receives an array of events

		_PieceMakerApi.prototype.listEventsWithFields = function ( /* groupId, id1, val1, id2, val2, …, cb */ ) {
			var groupId = arguments[0];
			var fields = {};
			if ( arguments.length > 3 ) {
				for ( var i = 1; i < arguments.length-1; i+=2 ) {
					fields[arguments[i]] = arguments[i+1];
				}
			} else if ( typeof arguments[1] === 'object' ) {
				for ( var k in arguments[1] ) {
					if ( arguments[1].hasOwnProperty(k) ) fields[k] = arguments[1][k];
				}
			} else {
				throw( 'Wrong parameter count' );
			}
			var cb = arguments[arguments.length-1];
			var callback = cb || noop, self = this;
			xhrGet( self, {
		        url: self.host + '/group/' + groupId + '/events',
		        data: {
		        	fields: fields
		        },
		        success: function ( response ) {
		        	callback.call( self.context || cb, fixEventsResponse( response ) );
		        }
		    });
		}

		// ###Get all events that happened within given timeframe
		
		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

		// Versions:
		// ```
		// api.listEventsForTimespan( <int> group_id, <date> from [, <string> method ] [, <function> callback ] )
		// api.listEventsForTimespan( <int> group_id, <date> to [, <string> method ] [, <function> callback ] )
		// api.listEventsForTimespan( <int> group_id, <date> from, <date> to [, <string> method ] [, <function> callback ] )
		// ```

		// If either *to* or *from* are null it is like saying *before to* or *after from*.

		// The *method* parameter is optional, can be any of:
		// ```
		// 'utc_timestamp', looking only at the start points
		// 'intersect', returning events that intersect the given time span or are contained within
		// 'contain', returning events that are fully contained (start+duration) in time span
		// ```
		// See here for details:
		// https://github.com/motionbank/piecemaker2-api/issues/76#issuecomment-37030586

		// Callback receives an array of events
		
		_PieceMakerApi.prototype.listEventsForTimespan = function ( groupId, from, to, method, cb ) {
			if ( arguments.length === 4 ) cb = method;
			var callback = cb || noop, self = this;
			var data = {
	        	from: (from !== null ? jsDateToTs(from) : null),
	        	to:   (to   !== null ? jsDateToTs(to)   : null)
	        };
	        if ( arguments.length === 5 && method !== null ) {
	        	method = method.toLowerCase();
	        	if ( ['utc_timestamp','intersect','contain'].indexOf(method) === -1 ) method = 'intersect';
	        	data.fromto_query = method;
	        }
			xhrGet( self, {
		        url: self.host + '/group/'+groupId+'/events',
		        data: data,
		        success: function ( response ) {
		        	callback.call( self.context || cb, fixEventsResponse( response ) );
		        }
		    });
		}

		// ###Get all events that match

		// This is a very generic method that allows for more complex searches

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

		// ```
		// api.findEvents( <int> group_id, <object> query [, <function> callback ] )
		// ```

		// Callback receives an array of events
		
		_PieceMakerApi.prototype.findEvents = function ( groupId, eventData, cb ) {
			var callback = cb || noop, self = this;
			xhrGet( self, {
		        url: self.host + '/group/' + groupId + '/events',
		        data: convertData( eventData ),
		        success: function ( response ) {
		        	callback.call( self.context || cb, fixEventsResponse( response ) );
		        }
		    });
		}

		// ###Get one event by id

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/event/GET_api_version_event_id_format

		// ```
		// api.getEvent( <int> group_id, <int> event_id [, <function> callback ] )
		// ```

		// Callback receives one event
		
		_PieceMakerApi.prototype.getEvent = function ( groupId, eventId, cb ) {
			var callback = cb || noop, self = this;
			xhrGet( self, {
		        url: self.host + '/event/'+eventId,
		        success: function ( response ) {
		        	callback.call( self.context || cb, expandEventToObject( response ) );
		        }
		    });
		}

		// ###Create one event

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_id_event_format

		// ```
		// api.createEvent( <int> group_id, <object> event_data [, <function> callback ] )
		// ```
		// Where *event_data* is:
		// ```
		// {
		//    utc_timestamp: <date>,
		//    duration:      <int>,
		//    type:          <string>,
		//	  // optionally:
		//    fields: {
		//        key1 : value1,
		//        key2 : value2,
		//        ...
		//     } 
		// }
		// ```

		// Callback receives newly created event

		_PieceMakerApi.prototype.createEvent = function ( groupId, eventData, cb ) {
			var data = convertData( eventData );
			var callback = cb || noop, self = this;
			xhrPost( this, {
		        url: self.host + '/group/' + groupId + '/event',
		        data: data,
		        success: function ( response ) {
		        	callback.call( self.context || cb, expandEventToObject( response ) );
		        }
		    });
		}

		// ###Update one event

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/event/PUT_api_version_event_id_format

		// ```
		// api.updateEvent( <int> group_id, <int> event_id, <object> event_data [, <function> callback ] )
		// ```
		// Where *event_data* is:
		// ```
		// {
		//    utc_timestamp: <date>,
		//    duration:      <int>,
		//    type:          <string>,
		//	  // optionally:
		//    fields: {
		//        key1 : value1,
		//        key2 : value2,
		//        ...
		//     } 
		// }
		// ```

		// Callback receives updated event

		_PieceMakerApi.prototype.updateEvent = function ( groupId, eventId, eventData, cb ) {
			var data = convertData( eventData );
			data['event_group_id'] = groupId;
			var callback = cb || noop, self = this;
			xhrPut( this, {
		        url: self.host + '/event/' + eventId,
		        data: data,
		        success: function ( response ) {
		            callback.call( self.context || cb, expandEventToObject( response ) );
		        }
		    });
		}

		// ###Delete one event

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/event/DELETE_api_version_event_id_format

		// ```
		// api.deleteEvent( <int> group_id, <int> event_id [, <function> callback ] )
		// ```

		_PieceMakerApi.prototype.deleteEvent = function ( groupId, eventId, cb ) {
			var callback = cb || noop, self = this;
			if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
			xhrDelete( this, {
		        url: self.host + '/event/' + eventId,
		        success: function ( response ) {
		            callback.call( self.context || cb , expandEventToObject( response ) );
		        }
		    });
		}

		// System related calls
		// ---------------------

		// ###Get the system (server) time

		// See:
		// http://motionbank.github.io/piecemaker2-api/swagger/#!/system/GET_api_version_system_utc_timestamp_format

		// ```
		// api.getSystemTime( [ <function> callback ] )
		// ```

		// Callback receives UTC timestamp (date) of server

		_PieceMakerApi.prototype.getSystemTime = function ( cb ) {
			var callback = cb || noop, self = this;
			xhrGet( this, {
		        url: self.host + '/system/utc_timestamp',
		        success: function ( response ) {
		            callback.call( self.context || cb, new Date( response.utc_timestamp * 1000 ));
		        }
		    });
		}

		// Additional client methods
		// --------------------------

		// ###Create a callback to be used for the API calls

		// This method mainly serves to legalize the Processing / Java syntax. 
		// In plain JavaScript just pass a function as callback into the API client methods.

		// Versions:
		// ```
		// api.createCallback( <string> method_name )
		// api.createCallback( <object> context, <string> method_name )
		// ```
		
		// Returns a function or callable

		_PieceMakerApi.prototype.createCallback = function () {

			var self = this;

			if ( arguments.length === 1 ) {

				return self.context[arguments[0]];

			} else if ( arguments.length >= 2 ) {
				
				var more = 1;
				var cntx = self.context, meth = arguments[0];
				
				if ( typeof arguments[0] !== 'string' ) { // then it's not a method name
					cntx = arguments[0];
					if ( typeof arguments[1] !== 'string' ) {
						throw( 'createCallback(): if first argument is a target then the second needs to be a method name' );
					}
					meth = arguments[1];
					more = 2;
				}

				if ( arguments.length > more ) {
					var args = [];
					for ( var i = more; i < arguments.length; i++ ) {
						args.push( arguments[i] );
					}	
					return (function(c,m,a){
						return function(response) {
							if (response) a.unshift(response);
							c[m].apply( c, a );
						}
					})(cntx, meth, args);
				}
				else 
					return cntx[meth];
			}
			else
				throw( "createCallback(): wrong number of arguments" );
		}


		// Helpers
		// -------

		// ... just an empty function to use in place of missing callbacks

	    var noop = function(){};

	    // Convert Processing.js HashMaps to JavaScript objects

	    var convertData = function ( data ) {
	    	if ( !data ) return data;
	    	if ( typeof data !== 'object' ) return data;
	    	if ( 'entrySet' in data && typeof data.entrySet === 'function' ) {
	    		//var allowed_long_keys = ['utc_timestamp', 'duration', 'type', 'token'];
	    		var set = data.entrySet();
	    		if ( !set ) return data;
	    		var obj = {};
	    		var iter = set.iterator();
	    		while ( iter.hasNext() ) {
					var entry = iter.next();
					var val = entry.getValue();
					if ( val && typeof val === 'object' && 
						 'entrySet' in val && 
						 typeof val.entrySet === 'function' ) val = convertData(val);
					var key = entry.getKey();
					if ( !key ) {
						throw( "Field key is not valid: " + key );
					}
					obj[entry.getKey()] = val;
				}
				return obj;
	    	} else {
	    		if ( 'utc_timestamp' in data ) data.utc_timestamp = jsDateToTs(data.utc_timestamp);
	    		if ( 'created_at' in data )    data.created_at 	  = jsDateToTs(data.created_at);
	    	}
	    	return data;
	    }

	    // FIXME: these are temporary fixes for:
	    // https://github.com/motionbank/piecemaker2/issues/54
	    // https://github.com/motionbank/piecemaker2-api/issues/105

	    var fixEventsResponse = function ( resp ) {
	    	if ( resp instanceof Array ) {
	    		var arr = [];
	    		for ( var i = 0; i < resp.length; i++ ) {
	    			arr.push( expandEventToObject( resp[i] ) );
	    		}
	    		return arr;
	    	}
	    	return resp;
	    }

	    var expandEventToObject = function ( event ) {
	    	if ( event.fields && event.fields.length > 0 ) {
	    		// fix JSON formatting
		    	var new_fields = {};
				for ( var i = 0, f = event.fields, l = f.length; i < l; i++ ) {
					var field = f[i];
					new_fields[f[i]['id']] = f[i]['value'];
				}
				event.fields = new_fields;
				// add a fake getter to make Processing.js happy
	    		event.fields.get = (function(e){
		    		return function ( k ) {
		    			return e.fields[k];
		    		}
		    	})(event);
		    }
	    	event.utc_timestamp = new Date( event.utc_timestamp * 1000.0 );
	    	return event;
	    }

	    var jsDateToTs = function ( date_time ) {
	    	if ( date_time instanceof Date ) {
	    		return date_time.getTime() / 1000.0;
	    	} else {
	    		if ( date_time > 9999999999 ) {
	    			return date_time / 1000.0; // assume it's a JS timestamp in ms
	    		} else {
	    			return date_time; // assume it's ok
	    		}
	    	}
	    }

	    // XHR requests
	    // ------------

		/* cross origin resource sharing
		   http://www.html5rocks.com/en/tutorials/cors/ */
		
	    var xhrRequest = function ( pm, url, type, data, success ) {

	    	// Almost all calls to the API need to be done including a per-user API token.
	    	// This token is passed into the constructor below and gets automatically 
	    	// added to each call here if it is not already present.

	    	if ( !pm.api_key && !url.match(/\/user\/login$/) ) {
	    		throw( "PieceMakerApi: need an API_KEY, please login first to obtain one" );
	    	}

	    	var ts = (new Date()).getTime();
	    	var callUrl = url + '.json';

	        ajaxImpl({
	                url: callUrl,
	                type: type,
	                dataType: 'json',
	                data: data || {},
					// before: function ( xhr ) {
					// 	if ( !url.match(/\/user\/login$/) ) {
					// 		xhr.setRequestHeader( 'X-Access-Key', api.api_key );
					// 	}
					// },
					context: pm,
	                success: function () {
	                	if ( arguments && arguments[0] && 
	                		 typeof arguments[0] === 'object' && 
	                		 !(arguments[0] instanceof Array) && 
	                		 !('queryTime' in arguments[0]) ) {
	                		arguments[0]['queryTime'] = ((new Date()).getTime()) - ts;
	                	}
	                	success.apply( pm, arguments );
	                },
	                error: function (err) {
	                    xhrError( pm, callUrl, type, err );
	                },
	                /* , xhrFields: { withCredentials: true } */
					/* , headers: { 'Cookie' : document.cookie } */
					headers: {
						'X-Access-Key': pm.api_key
					}
	            });
	    };

		var xhrGet = function ( pm, opts ) {
			xhrRequest( pm, opts.url, 'get', opts.data, opts.success );
		}

		var xhrPut = function ( pm, opts ) {
		    xhrRequest( pm, opts.url, 'put', opts.data, opts.success );
		}

		var xhrPost = function ( pm, opts ) {
		    xhrRequest( pm, opts.url, 'post', opts.data, opts.success );
		}

		var xhrDelete = function ( pm, opts ) {
		    xhrRequest( pm, opts.url, 'delete', null, opts.success );
		}
		
		var xhrError = function ( pm, url, type, err ) {

			var statusCode = -1, statusMessage = "";

			if ( err ) {
				statusCode = err.status || err.statusCode;
				statusMessage = err.statusText || err.message || 'No error message';
				if ( err.responseText ) {
					statusMessage += " " + err.responseText;
				}
			}

			if ( pm && 'piecemakerError' in pm && typeof pm['piecemakerError'] == 'function' )
				pm['piecemakerError']( statusCode, statusMessage, type.toUpperCase() + " " + url );
			else {
				if ( typeof console !== 'undefined' && console.log ) {
					console.log( statusCode, statusMessage, url, type, err );
				}
				throw( err );
			}
		}

	    return _PieceMakerApi;
	});

	// Environment setup
	// -----------------

	// ... Node or browser window

	if ( typeof module !== 'undefined' && module.exports ) {

		var nodeAjax = function noop () {
			throw('Seems like you are running in neither a browser nor Node. Can\'t help you there.');
		};

		if ( typeof global !== 'undefined' ) { // check if environment could be Node

			var url  = require('url'), 
				qstr = require('querystring'),
				http = require('http');
			
			// a shim to mimic jQuery.ajax for node.js
			nodeAjax = function nodeAjax (opts) {

				var url_parsed = url.parse(opts.url);
				var data = JSON.stringify( opts.data );

				var headers = opts.headers || {};
				headers['Content-Type'] = 'application/json';
				
				var query = null;

				if ( opts.type !== 'get' ) {
		    		headers['Content-Length'] = Buffer.byteLength( data, 'utf-8' );
		 		} else {
		 			var opts_data = opts.data || {};
		 			for ( var k in opts_data ) {
		 				if ( opts_data.hasOwnProperty(k) && typeof opts_data[k] === 'object' ) {
		 					var subObj = opts_data[k];
		 					for ( var kk in subObj ) {
		 						opts_data[k+'['+kk+']'] = subObj[kk];
		 					}
		 					delete opts_data[k];
		 				}
		 			}
		 			query = qstr.stringify( opts_data );
		 		}
		 
				var req_options = {
				    host 	: url_parsed.hostname,
				    port 	: url_parsed.port || 80,
				    path 	: url_parsed.path + ((opts.type === 'get' && query) ? '?' + query : ''),
				    method  : opts.type,
				    headers : headers
				};

				var request = http.request( req_options, function(res) {

				    if ( !(res.statusCode === 302 || res.statusCode <= 300) ) {
				    	opts.error.apply(null,[res]);
				    	return;
				    }

				 	var buf = '';
				    res.on( 'data', function(d) {
				        buf += d;
				    });
				    res.on( 'end', function() {
				    	opts.success.apply(opts.context,[JSON.parse(buf)]);
				    });
				});

				request.on('error', function(e) {
				    if ( opts.error ) opts.error.apply(null,[e]);
				});
		 
		 		if ( opts.type !== 'get' ) {
					request.write( data );
		 		}

				request.end();
			}
		}

		// support common-js
		module.exports = PieceMakerApi(nodeAjax);

	} else if ( window && !('PieceMakerApi' in window) ) {

		// in the browsers
		window.PieceMakerApi = PieceMakerApi($.ajax);
	}

})();