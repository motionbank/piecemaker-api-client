/**
 *	Piecemaker 2 API client (JavaScript version) for Motion Bank.
 *
 *	See: 
 *	  https://github.com/motionbank/piecemaker2-api
 *	  https://github.com/motionbank/piecemaker-api-client
 *
 *	Project:
 *	  http://piecemaker.org
 *	  http://motionbank.org
 *
 *	Version: 0.0.17, build: 787
 */
 (function(){var t=function(k){var f=function(){},o=function(a){if(!a||"object"!==typeof a)return a;if("entrySet"in a&&"function"===typeof a.entrySet){var b=a.entrySet();if(!b)return a;a={};for(b=b.iterator();b.hasNext();){var c=b.next(),d=c.getValue();d&&("object"===typeof d&&"entrySet"in d&&"function"===typeof d.entrySet)&&(d=o(d));var e=c.getKey();if(!e)throw"Field key is not valid: "+e;a[c.getKey()]=d}return a}"utc_timestamp"in a&&(a.utc_timestamp=p(a.utc_timestamp));"created_at"in a&&(a.created_at=
p(a.created_at));return a},m=function(a){if(a instanceof Array){for(var b=[],c=0;c<a.length;c++)b.push(l(h(a[c])));return b}return a},h=function(a){var b=a.event;b.fields={};for(var c=0,a=a.fields;c<a.length;c++)b.fields[a[c].id]=a[c].value;return b},l=function(a){a.fields.get=function(b){return a.fields[b]};a.utc_timestamp=new Date(1E3*a.utc_timestamp);return a},p=function(a){return a instanceof Date?a.getTime()/1E3:9999999999<a?a/1E3:a},n=function(a,b,c,d,e){if(!a.api_key&&!b.match(/\/user\/login$/))throw"PieceMakerApi: need an API_KEY, please login first to obtain one";
var j=(new Date).getTime(),f=b+".json";k({url:f,type:c,dataType:"json",data:d||{},context:a,success:function(){arguments&&(arguments[0]&&"object"===typeof arguments[0]&&!(arguments[0]instanceof Array)&&!("queryTime"in arguments[0]))&&(arguments[0].queryTime=(new Date).getTime()-j);e.apply(a,arguments)},error:function(b){var d=-1,e="";b&&(d=b.status||b.statusCode,e=b.statusText||b.message||"No error message",b.responseText&&(e+=" "+b.responseText));if(a&&"piecemakerError"in a&&"function"==typeof a.piecemakerError)a.piecemakerError(d,
e,c.toUpperCase()+" "+f);else throw"undefined"!==typeof console&&console.log&&console.log(d,e,f,c,b),b;},headers:{"X-Access-Key":a.api_key}})},i=function(a,b){n(a,b.url,"get",b.data,b.success)},r=function(a,b){n(a,b.url,"put",b.data,b.success)},q=function(a,b){n(a,b.url,"post",b.data,b.success)},s=function(a,b){n(a,b.url,"delete",null,b.success)},g=function(a,b,c){this.context=this.api_key=this.host=void 0;var d=arguments[0];if(1===arguments.length&&"object"==typeof d)this.context=d.context||{},this.api_key=
d.api_key||!1,this.host=d.host||d.base_url||"http://localhost:3000";else if(a&&"object"==typeof a&&(this.context=a),b&&"string"==typeof b&&(this.host=b),c&&"string"==typeof c)this.api_key=c;this.host+="/api/v1"};g.prototype.login=function(a,b,c){var d=c||f;if(!a||!b)throw"PieceMakerApi: need name and password to log user in";var e=this;q(this,{url:e.host+"/user/login",data:{email:a,password:b},success:function(a){var b=null;a&&("api_access_key"in a&&a.api_access_key)&&(e.api_key=a.api_access_key,
b=e.api_key);d.call(e.context||c,b)}})};g.prototype.logout=function(a){var b=a||f,c=this;q(this,{url:c.host+"/user/logout",success:function(d){d&&("api_access_key"in d&&d.api_access_key)&&(c.api_key=d.api_access_key);b.call(c.context||a,null)}})};g.prototype.listUsers=function(a){var b=a||f,c=this;i(this,{url:c.host+"/users",success:function(d){b.call(c.context||a,d)}})};g.prototype.whoAmI=function(a){var b=a||f,c=this;i(this,{url:c.host+"/user/me",success:function(d){b.call(c.context||a,d)}})};g.prototype.createUser=
function(a,b,c,d){var e=d||f,j=this;q(j,{url:j.host+"/user",data:{name:a,email:b,is_super_admin:c},success:function(a){e.call(j.context||d,a)}})};g.prototype.getUser=function(a,b){var c=b||f,d=this;i(this,{url:d.host+"/user/"+a,success:function(a){c.call(d.context||b,a)}})};g.prototype.updateUser=function(a,b,c,d,e,j){var g=j||f,i=this;r(i,{url:i.host+"/user/"+a,data:{name:b,email:c,password:d,api_access_key:e},success:function(a){g.call(i.context||j,a)}})};g.prototype.deleteUser=function(a,b){var c=
b||f,d=this;s(this,{url:d.host+"/user/"+a,success:function(){c.call(d.context||b)}})};g.prototype.listGroups=function(a){var b=a||f,c=this;i(this,{url:c.host+"/groups",success:function(d){b.call(c.context||a,d)}})};g.prototype.createGroup=function(a,b,c){var d=c||f,e=this;if(!a)throw"createGroup(): title can not be empty";q(e,{url:e.host+"/group",data:{title:a,text:b||""},success:function(a){d.call(e.context||c,a)}})};g.prototype.getGroup=function(a,b){var c=b||f,d=this;i(this,{url:d.host+"/group/"+
a,success:function(a){c.call(d.context||b,a)}})};g.prototype.updateGroup=function(a,b,c){var b=o(b),d=c||f,e=this;r(e,{url:e.host+"/group/"+a,data:b,success:function(a){d.call(e.context||c,a)}})};g.prototype.deleteGroup=function(a,b){var c=b||f,d=this;s(this,{url:d.host+"/group/"+a,success:function(){c.call(d.context||b)}})};g.prototype.listGroupUsers=function(a,b){var c=b||f,d=this;i(this,{url:d.host+"/group/"+a+"/users",success:function(a){c.call(d.context||b,a)}})};g.prototype.listEvents=function(a,
b){var c=b||f,d=this;i(this,{url:d.host+"/group/"+a+"/events",success:function(a){c.call(d.context||b,m(a))}})};g.prototype.listEventsOfType=function(a,b,c){var d=c||f,e=this;i(this,{url:e.host+"/group/"+a+"/events",data:{type:b},success:function(a){d.call(e.context||c,m(a))}})};g.prototype.listEventsWithFields=function(){var a=arguments[0],b={};if(3<arguments.length)for(var c=1;c<arguments.length-1;c+=2)b[arguments[c]]=arguments[c+1];else if("object"===typeof arguments[1])for(c in arguments[1])arguments[1].hasOwnProperty(c)&&
(b[c]=arguments[1][c]);else throw"Wrong parameter count";var d=arguments[arguments.length-1],e=d||f,j=this;i(j,{url:j.host+"/group/"+a+"/events",data:{fields:b},success:function(a){e.call(j.context||d,m(a))}})};g.prototype.listEventsBetween=function(a,b,c,d){var e=d||f,j=this;i(j,{url:j.host+"/group/"+a+"/events",data:{from:p(b),to:p(c)},success:function(a){e.call(j.context||d,m(a))}})};g.prototype.findEvents=function(a,b,c){var d=c||f,e=this;i(e,{url:e.host+"/group/"+a+"/events",data:b,success:function(a){d.call(e.context||
c,m(a))}})};g.prototype.getEvent=function(a,b,c){var d=c||f,e=this;i(e,{url:e.host+"/event/"+b,success:function(a){d.call(e.context||c,l(h(a)))}})};g.prototype.createEvent=function(a,b,c){var b=o(b),d=c||f,e=this;q(this,{url:e.host+"/group/"+a+"/event",data:b,success:function(a){d.call(e.context||c,l(h(a)))}})};g.prototype.updateEvent=function(a,b,c,d){c=o(c);c.event_group_id=a;var e=d||f,g=this;r(this,{url:g.host+"/event/"+b,data:c,success:function(a){e.call(g.context||d,l(h(a)))}})};g.prototype.deleteEvent=
function(a,b,c){var d=c||f,e=this;"object"===typeof b&&"id"in b&&(b=b.id);s(this,{url:e.host+"/event/"+b,success:function(a){d.call(e.context||c,l(h(a)))}})};g.prototype.getSystemTime=function(a){var b=a||f,c=this;i(this,{url:c.host+"/system/utc_timestamp",success:function(d){b.call(c.context||a,new Date(1E3*d.utc_timestamp))}})};g.prototype.createCallback=function(){if(1==arguments.length)return self.context[arguments[0]];if(2<=arguments.length){var a=1,b=self.context,c=arguments[0];if("string"!==
typeof arguments[0]){b=arguments[0];if("string"!==typeof arguments[1])throw"createCallback(): if first argument is a target then the second needs to be a method name";c=arguments[1];a=2}if(arguments.length>a){for(var d=[];a<arguments.length;a++)d.push(arguments[a]);var e=b,f=c;return function(a){a&&d.unshift(a);e[f].apply(e,d)}}return b[c]}throw"createCallback(): wrong number of arguments";};return g};if("undefined"!==typeof module&&module.exports){var u=function(){throw"Seems like you are running in neither a browser nor Node. Can't help you there.";
};if("undefined"!==typeof global)var v=require("url"),w=require("querystring"),x=require("http"),u=function(k){var f=v.parse(k.url),o=JSON.stringify(k.data),m=k.headers||{};m["Content-Type"]="application/json";var h=null;if("get"!==k.type)m["Content-Length"]=Buffer.byteLength(o,"utf-8");else{var h=k.data||{},l;for(l in h)if(h.hasOwnProperty(l)&&"object"===typeof h[l]){var p=h[l],n;for(n in p)h[l+"["+n+"]"]=p[n];delete h[l]}h=w.stringify(h)}f=x.request({host:f.hostname,port:f.port||80,path:f.path+
("get"===k.type&&h?"?"+h:""),method:k.type,headers:m},function(f){if(302===f.statusCode||300>=f.statusCode){var h="";f.on("data",function(f){h+=f});f.on("end",function(){k.success.apply(k.context,[JSON.parse(h)])})}else k.error.apply(null,[f])});f.on("error",function(f){k.error&&k.error.apply(null,[f])});"get"!==k.type&&f.write(o);f.end()};module.exports=t(u)}else window&&!("PieceMakerApi"in window)&&(window.PieceMakerApi=t($.ajax))})();