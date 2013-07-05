/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: connection to PM and loading some ..
 *
 *    P-2.0
 *    created: fjenett 20121203
 */

import org.piecemaker2.collections.*;
import org.piecemaker2.models.*;
import org.piecemaker2.api.*;

PieceMakerApi api;
Piece piece;
Video[] videos;
org.piecemaker2.models.Event[] events;

boolean loading = true;
String loadingMessage = "Loading pieces ...";

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMaker2Api( this, "http://localhost:8080" );
    
    api.listGroups( api.createCallback( "groupsLoaded") );
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

void groupsLoaded ( EventGroup[] groups )
{
    loadingMessage = "Loading videos ...";
    
    if ( groups.length > 0 ) {
        group = groups[0];
        //api.loadVideosForPiece( piece.id, api.createCallback( "videosLoaded") );
        api.listGroupEvents( group.id, api.createCallback( "groupEventsLoaded" ) );
    }
}

void groupEventsLoaded ( Event[] events )
{
    console.log( events.length );
    
//    loadingMessage = "Loading events ...";
//    
//    if ( vids.videos.length > 0 ) {
//        videos = vids.videos;
//        api.loadEventsForVideo( videos[0].id, api.createCallback( "eventsLoaded") );
//    }
}

//void eventsLoaded ( Events evts )
//{
//    events = evts.events;
//    println( events );
//    loading = false;
//}

