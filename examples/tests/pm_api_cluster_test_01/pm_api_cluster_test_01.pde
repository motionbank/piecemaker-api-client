/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API: building clusters of events that overlap
 *
 *    P-2.0
 *    created: fjenett 20121203
 *    changed: fjenett 20130205
 */

import org.piecemaker.collections.*;
import org.piecemaker.models.*;
import org.piecemaker.api.*;

import java.util.Date;

PieceMakerApi api;
Piece piece;
Video[] videos;
org.piecemaker.models.Event[] events;
int clustersToLoad = 0;

ArrayList<EventTimeCluster> clusters;
long clustersTimeMin = new Date().getTime(), clustersTimeMax = 0;

boolean loading = true;
String loadingMessage = "Loading pieces ...";

void setup ()
{
    size( 600, 200 );

    api = new PieceMakerApi( this, "a79c66c0bb4864c06bc44c0233ebd2d2b1100fbe", "http://sdcp-nttf-node13.herokuapp.com" );

    api.loadPieces( api.createCallback( "piecesLoaded") );
}

void draw ()
{
    if ( loading ) 
    {
        drawLoading();
        return;
    }
    else
    {
        background( 255 );
        textAlign( LEFT );

        fill( 200 );
        text( "Loaded piece \""+piece.title+"\" \n"+
            "with "+videos.length+" videos in \n"+
            clusters.size() + " clusters", 10, 20 );

        stroke( 0 );
        float y = 5;

        for ( EventTimeCluster c : clusters )
        {
            float xs = map( c.from().getTime(), clustersTimeMin, clustersTimeMax, 5, width-5 );
            float xe = map( c.to().getTime(), clustersTimeMin, clustersTimeMax, 5, width-5 );

            rect( xs, y, xe-xs, 10 );

            y+=5;
        }
    }
}

void drawLoading ()
{
    background( 255 );

    fill( 0 );
    textAlign( CENTER );
    text( loadingMessage, width/2, height/2 );
}

