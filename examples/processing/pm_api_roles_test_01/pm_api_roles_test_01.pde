/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker 2 API test: 
 *    create, update and delete some roles ...
 *
 *    Processing 2.0
 *    created: fjenett 20140315
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XdIkvf75OS3s" );
    api.whoAmI( api.createCallback( "selfLoaded" ) );
    
    // api.login( "administrator@fake-email.motionbank.org", 
    //            "Administrator", 
    //            api.createCallback( "loggedIn" ) );
}

// void loggedIn ( String api_key )
// {    
//     api.whoAmI( api.createCallback( "selfLoaded" ) );
// }

void draw ()
{
}

void selfLoaded ( User u )
{
    println( "You are: " + u.email );
    
    api.listRoles( api.createCallback("rolesLoaded") );
}

void rolesLoaded ( Role[] roles )
{
    console.log( roles );
}

void piecemakerError ( int status, String errMsg, String request )
{
    println( "Failed: " + status + " " + errMsg + " at " + request );
}
