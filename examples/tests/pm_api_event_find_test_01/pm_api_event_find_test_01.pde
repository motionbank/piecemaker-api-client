/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker 2 API test: 
 *    create, update and delete some markers ...
 *
 *    Processing 2.0
 *    created: fjenett 20130302
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

import java.util.*;

PieceMakerApi api;
Group group;
int eventsLen = 30;

boolean passed = false;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XMMFx35tqryp" );
    
    // api.login( "administrator@fake-email.motionbank.org", 
    //            "Administrator", 
    //            api.createCallback( "loggedIn" ) );

    api.createGroup( "Test group", "... with a fancy description", api.createCallback("groupCreated") );
}

void groupCreated ( Group g )
{
    group = g;
    api.listGroups( api.createCallback( "groupsLoaded" ) );
}

void draw ()
{
    if (passed) background( 0x009900 );
}

void loggedIn ( String api_key )
{
    api.listGroups( api.createCallback( "groupsLoaded" ) );
}

void groupsLoaded ( Group[] groups )
{
    if ( groups.length > 0 )
    {
        HashMap args = new HashMap<String,String>();
        args.put( "title", "test 123" );
        args.put( "utc_timestamp", (new Date().getTime() / 1000.0) + "");
        args.put( "duration", 1.0 );
        args.put( "type", "fake" );
        api.createEvent( groups[0].id, args, api.createCallback( "eventsCreated", groups[0] ) );
    }
    else
    {
        println( "No groups found" );
    }
}

void eventsCreated ( org.piecemaker2.models.Event e, Group g ) 
{
    api.listEventsWithFields( g.id, "type", "fake", api.createCallback( "eventsLoaded", g ) );
}

void eventsLoaded ( org.piecemaker2.models.Event[] events, Group g )
{
    println( events.length + " events found at eventsLoaded" );
    for ( org.piecemaker2.models.Event e : events )
    {
        println( e.type + " " + e.fields.get("type") );
    }
  
    HashMap opts = new HashMap<String,String>();
    opts.put( "type", "fake" );
    api.findEvents( g.id, opts, api.createCallback("eventsLoaded2", g) );  
}

void eventsLoaded2 ( org.piecemaker2.models.Event[] events, Group g )
{
    println( events.length + " events found at eventsLoaded2" );
    for ( org.piecemaker2.models.Event e : events )
    {
        println( e.type + " " + e.fields.get("type") );
    }
    
    if ( group != null )
    {
        api.deleteGroup( group.id, api.createCallback("groupDeleted") );
    }
}

void groupDeleted ()
{
    println( "Done" );
    passed = true;
}


