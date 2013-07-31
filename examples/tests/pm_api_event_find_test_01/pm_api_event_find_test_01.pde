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

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292" );
    
    api.login( "super-admin@example.com", "super-admin", api.createCallback( "loggedIn" ) );
}

void loggedIn ( String api_key )
{    
    api.createGroup( "Another test group", "", api.createCallback( "groupCreated" ) );
}

void draw ()
{
}

void groupCreated ( Group g )
{
    group = g;
    
    createEvent();
}

int eventsCreated = 0;
void createEvent ()
{
    HashMap<String, Object> eventData = new HashMap<String, Object>();
    
    eventData.put( "utc_timestamp", (new Date().getTime()) + "" );
    eventData.put( "duration", 1000 + "" );
    
    HashMap<String, Object> eventFields = new HashMap<String, Object>();
    
    eventFields.put( "title", "Test event" );
    eventFields.put( "type", "test-type-xyz" );
    eventFields.put( "creatednum", eventsCreated + "" );
    
    eventData.put( "fields", eventFields );
    
    api.createEvent( group.id, eventData, api.createCallback( "eventCreated" ) );
}

void eventCreated ( org.piecemaker2.models.Event event )
{
    println( "Event number " + event.id +  " created" );
    
    eventsCreated++;
    
    if ( eventsCreated == eventsLen )
    {
        api.listEventsOfType( group.id, "test-type-xyz", api.createCallback( "eventsFound" ) );
    } else {
        createEvent();
    }
}

org.piecemaker2.models.Event[] eventsToDelete;
void eventsFound ( org.piecemaker2.models.Event[] events )
{
    println( "Found: " + events.length + " matching events" );
    eventsToDelete = events;
    deleteEvent();
}

void deleteEvent ()
{
    org.piecemaker2.models.Event e = eventsToDelete[0];
    eventsToDelete = (org.piecemaker2.models.Event[])subset( eventsToDelete, 1 );
    
    api.deleteEvent( group.id, e.id, api.createCallback( "eventDeleted" ) );
}

void eventDeleted ( org.piecemaker2.models.Event event )
{
    println( "Event number " + event.id + " deleted" );
    
    if ( eventsToDelete.length == 0 )
        api.deleteGroup( group.id, api.createCallback( "groupDeleted" ) );
    else
        deleteEvent();
}

void groupDeleted ()
{
    println( "Events and group deleted" );
}

