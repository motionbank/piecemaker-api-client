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

    /*
     +	Connector interface for data retrieval
     +
     L + + + + + + + + + + + + + + + */

    var Connector = function () {}
    Connector.prototype = {
    	get :  function (cntxt, opts) {},
    	post : function (cntxt, opts) {},
    	put :  function (cntxt, opts) {},
    	del :  function (cntxt, opts) {},
    	fetch: function (cntxt, url, type, data, success, error) {}
    }
    var defaultConnectorError = function ( resp ) {
    	if ( context 
			 && 'piecemakerError' in context 
			 && typeof context['piecemakerError'] == 'function' )
			context['piecemakerError']( resp );
		else
			throw( resp );
    }

	/*
	 +	XHR connector implementation
	 +
	 L + + + + + + + + + + + + + + + */
	
	// cross origin resource sharing
	// http://www.html5rocks.com/en/tutorials/cors/
	
	var XHRConnector = function () {}
	XHRConnector.prototype = new Connector();
	XHRConnector.prototype.get = function ( pm, opts ) {
		this.fetch( pm, opts.url, 'get', null, opts.success, opts.error || defaultConnectorError );
	}
	XHRConnector.prototype.put = function ( pm, opts ) {
	    this.fetch( pm, opts.url, 'put', opts.data, opts.success, opts.error || defaultConnectorError );
	}
	XHRConnector.prototype.post = function ( pm, opts ) {
	    this.fetch( pm, opts.url, 'post', opts.data, opts.success, opts.error || defaultConnectorError );
	}
	XHRConnector.prototype.del = function ( pm, opts ) {
	    this.fetch( pm, opts.url, 'delete', null, opts.success, opts.error || defaultConnectorError );
	}
    XHRConnector.prototype.fetch = function ( context, url, type, data, success, error ) {
    	if ( api_key ) {
    		if ( data && !('api_key' in data) ) {
    			data['api_key'] = api_key
    		} else if ( !data ) {
    			data = { api_key: api_key }
    		}
    	}

    	//console.log( type + ' ' + url + '.json' );

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
                error: error,
                xhrFields: { withCredentials: true }
				// , headers: { 'Cookie' : document.cookie }
            });
    };

	/*
	 +	Remote connector implementation
	 +
	 L + + + + + + + + + + + + + + + */

	var RemoteConnector = function ( win, org ) {
		this.targetWindow = win;
		this.targetOrigin = org;
		this.requests = {};
	}
	RemoteConnector.prototype = new Connector();
	RemoteConnector.prototype.get = function ( pm, opts ) {
		this.fetch( pm, opts.url, 'get', null, opts.success, opts.error || defaultConnectorError );
	}
	RemoteConnector.prototype.fetch = function ( context, url, type, data, success, error ) {

    	if ( api_key ) {
    		if ( data && !('api_key' in data) ) {
    			data['api_key'] = api_key
    		} else if ( !data ) {
    			data = { api_key: api_key }
    		}
    	}

		var xhrOptions = {
                url: url,
                type: type,
                dataType: 'json',
                data: data,
// 			   context: context,
//             success: success,
//             error: error,
                xhrFields: { 
                	withCredentials: true 
                }
        };

        var requestId = 'piecemaker_request_'+(new Date().getTime());
        while ( connector.requests[requestId] ) {
        	requestId = 'piecemaker_request_'+(new Date().getTime());
        }

        connector.requests[requestId] = {
			context: context,
            success: function () {
            	success.apply( context, arguments );
            },
            error: function ( response ) {
                error.call( null, response );
            }
        }

        connector.targetWindow.postMessage(
    	(function(opt,rid){
    		return {
	        	name: 'piecemakerapi',
	        	data: JSON.stringify({
	        		options: opt,
	        		requestId: rid
	        	})
    		};
        })(xhrOptions,requestId), 
        connector.targetOrigin);
    }
    // note that "data" here is dom-message{data:{data:{DATA:XXX}}} ... three levels in
	RemoteConnector.prototype.handle = function ( response ) {
		if ( connector.requests[response.requestId] ) {
			connector.requests[response.requestId].success( response.data );
			delete connector.requests[response.requestId];
		} else {
			console.log( 'Unable to find request with ID: '+response.requestId );
			console.log( response );
			console.log( connector.requests );
		}
	}

	/*
	 +	PieceMaker1 data sanitation
	 +
	 L + + + + + + + + + + + + + + + */

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
		event.getHappenedAt = function () {
			return event.happened_at;
		}
		event.setHappenedAt = function ( date ) {
			if ( !( date instanceof 'Date' ) ) return;
			event.happened_at = date;
			event.happened_at_float = date.getTime();
		}
		event.getEventType = function () {
			return event.event_type;
		}
	}

	/*
	 +	PieceMaker API
	 +
	 L + + + + + + + + + + + + + + + */
    
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

		connector = new XHRConnector(); // default connector
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
	    connector.get( this, {
	        url: baseUrl + '/api/piece/'+pieceId,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.PIECE;
				callback.call( context || cb, response.piece );
	        }
	    });
	}

	PieceMakerApi.prototype.loadPieces = function ( cb ) {
		var callback = cb || noop;
	    connector.get( this, {
	        url: baseUrl + '/api/pieces',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.PIECES;
				callback.call( context || cb, response );
	        }
	    });
	}
	
	PieceMakerApi.prototype.loadEventsForPiece = function ( pieceId, cb ) {
		var callback = cb || noop;
		connector.get( this, {
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
		connector.get( this, {
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
		connector.get( this, {
	        url: baseUrl + '/api/video/'+videoId,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.VIDEO;
	        	var v = response.video;
	        	pm1PrepareVideo( v );
				callback.call( context || cb, v );
	        }
	    });
	}

	PieceMakerApi.prototype.createVideo = function ( data, cb ) {
		var callback = cb || noop;
		connector.post( this, {
	        url: baseUrl + '/api/video',
	        data: data,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.VIDEO;
	        	var v = response.video;
	        	pm1PrepareVideo( v );
				callback.call( context || cb, v );
	        }
	    });
	}

	PieceMakerApi.prototype.updateVideo = function ( videoId, data, cb ) {
		var callback = cb || noop;
		if ( (typeof videoId === 'object') && ('id' in videoId) ) videoId = videoId.id;
		connector.post( this, {
	        url: baseUrl + '/api/video/'+videoId+'/update',
	        data: data,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.VIDEO;
	        	var v = response.video;
	        	pm1PrepareVideo( v );
				callback.call( context || cb, v );
	        }
	    });
	}

	PieceMakerApi.prototype.deleteVideo = function ( videoId, cb ) {
		var callback = cb || noop;
		if ( (typeof videoId === 'object') && ('id' in videoId) ) videoId = videoId.id;
		connector.post( this, {
	        url: baseUrl + '/api/video/'+videoId+'/delete',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.VIDEO;
	        	var v = response.video;
	        	pm1PrepareVideo( v );
				callback.call( context || cb, v );
	        }
	    });
	}

	PieceMakerApi.prototype.loadEventsForVideo = function ( videoId, cb ) {
		var callback = cb || noop;
		connector.get( this, {
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
		connector.get( this, {
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
		connector.get( this, {
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
		connector.get( this, {
	        url: baseUrl + '/api/event/'+eventId,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	var e = response.event;
	        	pm1PrepareEvent( e );
	            callback.call( context || cb, e );
	        }
	    });
	}

	PieceMakerApi.prototype.createEvent = function ( data, cb ) {
		var callback = cb || noop;
		connector.post( this, {
	        url: baseUrl + '/api/event',
	        data: data,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	var e = response.event;
	        	pm1PrepareEvent( e );
	            callback.call( context || cb, e );
	        }
	    });
	}

	PieceMakerApi.prototype.updateEvent = function ( eventId, data, cb ) {
		var callback = cb || noop;
		connector.post( this, {
	        url: baseUrl + '/api/event/'+eventId+'/update',
	        data: data,
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	var e = response.event;
	        	pm1PrepareEvent( e );
	            callback.call( context || cb, e );
	        }
	    });
	}

	PieceMakerApi.prototype.deleteEvent = function ( eventId, cb ) {
		var callback = cb || noop;
		if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
		connector.post( this, {
	        url: baseUrl + '/api/event/'+eventId+'/delete',
	        success: function ( response ) {
	        	response.requestType = PieceMakerApi.EVENT;
	        	var e = response.event;
	        	pm1PrepareEvent( e );
	            callback.call( context || cb, e );
	        }
	    });
	}

	PieceMakerApi.prototype.findEvents = function ( opts, cb ) {
		var callback = cb || noop;
		connector.post( this, {
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

	/**
	 *	
	 */
	PieceMakerApi.prototype.useProxy = function ( win, org ) {
		
		connector = new RemoteConnector(win, org);

		window.addEventListener( 'message', function(msg){
			if ( connector instanceof RemoteConnector && 
				 msg.origin === connector.targetOrigin && 
			     msg.data.name === 'piecemakerapi' ) {
				var json = JSON.parse( msg.data );
				connector.handle( json.data );
			}
		}, true );
	}

	PieceMakerApi.prototype.fetch = function ( options, success, error ) {
		connector.fetch( null, options.url, options.type, options.data, success, error || defaultConnectorError );
	}

    return PieceMakerApi;
})();