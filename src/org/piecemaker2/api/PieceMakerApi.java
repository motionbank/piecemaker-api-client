package org.piecemaker2.api;

/**
 *	Class PieceMakerApi
 *
 *	<p>
 *	This reflects the main entry to the Piecemaker 2 API.
 *	</p>
 *
 *	References:
 *	<ul>
 *		<li>http://piecemaker.org</li>
 *		<li>http://motionbank.org</li>
 *		<li>https://github.com/motionbank/piecemaker-api-client</li>
 *	</ul>
 *
 *	@author florian@motionbank.org
 *	@version ##version## - ##build##
 */

import java.util.*;
import java.lang.reflect.*;

import org.piecemaker2.models.*;

// See Apache Commons:
// http://hc.apache.org/httpclient-3.x/apidocs/org/apache/commons/httpclient/methods/GetMethod.html
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;

// See JSON:
// http://www.json.org/javadoc/org/json/JSONObject.html
import org.json.*;

public class PieceMakerApi
{
	// -----------------------------------------
	//	Static variables
	// -----------------------------------------

	public final static int IGNORE 	= 100;
	
	public final static int USER 	= 0;
	public final static int USERS 	= 5;
	
	public final static int GROUP 	= 1;
	public final static int GROUPS 	= 2;
	
	public final static int EVENT 	= 3;
	public final static int EVENTS 	= 4;

	public final static int SYSTEM 	= 5;

	private final static String DEFAULT_ERROR_CALLBACK = "piecemakerError";

	// -----------------------------------------
	//	Instance variables
	// -----------------------------------------

	private String base_url = "http://127.0.0.1";
	private String api_key;
	private Object context;

	private Method pmErrorCallback;

	// -----------------------------------------
	//	Constructor
	// -----------------------------------------

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

	public PieceMakerApi ( String base_url, String api_key ) 
	{
		setApiKey( api_key );
		setBaseUrl( base_url );

		ensureApiKey();
		printVersion();
	}

	public PieceMakerApi ( Object context, String base_url, String api_key ) 
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
		return "Piecemaker client library - ##version## - ##build## \n"+
			   "https://github.com/motionbank/piecemaker-api-client";
	}

	static void printVersion ()
	{
		System.out.println( PieceMakerApi.getVersion() );
	}

	// -----------------------------------------
	//	Public, API methods
	// -----------------------------------------

	/**
	 *	listUsers()
	 *
	 *	Get all users visible to current user
	 *
	 *	@param callback A callback to be run once groups become available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listUsers ( ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, USERS, base_url + "/users", ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Get own user data
	 *
	 *	@param callback The callback to run when the user data becomes available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void whoAmI ( ApiCallback callback ) 
	{
		new Thread( new ApiRequest( this, api_key, USER, base_url + "/user/me", ApiRequest.GET, null, callback ) ).start();
	}

	/** 
	 *	createUser()
	 */
	public void createUser ( String userName, String userEmail, String userPassword, String userToken, ApiCallback callback )
	{
		HashMap userData = new HashMap();
		userData.put( "name", userName );
		userData.put( "email", userEmail );
		userData.put( "password", userPassword );
		userData.put( "api_access_key", userToken );
		new Thread( new ApiRequest( this, api_key, USER, base_url + "/user", ApiRequest.POST, userData, callback ) ).start();
	}

	/** 
	 *	getUser()
	 */
	public void getUser ( int userId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, USER, base_url + "/user/" + userId, ApiRequest.GET, null, callback ) ).start();
	}

	/** 
	 *	updateUser()
	 */
	public void updateUser ( int userId, String userName, String userEmail, String userPassword, String userToken, ApiCallback callback )
	{
		HashMap userData = new HashMap();
		userData.put( "name", userName );
		userData.put( "email", userEmail );
		userData.put( "password", userPassword );
		userData.put( "api_access_key", userToken );
		new Thread( new ApiRequest( this, api_key, USER, base_url + "/user/" + userId, ApiRequest.PUT, userData, callback ) ).start();
	}

	/** 
	 *	deleteUser()
	 */
	public void deleteUser ( int userId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, USER, base_url + "/user/" + userId, ApiRequest.DELETE, null, callback ) ).start();
	}

	// ----------------------------------------
	//	GROUPS
	// ----------------------------------------

	/**
	 *	getGroups()
	 *
	 *	Load available (visible to user) groups
	 *
	 *	In Piecemaker 1: listPieces( ApiCallback callback )
	 *
	 *	@param callback A callback to be run once groups become available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listGroups ( ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, GROUPS, base_url + "/groups", ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	getGroup()
	 *
	 *	Load one group by ID
	 *
	 *	In Piecemaker 1: loadPiece ( int pieceId, ApiCallback callback )
	 *
	 *	@param groupId The ID of the group
	 *	@param callback A callback to be run once the group is available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void getGroup ( int groupId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, GROUP, base_url + "/group/" + groupId, ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	createGroup()
	 *
	 *	Create a new group (for events)
	 *
	 *	@param groupTitle The title / name for the new group
	 *	@param groupText The text / description of the group
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void createGroup ( String groupTitle, String groupText, ApiCallback callback )
	{
		HashMap groupData = new HashMap();
		groupData.put( "title", groupTitle );
		groupData.put( "text", groupText );
		new Thread( new ApiRequest( this, api_key, GROUP, base_url + "/group", ApiRequest.POST, groupData, callback ) ).start();
	}

	/**
	 *	updateGroup()
	 *
	 *	Update a group (of events)
	 *
	 *	@param groupId The ID of the group to update
	 *	@param groupData The data for the new group as HashMap
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void updateGroup ( int groupId, HashMap groupData, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, GROUP, base_url + "/group/" + groupId, ApiRequest.PUT, groupData, callback ) ).start();
	}

	/**
	 *	deleteGroup()
	 *
	 *	Delete a group (of events)
	 *
	 *	@param groupId The ID of the group to delete
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void deleteGroup ( int groupId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, GROUP, base_url + "/group/" + groupId, ApiRequest.DELETE, null, callback ) ).start();
	}

	// ----------------------------------------
	//	EVENTS
	// ----------------------------------------

	/**
	 *	Load all events for a group
	 *
	 *	In Piecemaker 1: loadEventsForPiece( int pieceId, ApiCallback callback )
	 *
	 *	@param groupId The ID of the group
	 *	@param callback A callback to be run once events become available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listEvents ( int groupId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, EVENTS, base_url + "/group/" + groupId + "/events", ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Load all events of certain type for a piece
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsOfType ( int groupId, String eventType, ApiCallback callback )
	{
		HashMap<String, String> data = new HashMap();
		data.put( "type", eventType );
		new Thread( new ApiRequest( this, api_key, EVENTS, base_url + "/group/" + groupId + "/events", ApiRequest.GET, data, callback ) ).start();
	}

	/**
	 *	listEventsWithFields()
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsWithFields ( int groupId, HashMap fieldsData, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, EVENT, base_url + "/group/" + groupId + "/events", ApiRequest.GET, fieldsData, callback ) ).start();
	}

	/**
	 *	Load all events that fall into from - to
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void loadEventsBetween ( Date from, Date to, ApiCallback callback ) throws Exception
	{
		throw new Exception( "Currently not implemented" );
	}

	/**
	 *	Load one event by ID
	 *
	 *	In Piecemaker 1: loadEvent ( int eventId, ApiCallback callback )
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void getEvent ( int groupId, int eventId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, EVENT, base_url + "/group/" + groupId + "/event/" + eventId, ApiRequest.GET, null, callback ) ).start();
	}

	/**
	 *	Create one event
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void createEvent ( int groupId, HashMap eventData, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, EVENT, base_url + "/group/" + groupId + "/event", ApiRequest.POST, eventData, callback ) ).start();
	}

	/**
	 *	Update one event by ID
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void updateEvent ( int groupId, int eventId, HashMap eventData, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, EVENT, base_url + "/group/" + groupId + "/event/" + eventId, ApiRequest.PUT, eventData, callback ) ).start();
	}

	/**
	 *	Delete one event by ID
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void deleteEvent ( int groupId, int eventId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, EVENT, base_url + "/group/" + groupId + "/event/" + eventId, ApiRequest.DELETE, null, callback ) ).start();
	}

	/**
	 *	Find all events for parameters
	 *
	 *	@see #createCallback( Object[] args )
	 */
	//public void findEvents ( HashMap opts, ApiCallback callback ) {}

	// ----------------------------------------
	//	SYSTEM
	// ----------------------------------------

	/**
	 *	Get the server / system time.
	 *
	 *	<p>Remember that the HTTP communication will add to this.</p>
	 *
	 *	@param callback The callback to run when the data becomes available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void getSystemTime ( ApiCallback callback ) 
	{
		new Thread( new ApiRequest( this, api_key, SYSTEM, base_url + "/system/utc_timestamp", ApiRequest.GET, null, callback ) ).start();
	}

	// ----------------------------------------
	//	CALLBACK
	// ----------------------------------------

	/**
	 *	Create a callback to be called with results from API
	 */
	public ApiCallback createCallback ( Object ... args )
	{
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

	// -----------------------------------------
	//	Non-API public methods
	// -----------------------------------------

	public void handleResponse ( ApiRequest request )
	{
		//System.out.println( request );

		ApiCallback callback = request.getCallback();

		if ( callback == null ) return;

		JSONObject jsonResponse = null;
    	String responseBody = request.getResponse();
    	//System.out.println( responseBody );

    	// FIXME: this is an API design bug? always return JSON if that was requested?
    	try {
    		if ( request.getType() == USERS || request.getType() == GROUPS || request.getType() == EVENTS ) {
    			JSONArray jsonTest = new JSONArray( responseBody );
    		}
    		else
    		{
    			JSONObject jsonTest = new JSONObject( responseBody );
    		}
    	} catch ( JSONException jsonEx ) {
    		System.err.println( "Piecemaker API: Response body is not JSON!" );
    		// FIXME: should never happen 
    		request.getCallback().call( /* no args? this is a wild guess! */ );
    		return;
    	}

	    try {

	        // FIXME: handle errors more gently

	        // if ( jsonResponse.has("status") && jsonResponse.getString("status").equals("error") )
	        // {
	        // 	System.err.println( jsonResponse.getString("status") + "\n" + jsonResponse.getString("message") );
	        // 	return;
	        // }
	    
			if ( request.getType() == GROUPS ) 
			{
				JSONArray jsonGroup = new JSONArray( responseBody );
		        Group[] groups = new Group[jsonGroup.length()];

				for ( int i = 0, k = jsonGroup.length(); i < k; i++ ) 
				{	
					JSONObject g = jsonGroup.getJSONObject(i);
					
					Group group = groupFromJson(g);

					groups[i] = group;
				}

				request.getCallback().call( (Object)groups );
			}

			else if ( request.getType() == GROUP )
			{
				request.getCallback().call( groupFromJson( new JSONObject( responseBody ) ) );
			}

			else if ( request.getType() == EVENTS )
			{
				JSONArray jsonEvents = new JSONArray( responseBody );

				Event[] events = new Event[ jsonEvents.length() ];

				for ( int i = 0, k = jsonEvents.length(); i < k; i++ )
				{
					Event event = eventFromJson( jsonEvents.getJSONObject( i ) );

					events[i] = event;
				}
			
				request.getCallback().call( (Object)events );
			}

			else if ( request.getType() == EVENT )
			{
				request.getCallback().call( eventFromJson( new JSONObject( responseBody ) ) );
			}

			else if ( request.getType() == USERS )
			{
				JSONArray jsonUsers = new JSONArray( responseBody );

				User[] users = new User[ jsonUsers.length() ];

				for ( int i = 0, k = jsonUsers.length(); i < k; i++ )
				{
					User user = userFromJson( jsonUsers.getJSONObject( i ) );

					users[i] = user;
				}
			
				request.getCallback().call( (Object)users );
			}

			else if ( request.getType() == USER )
			{
				request.getCallback().call( userFromJson( new JSONObject( responseBody ) ) );
			}

			else if ( request.getType() == SYSTEM )
			{
				//FIXME: parse system time as long?
				request.getCallback().call( new java.util.Date( Long.parseLong( responseBody ) ) );
			}

			else
			{
				request.getCallback().call();
			}

		} catch ( org.json.JSONException jse ) {
	    	jse.printStackTrace();
	    }
	}

	public void handleError ( int statusCode, String errorMessage, ApiRequest request, Object method )
	{
		ApiCallback callback = new ApiCallback( request.getCallback().getTarget(), DEFAULT_ERROR_CALLBACK );
		callback.setIgnoreNoMethod( true );
		callback.call( statusCode, errorMessage, request.getTypeString() + " " + request.getURL() );
	}

	// -----------------------------------------
	//	Private methods
	// -----------------------------------------

	/**
	 *	groupFromJson()
	 *
	 *	Create a Group object from JSON data
	 *
	 *	@param json The JSON data on form of a JSONObject
	 *	@return Group The newly created group object
	 */
	private Group groupFromJson ( JSONObject g )
	{
		Group group = null;

		try 
		{
			group = new Group();
			group.id = g.getInt( "id" );
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
			return null;
		}

		try {
			group.title 	= g.getString( "title" );
			group.text 		= g.getString( "text" );
		}
		catch ( Exception excp )
		{
			/* ignore for now */
		}

		return group;
	}

	/**
	 *	eventFromJson()
	 *
	 *	Create an Event from JSON data
	 *
	 *	@param json The JSON data in form of a JSONObject
	 *  @return Event The newly created Event object 
	 */
	private Event eventFromJson ( JSONObject e )
	{
		Event event = null;

		try 
		{
			event = new Event();
			event.id 			= e.getInt( "id" );
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
			return null;
		}

		try {
			event.utc_timestamp = new java.util.Date( e.getLong( "utc_timestamp" ) );
			event.duration 		= e.getLong( "duration" );

			event.fields 		= new HashMap<String, String>();

			JSONObject jsonEventFields = e.getJSONObject( "fields" );
			java.util.Iterator<String> iter = jsonEventFields.keys();

			while ( iter.hasNext() ) {
				String key = iter.next();
				String val = jsonEventFields.getString( key );
				event.fields.put( key, val );
			}
		}
		catch ( Exception excp )
		{
			/* ignore for now */
		}

		return event;
	}



	/**
	 *	userFromJson()
	 *
	 *	Create an User from JSON data
	 *
	 *	@param json The JSON data in form of a JSONObject
	 *  @return User The newly created User object 
	 */
	private User userFromJson ( JSONObject e )
	{
		User user = null;

		try 
		{
			user = new User();
			user.id = e.getInt( "id" );
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
			return null;
		}

		try {
			user.name = e.getString( "name" );
			user.email = e.getString( "email" );
		}
		catch ( Exception excp )
		{
			/* ignore for now */
		}

		return user;
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
		if ( api_key != null /*&& api_key.length() == API_KEY_LENGTH*/ ) this.api_key = api_key;
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

	// ----------------------------------------
	//	PUBLIC DEPRECATED API
	// ----------------------------------------

	/**
	 *	Load all videos for a piece
	 *
	 *	Videos are now just events of type "video"
	 *
	 *	@see #listEventsOfType( int groupId, String eventType, ApiCallback callback )
	 *	@deprecated This method has been replaced by listEventsOfType( int groupId, String eventType, ApiCallback callback )
	 */
	public void loadVideosForPiece ( int pieceId, ApiCallback callback ) {}

	/**
	 *	Load all events (that fall in from + duration) for a video by ID
	 *
	 *	Videos are now just events of type "video"
	 *
	 *	@deprecated This method has not yet been ported to Piecemaker 2.0
	 */
	public void loadEventsForVideo ( int videoId, ApiCallback callback ) {}

	/**
	 *	Load one video by ID
	 *
	 *	Videos are now just events of type "video"
	 *
	 *	@see #getEvent( int groupId, int eventId, ApiCallback callback )
	 *	@deprecated This method has been replaced by getEvent( int groupId, int eventId, ApiCallback callback )
	 */
	public void loadVideo ( int videoId, ApiCallback callback ) {}

	/**
	 *	Create a video
	 *
	 *	Videos are now just events of type "video"
	 *
	 *	@see #createEvent( int groupId, HashMap eventData, ApiCallback callback )
	 *	@deprecated This method has been replaced by createEvent( int groupId, HashMap eventData, ApiCallback callback )
	 */
	public void createVideo ( HashMap data, ApiCallback callback ) {}

	/**
	 *	Update a video by ID
	 *
	 *	Videos are now just events of type "video"
	 *
	 *	@see #updateEvent( int groupId, int eventId, HashMap eventData, ApiCallback callback )
	 *	@deprecated This method has been replaced by updateEvent( int groupId, int eventId, HashMap eventData, ApiCallback callback )
	 */
	public void updateVideo ( int videoId, HashMap data, ApiCallback callback ) {}

	/**
	 *	Delete a video by ID
	 *
	 *	Videos are now just events of type "video"
	 *
	 *	@see #deleteEvent( int groupId, int eventId, ApiCallback callback )
	 *	@deprecated This method has been replaced by deleteEvent( int groupId, int eventId, ApiCallback callback )
	 */
	public void deleteVideo ( int videoId, ApiCallback callback ) {}

	/**
	 *	Load all events by type for a video by ID
	 *
	 *	Videos are now just events of type "video"
	 *
	 *	@see #listEventsOfType( int groupId, String eventType, ApiCallback callback )
	 *	@deprecated This method has been replaced by listEventsOfType( int groupId, String eventType, ApiCallback callback )
	 */
	public void loadEventsByTypeForVideo ( int videoId, String type, ApiCallback callback ) {}
}
