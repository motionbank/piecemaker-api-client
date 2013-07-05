// -----------------------------------------------
//  class PieceMaker2Api
// -----------------------------------------------
//  fjenett 2012, 2013
//	http://motionbank.org/
//	http://piecemaker.org/
// -----------------------------------------------
//	version: ##version##
//	build: ##build##
// -----------------------------------------------

var PieceMaker2Api = (function(){

    var noop = function(){};

	// cross origin resource sharing
	// http://www.html5rocks.com/en/tutorials/cors/
	
    var xhrRequest = function ( context, url, type, data, success ) {

    	// add token to call
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

        jQuery.ajax({
                url: url + '.json',
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
                success: function () {
                	if ( arguments && arguments[0] && 
                		 typeof arguments[0] === 'object' && 
                		 !('queryTime' in arguments[0]) ) {
                		arguments[0]['queryTime'] = ((new Date()).getTime()) - ts;
                	}
                	success.apply( context, arguments );
                },
                error: function (err) {
                    xhrError(err);
                }
                // , xhrFields: { withCredentials: true }
				// , headers: { 'Cookie' : document.cookie }
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
	
	var xhrError = function ( resp ) {
		if ( api.context 
			 && 'piecemakerError' in api.context 
			 && typeof api.context['piecemakerError'] == 'function' )
			api.context['piecemakerError']( resp );
		else
			throw( resp );
	}
    
    // this is an internal instance
    var api;

    /**
     *	Class PieceMakerApi2 implementation
     */
    var _PieceMakerApi2 = function () {

    	// fields

		this.baseUrl 	= undefined;
    	this.api_key	= undefined;
    	this.context 	= undefined;
        
    	// passing constructor parameters

		var params = arguments[0];
		
		if ( arguments.length == 1 && typeof params == 'object' ) {
	        this.context 	= params.context || {};
			this.api_key	= params.api_key || false;
			this.baseUrl 	= params['baseUrl'] || 'http://localhost:3000';
		} else {
			if ( arguments.length >= 1 && typeof arguments[0] == 'object' ) {
				this.context = arguments[0];
			}
			if ( arguments.length >= 2 && typeof arguments[1] == 'string' ) {
				this.baseUrl = arguments[1];
			}
			if ( arguments.length >= 3 && typeof arguments[2] == 'string' ) {
				this.api_key = arguments[2];
			}
		}

		// pm2 needs the API key

		if ( !this.api_key ) throw( "PieceMaker2API: need an API_KEY for this to work" );

		// ... for internal use only

		api = this;
	}

	// just as a personal reference: discussing the routes
	// https://github.com/motionbank/piecemaker2/issues/17

	/**
	 *	USERS
	 */

	_PieceMakerApi2.prototype.getUsers = function ( cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.baseUrl + '/users',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	_PieceMakerApi2.prototype.createUser = function ( userId, cb ) {
		// var callback = cb || noop;
	 //    xhrGet( this, {
	 //        url: api.baseUrl + '/user/' + userId,
	 //        success: function ( response ) {
		// 		callback.call( api.context || cb, response );
	 //        }
	 //    });
	}

	_PieceMakerApi2.prototype.getUser = function ( userId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.baseUrl + '/user/' + userId,
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	_PieceMakerApi2.prototype.updateUser = function ( userId, cb ) {
		// var callback = cb || noop;
	 //    xhrGet( this, {
	 //        url: api.baseUrl + '/user/' + userId,
	 //        success: function ( response ) {
		// 		callback.call( api.context || cb, response );
	 //        }
	 //    });
	}

	_PieceMakerApi2.prototype.deleteUser = function ( userId, cb ) {
		// var callback = cb || noop;
	 //    xhrGet( this, {
	 //        url: api.baseUrl + '/user/' + userId,
	 //        success: function ( response ) {
		// 		callback.call( api.context || cb, response );
	 //        }
	 //    });
	}

	/**
	 *	GROUPS
	 *
	 *	Groups are what PM1 called "Piece": a collection of events.
	 */

	_PieceMakerApi2.prototype.listGroups = function ( cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.baseUrl + '/groups',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	_PieceMakerApi2.prototype.createGroup = function ( groupId, cb ) {
		// var callback = cb || noop;
	 //    xhrGet( this, {
	 //        url: api.baseUrl + '/group/'+groupId,
	 //        success: function ( response ) {
		// 		callback.call( api.context || cb, response );
	 //        }
	 //    });
	}

	_PieceMakerApi2.prototype.getGroup = function ( groupId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.baseUrl + '/group/'+groupId,
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	_PieceMakerApi2.prototype.updateGroup = function ( groupId, cb ) {
		// var callback = cb || noop;
	 //    xhrGet( this, {
	 //        url: api.baseUrl + '/group/'+groupId,
	 //        success: function ( response ) {
		// 		callback.call( api.context || cb, response );
	 //        }
	 //    });
	}

	_PieceMakerApi2.prototype.deleteGroup = function ( groupId, cb ) {
		// var callback = cb || noop;
	 //    xhrGet( this, {
	 //        url: api.baseUrl + '/group/'+groupId,
	 //        success: function ( response ) {
		// 		callback.call( api.context || cb, response );
	 //        }
	 //    });
	}

	_PieceMakerApi2.prototype.getGroupUsers = function ( groupId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: api.baseUrl + '/group/'+groupId+'/users',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}

	/**
	 *	EVENTS
	 *	
	 *	Events can be anything relating to time and a group
	 */
	
	_PieceMakerApi2.prototype.listEvents = function ( groupId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.baseUrl + '/group/'+groupId+'/events',
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}
	
	_PieceMakerApi2.prototype.listEventsOfType = function ( groupId, type, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.baseUrl + '/group/'+groupId+'/events',
	        data: { type: type },
	        success: function ( response ) {
				callback.call( api.context || cb, response );
	        }
	    });
	}
	
	_PieceMakerApi2.prototype.listEventsWithFields = function ( groupId, fieldData, cb ) {
		var callback = cb || noop;
		xhrGet( api, {
	        url: api.baseUrl + '/group/'+groupId+'/events',
	        data: fieldData,
	        success: function ( response ) {
	        	callback.call( api.context || cb, response );
	        }
	    });
	}

	_PieceMakerApi2.prototype.createEvent = function ( groupId, data, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
	        url: api.baseUrl + '/group/'+groupId+'/event',
	        data: data,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	}
	
	_PieceMakerApi2.prototype.getEvent = function ( groupId, eventsId, cb ) {
		var callback = cb || noop;
		xhrGet( api, {
	        url: api.baseUrl + '/group/'+groupId+'/event/'+eventId,
	        success: function ( response ) {
	        	callback.call( api.context || cb, response );
	        }
	    });
	}

	_PieceMakerApi2.prototype.updateEvent = function ( eventId, data, cb ) {
		var callback = cb || noop;
		xhrPut( this, {
	        url: api.baseUrl + '/group/'+groupId+'/event/'+eventId,
	        data: data,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	}

	_PieceMakerApi2.prototype.deleteEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
		xhrDelete( this, {
	        url: api.baseUrl + '/group/'+groupId+'/event/'+eventId,
	        success: function ( response ) {
	            callback.call( api.context || cb, response );
	        }
	    });
	}

	// _PieceMakerApi2.prototype.loadVideosForPiece = function ( pieceId, cb ) {
	// 	var callback = cb || noop;
	// 	xhrGet( this, {
	//         url: api.baseUrl + '/api/piece/'+pieceId+'/videos',
	//         success: function ( response ) {
	// 			callback.call( api.context || cb, response );
	//         }
	//     });
	// }

	// _PieceMakerApi2.prototype.loadEventsForVideo = function ( videoId, cb ) {
	// 	var callback = cb || noop;
	// 	xhrGet( this, {
	//         url: api.baseUrl + '/api/video/'+videoId+'/events',
	//         success: function ( response ) {
	// 			callback.call( api.context || cb, response );
	//         }
	//     });
	// }

	// _PieceMakerApi2.prototype.listEventsBetween = function ( from, to, cb ) {
	// 	var callback = cb || noop;
	// 	xhrGet( this, {
	// 		url: api.baseUrl + '/api/events/between/'+
	// 				parseInt(from.getTime() / 1000) + '/' + 
	// 				parseInt(Math.ceil(to.getTime() / 1000)),
	// 		success: function ( response ) {
	// 			callback.call( api.context || cb, response );
	//         }
	// 	});
	// }

	// _PieceMakerApi2.prototype.getEvent = function ( eventId, cb ) {
	// 	var callback = cb || noop;
	// 	xhrGet( this, {
	//         url: api.baseUrl + '/event/'+eventId,
	//         success: function ( response ) {
	//             callback.call( api.context || cb, response );
	//         }
	//     });
	// }

	// _PieceMakerApi2.prototype.createEvent = function ( data, cb ) {
	// 	var callback = cb || noop;
	// 	xhrPost( this, {
	//         url: api.baseUrl + '/event',
	//         data: data,
	//         success: function ( response ) {
	//             callback.call( api.context || cb, response );
	//         }
	//     });
	// }

	// _PieceMakerApi2.prototype.updateEvent = function ( eventId, data, cb ) {
	// 	var callback = cb || noop;
	// 	xhrPut( this, {
	//         url: api.baseUrl + '/event/'+eventId,
	//         data: data,
	//         success: function ( response ) {
	//             callback.call( api.context || cb, response );
	//         }
	//     });
	// }

	// _PieceMakerApi2.prototype.deleteEvent = function ( eventId, cb ) {
	// 	var callback = cb || noop;
	// 	if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
	// 	xhrDelete( this, {
	//         url: api.baseUrl + '/event/'+eventId,
	//         success: function ( response ) {
	//             callback.call( api.context || cb, response );
	//         }
	//     });
	// }

	// _PieceMakerApi2.prototype.findEvents = function ( opts, cb ) {
	// 	var callback = cb || noop;
	// 	xhrPost( this, {
	//         url: api.baseUrl + '/api/events/find',
	//         data: opts,
	//         success: function ( response ) {
	//             callback.call( api.context || cb, response );
	//         }
	//     });
	// }

	_PieceMakerApi2.prototype.getSystemTime = function ( cb ) {
		var ts1 = (new Date()).getTime();
		var callback = cb || noop;
		xhrGet( this, {
	        url: api.baseUrl + '/system/utc_timestamp',
	        success: function ( response ) {
				var ts2 = (new Date()).getTime();
	            callback.call( api.context || cb, {
	            	systemTime: new Date(parseFloat(response)*1000).getTime(),
	            	callDuration: ts2-ts1
	            });
	        }
	    });
	}

	/**
	 *	Create a callback for the async events above
 	 */
	_PieceMakerApi2.prototype.createCallback = function () {
		if ( arguments.length == 1 )
			return this.context[arguments[0]];
		else if ( arguments.length == 2 )
			return arguments[0][arguments[1]];
		else
			throw( "PieceMakerAPI error: wrong number of arguments" );
	}

    return _PieceMakerApi2;
})();