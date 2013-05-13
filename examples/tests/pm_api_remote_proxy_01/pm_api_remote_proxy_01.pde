/**
 *    This is a rather complicated example showing the use of the proxi connector.
 *
 *    A proxy connector can take place of the normal XHR connector and will talk
 *    to a remote window instead of to a server.
 */

import org.piecemaker.api.*;

PieceMakerApi api;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "faux-api-key", "http://localhost:3000" );
}

void draw ()
{
    // just for event handling transport
}

void proxyAvailable ( Object win, String org )
{
    api.useProxy( win, org );
    api.loadPieces(api.createCallback("piecesLoaded"));
}

void piecesLoaded ( Pieces pieces )
{
    api.loadVideosForPiece( pieces.pieces[0].id, api.createCallback( "videosLoaded" ) );
}

void videosLoaded ( Videos videos )
{
    for ( int i = 0; i < videos.total; i++ )
    {
        if ( videos.videos[i].title.indexOf("Center") != -1 ) {
            api.loadEventsByTypeForVideo( videos.videos[i].id, "scene", api.createCallback("sceneEventsLoaded") );
            return;
        }
    }
}

void sceneEventsLoaded ( Events events )
{
    console.log( events );
}
