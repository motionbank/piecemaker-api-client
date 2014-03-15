/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: connection to PM and loading some ..
 *
 *    P-2.0
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;

void setup ()
{
    size( 400, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XdIkvf75OS3s" );
    api.listAllGroups( api.createCallback( "groupsLoaded" ) );
    
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
        println( g.title );
        
        if (  g.title.indexOf("notimetofly") != -1 ) {
            api.getGroup( g.id, api.createCallback("groupLoaded") );
            break;
        }
    }
}

void groupLoaded ( Group group )
{
    println( "Group '" + group.title + "' (#" + group.id + ") loaded" );
    
    api.listEventsOfType( group.id, "dev_notes", api.createCallback( "groupEventsLoaded", group ) );
    
    //api.listEvents( group.id, api.createCallback( "groupEventsLoaded", group ) );
}

void groupEventsLoaded ( org.piecemaker2.models.Event[] groupEvents, Group group )
{
    for ( org.piecemaker2.models.Event e : groupEvents )
    {
        println( e.utc_timestamp + " " + e.fields.get("type") + " " + e.fields.get("title") );
    }
}

void piecemakerError ( int status, String err )
{
    println( err );
}
