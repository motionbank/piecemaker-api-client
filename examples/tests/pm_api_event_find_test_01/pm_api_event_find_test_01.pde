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
    eventData.put( "type", "test-type" );
    
    api.createEvent( group.id, eventData, api.createCallback( "eventCreated" ) );
}

void eventCreated ( Event event )
{
    api.getEvent( group.id, event.id, api.createCallback( "eventLoaded" ) ); 
}

void eventLoaded ( Event event )
{    
    api.listEventsOfType( group.id, "test-type", api.createCallback( "eventsFound" ) );
}

int eventsToDelete = 0;
void eventsFound ( Events events )
{
    console.log( events );
    
    for ( Event e : events )
    {
        eventsToDelete++;
        api.deleteEvent( group.id, e.id, api.createCallback( "eventDeleted" ) );
    }
}

void eventDeleted ( Event event )
{
    eventsToDelete--;
    
    if ( eventsToDelete == 0 )
        api.deleteGroup( group.id, api.createCallback( "groupDeleted" ) );
}

void groupDeleted ()
{
    console.log( "All done!" );
}

