/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker 2 API test: 
 *    create, update and delete some markers ...
 *
 *    Processing 2.0
 *    created: fjenett 20130302
 */
 
import java.util.*;

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;
Group group;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292" );
    
    api.login( "administrator@fake-email.motionbank.org", 
               "Administrator", 
               api.createCallback( "loggedIn" ) );
}

void loggedIn ( String api_key )
{    
    api.createGroup( "Test group to hold events, will be deleted later on", "", api.createCallback( "groupCreated" ) );
}

void draw ()
{
}

void groupCreated ( Group g )
{
    println( "Group '" + g.title + "' created" );
    
    group = g;
    
    HashMap<String, Object> eventData = new HashMap<String, Object>();
    
    eventData.put( "utc_timestamp", (new Date().getTime()) + "" );
    eventData.put( "duration", (1000) + "" );
    eventData.put( "type", "test-type-1" );
    
    eventData.put( "fields[title]", "Emperors new cloths" );
    eventData.put( "fields[super-type]", "type-0-negative" );
    
    api.createEvent( group.id, eventData, api.createCallback( "eventCreated" ) );
}

void eventCreated ( org.piecemaker2.models.Event event )
{
    println( "Event #" + event.id + " '" + event.fields.get("title") + "' created" );
    
    HashMap<String, Object> eventData = new HashMap<String, Object>();
    
    eventData.put( "utc_timestamp", (new Date().getTime()) + "" );
    eventData.put( "duration", (2000) + "" );
    eventData.put( "type", "test-type-2" );
    
    eventData.put( "fields[title]", "Oh my goodness" );
    eventData.put( "fields[super-type]", "a-super-fancy-type" );
    
    api.updateEvent( group.id, event.id, eventData, api.createCallback( "eventUpdated" ) );
}

void eventUpdated ( org.piecemaker2.models.Event event )    
{
    println( "Event #" + event.id + " '" + event.fields.get("title") + "' updated" );
    
    api.deleteEvent( group.id, event.id, api.createCallback( "eventDeleted" ) );
}

void eventDeleted ( org.piecemaker2.models.Event event )
{
    println( "Event deleted" );
    
    api.deleteGroup( group.id, api.createCallback( "groupDeleted" ) );
}

void groupDeleted ()
{
    println( "Group deleted" );
}

void piecemakerError ( int code, String message, Object o )
{
    println( message );
}

