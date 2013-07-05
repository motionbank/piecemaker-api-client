/**
 *	As the packaging says: a collection of Event objects
 */

package org.piecemaker2.collections;

import org.piecemaker2.models.*;

public class Events
{
	public int total;
	public Event[] events;

	public void add ( Event v )
	{
		if ( events == null )
		{
			events = new Event[1];
			events[0] = v;
		}
		else
		{
			Event[] tmp = new Event[events.length+1];
			System.arraycopy( events, 0, tmp, 0, events.length );
			tmp[tmp.length-1] = v;
			events = tmp;
			tmp = null;
		}
		total = events.length;
	}
}