_Please note that this code and the API is going to change a lot in the upcoming months as we move on from the original PieceMaker 1 to the brand new PieceMaker 2_

# PieceMaker API wrapper for Java and JavaScript

As part of the Motion Bank research project the PieceMaker software by [David Kern](http://www.nutbitsresearch.com/) is [being further developed at H_DA, Hochschule Darmstadt](http://ikum.h-da.de/projekte/mediensysteme/motion-bank-piecemaker/). PieceMaker is essentially a process documentation tool that allows to align events in time. You can think of it as a video annotation tool.

Official information about PieceMaker as part of Motion Bank is [here](http://motionbank.org/en/piecemaker-2/).

At Motion Bank we use PieceMaker to align several video streams with data and additional annotations. It is the backbone of our online score system.

This client library for Java/Processing and JavaScript allows to connect to PieceMaker through an JSON-API. It is completely event based and uses almost the same API in both Java/JS allowing for Processing sketches to run in both modes. ( [Processing?](http://processing.org/) )

Technically the communication to the API is using [jQuery](http://api.jquery.com/jQuery.ajax/) for JS XHR ("ajax") and [Apache HTTP Components](http://hc.apache.org/) for Java.

## Usage

Currently the only way to use this client library is with an installation of PM somewhere. We have MB data online but as we are still changing and fixing things so we are hessitant to open up just now. Please mail us at "florian at motionbank org" if you really want/need access just now.

More information:
- [piecemaker.org](http://piecemaker.org)
- [motionbank.org](http://motionbank.org)
