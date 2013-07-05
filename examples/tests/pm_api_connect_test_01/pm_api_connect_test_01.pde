/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: connection to PM and loading some ..
 *
 *    P-2.0
 *    created: fjenett 20121203
 */

import org.piecemaker2.api.*;

PieceMakerApi2 api;

boolean loading = true;
String loadingMessage = "Loading pieces ...";

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMaker2Api( this, 
                              false ? "http://localhost:8080" : "http://jbmf-piecemaker2-prod.eu01.aws.af.cm",
                              "1eda23758be9e36e5e0d2a6a87de584aaca0193f" );
    
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
    api.listEvents( groups[0].id, api.createCallback( "groupEventsLoaded" ) );
    api.listEventsOfType( groups[0].id, "video", api.createCallback( "groupVideosLoaded" ) );
}

void groupEventsLoaded ( Events groupEvents )
{
    console.log( groupEvents.queryTime );
}

void groupVideosLoaded ( Videos groupVideos )
{
    console.log( groupVideos.queryTime );
}
