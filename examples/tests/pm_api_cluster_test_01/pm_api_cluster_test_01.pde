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

ArrayList<VideoTimeCluster> clusters;
long clustersTimeMin = Long.MAX_VALUE, clustersTimeMax = Long.MIN_VALUE;

boolean loading = true;
String loadingMessage = "Loading pieces ...";

void setup ()
{
    size( 600, 200 );
    
    api = new PieceMakerApi( this, "a79c66c0bb4864c06bc44c0233ebd2d2b1100fbe", "http://localhost:3000" );
    
    api.loadPieces( api.createCallback( "piecesLoaded") );
}

boolean clustersBusy = false;

void draw ()
{
    if ( loading ) {
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
        clustersBusy = true;
        for ( VideoTimeCluster c : clusters )
        {
            float xs = map( c.from.getTime(), clustersTimeMin, clustersTimeMax, 5, width-5 );
            float xe = map( c.to.getTime(),   clustersTimeMin, clustersTimeMax, 5, width-5 );
            
            line( xs, y, xe, y );
            
            y+=5;
        }
        clustersBusy = false;
    }
}

void drawLoading ()
{
    background( 255 );
    
    fill( 0 );
    textAlign( CENTER );
    text( loadingMessage, width/2, height/2 );
}
