package org.piecemaker.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Calendar;

/*
+-------------------+--------------+------+-----+-----------+----------------+
| Field             | Type         | Null | Key | Default   | Extra          |
+-------------------+--------------+------+-----+-----------+----------------+
| id                | int(11)      | NO   | PRI | NULL      | auto_increment |
| title             | varchar(255) | YES  | MUL | NULL      |                |
| created_at        | datetime     | YES  |     | NULL      |                |
| updated_at        | datetime     | YES  |     | NULL      |                |
| meta_data         | text         | YES  |     | NULL      |                |
| duration          | int(11)      | YES  |     | NULL      |                |
| rating            | int(11)      | YES  |     | 0         |                |
| group_id          | int(11)      | YES  | MUL | NULL      |                |
| fn_s3             | varchar(255) | YES  |     | NULL      |                |
| fn_arch           | varchar(255) | YES  |     | NULL      |                |
| rec_date_verified | tinyint(1)   | YES  |     | 0         |                |
| vid_type          | varchar(255) | YES  |     | rehearsal |                |
| fn_local          | varchar(255) | YES  |     | NULL      |                |
| recorded_at       | datetime     | YES  |     | NULL      |                |
| old_title         | varchar(255) | YES  |     | NULL      |                |
+-------------------+--------------+------+-----+-----------+----------------+
*/

public class Video extends BasicEvent
{
	// columns
	
	// ... from BasicIDModel
	// public int id;
	
	// ... from Rateable
	//public int rating; 
	
	// ... from BasicEvent
	//protected Date createdAt;
	//protected String createdBy;
	//protected Date updatedAt;
	//protected int duration;
	// public int pieceId;
	
	// not used anymore
	//protected Date recordedAt;
	
	public int groupId;
	public String fnArch;
	public String fnLocal;
	public String fnS3;
	public String metaData;
	public String oldTitle;
	public String recDatVerified;
	public String title;
	public String vidType;

	public String videoUrl;

	
	// relations
	protected ArrayList<Event> events; //,:dependent => :nullify, :order => :happened_at,:conditions => "state = 'normal'"
 	protected ArrayList<VideoRecording> videoRecordings; //, :dependent => :destroy
	public ArrayList<XXX> subjects; //, :through => :video_recordings, :source => :piece, :uniq => true
	
	public Video () {
		
	}
	
	public Video ( HashMap properties ) {
		super( properties );
	}
	
	public Piece getPiece () {
		return piece;
	}

	public void addEvent ( Event event )
	{
		if ( events == null ) events = new ArrayList<Event>();
		if ( !events.contains(event) ) events.add( event );
	}
	
	public ArrayList<Event> getEvents ()
	{
		return events;
	}
	
	public void setPiece ( Piece piece )
	{
		this.piece = piece;
		this.pieceId = piece.getId();
	}

	public void setRecordedAt ( float ts ) {
		setHappenedAt(new java.util.Date((long)(ts*1000)));
	}

	public void setRecordedAt ( double ts ) {
		setHappenedAt(new java.util.Date((long)(ts*1000)));
	}

	public void setRecordedAt ( java.math.BigDecimal dec ) {
		setRecordedAt(dec.doubleValue());
	}
	
	/* fixing non-consistant var names */
	public void setRecordedAt ( Date rat ) {
		setHappenedAt( rat ); // BasicEvent
	}
	
	/* fixing non-consistant var names */
	public Date getRecordedAt ( ) {
		return happenedAt;
	}

	public void setTitle ( String title )
	{
		this.title = title;
	}

	public String getTitle ()
	{
		return title;
	}

	public void setVideoUrl ( String url )
	{
		videoUrl = url;
	}
}