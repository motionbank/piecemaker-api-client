**Piecemaker API client for Java and JavaScript**

Piecemaker is a software originally started by David Kern and further developed [as part of the Motion Bank project](http://motionbank.org/en/content/education-piecemaker). It is a simple system to annotate time based (mostly video) material. It is heavily being used by [The Forsythe Company](http://theforsythecompany.com/) and behind the [online scores of the Motion Bank project](http://scores.motionbank.org/).

There are multiple versions of Piecemaker out in the wild at the moment:
 - original [Piecemaker and Piecemaker Lite](http://piecemaker.org/) by [David Kern](https://github.com/nutbits)
 - [PM2GO (Piecemaker to go)](http://motionbank.org/en/event/pm2go-easy-use-video-annotation-tool) by [H_Da](https://www.h-da.de/) for Motion Bank
 - [Piecemaker 2](https://github.com/motionbank/piecemaker2-app) which includes [the API](https://github.com/motionbank/piecemaker2-api) by [H_Da](https://www.h-da.de/) for Motion Bank

This client's API implementation is based upon the new/upcoming [Piecemaker 2.0 API](https://github.com/motionbank/piecemaker2-api) which is part of Piecemaker 2.

The library is actually two implementations in one: JavaScript and Java.
The JS version can be used in a browser or with Node.js.
Java version is targeted at Processing but should run elsewhere just fine.
An openFrameworks addon is [in the works](https://github.com/motionbank/ofxPiecemaker2).

The JS uses [jQuery.ajax](https://api.jquery.com/jQuery.ajax/) in the browser DOM and [Node.js' "http"](http://nodejs.org/api/http.html) for the asynchronous Piecemaker API requests. Java version uses [Apache Commons](http://commons.apache.org/).

Install for browser, use bower:
```
$ bower install piecemaker-api-client
```

Install for Node.js, use npm:
```
$ npm install piecemaker-api-client
```

For Processing: i will ask for inclusion into the PDE library manager once we hit a first official release.

For Java you should build from source:
Tweak the build.xml to point to your Processing copy, then:
```
$ ant
```

Resources:
- [Motion Bank on Github](https://github.com/motionbank)
- [motionbank.org](http://motionbank.org)
- [piecemaker.org](http://piecemaker.org)