// Piecemaker 2 API client for Processing and Java / JS 
// ====================================================

//  Created by fjenett 2012, 2013  
//  https://github.com/motionbank/piecemaker-api-client

//  See:  
//	http://motionbank.org/  
//	http://piecemaker.org/

//	Version: ##version##  
//	Build: ##build##

var PieceMakerApi = (function(){

	// Helpers
	// -------

	// ... just an empty function to use in place of missing callbacks

    var noop = function(){};

    // Convert Processing.js HashMaps to JavaScript objects

    var convertData = function ( data ) {
    	if ( !data ) return data;
    	if ( typeof data !== 'object' ) return data;
    	if ( 'entrySet' in data && typeof data.entrySet === 'function' ) {
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
				obj[entry.getKey()] = val;
			}
			return obj;
    	}
    	return data;
    }

    // XHR requests
    // ------------

	/* cross origin resource sharing
	   http://www.html5rocks.com/en/tutorials/cors/ */
	
    var xhrRequest = function ( context, url, type, data, success ) {

    	// Almost all calls to the API need to be done including a per-user API token.
    	// This token is passed into the constructor below and gets automatically 
    	// added to each call here if it is not already present.

    	if ( api.api_key ) {
    		if ( data && !('token' in data) ) {
    			data['token'] = api.api_key
    		} else if ( !data ) {
    			data = { 
    				token: api.api_key 
    			}
    		}
    	}

    	var ts = (new Date()).getTime();
    	var callUrl = url + '.json';

        jQuery.ajax({
                url: callUrl,
                type: type,
                dataType: 'json',
                data: data,
				/* before: function ( xhr ) {
					xhr.withCredentials = true;
					xhr.setRequestHeader( 'Cookie', document.cookie );
					if ( isLoggedIn ) {
						xhr.setRequestHeader( 'Authorization',  'Basic '+user.login+':'+user.password );
					}
				}, */
				context: context,
                success: function () {
                	if ( arguments && arguments[0] && 
                		 typeof arguments[0] === 'object' && 
                		 !('queryTime' in arguments[0]) ) {
                		arguments[0]['queryTime'] = ((new Date()).getTime()) - ts;
                	}
                	success.apply( context, arguments );
                },
                error: function (err) {
                    xhrError( context, callUrl, type, err );
                }
                /* , xhrFields: { withCredentials: true } */
				/* , headers: { 'Cookie' : document.cookie } */
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
	
	var xhrError = function ( context, url, type, err ) {

		var statusCode = -1, statusMessage = "";

		if ( err ) {
			statusCode = err.status;
			statusMessage = err.statusText;
			if ( err.responseText ) {
				statusMessage += " " + err.responseText;
			}
		}

		if ( api.context 
			 && 'piecemakerError' in api.context 
			 && typeof api.context['piecemakerError'] == 'function' )
			api.context['piecemakerError']( statusCode, statusMessage, type.toUpperCase() + " " + url );
		else
			throw( err );
	}

	// Library global variables
	// ------------------------
    
    var api; // FIXME: in this scope it will be replaced by the next constructor call!

    // Class PieceMakerApi2
    // ---------------------

    // The actual implementation of the client class starts here

    // ###PieceMakerApi()

    // Expects either 3 arguments or an object with:
    // ```
    // {  
    //   context: <object>,  
    //   api_key: <string>,  
    //   base_url: <string>  
    // }
    // ```

    var _PieceMakerApi = function () {

    	// Fields

		this.base_url 	= undefined;
    	this.api_key	= undefined;
    	this.context 	= undefined;

    	// Parsing the parameters

		var params = arguments[0];
		
		if ( arguments.length == 1 && typeof params == 'object' ) {
	        this.context 	= params.context || {};
			this.api_key	= params.api_key || false;
			this.base_url 	= params.base_url || 'http://localhost:3000';
		} else {
			if ( arguments.length >= 1 && typeof arguments[0] == 'object' ) {
				this.context = arguments[0];
			}
			if ( arguments.length >= 2 && typeof arguments[1] == 'string' ) {
				this.base_url = arguments[1];
			}
			if ( arguments.length >= 3 && typeof arguments[2] == 'string' ) {
				this.api_key = arguments[2];
			}
		}

		// Since piecemaker 2 we require the API key to be added

		if ( !this.api_key ) throw( "PieceMaker2API: need an API_KEY for this to work" );

		api = this; // ... store for internal use only
	}

	/* just as a personal reference: discussing the routes
	   https://github.com/motionbank/piecemaker2/issues/17 */

	// Users
	// ------

	// ###Get all users

	// Returns a list of all users

	_PieceMakerApi.prototype.listUsers = function ( cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.base_url + '/users',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Create a user

	_PieceMakerApi.prototype.createUser = function ( userName, userEmail, userPassword, userToken, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
			url: api.base_url + '/user',
			data: {
				name: userName, email: userEmail,
				password: userPassword, api_access_key: userToken
			},
			success: function ( response ) {
				callback.call( api.context || cb, response );
			}
		});
	}

	// ###Get one user

	_PieceMakerApi.prototype.getUser = function ( userId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.base_url + '/user/' + userId,
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Update one user

	_PieceMakerApi.prototype.updateUser = function ( userId, userName, userEmail, userPassword, userToken, cb ) {
		var callback = cb || noop;
		xhrPut( this, {
			url: api.base_url + '/user/' + userId,
			data: {
				name: userName, email: userEmail,
				password: userPassword, api_access_key: userToken
			},
			success: function ( response ) {
				callback.call( api.context || cb, response );
			}
		}); 
	}

	// ###Delete one user

	_PieceMakerApi.prototype.deleteUser = function ( userId, cb ) {
		var callback = cb || noop;
		xhrDelete( this, {
			url: api.base_url + '/user/' + userId,
			success: function ( response ) {
				callback.call( api.context || cb, response );
			}
		});
	}

	// Groups
	// -------

	// Groups are what Piecemaker 1 called "Piece":  
	// they are just a collection of events

	// ###Get all groups

	_PieceMakerApi.prototype.listGroups = function ( cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.base_url + '/groups',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Create a group

	// Arguments:  
	// ```title``` is the name of the group  
	// ```text``` is the group description  
	// [ ```callback``` an optional callback ]  

	// Returns:
	// ```{ id: <int> }``` an object with the group id

	_PieceMakerApi.prototype.createGroup = function ( groupTitle, groupText, cb ) {
		var callback = cb || noop;
		if ( !groupTitle ) {
			throw( "createGroup(): title can not be empty" );
		}
		xhrPost( this, {
			url: api.base_url + '/group',
			data: {
				title: groupTitle,
				text: groupText || ''
			},
		    success: function ( response ) {
				callback.call( api.context || cb, response );
		    }
		});
	}

	// ###Get a group

	_PieceMakerApi.prototype.getGroup = function ( groupId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.base_url + '/group/'+groupId,
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Update a group

	_PieceMakerApi.prototype.updateGroup = function ( groupId, groupData, cb ) {
		var data = convertData( groupData );
		var callback = cb || noop;
		xhrPut( this, {
			url: api.base_url + '/group/'+groupId,
			data: data,
			success: function ( response ) {
				callback.call( api.context || cb, response );
			}
		});
	}

	// ###Delete a group

	_PieceMakerApi.prototype.deleteGroup = function ( groupId, cb ) {
		var callback = cb || noop;
		xhrDelete( this, {
				url: api.base_url + '/group/'+groupId,
				success: function ( response ) {
				callback.call( api.context || cb, response );
			}
		});
	}

	// ###Get all users in this group

	_PieceMakerApi.prototype.listGroupUsers = function ( groupId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.base_url + '/group/'+groupId+'/users',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	// Events
	// --------

	// Events can be anything relating to time and a group
	
	// ###Get all events
	
	_PieceMakerApi.prototype.listEvents = function ( groupId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.base_url + '/group/'+groupId+'/events',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Get all events of a certain type
	
	_PieceMakerApi.prototype.listEventsOfType = function ( groupId, type, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.base_url + '/group/'+groupId+'/events',
	        data: { type: type },
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Get all events that have certain fields
	
	_PieceMakerApi.prototype.listEventsWithFields = function ( groupId, fieldData, cb ) {
		var callback = cb || noop;
		xhrGet( api, {
	        url: api.base_url + '/group/'+groupId+'/events',
	        data: fieldData,
	        success: function ( response ) {
	        	callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Get one event
	
	_PieceMakerApi.prototype.getEvent = function ( groupId, eventId, cb ) {
		var callback = cb || noop;
		xhrGet( api, {
	        url: api.base_url + '/group/'+groupId+'/event/'+eventId,
	        success: function ( response ) {
	        	callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Create one event

	_PieceMakerApi.prototype.createEvent = function ( groupId, eventData, cb ) {
		var data = convertData( eventData );
		var callback = cb || noop;
		xhrPost( this, {
	        url: api.base_url + '/group/'+groupId+'/event',
	        data: data,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Update one event

	_PieceMakerApi.prototype.updateEvent = function ( groupId, eventId, eventData, cb ) {
		var data = convertData( eventData );
		var callback = cb || noop;
		xhrPut( this, {
	        url: api.base_url + '/group/'+groupId+'/event/'+eventId,
	        data: data,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	}

	// ###Delete one event

	_PieceMakerApi.prototype.deleteEvent = function ( groupId, eventId, cb ) {
		var callback = cb || noop;
		if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
		xhrDelete( this, {
	        url: api.base_url + '/group/'+groupId+'/event/'+eventId,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	}

	/* _PieceMakerApi.prototype.listVideosForPiece = function ( pieceId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.base_url + '/api/piece/'+pieceId+'/videos',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	} */

	/* _PieceMakerApi.prototype.listEventsForVideo = function ( videoId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.base_url + '/api/video/'+videoId+'/events',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	} */

	/* _PieceMakerApi.prototype.listEventsBetween = function ( from, to, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
			url: api.base_url + '/api/events/between/'+
					parseInt(from.getTime() / 1000) + '/' + 
					parseInt(Math.ceil(to.getTime() / 1000)),
			success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
		});
	} */

	/* _PieceMakerApi.prototype.getEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.base_url + '/event/'+eventId,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	} */

	/* _PieceMakerApi.prototype.createEvent = function ( data, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
	        url: api.base_url + '/event',
	        data: data,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	} */

	/* _PieceMakerApi.prototype.updateEvent = function ( eventId, data, cb ) {
		var callback = cb || noop;
		xhrPut( this, {
	        url: api.base_url + '/event/'+eventId,
	        data: data,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	}*/

	/* _PieceMakerApi.prototype.deleteEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
		xhrDelete( this, {
	        url: api.base_url + '/event/'+eventId,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	} */

	/* _PieceMakerApi.prototype.findEvents = function ( opts, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
	        url: api.base_url + '/api/events/find',
	        data: opts,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	} */

	// System related calls
	// ---------------------

	// ###Get the system (server) time

	_PieceMakerApi.prototype.getSystemTime = function ( cb ) {
		var ts1 = (new Date()).getTime();
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.base_url + '/system/utc_timestamp',
	        success: function ( response ) {
				var ts2 = (new Date()).getTime();
	            callback.call( api.context || cb, {
	            	systemTime: new Date(parseFloat(response)*1000).getTime(),
	            	callDuration: ts2-ts1
	            });
	        }
	    });
	}

	// Additional client methods
	// --------------------------

	// ###Create a callback to be used for the API calls

	_PieceMakerApi.prototype.createCallback = function () {
		if ( arguments.length == 1 ) {

			return api.context[arguments[0]];

		} else if ( arguments.length >= 2 ) {
			
			var more = 1;
			var cntx = api.context, meth = arguments[0];
			
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
				//console.log( args );
				return (function(c,m,a){
					return function(response) {
						a.unshift(response);
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

    return _PieceMakerApi;
})();