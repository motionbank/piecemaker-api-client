class VideoTimeCluster
{
    ArrayList<Video> videos;
    ArrayList<org.piecemaker.models.Event> events;
    
    Date from, to;
    
    VideoTimeCluster ( Video v ) 
    {
        videos = new ArrayList();
        
        videos.add( v );
        from = v.getRecordedAt();
        to = v.getFinishedAt();
        
        events = new ArrayList();
    }
    
    void addVideo ( Video v ) 
    {
        if ( videos.contains( v ) ) return;
        if ( v.getRecordedAt().compareTo(from) < 0 ) {
            from = v.getRecordedAt();
        }
        if ( v.getFinishedAt().compareTo(to) > 0 ) {
            to = v.getFinishedAt();
        }
        videos.add( v );
    }
    
    void addEvent ( org.piecemaker.models.Event e )
    {
        events.add( e );
    }
    
    boolean overlapsWith ( BasicEvent v )
    {
        return !( v.getFinishedAt().compareTo(from) < 0 || v.getHappenedAt().compareTo(to) > 0 );
    }
    
    public String toString ()
    {
        String s = "";
        s += from.toString() + " - " + to.toString() + "\n";
        for ( Video v : videos )
        {
            s += "\t" + v.title + "\n";
        }
        return s;
    }
}
