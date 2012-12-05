
void piecesLoaded ( Pieces pieces )
{
    loadingMessage = "Loading videos ...";
    
    if ( pieces.pieces.length > 0 ) {
        piece = pieces.pieces[0];
        api.loadVideosForPiece( piece.id, api.createCallback( "videosLoaded") );
    }
}

void videosLoaded ( Videos vids )
{
    loadingMessage = "Loading events ...";
    
    if ( vids.videos.length > 0 ) {
        videos = vids.videos;
        api.loadEventsForVideo( videos[0].id, api.createCallback( "eventsLoaded") );
    }
}

void eventsLoaded ( Events evts )
{
    events = evts.events;
    loading = false;
}

