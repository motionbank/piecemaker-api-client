/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: connection to PM and loading some ..
 *
 *    P-2.0
 *    created: fjenett 20121203
 */

import org.piecemaker.models.*;
import org.piecemaker.api.*;

PieceMakerApi api;
PApplet self;

void setup ()
{
    size( 200, 200 );
    
    self = this;

    api = new PieceMakerApi( "a79c66c0bb4864c06bc44c0233ebd2d2b1100fbe", null, "http://localhost:3000" );
    
    api.loadPieces( api.createCallback( self, "piecesLoaded") );
}

void piecesLoaded ( Pieces pieces )
{
    if ( pieces.pieces.length > 0 ) {
        api.loadVideosForPiece( pieces.pieces[0].id, api.createCallback( self, "videosLoaded") );
    }
}

void videosLoaded ( Videos videos )
{
    if ( videos.videos.length > 0 ) {
        println( videos.videos[0].title );
        api.loadEventsForVideo( videos.videos[0].id, api.createCallback( self, "eventsLoaded") );
    }
}

void eventsLoaded ( Events events )
{
    println( events.events );
}

