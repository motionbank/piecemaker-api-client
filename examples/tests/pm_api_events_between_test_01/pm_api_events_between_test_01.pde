/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    P-2.0
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

import java.util.*;

PieceMakerApi api;

int maxRuns = 2000, runs = 0;
long startTs = 0, avgTs = 0;

void setup ()
{
    size( 400, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XMMFx35tqryp" );

    api.listGroups( api.createCallback( "groupsLoaded" ) );
    
    // api.login( "administrator@fake-email.motionbank.org", 
    //            "Administrator", 
    //            api.createCallback( "loggedIn" ) );
}

void draw ()
{
}

// void loggedIn ( String api_key )
// {
//     api.listGroups( api.createCallback( "groupsLoaded" ) );
// }

void groupsLoaded ( Group[] groups )
{
    for ( Group g : groups )
    {
        if ( g.title.indexOf( "jbmf" ) != -1 )
        {
            api.listEventsOfType( g.id, "video", api.createCallback( "videosLoaded", g ) );
            return;
        }
    }
}

void videosLoaded ( org.piecemaker2.models.Event[] videos, Group g )
{
    for ( org.piecemaker2.models.Event v : videos )
    {
        if( v.fields.get("title").equals("20120518_002_jbmf") )
        {
            api.listEventsBetween( g.id, 
                                   v.utc_timestamp, 
                                   new Date((long)(v.utc_timestamp.getTime() + (v.duration * 1000.0))),
                                   api.createCallback("videoEventsLoaded", v, g) );
        }
    }
}

void videoEventsLoaded ( org.piecemaker2.models.Event[] events, org.piecemaker2.models.Event video, Group g )
{
    println( video.utc_timestamp + " " + video.duration );
    
    for ( org.piecemaker2.models.Event e : events )
    {
        println( ((e.utc_timestamp.getTime() - video.utc_timestamp.getTime())/1000.0) + " sec -> " + e.fields.get("title") );
    }
}
