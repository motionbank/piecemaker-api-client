package org.piecemaker.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;

/*
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
| created_at  | datetime     | YES  |     | NULL    |                |
| title       | varchar(255) | YES  |     | NULL    |                |
| group_id    | int(11)      | YES  | MUL | NULL    |                |
| updated_at  | datetime     | YES  |     | NULL    |                |
| modified_by | varchar(255) | YES  |     | NULL    |                |
| short_name  | varchar(255) | YES  |     | NULL    |                |
| is_active   | tinyint(1)   | YES  |     | 1       |                |
+-------------+--------------+------+-----+---------+----------------+
*/

public class Piece extends BasicModel
{
	// db columns
	//public int id;
	private Date createdAt;

	private Date updatedAt;
	//private String modifiedBy;
	protected String updatedBy;
	
	public String title;
	private int groupId;
	private String shortName;
	private boolean isActive;
	
	// rb relations
	private ArrayList<Event> events; //dependent => :destroy; //order => 'happened_at'
	private ArrayList<VideoRecording> videoRecordings; //dependent => :destroy
	public ArrayList<XXX> blocklists; //dependent => :destroy
	public ArrayList<XXX> showings;
	public ArrayList<XXX> performances; //through => :showings
	public ArrayList<XXX> castings; //dependent => :destroy
	public ArrayList<XXX> performers; //through => :castings; //source => :performer
	public ArrayList<XXX> metaInfos; //dependent => :destroy
	public ArrayList<XXX> assemblages; //dependent => :destroy
	public ArrayList<XXX> documents; //dependent => :destroy
	public ArrayList<XXX> recordings; //through => :video_recordings; //source => :video; //uniq => true; //order => :recorded_at; //include => {:events => [:sub_scenes,:tags,:notes,:video]}
	public ArrayList<XXX> smallRecordings; //through => :video_recordings; //source => :video; //uniq => true; //order => :recorded_at; //include => {:events => [:sub_scenes,:tags,:notes,:video]}
	public ArrayList<XXX> evRecordings; //through => :video_recordings; //source => :video; //uniq => true; //order => :recorded_at; //include => [:events]
	public ArrayList<XXX> cleanRecordings; //through => :video_recordings; //source => :video; //uniq => true; //order => :recorded_at
	public ArrayList<XXX> shortRecordings; //through => :video_recordings; //source => :video; //order => :recorded_at
	public ArrayList<XXX> photos; //dependent => :destroy
	public ArrayList<XXX> tags;
	
	// additional
	protected ArrayList<Video> videos;
	
	private Event firstEvent, lastEvent;
	
	public Piece () {
		
	}
	
	public Piece ( HashMap properties ) 
	{
		super( properties );
	}
	
	public void addVideo ( Video video ) 
	{
		if ( videos == null ) videos = new ArrayList<Video>();
		if ( !videos.contains(video) )
		{
			videos.add( video );
			video.setPiece( this );
		}
	}
	
	public ArrayList<Video> getVideos ()
	{
		return videos;
	}
	
	public void addEvent ( Event event )
	{
		if ( events == null ) events = new ArrayList<Event>();
		if ( !events.contains(event) ) {
			events.add( event );
			event.setPiece( this );
			java.util.Collections.sort(events,new java.util.Comparator<Event>(){
				public int compare ( Event a, Event b ) {
					return a.getHappenedAt().compareTo(b.getHappenedAt());
				}
			});
			int eIndex = events.indexOf(event);
			if ( eIndex == 0 ) firstEvent = event;
			if ( eIndex == events.size()-1 ) lastEvent = event;
		}
	}
	
	public ArrayList<Event> getEvents ()
	{
		return events;
	}
	
	public ArrayList<Event> getEvents ( HashMap properties )
	{
		if ( events == null ) return null;
		
		ArrayList<Event> eventsList = null;
		for ( Event e : events )
		{
			if ( e.has( properties ) ) {
				if ( eventsList == null )
					eventsList = new ArrayList();
				eventsList.add(e);
			}
		}
		
		return eventsList;
	}
	
	public void setTitle ( String title )
	{
		this.title = title;
	}
	
	public String getTitle ()
	{
		return title;
	}
	
	public void setUpdatedAt ( Date uat )
	{	
		updatedAt = uat;
	}

	public Date getUpdatedAt ( )
	{	
		return updatedAt;
	}

	public void setUpdatedBy ( String uby ) {
		updatedBy = uby;
	}

	public String getUpdatedBy ( ) {
		return updatedBy;
	}
	
	public void setIsActive ( boolean active )
	{	
		isActive = active;
	}

	public boolean getIsActive ( )
	{	
		return isActive;
	}
	
	public void setCreatedAt ( Date cat )
	{	
		createdAt = cat;
	}

	public Date getCreatedAt ( )
	{	
		return createdAt;
	}

	public Event getFirstEvent ()
	{
		return firstEvent;
	}

	public Event getLastEvent ()
	{
		return lastEvent;
	}
	
	public long getStartTime ()
	{
		return Math.min( createdAt.getTime(), firstEvent.getHappenedAt().getTime() );
	}
	
	public long getEndTime ()
	{
		return lastEvent.getFinishedAt().getTime();
	}
	
	public long getTotalTime ()
	{
		return getEndTime() - getStartTime();
	}
}