/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    P-2.0
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;

int maxRuns = 2000, runs = 0;
long startTs = 0, avgTs = 0;

void setup ()
{
    size( 400, 200 );
    
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
    startTs = new java.util.Date().getTime();
    api.getSystemTime( api.createCallback("serverTimeReceived") );
}

void serverTimeReceived ( java.util.Date time )
{
    avgTs += (time.getTime() - startTs) / 2;
    
    runs++;
    if ( runs == maxRuns )
    {
        double latency = (avgTs / (double)runs);
        java.util.Date serverTime = new java.util.Date( (long)(time.getTime() + latency) );
        println( "Server latency: " + latency + " ms" );
        println( "Server time: " + serverTime );
    }
    else
    {
        startTs = new java.util.Date().getTime();
        api.getSystemTime( api.createCallback("serverTimeReceived") );
    }
}
