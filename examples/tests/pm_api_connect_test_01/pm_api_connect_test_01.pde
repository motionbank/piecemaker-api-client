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

void setup ()
{
    size( 400, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XqmCQ4N7JkwP" );
    
    api.login( "SuperAdmin", 
               "SuperAdmin", 
               api.createCallback( "loggedIn" ) );
}

void loggedIn ( String api_key )
{
    println( "Logged in!" );
    println( api_key );
    if ( true ) return;
    api.listGroups( api.createCallback( "groupsLoaded" ) );
}

void draw ()
{
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
}
