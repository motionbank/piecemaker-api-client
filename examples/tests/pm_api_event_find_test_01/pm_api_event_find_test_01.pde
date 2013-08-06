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
    
    api.login( "administrator@fake-email.motionbank.org", 
               "Administrator", 
               api.createCallback( "loggedIn" ) );
}

void draw ()
{
}

void loggedIn ( String api_key )
{
    println( api_key );
    api.listGroups( api.createCallback( "groupsLoaded" ) );
}

void groupsLoaded ( Group[] groups )
{
    for ( Group g : groups )
    {
        if ( g.title.indexOf( "jbmf" ) != -1 )
        {
            println( "group: " + g.id );
            api.listEventsWithFields( g.id, "fn_local", ".mp4", api.createCallback( "eventsLoaded", g ) );
            return;
        }
    }
}

void eventsLoaded ( org.piecemaker2.models.Event[] events, Group g )
{
    for ( org.piecemaker2.models.Event e : events )
    {
        println( e.fields.get("title") + " " + e.fields.get("fn_local") );
    }
}


