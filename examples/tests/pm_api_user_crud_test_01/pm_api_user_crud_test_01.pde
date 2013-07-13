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
    
    api = new PieceMakerApi( this, "http://localhost:3001", "9bBa7k4Q4C" );
    
    api.listUsers( api.createCallback( "usersLoaded" ) );
}

void draw ()
{
}

void usersLoaded ( User[] users )
{
    println( users );
    
    api.createUser( "Mr. Horse", "mr@horses.org", "crazy shit password", "a7a6sd8a7s6da8sd67", api.createCallback("userCreated") );
}

void userCreated ( User u )
{
    api.getUser( u.id, api.createCallback( "userLoaded" ) );
}

void userLoaded ( User u )
{
    api.updateUser( u.id, "Mr. Horse 2", "mr@horses-2.org", "crazy shit password again", "cca7a6sd8a7s6da8sd67", api.createCallback( "userUpdated", u ) );
}

void userUpdated ( User u )
{
    api.getUser( u.id, api.createCallback( "userLoadedAgain" ) );
}

void userLoadedAgain ( User u )
{
    api.deleteUser( u.id, api.createCallback( "userDeleted" ) );
}

void userDeleted ()
{
    println( "All done" );
}

