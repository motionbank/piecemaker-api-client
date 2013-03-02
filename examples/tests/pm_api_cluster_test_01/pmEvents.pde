
void piecesLoaded ( Pieces pieces )
{
    loadingMessage = "Loading videos ...";
    
    if ( pieces.pieces.length > 0 ) {
        piece = pieces.pieces[0];
        api.loadVideosForPiece( piece.id, api.createCallback( "videosLoaded", piece.id ) );
    }
}

void videosLoaded ( Videos vids, int piece_id )
{
    loadingMessage = "Loading events ...";
    
    if ( vids.videos.length > 0 ) 
    {
        videos = vids.videos;
        
        // building clusters from videos
        
        EventTimeCluster[] clustersTemp = EventTimeClusters.clusterEvents( videos );
        
        clusters = new ArrayList();
        clustersToLoad = 0;
        
        // now load events for clusters by querying for from-to
        
        for ( EventTimeCluster c : clustersTemp )
        {
            api.loadEventsBetween( c.from(), c.to(), api.createCallback( "eventsLoaded", c ) );
            clustersToLoad++;
        }
        
        clustersTemp = null;
    }
}

void eventsLoaded ( Events evts, EventTimeCluster c )
{
    clustersToLoad--;
    
    if ( evts == null ) return;
    if ( c == null ) return;
    
    org.piecemaker.models.Event[] events = evts.events;
    
    if ( events == null || events.length == 0 ) return;
    
    for ( org.piecemaker.models.Event e : events )
    {
        c.add( e );
    }
    
    clustersTimeMin = clustersTimeMin > c.from().getTime() ? c.from().getTime() : clustersTimeMin;
    clustersTimeMax = clustersTimeMax < c.to().getTime()   ? c.to().getTime()   : clustersTimeMax;

    clusters.add( c );
    
    if ( clustersToLoad == 0 )
    { 
//        java.util.Collections.sort( clusters, new java.util.Comparator (){
//            public int compare ( Object a, Object b ) {
//                return ((EventTimeCluster)a).from().compareTo( ((EventTimeCluster)b).from() );
//            }
//        });
        
        loading = false;
    }
}

