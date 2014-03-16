/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Processing 2.0
 *    created: fjenett 20140316
 */
 
import java.util.*;

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;
Group group;
org.piecemaker2.models.Event event;
User user;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XdIkvf75OS3s" );
    
    api.createGroup( "test group", "", api.createCallback( "groupCreated" ) );
}

void draw ()
{
}

void groupCreated ( Group g )
{
    group = g;
    
    println( "Group '" + group.title + "' created" );
    
    api.createUser( "Test user", (new Date().getTime())+"-test@motionbank.org", "user", api.createCallback( "userCreated" ) );
}

void userCreated ( User u )
{
    user = u;
    println( "created " + user.name );
    api.addUserToGroup( group.id, user.id, "group_admin", api.createCallback( "userAdded" ) );
}

void userAdded ()
{
    api.listGroupUsers( group.id, api.createCallback( "groupUsersLoaded" ) );
}

void groupUsersLoaded ( User[] users )
{
    println( "group contains " + users.length + " users" );
    
    for ( User u : users )
    {
        println( "    " + u.name );
    }
    
    api.login( user.email, user.password, api.createCallback( "userLoggedIn" ) );
}

void userLoggedIn ( String api_key )
{
    HashMap<String, String> eventData = new HashMap<String, String>();
    
    eventData.put( "utc_timestamp", (new Date().getTime()) + "" );
    eventData.put( "duration", (1000) + "" );
    
    eventData.put( "title", "This is a test marker …" );
    eventData.put( "type", "test-type" );
    
    api.createEvent( group.id, eventData, api.createCallback( "eventCreated" ) );
}

void eventCreated ( org.piecemaker2.models.Event event )
{
    api.deleteGroup( group.id, api.createCallback( "groupDeleted", event ) );
}

void groupDeleted ( org.piecemaker2.models.Event event )
{
    println( "Group deleted" );
    
    // relogin as original user
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XdIkvf75OS3s" );
    
    api.deleteUser( user.id, api.createCallback( "userDeleted" ) );
}

void userDeleted ( User u )
{
    println( "deleted user " + u.name );
}

void piecemakerError ( int status, String errMsg, String request )
{
    println( "Failed: " + status + " " + errMsg + " at " + request );
}
