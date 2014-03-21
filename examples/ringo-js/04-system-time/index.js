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

var min = 100000, max = 0, average = 0, median = [];
var runs = 2000;
var last_time = new Date().getTime();
var count = 0;

var next = function () {

	pm.getSystemTime(pm.createCallback(function ( systime ) {
		var now_time = new Date().getTime();
		var d = now_time - last_time;
		median.push( d );
		last_time = now_time;

		average += d;
		min = Math.min( min, d );
		max = Math.max( max, d );

		if ( count >= runs ) {

			average /= count;
			print( 'min / average / median / max', 
						 min, average, 
						 median[parseInt((median.length-1)/2,10)], 
						 max );

		} else {
			next();
		}
	}));

	count++;
};

next();