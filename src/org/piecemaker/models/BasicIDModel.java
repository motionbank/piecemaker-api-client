package org.piecemaker.models;

import java.util.HashMap;

public class BasicIDModel extends BasicModel
{
	protected int id;
	
	public BasicIDModel () {
		
	}
	
	public BasicIDModel ( HashMap properties ) {
		super( properties );
	}
	
	public int getId () {
		return id;
	}

	public void setId ( int id ) {
		this.id = id;
	}
}