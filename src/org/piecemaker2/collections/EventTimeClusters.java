/**
 *	This class is used to build clusters of (basic) events. Events in this
 *	context are Events and Videos.
 *
 *	A cluster is build from looking at start-time and duration of the
 *	events to group. The resulting clusters will hold all overlapping
 *	items passed to the cluster generator:
 *
 *	<pre>
 *
 *				+----------------------------------> time
 *	events:		|  |  ||   |   || |       |
 *	videos:	    | |----|       |------|
 *	            |    |---|          |--------|
 *				+----------------------------------------
 *	clusters:   | |======| |   |=============|
 *				+----------------------------------------
 *
 *	As you can see the 8 events and 4 videos will result in 3 clusters being generated.
 *	</pre>
 */

package org.piecemaker2.collections;

import org.piecemaker2.models.*;

import java.util.*;

public class EventTimeClusters
{
	public static EventTimeCluster[] clusterEvents ( BasicEvent[] ungroupedEvents )
	{
		ArrayList<EventTimeCluster> clusters = new ArrayList();

		for ( BasicEvent be : ungroupedEvents )
		{
			boolean inCluster = false;
			for ( EventTimeCluster vc : clusters )
			{
				if ( vc.overlapsWith(be) )
				{
					vc.add( be );
					inCluster = true;
					break;
				}
			}
			if ( !inCluster )
			{
				EventTimeCluster c = new EventTimeCluster();
				clusters.add( c );
				c.add( be );
			}
		}

		return clusters.toArray(new EventTimeCluster[0]);
	}
}