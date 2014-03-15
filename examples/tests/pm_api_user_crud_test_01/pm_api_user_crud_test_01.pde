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
User user1, user2;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XdIkvf75OS3s" );

    api.listUsers( api.createCallback( "usersLoaded" ) );
    
    // api.login( "administrator@fake-email.motionbank.org", 
    //            "Administrator", 
    //            api.createCallback( "loggedIn" ) );
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
    
    api.createUser( "Mr. Horse", int(random(10000000))+"mr@horses.org", api.createCallback("user1Created") );
}

void user1Created ( User u1 )
{
    console.log( "User 1:", u1 );
    user1 = u1;
    
    api.createUser( "Mr. Horse 2", int(random(10000000))+"mr@horses-2.org", "super_admin", api.createCallback( "user2Created" ) );
}

void user2Created ( User u2 )
{
    console.log( "User 2:", u2 );
    user2 = u2;
    
    api.login( user1.email, user1.password, api.createCallback("user1LoggedIn") );
}

void user1LoggedIn ( String api_key )
{
    println( user1.name + " " + api_key );
    
    api.login( user2.email, user2.password, api.createCallback("user2LoggedIn") );
}

void user2LoggedIn ( String api_key )
{
    println( user2.name + " " + api_key );
    
    //api.updateUser( user1.id, "Mr. Horse 1.5", int(random(10000000))+"mr@horses-1-5.org", "group_admin", 
    //                false, false, api.createCallback( "user1Updated" ) );
    
    api.updateUser( user1.id, "Mr. Horse 1.5", int(random(10000000))+"mr@horses-1-5.org",
                    api.createCallback( "user1Updated" ) );
}

void user1Updated ( User u1 )
{
    console.log( u1, user1 );
    api.deleteUser( u1.id, api.createCallback( "user1Deleted" ) );
}

void user1Deleted ( User u )
{
    println( "User 1 deleted" );
    api.deleteUser( user2.id, api.createCallback( "user2Deleted" ) );
}

void user2Deleted ( User u )
{
    println( "User 2 deleted, all done" );
}

