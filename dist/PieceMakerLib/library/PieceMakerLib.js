/**
 *	PieceMaker API client (JavaScript version) for Motion Bank.
 *
 *	See: 
 *	  http://piecemaker.org
 *	  http://motionbank.org
 *	  https://github.com/fjenett/piecemaker-api-client
 *
 *	Version: 0.0.1, build: 201
 */
 var PieceMakerApi=function(){var f=void 0,j=void 0,e=void 0,g=function(){},l=function(a,b,c,h,f){user&&j&&(h&&!("api_key"in h)?h.api_key=j:h||(h={api_key:j}));jQuery.ajax({url:b,type:c,dataType:"json",data:h,context:a,success:f,error:function(b){if(e&&"piecemakerError"in e&&"function"==typeof e.piecemakerError)e.piecemakerError(b);else throw b;},xhrFields:{withCredentials:!0}})},i=function(a,b){l(a,b.url,"get",null,b.success)},k=function(a,b){l(a,b.url,"post",b.data,b.success)},c=function(a){e=a.context||
{};j=a.api_key||!1;f=a.baseUrl||"http://localhost:3000"};c.PIECE=1;c.PIECES=2;c.EVENT=3;c.EVENTS=4;c.VIDEO=5;c.VIDEOS=6;c.prototype.loadPiece=function(a,b){var d=b||g;i(this,{url:f+"/api/piece/"+a,success:function(a){a.requestType=c.PIECE;d.call(b||e,a)}})};c.prototype.loadPieces=function(a){var b=a||g;i(this,{url:f+"/api/pieces",success:function(d){d.requestType=c.PIECES;b.call(a||e,d)}})};c.prototype.loadEventsForPiece=function(a,b){var d=b||g;i(this,{url:f+"/api/piece/"+a+"/events",success:function(a){a.requestType=
c.EVENTS;d.call(b||e,a)}})};c.prototype.loadVideosForPiece=function(a,b){var d=b||g;i(this,{url:f+"/api/piece/"+a+"/videos",success:function(a){a.requestType=c.VIDEOS;d.call(b||e,a)}})};c.prototype.loadVideo=function(a,b){var d=b||g;i(this,{url:f+"/api/video/"+a,success:function(a){a.requestType=c.VIDEO;d.call(b||e,a)}})};c.prototype.loadEventsForVideo=function(a,b){var d=b||g;i(this,{url:f+"/api/video/"+a+"/events",success:function(a){a.requestType=c.EVENTS;d.call(b||e,a)}})};c.prototype.loadEventsBetween=
function(a,b,d){var h=d||g;i(this,{url:f+"/api/events/between/"+parseInt(a.getTime()/1E3)+"/"+parseInt(Math.ceil(b.getTime()/1E3)),success:function(a){a.requestType=c.EVENTS;h.call(d||e,a)}})};c.prototype.loadEvent=function(a,b){var d=b||g;i(this,{url:f+"/api/event/"+a,success:function(a){a.requestType=c.EVENT;d.call(b||e,a)}})};c.prototype.createEvent=function(a,b){var d=b||g;k(this,{url:f+"/api/event",data:a,success:function(a){a.requestType=c.EVENT;d.call(b||e,a)}})};c.prototype.saveEvent=function(a,
b,d){var h=d||g;k(this,{url:f+"/api/event/"+a+"/update",data:b,success:function(a){a.requestType=c.EVENT;h.call(d||e,a)}})};c.prototype.deleteEvent=function(a,b){var d=b||g;"object"===typeof a&&"id"in a&&(a=a.id);k(this,{url:f+"/api/event/"+a+"/delete",success:function(a){a.requestType=c.EVENT;d.call(b||e,a)}})};c.prototype.findEvents=function(a,b){var d=b||g;k(this,{url:f+"/api/events/find",data:a,success:function(a){a.requestType=c.EVENTS;d.call(b||e,a)}})};c.prototype.createCallback=function(a,
b){console.log(a[b]);return a[b]};return c}();if(!("$"in this))var $={ajax:function(){}};