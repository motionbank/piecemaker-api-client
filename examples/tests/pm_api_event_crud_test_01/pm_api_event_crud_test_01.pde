/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: create, update and delete some markers ...
 *
 *    Processing 2.0b
 *    created: fjenett 20130302
 */

import org.piecemaker2.api.*;

PieceMakerApi api;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMaker2Api( this, "not-a-real-api-key", "http://localhost:3000" );
    
    HashMap<String, String> eventData = new HashMap<String, String>();
    eventData.put( "title", "test marker" );
    eventData.put( "event_type", "data" );
    api.createEvent( eventData, api.createCallback( "eventCreated" ) );
}

void draw ()
{
}

void eventCreated ( org.piecemaker2.models.Event event )
{
    if ( event != null )
    {
        println( "Title is: " + event.getTitle() );
        
        HashMap<String, String> eventData = new HashMap<String, String>();
        eventData.put( "title", "my new title" );
    
        api.updateEvent( event.id, eventData, api.createCallback( "eventUpdated", event ) );
    }
}

void eventUpdated ( org.piecemaker2.models.Event updatedEvent, org.piecemaker2.models.Event originalEvent )
{
    if ( originalEvent != null )
    {
        println( "Title changed from: " + originalEvent.getTitle() );
    }
    
    if ( updatedEvent != null )
    {
        println( updatedEvent.getTitle() );
    }
    
    api.deleteEvent( updatedEvent.id, api.createCallback( "eventDeleted", updatedEvent ) );
}

void eventDeleted ( org.piecemaker2.models.Event deletedEvent )
{
    println( "Event #" + deletedEvent.id + " has been deleted ..." );
}

