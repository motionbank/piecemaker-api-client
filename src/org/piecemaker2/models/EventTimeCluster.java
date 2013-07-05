/**
 *	
 */

package org.piecemaker2.models;

import org.piecemaker2.collections.*;

import java.util.*;

public class EventTimeCluster
{
	BasicEvent[] allEvents;

	Videos videos;
	Events events;

	Date from, to;

	public Date from ()
	{
		return from;
	}

	public Date to()
	{
		return to;
	}

	public boolean overlapsWith ( BasicEvent be )
	{
    	return !( be.getFinishedAt().compareTo(from) < 0 || be.getHappenedAt().compareTo(to) > 0 );
	}

	public void addAll ( BasicEvent[] events )
	{
		for ( BasicEvent be : events )
		{
			add( be );
		}
	}

	public void add ( BasicEvent be )
	{
		if ( allEvents != null && allEvents.length > 0 )
		{
			BasicEvent[] tmp = new BasicEvent[allEvents.length+1];
			System.arraycopy( allEvents, 0, tmp, 0, allEvents.length );
			tmp[tmp.length-1] = be;
			allEvents = tmp;
			tmp = null;
		}
		else
		{
			allEvents = new BasicEvent[1];
			allEvents[0] = be;
		}

		if ( from == null ) from = be.getHappenedAt();
		else if ( be.getHappenedAt().compareTo(from) < 0 ) 
		{
            from = be.getHappenedAt();
        }

        if ( to == null ) to = be.getFinishedAt();
		else if ( be.getFinishedAt().compareTo(to) > 0 ) 
        {
            to = be.getFinishedAt();
        }

        if ( be.getClass() == org.piecemaker2.models.Video.class )
        {
        	if ( videos == null ) videos = new Videos();
        	videos.add( (Video)be );
        }
        else if ( be.getClass() == org.piecemaker2.models.Event.class )
        {
        	if ( events == null ) events = new Events();
        	events.add( (Event)be );
        }
	}

	public BasicEvent[] getAll ()
	{
		return allEvents;
	}

	public Video[] getVideos ()
	{
		return videos.videos;
	}

	public Event[] getEvents ()
	{
		return events.events;
	}

	public String toString ()
	{
		return "EventTimeCluster: " + from.toString() + " " + to.toString();
	}
}