/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: connection to PM and loading some ..
 *
 *    P-2.0
 *    created: fjenett 20121203
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;
boolean passed = false;

void setup ()
{
    size( 400, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "XXX" );
    
    api.login( "super-admin-1394793134@example.com", 
               "super-admin-1394793134", 
               api.createCallback( "loggedIn" ) );
}

void loggedIn ( String api_key )
{
    println( "Logged in!" );
    println( api_key );
    api.listAllGroups( api.createCallback( "groupsLoaded" ) );
}

void draw ()
{
    if ( passed ) background( 0x009900 );
}

void groupsLoaded ( Group[] groups )
{
    println( groups );
    
//    if ( groups.length > 0 )
//    {
//        groupLoaded( groups[0] );
//    }
//    else
    {
        api.createGroup( "Fancy title", "Fancy text", api.createCallback( "groupLoaded" ) );
    }
}

void groupLoaded ( Group group )
{
    println( "Group '" + group.title + "' loaded" );
    
    api.listEvents( group.id, api.createCallback( "groupEventsLoaded", group ) );
}

void groupEventsLoaded ( org.piecemaker2.models.Event[] groupEvents, Group group )
{
    api.deleteGroup( group.id, api.createCallback( "groupDeleted" ) );
}

void groupDeleted ()
{
    println( "... and deleted" );
    api.logout( api.createCallback( "loggedOut" ) );
}

void loggedOut ()
{
    println( "Passed!" );
    passed = true;
}
