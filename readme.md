**Piecemaker API wrapper for Java and JavaScript**

This client's API implementation is based upon the new/upcoming [Piecemaker 2.0 API](https://github.com/motionbank/piecemaker2-api).

*Note that this is still work in process as we approach our [final release end of 2013](http://motionbank.org/en/event/motion-bank-live-online-2013)*

The library is actually two implementations in one: JavaScript and Java.
The JS version can be used in a browser or with Node.js.
Java version is targeted as Processing mainly but should work elsewhere just fine.

The JS uses jQuery (not incl.) in the DOM and Node.js' 'http' for the Piecemaker API requests. Java uses Apache Commons.

Install in browser, use bower:
```
bower install piecemaker-api-client
```

Install for Node.js:
```
npm install piecemaker-api-client
```

For Processing: i will ask for inclusion into the PDE library manager once we hit a first full release.

For Java you should build from source:
Tweak the build.xml to point to your Processing copy, then:
```
ant
```

Resources:
- "Motion Bank Github ":https://github.com/motionbank
- "piecemaker.org":http://piecemaker.org
- "motionbank.org":http://motionbank.org
