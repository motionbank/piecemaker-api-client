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

PieceMakerApi api;
Group group;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMaker2Api( this, "http://localhost:3001", "9bBa7k4Q4C" );
    
    api.createGroup( "test group", "", api.createCallback( "groupCreated" ) );
}

void draw ()
{
}

void groupCreated ( Group g )
{
    group = g;
    
    HashMap<String, String> eventData = new HashMap<String, String>();
    
    eventData.put( "utc_timestamp", new Date().getTime() );
    eventData.put( "duration", 1000 );
    
    eventData.put( "title", "Where does this end up?" );
    eventData.put( "type", "test type" );
    
    api.createEvent( group.id, eventData, api.createCallback( "eventCreated" ) );
}

void eventCreated ( org.piecemaker2.models.Event event )
{
    api.getEvent( group.id, event.id, api.createCallback( "eventLoaded" ) ); 
}

void eventLoaded ( Event event )
{
    HashMap<String, String> eventData = new HashMap<String, String>();
    
    eventData.put( "utc_timestamp", new Date().getTime() );
    eventData.put( "duration", 2000 );
    
    eventData.put( "title", "Oh my goodness" );
    eventData.put( "super-type", "a-super-fancy-type" );
    
    api.updateEvent( group.id, event.id, eventData, api.createCallback( "eventUpdated", event ) );
}

void eventUpdated ( org.piecemaker2.models.Event event, Object e2 )
{    
    api.deleteEvent( group.id, e2.id, api.createCallback( "eventDeleted" ) );
}

void eventDeleted ( org.piecemaker2.models.Event event )
{
    api.deleteGroup( group.id, api.createCallback( "groupDeleted" ) );
}

void groupDeleted ()
{
    console.log( "All done!" );
}

