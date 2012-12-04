package org.piecemaker.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

/*
+----------------+--------------+------+-----+---------+----------------+
| Field          | Type         | Null | Key | Default | Extra          |
+----------------+--------------+------+-----+---------+----------------+
| id             | int(11)      | NO   | PRI | NULL    | auto_increment |
| created_at     | datetime     | YES  |     | NULL    |                |
| created_by     | varchar(255) | YES  |     | NULL    |                |
| title          | varchar(255) | YES  |     | NULL    |                |
| description    | text         | YES  |     | NULL    |                |
| event_type     | varchar(255) | YES  |     | NULL    |                |
| modified_by    | varchar(255) | YES  |     | NULL    |                |
| updated_at     | datetime     | YES  |     | NULL    |                |
| locked         | varchar(255) | NO   |     | none    |                |
| performers     | text         | YES  |     | NULL    |                |
| piece_id       | int(11)      | YES  | MUL | NULL    |                |
| video_id       | int(11)      | YES  | MUL | 0       |                |
| highlighted    | tinyint(1)   | YES  |     | 0       |                |
| inherits_title | tinyint(1)   | YES  |     | 0       |                |
| location       | varchar(255) | YES  |     | NULL    |                |
| state          | varchar(255) | YES  |     | normal  |                |
| rating         | int(11)      | YES  |     | 0       |                |
| happened_at    | datetime     | YES  |     | NULL    |                |
| dur            | int(11)      | YES  |     | NULL    |                |
| parent_id      | int(11)      | YES  |     | NULL    |                |
+----------------+--------------+------+-----+---------+----------------+
*/

public class Event extends BasicEvent
{
	final static String STATE_NORMAL = "normal";
	
	// db columns
	
	// ... from Rateable
	//public int rating = RATING_0;
	
	// ... from BasicIDModel
	//public int id;
	
	// ... from BasicEvent
	// public Date createdAt;
	// public String createdBy;
	// public Date happenedAt;
	// public Date updatedAt;
	// public int duration;
	// public int pieceId;
	// public String eventType;
	
	public boolean highlighted = false;
	public boolean inheritsTitle = false;
	public int parentId;
	public String location;
	public String locked;
	public String modifiedBy; // updatedBy?
	public String performers;
	public String state = STATE_NORMAL;
	public String title;
	public String description;
	
	// not used anymore
	//public int videoId = 0; // ... trying to get away from it

	
	// rb relations
	public ArrayList<XXX> subScenes; //, :dependent => :destroy //, :order => 'happened_at'
	public ArrayList<XXX> subEvents; //, :class_name => "Event" //, :foreign_key => 'parent_id'
	public ArrayList<XXX> parent; //, :class_name => "Event"
	public ArrayList<XXX> notes; //, :dependent => :destroy
	public ArrayList<XXX> blocks; //
	// protected Piece piece; //
	protected Video video; //
	public ArrayList<XXX> tags; //
	protected ArrayList<User> users; //
	
	// rb inits
  	//serialize :performers	
	//before_create :check_for_everyone
  	//before_update :check_for_everyone, :except => 'unlock'

	public Event () {
	}

	public Event ( HashMap properties ) {
		super( properties );
	}

	public void setTitle ( String title )
	{
		this.title = title;
	}
	
	public void setPiece ( Piece piece )
	{
		this.piece = piece;
	}
	
	/* fixing non-consistant var names */
	public void setModifiedBy ( String mby ) {
		setUpdatedBy( mby );
	}
	
	/* fixing non-consistant var names */
	public String getModifiedBy ( ) {
		return updatedBy;
	}

	public void setDescription ( String description )
	{
		this.description = description;
	}
}