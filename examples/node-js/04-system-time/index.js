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

var min = 100000, max = 0, average = 0, median = [];
var runs = 2000;
var last_time = new Date().getTime();
var count = 0;

var next = function () {

	pm.getSystemTime(function ( systime ) {
		var now_time = new Date().getTime();
		var d = now_time - last_time;
		median.push( d );
		last_time = now_time;

		average += d;
		min = Math.min( min, d );
		max = Math.max( max, d );

		if ( count >= runs ) {

			average /= count;
			console.log( 'min / average / median / max', 
						 min, average, 
						 median[parseInt((median.length-1)/2,10)], 
						 max );

		} else {
			next();
		}
	});

	count++;
};

next();