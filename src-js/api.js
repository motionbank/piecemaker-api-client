// -----------------------------------------------
//  class PieceMakerApi
// -----------------------------------------------
//  fjenett 2012
//	http://motionbank.org/
//	http://piecemaker.org/
// -----------------------------------------------
var PieceMakerApi = (function(){
    
    var baseUrl 	= undefined;
    var user		= undefined;
    var isLoggedIn 	= false;
    var listener 	= undefined;

    var noop		= function(){};
	
	// cross origin resource sharing
	// http://www.html5rocks.com/en/tutorials/cors/
	
    var xhrRequest = function ( context, url, type, data, success ) {
    	if ( user && user.api_key ) {
    		if ( data && !('api_key' in data) ) {
    			data['api_key'] = user.api_key
    		} else if ( !data ) {
    			data = { api_key: user.api_key }
    		}
    	}
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
		if ( listener && listener.pmError ) listener.pmError( resp );
	}
    
    var PieceMakerApi = function () {
         
		var params = arguments[0];
		
        listener 	= params.listener || {};
		user 		= { login: 	  params.user || false, 
				 		password: params.pass || false,
				 		api_key:  params.api_key || false  };
		baseUrl 	= params['baseUrl'] || 'http://localhost:3000';
	}

	PieceMakerApi.prototype.login = function ( cb ) {
		var callback = cb || (listener && listener.pmDataAvailable) || noop;
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
					callback.call( cb || listener, PieceMakerApi.USER, response );
				} else {
					if ( listener && 'pmLoginFailed' in listener )
						listener.pmLoginFailed();
				}
	        }
	    });
	}

	PieceMakerApi.USER 		= 0;
	PieceMakerApi.PIECE 	= 1;
	PieceMakerApi.PIECES 	= 2;
	PieceMakerApi.EVENT 	= 3;
	PieceMakerApi.EVENTS 	= 4;
	PieceMakerApi.VIDEO 	= 5;
	PieceMakerApi.VIDEOS 	= 6;

	PieceMakerApi.prototype.loadPiece = function ( pieceId, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
	    xhrGet( this, {
	        url: baseUrl + '/api/piece/'+pieceId,
	        success: function ( response ) {
				callback.call( cb || listener, PieceMakerApi.PIECE, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadPieces = function ( cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
	    xhrGet( this, {
	        url: baseUrl + '/api/pieces',
	        success: function ( response ) {
				callback.call( cb || listener, PieceMakerApi.PIECES, response );
	        }
	    });
	}
	
	PieceMakerApi.prototype.loadEventsForPiece = function ( pieceId, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/piece/'+pieceId+'/events',
	        success: function ( response ) {
				callback.call( cb || listener, PieceMakerApi.EVENTS, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadVideosForPiece = function ( pieceId, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/piece/'+pieceId+'/videos',
	        success: function ( response ) {
				callback.call( cb || listener, PieceMakerApi.VIDEOS, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadVideo = function ( videoId, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/video/'+videoId,
	        success: function ( response ) {
				callback.call( cb || listener, PieceMakerApi.VIDEO, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadEventsForVideo = function ( videoId, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/video/'+videoId+'/events',
	        success: function ( response ) {
				callback.call( cb || listener, PieceMakerApi.EVENTS, response );
	        }
	    });
	}

	PieceMakerApi.prototype.loadEvent = function ( eventId, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		xhrGet( this, {
	        url: baseUrl + '/api/event/'+eventId,
	        success: function ( response ) {
	            callback.call( cb || listener, PieceMakerApi.EVENT, response );
	        }
	    });
	}

	PieceMakerApi.prototype.createEvent = function ( data, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		xhrPost( this, {
	        url: baseUrl + '/api/event',
	        data: data,
	        success: function ( response ) {
	            callback.call( cb || listener, PieceMakerApi.EVENT, response );
	        }
	    });
	}

	PieceMakerApi.prototype.saveEvent = function ( eventId, data, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		xhrPost( this, {
	        url: baseUrl + '/api/event/'+eventId+'/update',
	        data: data,
	        success: function ( response ) {
	            callback.call( cb || listener, PieceMakerApi.EVENT, response );
	        }
	    });
	}

	PieceMakerApi.prototype.deleteEvent = function ( eventId, cb ) {
		callback = cb || (listener && listener.pmDataAvailable) || noop;
		if ( (typeof eventId === 'object') && ('id' in eventId) ) eventId = eventId.id;
		xhrPost( this, {
	        url: baseUrl + '/api/event/'+eventId+'/delete',
	        success: function ( response ) {
	            callback.call( cb || listener, PieceMakerApi.EVENT, response );
	        }
	    });
	}

	PieceMakerApi.prototype.isLoggedIn = function () {
		return isLoggedIn;
	}
		
    return PieceMakerApi;
})();