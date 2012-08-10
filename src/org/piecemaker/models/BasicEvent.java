package org.piecemaker.models;

import java.util.Date;
import java.util.HashMap;
import java.util.Calendar;

public class BasicEvent extends RateableModel
{	
	protected String eventType;
	protected Date happenedAt;
	protected int duration;
	protected Date finishedAt;
	
	protected Date createdAt;
	protected String createdBy;
	protected Date updatedAt;
	protected String updatedBy;
	
	protected int pieceId;
	protected Piece piece;
	
	public BasicEvent () {
		
	}
	
	public BasicEvent ( HashMap properties ) {
		super( properties );
	}

	public String getEventType ()
	{
		return eventType;
	}

	public void setEventType ( String evTyp )
	{
		eventType = evTyp;
	}
	
	public void setPieceId ( int pid ) {
		pieceId = pid;
	}
	
	public int getPieceId ( ) {
		return pieceId;
	}
	
	public void setCreatedAt ( Date cat ) {
		createdAt = cat;
	}

	public Date getCreatedAt ( ) {
		return createdAt;
	}

	public void setCreated ( Date cat, String cby ) {
		setCreatedAt( cat );
		setCreatedBy( cby );
	}
	
	public void setCreatedBy ( String cby ) {
		createdBy = cby;
	}

	public String getCreatedBy ( ) {
		return createdBy;
	}

	public void setHappenedAt ( Date hat ) {
		happenedAt = hat;
	}

	public Date getHappenedAt ( ) {
		return happenedAt;
	}
	
	public void setUpdated ( Date uat, String uby ) {
		setUpdatedAt( uat );
		setUpdatedBy( uby );
	}

	public void setUpdatedAt ( Date uat ) {
		updatedAt = uat;
	}

	public Date getUpdatedAt ( ) {
		return updatedAt;
	}

	public void setUpdatedBy ( String uby ) {
		updatedBy = uby;
	}

	public String getUpdatedBy ( ) {
		return updatedBy;
	}
	
	public Date getFinishedAt ()
	{
		if ( finishedAt == null && happenedAt != null ) {
			Calendar cal = Calendar.getInstance();
			cal.setTime( happenedAt );
			cal.add( Calendar.SECOND, duration );
			finishedAt = cal.getTime();
		}
		return finishedAt;
	}
	
	public void setPiece ( Piece p ) {
		piece = p;
		pieceId = p.getId();
	}
	
	public Piece getPiece ( ) {
		return piece;
	}
	
	public void setDuration ( int duration ) {
		this.duration = duration;
	}
	
	public int getDuration () {
		return duration;
	}
}