/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker API test: connection to PM and loading some ..
 *
 *    P-2.0
 *    created: fjenett 20121203
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;

void setup ()
{
    size( 400, 200 );
    
    api = new PieceMakerApi( this,
                              "http://localhost:3001",
                             "9bBa7k4Q4C" );
    
    api.listGroups( api.createCallback( "groupsLoaded" ) );
}

void draw ()
{
}

void groupsLoaded ( Group[] groups )
{
    println( groups );
    
    if ( groups.length > 0 )
    {
        groupLoaded( groups[0] ); 
    }
    else
    {
        api.createGroup( "Fancy title", "Fancy text", api.createCallback( "groupCreated" ) );
    }
}

void groupCreated ( Group g )
{
    api.getGroup( g.id, api.createCallback( "groupLoaded" ) );
}

void groupLoaded ( Group g )
{
    api.listEvents( g.id, api.createCallback( "groupEventsLoaded", g ) );
//    api.listEventsOfType( g.id, "video", api.createCallback( "groupVideosLoaded" ) );
}

void groupEventsLoaded ( org.piecemaker2.models.Event[] groupEvents, Group group )
{
    api.deleteGroup( group.id, api.createCallback( "groupDeleted" ) );
}

//void groupVideosLoaded ( org.piecemaker2.models.Event[] groupVideos )
//{
//    println( groupVideos.length );
//}

void groupDeleted ()
{
    println( "All done!" );
}
