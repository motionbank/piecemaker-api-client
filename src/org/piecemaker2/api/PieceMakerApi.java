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

	private static int v = 0;

	public final static int IGNORE 	= v;
	
	public final static int USER 	= (++v);
	public final static int USERS 	= (++v);
	
	public final static int GROUP 	= (++v);
	public final static int GROUPS 	= (++v);
	
	public final static int EVENT 	= (++v);
	public final static int EVENTS 	= (++v);

	public final static int SYSTEM 	= (++v);

	public final static int API_KEY = (++v);

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

	// public PieceMakerApi ( String api_key )
	// {
	// 	setApiKey( api_key );

	// 	ensureApiKey();
	// 	printVersion();
	// }

	public PieceMakerApi ( Object context ) 
	{
		setContext( context );

		printVersion();
	}

	public PieceMakerApi ( String base_url ) 
	{
		setBaseUrl( base_url );

		printVersion();
	}

	public PieceMakerApi ( Object context, String base_url ) 
	{
		setContext( context );
		setBaseUrl( base_url );

		printVersion();
	}

	public PieceMakerApi ( HashMap params ) 
	{
		Object context = params.get( "context" );
		setContext( context );

		String base_url = (String)params.get( "base_url" );
		setBaseUrl( base_url );

		printVersion();
	}

	static String getVersion ()
	{
		return "Piecemaker 2 client library\n"+
			   "  version ##version## - build ##build##\n"+
			   "  https://github.com/motionbank/piecemaker-api-client\n";
	}

	static void printVersion ()
	{
		System.out.println( PieceMakerApi.getVersion() );
	}

	// -----------------------------------------
	//	Public, API methods
	// -----------------------------------------

	/**
	 *	login()
	 *
	 *	Log a user in to obtain an API key
	 *
	 *	@param userEmail The users email as contained in the database
	 *	@param userPassword The users password as contained in the database
	 *	@param callback A callback to be run once user is logged in
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void login ( String userEmail, String userPassword, ApiCallback callback )
	{
		HashMap loginData = new HashMap();
		loginData.put( "email",    userEmail );
		loginData.put( "password", userPassword );

		new Thread(
			new ApiRequest(
				this, null, API_KEY, base_url + "/user/login", ApiRequest.POST, loginData, callback
			)
		).start();
	}

	public void logout ( ApiCallback callback )
	{
		new Thread(
			new ApiRequest(
				this, api_key, API_KEY, base_url + "/user/logout", ApiRequest.POST, null, callback
			)
		).start();
	}

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
		userData.put( "is_super_admin", "false" );
		userData.put( "is_disabled", "false" );

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
		userData.put( "is_super_admin", "false" );
		userData.put( "is_disabled", "false" );		
		
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
	 *	@param groupId the ID of the group to search events in
	 *	@param eventType the type of the events to look for
	 *	@param callback to call once results are available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsOfType ( int groupId, String eventType, ApiCallback callback )
	{
		HashMap reqData = new HashMap();
		reqData.put( "type", eventType );
		new Thread( new ApiRequest( this, api_key, EVENTS, base_url + "/group/" + groupId + "/events", ApiRequest.GET, reqData, callback ) ).start();
	}

	/**
	 *	listEventsWithFields()
	 *
	 *	@param args first arg is expected to be the (int) group id, then none or more pairs of (String) id, (String) value for the fields to look for, then a (ApiCallback) callback
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsWithFields ( Object ... args )
	{
		int groupId = (Integer)(args[0]);
		ApiCallback callback = (ApiCallback)(args[args.length-1]);

		HashMap fieldData = new HashMap();
		if ( args.length > 3 ) {
			for ( int i = 1; i < args.length-1; i+=2 ) {
				fieldData.put(
					"field["+((String)args[i])+"]",
					(String)args[i+1]
				);
			}
		}
		new Thread( new ApiRequest( this, api_key, EVENTS, base_url + "/group/" + groupId + "/events", ApiRequest.GET, fieldData, callback ) ).start();
	}

	/**
	 *	Load all events that fall into from - to timeframe
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsBetween ( int groupId, Date from, Date to, ApiCallback callback )
	{
		HashMap fromTo = new HashMap();
		fromTo.put( "from", from.getTime() / 1000.0 );
		fromTo.put( "to",   to.getTime() / 1000.0 );
		new Thread( new ApiRequest( this, api_key, EVENTS, base_url + "/group/" + groupId + "/events", ApiRequest.GET, fromTo, callback ) ).start();
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
		eventData.put( "event_group_id", groupId );

		System.out.println( eventData.toString() );

		new Thread( new ApiRequest( this, api_key, EVENT, base_url + "/event/" + eventId, ApiRequest.PUT, eventData, callback ) ).start();
	}

	/**
	 *	Delete one event by ID
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void deleteEvent ( int groupId, int eventId, ApiCallback callback )
	{
		new Thread( new ApiRequest( this, api_key, EVENT, base_url + "/event/" + eventId, ApiRequest.DELETE, null, callback ) ).start();
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
    	// try {
    	// 	if ( request.getType() == USERS || request.getType() == GROUPS || request.getType() == EVENTS ) {
    	// 		JSONArray jsonTest = new JSONArray( responseBody );
    	// 	}
    	// 	else
    	// 	{
    	// 		JSONObject jsonTest = new JSONObject( responseBody );
    	// 	}
    	// } catch ( JSONException jsonEx ) {
    	// 	System.err.println( "Piecemaker API: Response body is not JSON!" );
    	// 	// FIXME: should never happen 
    	// 	request.getCallback().call( /* no args? this is a wild guess! */ );
    	// 	return;
    	// }

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
				if ( request.getMethod() == ApiRequest.DELETE )
					request.getCallback().call();
				else
					request.getCallback().call( groupFromJson( new JSONObject( responseBody ) ) );
			}

			else if ( request.getType() == EVENTS )
			{
				JSONArray jsonEvents = new JSONArray( responseBody );

				Event[] events = new Event[ jsonEvents.length() ];

				for ( int i = 0, k = jsonEvents.length(); i < k; i++ )
				{
					Event event = eventFromJsonTmpFixBug54( jsonEvents.getJSONObject( i ) );

					events[i] = event;
				}
			
				request.getCallback().call( (Object)events );
			}

			else if ( request.getType() == EVENT )
			{
				Event e = eventFromJsonTmpFixBug54( new JSONObject( responseBody ) );

				request.getCallback().call( e );
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
				request.getCallback().call(
					new java.util.Date( 
						(long)(
							new JSONObject(
								responseBody
							).getDouble("utc_timestamp") * 1000.0 
						)
					)
				);
			}

			else if ( request.getType() == API_KEY )
			{
				JSONObject jsonKey = new JSONObject( responseBody );
				String api_key_new = jsonKey.getString("api_access_key");

				if ( api_key_new != null ) {
					setApiKey( api_key_new );
				}

				if ( api_key_new == null )
					request.getCallback().call();
				else
					request.getCallback().call( api_key_new );
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

	private Event eventFromJsonTmpFixBug54 ( JSONObject eArr )
	{
		Event event = null;

		JSONObject eventData = null;
		JSONArray eventFields = null;

		try 
		{
			eventData 	= eArr.getJSONObject("event");
			eventFields = eArr.getJSONArray("fields");

			event = new Event();
			event.id = eventData.getInt( "id" );
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
			return null;
		}

		try {
			event.utc_timestamp = new java.util.Date( (long)(eventData.getDouble( "utc_timestamp" ) * 1000.0) );
			event.duration 		= eventData.getLong( "duration" );
			event.type 			= eventData.getString( "type" );

			event.fields 		= new HashMap<String, String>();

			for ( int i = 0; i < eventFields.length(); i++ ) 
			{
				try {
					JSONObject eventField = eventFields.getJSONObject(i);
					String key = eventField.getString( "id" );
					String val = eventField.getString( "value" );
					event.fields.put( key, val );
				} catch ( Exception e ) {
					e.printStackTrace();
				}
			}
		}
		catch ( Exception excp )
		{
			/* ignore for now */
		}

		return event;
	}

	// /**
	//  *	eventFromJson()
	//  *
	//  *	Create an Event from JSON data
	//  *
	//  *	@param json The JSON data in form of a JSONObject
	//  *  @return Event The newly created Event object 
	//  */
	// private Event eventFromJson ( JSONObject e )
	// {
	// 	Event event = null;

	// 	try 
	// 	{
	// 		event = new Event();
	// 		event.id = e.getInt( "id" );
	// 	}
	// 	catch ( Exception excp )
	// 	{
	// 		excp.printStackTrace();
	// 		return null;
	// 	}

	// 	try {
	// 		event.utc_timestamp = new java.util.Date( (long)(e.getDouble( "utc_timestamp" ) * 1000.0) );
	// 		event.duration 		= e.getLong( "duration" );
	// 		event.type 			= e.getString( "type" );

	// 		event.fields 		= new HashMap<String, String>();

	// 		JSONObject jsonEventFields = e.getJSONObject( "fields" );
	// 		java.util.Iterator<String> iter = jsonEventFields.keys();

	// 		while ( iter.hasNext() ) {
	// 			String key = iter.next();
	// 			String val = jsonEventFields.getString( key );
	// 			event.fields.put( key, val );
	// 		}
	// 	}
	// 	catch ( Exception excp )
	// 	{
	// 		/* ignore for now */
	// 	}

	// 	return event;
	// }

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
		//System.out.println( base_url );
		String base_url_full = base_url + "/api/v1";
		if ( base_url_full != null && base_url_full.length() > 0 ) 
		{
			boolean validUrl = (new org.apache.commons.validator.UrlValidator(
									new String[]{ "http", "https" }
							   )).isValid( base_url_full );
			if ( validUrl || 
				 base_url_full.indexOf("localhost") != -1 || 
				 base_url_full.indexOf(".local") != -1 )
			{
				this.base_url = base_url_full;	
			}
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
}
