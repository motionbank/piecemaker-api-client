/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker 2 API test: 
 *    create, update and delete some groups ...
 *
 *    Processing 2.0
 *    created: fjenett 20130302
 */
 
import java.util.*;

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;
Group group;
org.piecemaker2.models.Event event;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XMMFx35tqryp" );
    api.createGroup( "test group", "", api.createCallback( "groupCreated" ) );
    
    // api.login( "administrator@fake-email.motionbank.org", 
    //            "Administrator", 
    //            api.createCallback( "loggedIn" ) );
}

// void loggedIn ( String api_key )
// {    
//     api.createGroup( "test group", "", api.createCallback( "groupCreated" ) );
// }

void draw ()
{
}

void groupCreated ( Group g )
{
    group = g;
    
    println( "Group '" + group.title + "' created" );
    
    HashMap<String, String> eventData = new HashMap<String, String>();
    
    eventData.put( "utc_timestamp", (new Date().getTime()) + "" );
    eventData.put( "duration", (1000) + "" );
    
    eventData.put( "title", "This is a test marker …" );
    eventData.put( "type", "test-type" );
    
    api.createEvent( group.id, eventData, api.createCallback( "eventCreated" ) );
}

void eventCreated ( org.piecemaker2.models.Event event )
{
    api.deleteGroup( group.id, api.createCallback( "groupDeleted", event ) );
}

void groupDeleted ( org.piecemaker2.models.Event event )
{
    println( "Group deleted" );
    
    // THESE SHOULD BOTH FAIL NOW:
    api.getGroup( group.id, api.createCallback( "groupLoaded" ) );
    api.getEvent( group.id, event.id, api.createCallback( "eventLoadedAgain" ) );
}

void eventLoadedAgain ()
{
    println( "Should never be called! (1)" );
}

void groupLoaded ()
{
    println( "Should never be called! (2)" );
}

void piecemakerError ( int status, String errMsg, String request )
{
    println( "Failed: " + status + " " + errMsg + " at " + request );
}
