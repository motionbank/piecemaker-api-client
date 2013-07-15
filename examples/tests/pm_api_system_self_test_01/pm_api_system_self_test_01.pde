/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker 2 API test: 
 *    create, update and delete some groups ...
 *
 *    Processing 2.0
 *    created: fjenett 20130302
 */
 
import java.util.*;

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:3001", "9bBa7k4Q4C" );

    api.whoAmI( api.createCallback( "selfLoaded" ) );
    
    api.getSystemTime( api.createCallback( "systemTimeReceived" ) );
}

void draw ()
{
}

void selfLoaded ( User u )
{
    println( u );
}

void systemTimeReceived (  )
{
    println( "Called" );
}

void piecemakerError ( int status, String errMsg, String request )
{
    println( "Failed: " + status + " " + errMsg + " at " + request );
}
