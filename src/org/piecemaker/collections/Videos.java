/**
 *	Simply a collection of Video objects
 */

package org.piecemaker.collections;

import org.piecemaker.models.*;

public class Videos
{
	public int total;
	public Video[] videos;

	public void add ( Video v )
	{
		if ( videos == null )
		{
			videos = new Video[1];
			videos[0] = v;
		}
		else
		{
			Video[] tmp = new Video[videos.length+1];
			System.arraycopy( videos, 0, tmp, 0, videos.length );
			tmp[tmp.length-1] = v;
			videos = tmp;
			tmp = null;
		}
		total = videos.length;
	}
}