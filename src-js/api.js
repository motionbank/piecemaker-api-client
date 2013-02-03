// -----------------------------------------------
//  class PieceMakerApi
// -----------------------------------------------
//  fjenett 2012, 2013
//	http://motionbank.org/
//	http://piecemaker.org/
// -----------------------------------------------
//	version: ##version##
//	build: ##build##
// -----------------------------------------------
var PieceMakerApi = (function(){
    
    var baseUrl 	= undefined;
    var api_key		= undefined;
    var context 	= undefined;

    var noop		= function(){};

	// cross origin resource sharing
	// http://www.html5rocks.com/en/tutorials/cors/
	
    var xhrRequest = function ( context, url, type, data, success ) {
    	// if ( api_key ) {
    	// 	if ( data && !('api_key' in data) ) {
    	// 		data['api_key'] = api_key
    	// 	} else if ( !data ) {
    	// 		data = { api_key: api_key }
    	// 	}
    	// }
        jQuery.ajax({
                url: url,
                type: type,
                dataType: 'json',
                data: data,
				// before: function ( xhr ) {
				// 	xhr.withCredentials = true;
				// 	//xhr.setRequestHeader( 'Cookie', document.cookie );
				// 	// if ( isLoggedIn ) {
				// 	// 	xhr.setRequestHeader( 'Authorization',
				// 	// 			'Basic '+user.login+':'+user.password );
				// 	// }
				// },
				context: context,
                success: success,
                error: function ( response ) {
                    xhrError( response );
                }
                // , xhrFields: { withCredentials: true }
				// , headers: { 'Cookie' : document.cookie }
            });
    };

	var xhrGet = function ( pm, opts ) {
		xhrRequest( pm, opts.url, 'get', null, opts.success );
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
	
	var xhrError = function ( resp ) {
		if ( context 
			 && 'piecemakerError' in context 
			 && typeof context['piecemakerError'] == 'function' )
			context['piecemakerError']( resp );
		else
			throw( resp );
	}
    
    var PieceMakerApi = function () {
         
		var params = arguments[0];
		
		if ( arguments.length == 1 && typeof params == 'object' ) {
	        context 	= params.context || {};
			api_key		= params.api_key || false;
			baseUrl 	= params['baseUrl'] || 'http://localhost:3000';
		} else {
			if ( arguments.length >= 1 && typeof arguments[0] == 'object' ) {
				context = arguments[0];
			}
			if ( arguments.length >= 2 && typeof arguments[1] == 'string' ) {
				baseUrl = arguments[1];
			}
			if ( arguments.length >= 3 && typeof arguments[2] == 'string' ) {
				api_key = arguments[2];
			}
		}

		//if ( !api_key ) throw( "PieceMakerAPI: need an API_KEY for this to work" );
	}

	/* PieceMakerApi.USER 		= 0; */
	// PieceMakerApi.PIECE 	= 1;
	// PieceMakerApi.PIECES 	= 2;
	// PieceMakerApi.EVENT 	= 3;
	// PieceMakerApi.EVENTS 	= 4;
	// PieceMakerApi.VIDEO 	= 5;
	// PieceMakerApi.VIDEOS 	= 6;

	PieceMakerApi.prototype.getGroup = function ( groupId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: baseUrl + '/event_group/'+groupId,
	        success: function ( response ) {
				callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.listGroups = function ( cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: baseUrl + '/event_groups',
	        success: function ( response ) {
				callback.call( context || cb, response );
	        }
	    });
	}
	
	PieceMakerApi.prototype.listGroupEvents = function ( groupId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/event_group/'+groupId+'/events',
	        success: function ( response ) {
				callback.call( context || cb, response );
	        }
	    });
	}

	// PieceMakerApi.prototype.loadVideosForPiece = function ( pieceId, cb ) {
	// 	var callback = cb || noop;
	// 	xhrGet( this, {
	//         url: baseUrl + '/api/piece/'+pieceId+'/videos',
	//         success: function ( response ) {
	// 			callback.call( context || cb, response );
	//         }
	//     });
	// }

	PieceMakerApi.prototype.getVideo = function ( videoId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/event/'+videoId, // TODO: force type?
	        success: function ( response ) {
				callback.call( context || cb, response );
	        }
	    });
	}

	// PieceMakerApi.prototype.loadEventsForVideo = function ( videoId, cb ) {
	// 	var callback = cb || noop;
	// 	xhrGet( this, {
	//         url: baseUrl + '/api/video/'+videoId+'/events',
	//         success: function ( response ) {
	// 			callback.call( context || cb, response );
	//         }
	//     });
	// }

	// PieceMakerApi.prototype.listEventsBetween = function ( from, to, cb ) {
	// 	var callback = cb || noop;
	// 	xhrGet( this, {
	// 		url: baseUrl + '/api/events/between/'+
	// 				parseInt(from.getTime() / 1000) + '/' + 
	// 				parseInt(Math.ceil(to.getTime() / 1000)),
	// 		success: function ( response ) {
	// 			callback.call( context || cb, response );
	//         }
	// 	});
	// }

	PieceMakerApi.prototype.getEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/event/'+eventId,
	        success: function ( response ) {
	            callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.createEvent = function ( data, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
	        url: baseUrl + '/event',
	        data: data,
	        success: function ( response ) {
	            callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.saveEvent = function ( eventId, data, cb ) {
		var callback = cb || noop;
		xhrPut( this, {
	        url: baseUrl + '/event/'+eventId,
	        data: data,
	        success: function ( response ) {
	            callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.deleteEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
		xhrDelete( this, {
	        url: baseUrl + '/event/'+eventId,
	        success: function ( response ) {
	            callback.call( context || cb, response );
	        }
	    });
	}

	// PieceMakerApi.prototype.findEvents = function ( opts, cb ) {
	// 	var callback = cb || noop;
	// 	xhrPost( this, {
	//         url: baseUrl + '/api/events/find',
	//         data: opts,
	//         success: function ( response ) {
	//             callback.call( context || cb, response );
	//         }
	//     });
	// }

	/**
	 *	Create a callback for the async events above
 	 */
	PieceMakerApi.prototype.createCallback = function () {
		if ( arguments.length == 1 )
			return context[arguments[0]];
		else if ( arguments.length == 2 )
			return arguments[0][arguments[1]];
		else
			throw( "PieceMakerAPI error: wrong number of arguments" );
	}

    /* var isLoggedIn 	= false; */
	/* PieceMakerApi.prototype.login = function ( cb ) {
		var callback = cb || noop;
		if ( arguments.length == 1 ) {
			callback = arguments[0];
		} else if ( arguments.length == 2 ) {
			// TODO: validate user / pass before sending to server?
			user = { login: arguments[0], 
					 password: arguments[1] };
		}
		var self = this;
	    xhrPost( this, {
	        url: baseUrl + '/api/login',
	        data: { login: user.login, password: user.password, api_key: user.api_key },
	        success: function ( response ) {
				if ( response.status ) {
	            	isLoggedIn = true;
					callback.call( context || cb, PieceMakerApi.USER, response );
				} else {
					if ( context && 'pmLoginFailed' in context )
						context.pmLoginFailed();
				}
	        }
	    });
	} */
	/* PieceMakerApi.prototype.isLoggedIn = function () {
		return isLoggedIn;
	} */
		
    return PieceMakerApi;
})();