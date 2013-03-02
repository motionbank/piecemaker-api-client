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
    	if ( api_key ) {
    		if ( data && !('api_key' in data) ) {
    			data['api_key'] = api_key
    		} else if ( !data ) {
    			data = { api_key: api_key }
    		}
    	}

    	console.log( url + '.json' );

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
                },
                xhrFields: { withCredentials: true }
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

	var pm1PrepareVideos = function ( videos ) {
		if ( !videos || videos.length == 0 ) return;
		for ( var i = 0, k = videos.length; i < k; i++ ) {
			pm1PrepareVideo( videos[i] );
		}
	}

	var pm1PrepareVideo = function ( video ) {
		if ( !video ) return;
		if ( 'happened_at_float' in video ) {
			if ( typeof video.happened_at_float === 'number' ) {
				video.happened_at = new Date( video.happened_at_float );
				video.finished_at = new Date( video.happened_at.getTime() + video.duration * 1000 );
			}
		}
	}

	var pm1PrepareEvents = function ( events ) {
		if ( !events || events.length == 0 ) return;
		for ( var i = 0, k = events.length; i < k; i++ ) {
			pm1PrepareEvent( events[i] );
		}
	}

	var pm1PrepareEvent = function ( event ) {
		if ( !event ) return;
		if ( 'happened_at_float' in event ) {
			if ( typeof event.happened_at_float === 'number' ) {
				event.happened_at = new Date( event.happened_at_float );
				event.finished_at = new Date( event.happened_at.getTime() + event.duration * 1000 );
			}
		}
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
				api_key = arguments[1];
			}
			if ( arguments.length >= 3 && typeof arguments[2] == 'string' ) {
				baseUrl = arguments[2];
			}
		}

		if ( !api_key ) throw( "PieceMakerAPI: need an API_KEY for this to work" );
	}

	/* PieceMakerApi.USER 		= 0; */
	PieceMakerApi.PIECE 	= 1;
	PieceMakerApi.PIECES 	= 2;
	PieceMakerApi.EVENT 	= 3;
	PieceMakerApi.EVENTS 	= 4;
	PieceMakerApi.VIDEO 	= 5;
	PieceMakerApi.VIDEOS 	= 6;

	PieceMakerApi.prototype.loadPiece = function ( pieceId, cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: baseUrl + '/api/piece/'+pieceId,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.PIECE;
				callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadPieces = function ( cb ) {
		var callback = cb || noop;
	    xhrGet( this, {
	        url: baseUrl + '/api/pieces',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.PIECES;
				callback.call( context || cb, response );
	        }
	    });
	}
	
	PieceMakerApi.prototype.loadEventsForPiece = function ( pieceId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/piece/'+pieceId+'/events',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENTS;
	        	pm1PrepareEvents( response.events );
				callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadVideosForPiece = function ( pieceId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/piece/'+pieceId+'/videos',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.VIDEOS;
	        	pm1PrepareVideos( response.videos );
				callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadVideo = function ( videoId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/video/'+videoId,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.VIDEO;
	        	pm1PrepareVideo( response );
				callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadEventsForVideo = function ( videoId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/video/'+videoId+'/events',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENTS;
	        	pm1PrepareEvents( response.events );
				callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadEventsByTypeForVideo = function ( videoId, type, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/video/'+videoId+'/events/type/'+type,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENTS;
	        	pm1PrepareEvents( response.events );
				callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadEventsBetween = function ( from, to, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
			url: baseUrl + '/api/events/between/'+
					parseInt(from.getTime() / 1000) + '/' + 
					parseInt(Math.ceil(to.getTime() / 1000)),
			success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENTS;
	        	pm1PrepareEvents( response.events );
				callback.call( context || cb, response );
	        }
		});
	}

	PieceMakerApi.prototype.loadEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/event/'+eventId,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	pm1PrepareEvent( response );
	            callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.createEvent = function ( data, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
	        url: baseUrl + '/api/event',
	        data: data,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	pm1PrepareEvent( response );
	            callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.updateEvent = function ( eventId, data, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
	        url: baseUrl + '/api/event/'+eventId+'/update',
	        data: data,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	pm1PrepareEvent( response );
	            callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.deleteEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
		xhrPost( this, {
	        url: baseUrl + '/api/event/'+eventId+'/delete',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	pm1PrepareEvent( response );
	            callback.call( context || cb, response );
	        }
	    });
	}

	PieceMakerApi.prototype.findEvents = function ( opts, cb ) {
		var callback = cb || noop;
		xhrPost( this, {
	        url: baseUrl + '/api/events/find',
	        data: opts,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENTS;
	        	pm1PrepareEvents( response.events );
	            callback.call( context || cb, response );
	        }
	    });
	}

	/**
	 *	Create a callback for the async events above
 	 */
	PieceMakerApi.prototype.createCallback = function () {
		if ( arguments.length == 1 ) {

			return context[arguments[0]];

		} else if ( arguments.length >= 2 ) {
			
			var more = 1;
			var cntx = context, meth = arguments[0];
			
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