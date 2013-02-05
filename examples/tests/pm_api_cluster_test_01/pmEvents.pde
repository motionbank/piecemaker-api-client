
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
        
        // a cluster is all videos that overlap:
        //   |-------|    video 1
        // |-------|      video 2
        //       |---|    video 3
        // |=========|    cluster
        
        
        clusters = new ArrayList();
        ArrayList<VideoTimeCluster> clustersTemp = new ArrayList();
        
        for ( Video v : videos ) 
        {
            boolean hasCluster = false;
            for ( VideoTimeCluster c : clustersTemp )
            {
                if ( c.overlapsWith( v ) )
                {
                    c.addVideo( v );
                    hasCluster = true;
                }
            }
            if ( !hasCluster )
            {
                VideoTimeCluster cc = new VideoTimeCluster( v );
                clustersTemp.add( cc );
            }
        }
        
        // now load events for clusters by querying for from-to
        
        for ( VideoTimeCluster c : clustersTemp )
        {
            api.loadEventsBetween( c.from, c.to, api.createCallback( "eventsLoaded", c ) );
        }
        
        clustersTemp = null;
    }
}

void eventsLoaded ( Events evts, VideoTimeCluster c )
{
    if ( evts == null ) return;
    if ( c == null ) return;
    
    org.piecemaker.models.Event[] events = evts.events;
    
    if ( events == null || events.length == 0 ) return;
    
    for ( org.piecemaker.models.Event e : events )
    {
        c.addEvent( e );
    }
    
    clusters.add( c );
    loading = false;
}

