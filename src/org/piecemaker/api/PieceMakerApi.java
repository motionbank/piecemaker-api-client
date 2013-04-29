package org.piecemaker.api;

import java.util.*;
import java.lang.reflect.*;

import org.piecemaker.models.*;
import org.piecemaker.collections.*;

// See Apache Commons:
// http://hc.apache.org/httpclient-3.x/apidocs/org/apache/commons/httpclient/methods/GetMethod.html
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;

// See JSON:
// http://www.json.org/javadoc/org/json/JSONObject.html
import org.json.*;

import org.yaml.snakeyaml.*;

/**
 *	Class PieceMakerApi
 */
public class PieceMakerApi
{
	/* + + + + + + + + + + + + + + + + + + + + +
	 +
	 +	Static variables
	 +
	 + + + + + + + + + + + + + + + + + + + + + */

	public final static int IGNORE 	= 100;
	//public final static int USER 	= 0;
	public final static int PIECE 	= 1;
	public final static int PIECES 	= 2;
	public final static int EVENT 	= 3;
	public final static int EVENTS 	= 4;
	public final static int VIDEO 	= 5;
	public final static int VIDEOS 	= 6;

	private final static int API_KEY_LENGTH = 40;
	private final static String DEFAULT_ERROR_CALLBACK = "piecemakerError";

	/* + + + + + + + + + + + + + + + + + + + + +
	 +
	 +	Instance variables
	 +
	 + + + + + + + + + + + + + + + + + + + + + */

	private String base_url = "http://127.0.0.1";
	private String user_name, user_pass;
	private String api_key;

	private Object context;
	private Method pmErrorCallback;

	/* + + + + + + + + + + + + + + + + + + + + +
	 +
	 +	Constructor
	 +
	 + + + + + + + + + + + + + + + + + + + + + */

	public PieceMakerApi ( String api_key )
	{
		setApiKey( api_key );

		ensureApiKey();
		printVersion();
	}

	public PieceMakerApi ( Object context, String api_key ) 
	{
		setApiKey( api_key );
		setContext( context );

		ensureApiKey();
		printVersion();
	}

	public PieceMakerApi ( String api_key, String base_url ) 
	{
		setApiKey( api_key );
		setBaseUrl( base_url );

		ensureApiKey();
		printVersion();
	}

	public PieceMakerApi ( Object context, String api_key, String base_url ) 
	{
		setApiKey( api_key );
		setContext( context );
		setBaseUrl( base_url );

		ensureApiKey();
		printVersion();
	}

	public PieceMakerApi ( HashMap params ) 
	{
		Object context = params.get( "context" );
		setContext( context );

		String base_url = (String)params.get( "base_url" );
		setBaseUrl( base_url );

		String api_key = (String)params.get( "api_key" );
		setApiKey( api_key );

		ensureApiKey();
		printVersion();
	}

	static String getVersion ()
	{
		return "PieceMaker client library - ##version## - ##build## \nhttps://github.com/fjenett/piecemaker-api-client";
	}

	static void printVersion ()
	{
		System.out.println( PieceMakerApi.getVersion() );
	}

	/* + + + + + + + + + + + + + + + + + + + + +
	 +
	 +	Public, API methods
	 +
	 + + + + + + + + + + + + + + + + + + + + + */

	/**
	 *	Load available pieces
	 */
	public void loadPieces ( ApiCallback callback )
	{
		new Thread( new ApiRequest( this, PIECES, base_url + "/api/pieces", ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load one piece by ID
	 */
	public void loadPiece ( int pieceId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, PIECE, base_url + "/api/piece/" + pieceId, ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load all events for a piece
	 */
	public void loadEventsForPiece ( int pieceId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENTS, base_url + "/api/piece/" + pieceId + "/events", ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load all events of certain type for a piece
	 */
	public void loadEventsByTypeForPiece ( int pieceId, String type, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENTS, base_url + "/api/piece/" + pieceId + "/events/type/" + type, ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load all videos for a piece
	 */
	public void loadVideosForPiece ( int pieceId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, VIDEOS, base_url + "/api/piece/" + pieceId + "/videos", ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load one video by ID
	 */
	public void loadVideo ( int videoId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, VIDEO, base_url + "/api/video/" + videoId, ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Create a video
	 */
	public void createVideo ( HashMap data, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, VIDEO, base_url + "/api/video", ApiRequest.POST, data, callback ) ).start();
	}

	/**
	 *	Update a video by ID
	 */
	public void updateVideo ( int videoId, HashMap data, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, VIDEO, base_url + "/api/video/" + videoId + "/update", ApiRequest.POST, data, callback ) ).start();
	}

	/**
	 *	Delete a video by ID
	 */
	public void deleteVideo ( int videoId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, VIDEO, base_url + "/api/video/" + videoId + "/delete", ApiRequest.POST, null, callback ) ).start();
	}

	/**
	 *	Load all events (that fall in from + duration) for a video by ID
	 */
	public void loadEventsForVideo ( int videoId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENTS, base_url + "/api/video/" + videoId + "/events", ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load all events by type for a video by ID
	 */
	public void loadEventsByTypeForVideo ( int videoId, String type, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENTS, base_url + "/api/video/" + videoId + "/events/type/" + type, ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load all events that fall into from - to
	 */
	public void loadEventsBetween ( Date from, Date to, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENTS, base_url + "/api/events/between/" + (from.getTime() / 1000) + "/" + (to.getTime() / 1000), ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load one event by ID
	 */
	public void loadEvent ( int eventId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENT, base_url + "/api/event/" + eventId, ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Create one event
	 */
	public void createEvent ( HashMap data, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENT, base_url + "/api/event", ApiRequest.POST, data, callback ) ).start();
	}

	/**
	 *	Update one event by ID
	 */
	public void updateEvent ( int eventId, HashMap data, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENT, base_url + "/api/event/" + eventId + "/update", ApiRequest.POST, data, callback ) ).start();
	}

	/**
	 *	Delete one event by ID
	 */
	public void deleteEvent ( int eventId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, EVENT, base_url + "/api/event/" + eventId + "/delete", ApiRequest.POST, null, callback ) ).start();
	}

	/**
	 *	Find all events for parameters
	 */
	public void findEvents ( HashMap opts, ApiCallback callback )
	{
		System.err.println( "Not implemented yet. Sorry." );
	}

	/**
	 *	Create a callback to be called with results from API
	 */
	public ApiCallback createCallback ( Object ... args )
	{
		if ( args == null || args.length == 0 ) 
		{
			System.err.println( "Called createCallback with null or zero arguments" );
			return null;
		}
		
		Object target = context;
		String method = "";
		int shift = 1;

		if ( args.length >= 2 && args[0].getClass() != String.class )
		{
			target = args[0];
			method = (String)args[1];
			shift = 2;
		}
		else
		{
			method = (String)args[0];
		}

		if ( args.length > shift )
		{
			Object[] tmp = new Object[args.length - shift];
			System.arraycopy( args, shift, tmp, 0, tmp.length );
			args = tmp;
		}
		else
		{
			args = null;
		}

		ApiCallback cb = new ApiCallback( target, method );
		if ( args != null && args.length > 0 )
		{
			cb.addArguments( args );
		}
		return cb;
	}

	/* + + + + + + + + + + + + + + + + + + + + +
	 +
	 +	Non-API public methods
	 +
	 + + + + + + + + + + + + + + + + + + + + + */

	public void handleResponse ( ApiRequest request )
	{
		//System.out.println( request );

		ApiCallback callback = request.getCallback();

		if ( callback == null ) return;

		JSONObject jsonResponse = null;
	    try {

	    	String responseBody = request.getResponse();
	    	//System.out.println( responseBody );
	        jsonResponse = new JSONObject( responseBody );

	        if ( jsonResponse.has("status") && jsonResponse.getString("status").equals("error") )
	        {
	        	System.err.println( jsonResponse.getString("status") + "\n" + jsonResponse.getString("message") );
	        	return;
	        }
	    
			if ( request.getType() == PIECES ) 
			{
				Pieces pieces = new Pieces();

				pieces.total = jsonResponse.getInt("total");
				if ( pieces.total > 0 )
				{
					JSONArray jsonPieces = jsonResponse.getJSONArray("pieces");
					pieces.pieces = new Piece[ jsonPieces.length() ];
					for ( int i = 0, k = jsonPieces.length(); i < k; i++ ) {
						
						JSONObject p = jsonPieces.getJSONObject(i);
						
						Piece piece = pieceFromJson(p);

						pieces.pieces[i] = piece;
					}
				} 

				request.getCallback().call( pieces );
			}
			else if ( request.getType() == PIECE )
			{
				JSONObject p = jsonResponse.getJSONObject("piece");
				
				Piece piece = pieceFromJson(p);

				request.getCallback().call( piece );
			}
			else if ( request.getType() == VIDEOS )
			{
				Videos videos = new Videos();

				videos.total = jsonResponse.getInt("total");
				if ( videos.total > 0 )
				{
					JSONArray jsonVideos = jsonResponse.getJSONArray("videos");
					videos.videos = new Video[ jsonVideos.length() ];
					for ( int i = 0, k = jsonVideos.length(); i < k; i++ ) {
						JSONObject v = jsonVideos.getJSONObject(i);
						Video video = new Video();

						// { "recorded_at_float":1319117217000,
						// "happened_at":1.319117217E9,
						// "happened_at_float":1319117217000,
						// "s3_url":"http://motionbank-deborah.s3.amazonaws.com/piecemaker/D04_T05_Juliette_AJA.mp4",
						// "vid_type":"rehearsal","fn_s3":".mp4","fn_local":".mp4",
						// "group_id":null,"recorded_at":"2011/10/20 13:26:57 +0000",
						// "rec_date_verified":false,"meta_data":null,"old_title":null,
						// "id":280,"video_recordings":[],
						// "title":"D04_T05_Juliette_AJA","duration":2534,
						// "updated_at":"2012/09/12 11:27:13 +0200","piece_id":3,
						// "created_at":"2012/04/18 10:55:33 +0200","fn_arch":null,"rating":0}
						video.setId( v.getInt("id") );
						video.setTitle( v.getString("title") );
						video.setUpdatedAt( new Date( v.getString("updated_at") ) );
						//video.setUpdatedBy( v.getString("modified_by") );
						//video.setCreatedAt( new Date( v.getString("created_at") ) );
						
						Date happened_at = new Date();
						happened_at.setTime( v.getLong("happened_at_float") );
						video.setHappenedAt( happened_at );

						video.setVideoUrl( v.getString("s3_url") );
						video.setDuration( v.getInt("duration") );
						//video.setPieceId( v.getInt("piece_id") );

						videos.videos[i] = video;
					}
				}

				request.getCallback().call( videos );
			}
			else if ( request.getType() == EVENTS )
			{
				Events events = new Events();

				//System.out.println( request.getResponse() );

				events.total = jsonResponse.getInt("total");

				if ( events.total > 0 )
				{
					JSONArray jsonEvents = jsonResponse.getJSONArray( "events" );
					events.events = new Event[ jsonEvents.length() ];
					for ( int i = 0, k = jsonEvents.length(); i < k; i++ )
					{
						Event event = eventFromJson( jsonEvents.getJSONObject( i ) );

						events.events[i] = event;
					}
				}

				request.getCallback().call( events );
			}
			else if ( request.getType() == EVENT )
			{
				Event event = eventFromJson( jsonResponse.getJSONObject("event") );

				request.getCallback().call( event );
			}
			else if ( request.getType() == VIDEO )
			{
				JSONObject v = jsonResponse.getJSONObject("video");

				Video video = new Video();

				// { "recorded_at_float":1319117217000,
				// "happened_at":1.319117217E9,
				// "happened_at_float":1319117217000,
				// "s3_url":"http://motionbank-deborah.s3.amazonaws.com/piecemaker/D04_T05_Juliette_AJA.mp4",
				// "vid_type":"rehearsal","fn_s3":".mp4","fn_local":".mp4",
				// "group_id":null,"recorded_at":"2011/10/20 13:26:57 +0000",
				// "rec_date_verified":false,"meta_data":null,"old_title":null,
				// "id":280,"video_recordings":[],
				// "title":"D04_T05_Juliette_AJA","duration":2534,
				// "updated_at":"2012/09/12 11:27:13 +0200","piece_id":3,
				// "created_at":"2012/04/18 10:55:33 +0200","fn_arch":null,"rating":0}
				video.setId( v.getInt("id") );
				video.setTitle( v.getString("title") );
				video.setUpdatedAt( new Date( v.getString("updated_at") ) );
				//video.setUpdatedBy( v.getString("modified_by") );
				//video.setCreatedAt( new Date( v.getString("created_at") ) );
				
				Date happened_at = new Date();
				happened_at.setTime(v.getLong("happened_at_float"));
				video.setHappenedAt( happened_at );

				video.setVideoUrl( v.getString("s3_url") );
				video.setDuration( v.getInt("duration") );
				//video.setPieceId( v.getInt("piece_id") );


				request.getCallback().call( video );
			}
			else
			{
				request.getCallback().call();
			}

		} catch ( org.json.JSONException jse ) {
	    	jse.printStackTrace();
	    }
	}

	/* + + + + + + + + + + + + + + + + + + + + +
	 +
	 +	Private methods
	 +
	 + + + + + + + + + + + + + + + + + + + + + */

	private Piece pieceFromJson ( JSONObject p )
	{
		try {
			Piece piece = new Piece();

			// {"id":3,"title":"No time to fly",
			// "updated_at":"2012/05/30 15:49:45 +0200",
			// "modified_by":null,"is_active":true,"group_id":null,
			// "created_at":"2011/02/21 09:45:18 +0100","short_name":"notimetofly"}
			piece.setId( p.getInt("id") );
			piece.setTitle( p.getString("title") );
			piece.setUpdatedAt( new Date( p.getString("updated_at") ) );
			piece.setUpdatedBy( p.getString("modified_by") );
			piece.setIsActive( p.getBoolean("is_active") );
			piece.setCreatedAt( new Date( p.getString("created_at") ) );
			
			return piece;

		} catch ( Exception e ) {
			e.printStackTrace();
		}
		return null;
	}

	private Event eventFromJson ( JSONObject e )
	{
		try 
		{
			Event event = new Event();

			event.setId( e.getInt("id") );
			event.setTitle( e.getString("title") );
			event.setDuration( e.getInt("duration") );
			event.setEventType( e.getString("event_type") );
			event.setDescription( e.getString("description") );

			event.setCreatedAt( new Date( e.getString("created_at") ) );
			event.setCreatedBy( e.getString("created_by") );

			event.setUpdatedAt( new Date( e.getString("updated_at") ) );
			event.setUpdatedBy( e.getString("modified_by") );

			String[] performers = new String[0];
			Yaml perfsYaml = new Yaml();
			String perfsYamlSrc = e.getString("performers");
			if ( perfsYamlSrc != null && !perfsYamlSrc.equals("") )
			{
				Object perfsYmlObj = perfsYaml.load( perfsYamlSrc );
				//System.out.println( perfsYmlObj );
				if ( perfsYmlObj.getClass() == String.class )
				{
					performers = new String[]{
						(String)perfsYmlObj
					};
				}
				else if ( perfsYmlObj.getClass() == ArrayList.class )
				{
					ArrayList perfsMap = (ArrayList)perfsYmlObj;
					performers = new String[perfsMap.size()];
					for ( int p = 0; p < performers.length; p++ )
					{
						performers[p] = perfsMap.get(p).toString();
					}
				}
			}
			event.setPerformers( performers );
			
			Date happened_at = new Date();
			happened_at.setTime( e.getLong("happened_at_float"));
			event.setHappenedAt( happened_at );

			return event;
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
		}
		return null;
	}

	private void ensureApiKey ()
	{
		if ( api_key == null ) {
			System.err.println("A Piecemaker API-key is required!");
		}
	}

	private void setBaseUrl ( String base_url )
	{
		System.out.println( base_url );
		if ( base_url != null && base_url.length() > 0 ) {
			boolean validUrl = (new org.apache.commons.validator.UrlValidator(new String[]{"http","https"})).isValid( base_url );
			if ( validUrl || base_url.indexOf("localhost") != -1 || base_url.indexOf(".local") != -1 )
				this.base_url = base_url;
		}
	}

	private void setApiKey ( String api_key )
	{
		if ( api_key != null && api_key.length() == API_KEY_LENGTH ) this.api_key = api_key;
	}

	private void setContext ( Object context )
	{
		if ( context != null )
		{
			this.context = context;
			try {
				Method[] meths = context.getClass().getMethods();
				for ( Method meth : meths ) {
					if ( meth.equals( DEFAULT_ERROR_CALLBACK ) ) {
						pmErrorCallback = meth;
						break;
					}
				}
			} catch ( Exception e ) {
				e.printStackTrace();
			}
		}
	}
}
