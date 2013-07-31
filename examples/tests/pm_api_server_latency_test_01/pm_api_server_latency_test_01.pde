/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    P-2.0
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

import java.util.*;

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
    startTs = new Date().getTime();
    api.getSystemTime( api.createCallback("serverTimeReceived") );
}

void serverTimeReceived ( Date time )
{
    avgTs += (time.getTime() - startTs) / 2;
    
    runs++;
    if ( runs == maxRuns )
    {
        double latency = (avgTs / (double)runs);
        Date serverTime = new Date( (long)(time.getTime() + latency) );
        println( "Server latency: " + latency + " ms" );
        println( "Server time: " + serverTime );
    }
    else
    {
        startTs = new Date().getTime();
        api.getSystemTime( api.createCallback("serverTimeReceived") );
    }
}
