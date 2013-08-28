package org.piecemaker2.models;

/**
 *	Class Event
 *
 *	<p>Basically just a collection of values.</p>
 *
 *	@version ##version## - ##build##
 *	@author florian@motionbank.org
 */

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class Event
{
	// FIXME: how can this be en par with JS but still be immutable?

	public int id;
	public Date utc_timestamp;
	public long duration;
	public String type;
	public HashMap fields;
}
