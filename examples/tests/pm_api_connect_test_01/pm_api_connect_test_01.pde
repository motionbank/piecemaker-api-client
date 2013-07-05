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
Group group;
Event[] videos;
Event[] allEvents;

boolean loading = true;
String loadingMessage = "Loading pieces ...";

void setup ()
{
    size( 400, 200 );
    
    api = new PieceMaker2Api( this, 
                              false ? "http://localhost:8080" : "http://jbmf-piecemaker2-prod.eu01.aws.af.cm",
                              "1eda23758be9e36e5e0d2a6a87de584aaca0193f" );
    
    api.listGroups( api.createCallback( "groupsLoaded") );
}

void draw ()
{
    if ( videos != null && allEvents != null )
    {
        background( 255 );
        textAlign( LEFT );
        
        text( "Loaded piece \"" + group.title + "\" \n"+
              "with " + videos.length + " videos "+
              "and " + allEvents.length + " events (incl. videos)", 
              10, 20 );
    }
    else
    {
        drawLoading();
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
    group = groups[0];
    
    api.listEvents( group.id, api.createCallback( "groupEventsLoaded" ) );
    api.listEventsOfType( group.id, "video", api.createCallback( "groupVideosLoaded" ) );
}

void groupEventsLoaded ( Event[] groupEvents )
{
    allEvents = groupEvents;
    
    console.log( groupEvents.length, groupEvents.queryTime, (1.0 * groupEvents.queryTime) / groupEvents.length );
}

void groupVideosLoaded ( Event[] groupVideos )
{
    videos = groupVideos;
    
    console.log( groupVideos.length, groupVideos.queryTime, (1.0 * groupVideos.queryTime) / groupVideos.length );
}
