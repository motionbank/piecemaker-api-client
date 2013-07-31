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

PieceMakerApi api;
Group group;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292" );
    
    api.login( "super-admin@example.com", "super-admin", api.createCallback( "loggedIn" ) );
}

void loggedIn ( String api_key )
{    
    api.listUsers( api.createCallback( "usersLoaded" ) );
}

void draw ()
{
}

void usersLoaded ( User[] users )
{
    println( users.length );
    
    api.createUser( "Mr. Horse", int(random(10000000))+"mr@horses.org", "crazy shit password", "a7a6sd8a7s6da8sd67", api.createCallback("userCreated") );
}

void userCreated ( User u )
{
    api.updateUser( u.id, "Mr. Horse 2", int(random(10000000))+"mr@horses-2.org", "crazy shit password again", "cca7a6sd8a7s6da8sd67", api.createCallback( "userUpdated" ) );
}

void userUpdated ( User u )
{
    api.deleteUser( u.id, api.createCallback( "userDeleted" ) );
}

void userDeleted ( User u )
{
    println( "All done" );
}

