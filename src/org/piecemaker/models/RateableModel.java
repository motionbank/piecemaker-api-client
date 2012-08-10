package org.piecemaker.models;

import java.util.HashMap;

public class RateableModel extends BasicIDModel
{
	final static int RATED_0 = 0;
	final static int RATED_1 = 1;
	final static int RATED_2 = 2;
	final static int RATED_3 = 3;
	final static int RATED_4 = 4;
	final static int RATED_5 = 5;
	final static int RATED_6 = 6;
	final static int RATED_7 = 7;
	final static int RATED_8 = 8;
	final static int RATED_9 = 9;
	final static int RATED_10 = 10;
	
	public int rating = RATED_0;
	
	public RateableModel () {
		
	}
	
	public RateableModel ( HashMap properties ) {
		super( properties );
	}
}