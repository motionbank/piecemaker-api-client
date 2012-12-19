/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: connection to PM and loading some ..
 *
 *    P-2.0
 *    created: fjenett 20121203
 */

import org.piecemaker.collections.*;
import org.piecemaker.models.*;
import org.piecemaker.api.*;

PieceMakerApi api;
Piece piece;
Video[] videos;
org.piecemaker.models.Event[] events;

boolean loading = true;
String loadingMessage = "Loading pieces ...";

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "a79c66c0bb4864c06bc44c0233ebd2d2b1100fbe", "http://localhost:3000" );
    
    api.loadPieces( api.createCallback( "piecesLoaded") );
}

void draw ()
{
    if ( loading ) {
        drawLoading();
        return;
    }
    else
    {
        background( 255 );
        textAlign( LEFT );
        
        text( "Loaded piece \""+piece.title+"\" \nwith "+videos.length+" videos \nand "+events.length+" events.", 10, 20 );
    }
}

void drawLoading ()
{
    background( 255 );
    
    fill( 0 );
    textAlign( CENTER );
    text( loadingMessage, width/2, height/2 );
}

void piecesLoaded ( Pieces pieces )
{
    loadingMessage = "Loading videos ...";
    
    if ( pieces.pieces.length > 0 ) {
        piece = pieces.pieces[0];
        api.loadVideosForPiece( piece.id, api.createCallback( "videosLoaded") );
    }
}

void videosLoaded ( Videos vids )
{
    loadingMessage = "Loading events ...";
    
    if ( vids.videos.length > 0 ) {
        videos = vids.videos;
        api.loadEventsForVideo( videos[0].id, api.createCallback( "eventsLoaded") );
    }
}

void eventsLoaded ( Events evts )
{
    events = evts.events;
    println( events );
    loading = false;
}

