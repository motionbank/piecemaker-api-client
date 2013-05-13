_Please note that this code and the API is going to change a lot in the upcoming months as we move on from the original PieceMaker 1 to the brand new PieceMaker 2_

***PieceMaker API wrapper for Java and JavaScript***

As part of the Motion Bank research project the PieceMaker software by David Kern is further developed. PieceMaker is essentially a process documentation tool that allows to align events in time. You can think of it as a video annotation tool.

Official information about PieceMaker as part of Motion Bank is [here](http://motionbank.org/en/piecemaker-2/).

At Motion Bank we use PieceMaker to align several video streams with data and additional annotations. It is the backbone of our online score system.

This client library for Java/Processing and JavaScript allows to connect to PieceMaker through an JSON-API. It is completely event based and uses almost the same API in both Java/JS allowing for Processing sketches to run in both modes. ( [Processing?](http://processing.org/) )

Technically the communication to the API is using [jQuery](http://api.jquery.com/jQuery.ajax/) for JS XHR ("ajax") and [Apache HTTP Components](http://hc.apache.org/) for Java.

More information:
- [piecemaker.org](http://piecemaker.org)
- [motionbank.org](http://motionbank.org)
