/**
 *    PieceMaker API test ... video C/R/U/D
 *
 *    Processing 2.0b
 *    fjenett 20130304
 */
 
 import org.piecemaker.api.*;
 import org.piecemaker.models.*;
 
 import java.util.*;
 
 PieceMakerApi api;
 
 void setup ()
 {
     size( 200, 200 );
     
     api = new PieceMakerApi(this,"fake-api-key","http://localhost:3000");
     
     HashMap data = new HashMap();
     data.put( "title", "Test title" );
     data.put( "happened_at", new Date().getTime()+"" );
     data.put( "piece_id", "1" );
     
     ApiRequest.DEBUG = true;
     api.createVideo( data, api.createCallback( "videoCreated" ) );
 }
 
 void draw ()
 {
     
 }
 
 void videoCreated ( Video v )
 {
     if ( v != null )
     {
         api.loadVideo( v.id, api.createCallback( "videoLoaded" ) );
     }
 }
 
 void videoLoaded ( Video v )
 {
     if ( v != null )
     {
         HashMap data = new HashMap();
         data.put( "title", "My New Video Title" );
         api.updateVideo( v.id, data, api.createCallback( "videoUpdated" ) );
     }
 }
 
 void videoUpdated ( Video v )
 {
     if ( v != null )
     {
         api.deleteVideo( v.id, api.createCallback( "videoDeleted" ) );
     }
 }
 
 void videoDeleted ()
 {
     println("Done!");
 }
