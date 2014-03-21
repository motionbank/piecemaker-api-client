package org.piecemaker2.api;

/**
 *	Class PieceMakerApi
 *
 *	References:
 *	<ul>
 *		<li>https://github.com/motionbank/piecemaker-api-client</li>
 *		<li>http://piecemaker.org</li>
 *		<li>http://motionbank.org</li>
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
	public final static int LOG_IN_OUT = (++v);
	
	public final static int GROUP 	= (++v);
	public final static int GROUPS 	= (++v);
	
	public final static int EVENT 	= (++v);
	public final static int EVENTS 	= (++v);

	public final static int ROLE 	= (++v);
	public final static int ROLES 	= (++v);

	public final static int PERMISSION  = (++v);
	public final static int PERMISSIONS = (++v);

	public final static int SYSTEM 	= (++v);

	public final String TIMESTAMP 	 = "utc_timestamp";
	public final String INTERSECTING = "intersect";
	public final String CONTAINED 	 = "contain";

	private final static String DEFAULT_ERROR_CALLBACK = "piecemakerError";

	// -----------------------------------------
	//	Instance variables
	// -----------------------------------------

	private String host = "http://127.0.0.1:9292";
	private String api_key;
	private Object context;

	private Method pmErrorCallback;

	// -----------------------------------------
	//	Constructor(s)
	// -----------------------------------------

	/**
	 *	Contructor (default)
	 *
	 *	@param 	context  A context for the callbacks / -errors
	 *	@param 	host 	 A host fully qualified like: "http://localhost:3000"
	 *	@param  api_key  An api_key that comes with your user account for a PM2 instance
	 */
	public PieceMakerApi ( Object context, String host, String api_key ) 
	{
		try {
			setContext( context ); // handles bad input itself
		} catch (Exception e) {
			e.printStackTrace();
			return;
		}

		try {
			setHost( host ); // handles bad input itself
		} catch (Exception e) {
			e.printStackTrace();
			return;
		}

		if ( api_key != null ) { // ok, to allow for users loggin in through API
			try {
				setApiKey( api_key ); // handles bad input itself
			} catch (Exception e) {
				e.printStackTrace();
				return;
			}
		}

		printVersion();
	}

	/**
	 *	 Alternative constructor
	 *
	 *	@param  params  A HashMap containing the parameters
	 */
	public PieceMakerApi ( HashMap params ) 
	{
		this( 
			params.get( "context" ),
			(String)params.get( "host" ),
			(String)params.get( "api_key" )
		);
	}

	// -----------------------------------------
	//	Static methods
	// -----------------------------------------

	/**
	 *	 getVersion()
	 *
	 *	 <p>Get the current version of this library. Java only.</p>
	 *
	 *	 @return  The version and build-number of this library
	 */
	static String getVersion ()
	{
		return "Piecemaker 2 client library\n"+
			   "  version ##version## - build ##build##\n"+
			   "  https://github.com/motionbank/piecemaker-api-client\n";
	}

	/**
	 *	 printVersion()
	 *
	 *	 <p>Print the current version to standard out. Java only.</p>
	 */
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
	 *  <p>No API_KEY required</p>
	 *
	 *	<p>If the user has no API key, this will generate one and it will be used for any further calls.</p>
	 *
	 *	@param userEmail The users email as contained in the database
	 *	@param userPassword The users password as contained in the database
	 *	@param callback A callback to be run once user is logged in
	 *
	 *	<p>The callback returns the users API key as String</p>
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
				this, null, LOG_IN_OUT, host + "/user/login", ApiRequest.POST, loginData, callback
			)
		).start();
	}

	/**
	 *	logout()
	 *
	 *	Logging out does currently not make sense in the API (as there are no sessions), 
	 *	so this does actually nothing.
	 *
	 *	@param callback A callback to be run once the logout is done
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void logout ( ApiCallback callback )
	{
		new Thread(
			new ApiRequest(
				this, api_key, LOG_IN_OUT, host + "/user/logout", ApiRequest.POST, null, callback
			)
		).start();
	}

	/**
	 *	listUsers()
	 *
	 *	@param callback A callback to be run once groups become available
	 *
	 *	<p>The callback returns an array of User objects</p>
	 *
	 *	@see #createCallback( Object[] args )
	 *	@see org.piecemaker2.models.User
	 */
	public void listUsers ( ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, USERS, host + "/users", ApiRequest.GET, null, callback ) ).start();
		}
	}

	/**
	 *	whoAmI()
	 *
	 *	<p>Get User object of the currently logged in user as determined by the API key in use.</p>
	 *
	 *	@param callback The callback to run when the user data becomes available
	 *
	 *	<p>The callback returns an User object for the currently logged in user</p>
	 *
	 *	@see #createCallback( Object[] args )
	 *	@see org.piecemaker2.models.User
	 */
	public void whoAmI ( ApiCallback callback ) 
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, USER, host + "/user/me", ApiRequest.GET, null, callback ) ).start();
		}
	}

	/** 
	 *	createUser()
	 *
	 *	<p>Creates a new user from a name, email address and user role name. 
	 *	A password will be autogenerated and returned through the callback.</p>
	 *
	 *	@param userName A (display) name for this user
	 *	@param userEmail An email address for this user (can be fake)
	 *	@param userRoleName A global role for the user from the list of listRoles()
	 *	@param callback The callback to run when the user data becomes available
	 *
	 *	<p>The callback returns an User object for the new user including an autogenerated password</p>
	 *
	 *	@see org.piecemaker2.models.Role
	 *	@see #listRoles( ApiCallback callback )
	 *	@see #createCallback( Object[] args )
	 *	@see org.piecemaker2.models.User
	 */
	public void createUser ( String userName, String userEmail, String userRoleName, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			HashMap userData = new HashMap();
			userData.put( "name", userName );
			userData.put( "email", userEmail );
			userData.put( "user_role_id", userRoleName );

			new Thread( new ApiRequest( this, api_key, USER, host + "/user", ApiRequest.POST, userData, callback ) ).start();
		}
	}

	/** 
	 *	getUser()
	 *
	 *	<p>Returns a User object, note that passwords are always omitted</p>
	 *
	 *	@param userId The id of the user to fetch
	 *	@param callback A callback to be run once user data is available
	 *
	 *	@see org.piecemaker2.models.User
	 *	@see #createCallback( Object[] args )
	 */
	public void getUser ( int userId, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, USER, host + "/user/" + userId, ApiRequest.GET, null, callback ) ).start();
		}
	}

	/** 
	 *	updateUser()
	 *
	 *	@param userId The id of the user to update
	 *	@param userName A display user name
	 *	@param userEmail An email address for the user (can be fake)
	 *	@param userRoleName A global role for the user as returned by listRoles()
	 *	@param disable A flag to enable or disable an user account
	 *	@param renew_password A flag to have the password be renewed (and then returned)
	 *	@param callback A callback to be run once the user data becomes available
	 *
	 *	<p>The callback returns a new User object reflecting the updated account</p>
	 *
	 *	@see org.piecemaker2.models.Role
	 *	@see #listRoles( ApiCallback callback )
	 *	@see org.piecemaker2.models.User
	 *	@see #createCallback( Object[] args )
	 */
	public void updateUser ( int userId, String userName, String userEmail, String userRoleName, 
							 boolean disable, boolean renew_password, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			HashMap userData = new HashMap();
			userData.put( "name", userName );
			userData.put( "email", userEmail );
			userData.put( "user_role_id", userRoleName );
			userData.put( "is_disabled", disable ? "true" : "false" );
			userData.put( "new_password", renew_password ? "true" : "false" );
			
			new Thread( new ApiRequest( this, api_key, USER, host + "/user/" + userId, ApiRequest.PUT, userData, callback ) ).start();
		}
	}

	/** 
	 *	deleteUser()
	 *
	 *	<p>All groups and events created by the user account will be set to "null"</p>
	 *
	 *	@param userId The id of the user account to delete
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void deleteUser ( int userId, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, USER, host + "/user/" + userId, ApiRequest.DELETE, null, callback ) ).start();
		}
	}

	// ----------------------------------------
	//	GROUPS
	// ----------------------------------------

	/**
	 *	listGroups()
	 *
	 *	<p>List all groups that the current user is part of</p>
	 *
	 *	@param callback A callback to be run once groups become available
	 *
	 *	<p>The callback receives an array of Group objects</p>
	 *
	 *	@see org.piecemaker2.models.Group
	 *	@see #createCallback( Object[] args )
	 */
	public void listGroups ( ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, GROUPS, host + "/groups", ApiRequest.GET, null, callback ) ).start();
		}
	}

	/**
	 *	listAllGroups()
	 *
	 *	<p>List all groups in the database</p>
	 *
	 *	@param callback A callback to be run once groups become available
	 *
	 *	<p>The callback receives an array of Group objects</p>
	 *
	 *	@see org.piecemaker2.models.Group
	 *	@see #createCallback( Object[] args )
	 */
	public void listAllGroups ( ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, GROUPS, host + "/groups/all", ApiRequest.GET, null, callback ) ).start();
		}
	}

	/**
	 *	getGroup()
	 *
	 *	@param groupId The ID of the group
	 *	@param callback A callback to be run once the group is available
	 *
	 *	<p>The callback receives a Group object</p>
	 *
	 *	@see #createCallback( Object[] args )
	 *	@see org.piecemaker2.models.Group
	 */
	public void getGroup ( int groupId, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, GROUP, host + "/group/" + groupId, ApiRequest.GET, null, callback ) ).start();
		}
	}

	/**
	 *	createGroup()
	 *
	 *	@param groupTitle The title / name for the new group
	 *	@param groupDescription The description of the group
	 *
	 *	<p>The callback receives the newly created group as Group object</p>
	 *
	 *	@see #createCallback( Object[] args )
	 *	@see org.piecemaker2.models.Group
	 */
	public void createGroup ( String groupTitle, String groupDescription, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			HashMap groupData = new HashMap();
			groupData.put( "title", groupTitle );
			groupData.put( "description", groupDescription );

			new Thread( new ApiRequest( this, api_key, GROUP, host + "/group", ApiRequest.POST, groupData, callback ) ).start();
		}
	}

	/**
	 *	updateGroup()
	 *
	 *	@param groupId The ID of the group to update
	 *	@param groupData The data for the new group as HashMap
	 *
	 *	<p><em>groupData</em> can have a "title" and "description" entry</p>
	 *
	 *	<p>The callback receives the updated group as Group object</p>
	 *
	 *	@see #createCallback( Object[] args )
	 *	@see org.piecemaker2.models.Group
	 */
	public void updateGroup ( int groupId, HashMap groupData, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, GROUP, host + "/group/" + groupId, ApiRequest.PUT, groupData, callback ) ).start();
		}
	}

	/**
	 *	deleteGroup()
	 *
	 *	<p>Any events contained will be deleted along with the group</p>
	 *
	 *	@param groupId The ID of the group to delete
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void deleteGroup ( int groupId, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( 
				new ApiRequest( this, api_key, GROUP, host + "/group/" + groupId, ApiRequest.DELETE, null, callback ) 
			).start();
		}
	}

	/**
	 *	listGroupUsers()
	 *
	 *	<p>List the users in the given group</p>
	 *
	 *	@param groupId The id of the group
	 *	@param callback The callback to be run when the users become available
	 *
	 *	<p>The callback receives an array of User objects</p>
	 *
	 *	@see org.piecemaker2.models.User
	 *	@see #createCallback( Object[] args )
	 */
	public void listGroupUsers ( int groupId, ApiCallback callback )
	{
		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, USERS, host + "/group/" + groupId + "/users", ApiRequest.GET, null, callback )
			).start();
		}
	}

	/**
	 *	addUserToGroup()
	 *
	 *	@param groupId The id of the group the user should be added to
	 * 	@param userId The id of the user to add
	 *	@param userRoleName The name / id of the role the user should have in the group
	 *	@param callback The callback to run once user is added
	 *
	 *	<p>The callback receives nothing at the moment</p>
	 *
	 *	@see org.piecemaker2.models.User
	 *	@see #createCallback( Object[] args )
	 */
	public void addUserToGroup ( int groupId, int userId, String userRoleName, ApiCallback callback )
	{
		HashMap data = new HashMap<String,String>();
		data.put( "user_role_id", userRoleName );

		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, IGNORE, host + "/group/" + groupId + "/user/" + userId, 
								ApiRequest.POST, data, callback )
			).start();
		}
	}

	/**
	 *	changeUserRoleInGroup()
	 *
	 *	@param groupId The id of the group
	 * 	@param userId The id of the user
	 *	@param userRoleName The name / id of the role the user should have in the group
	 *	@param callback The callback to run once user role has been changed
	 *
	 *	<p>The callback receives nothing at the moment</p>
	 *
	 *	@see org.piecemaker2.models.User
	 *	@see #createCallback( Object[] args )
	 */
	public void changeUserRoleInGroup ( int groupId, int userId, String userRoleName, ApiCallback callback )
	{
		HashMap data = new HashMap<String,String>();
		data.put( "user_role_id", userRoleName );

		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, IGNORE, host + "/group/" + groupId + "/user/" + userId, 
								ApiRequest.PUT, data, callback )
			).start();
		}
	}

	/**
	 *	removeUserFromGroup()
	 *
	 *	@param groupId The id of the group
	 * 	@param userId The id of the user
	 *	@param callback The callback to run once user has been removed from group
	 *
	 *	<p>The callback receives nothing at the moment</p>
	 *
	 *	@see org.piecemaker2.models.User
	 *	@see #createCallback( Object[] args )
	 */
	public void removeUserFromGroup ( int groupId, int userId, ApiCallback callback )
	{
		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, IGNORE, host + "/group/" + groupId + "/user/" + userId, 
								ApiRequest.DELETE, null, callback )
			).start();
		}
	}

	// ----------------------------------------
	//	EVENTS
	// ----------------------------------------

	/**
	 *	listEvents()
	 *
	 *	@param groupId The ID of the group
	 *	@param callback A callback to be run once events become available
	 *
	 *	<p>The callback receives an array of Event objects</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void listEvents ( int groupId, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( new ApiRequest( this, api_key, EVENTS, host + "/group/" + groupId + "/events", ApiRequest.GET, null, callback ) ).start();
		}
	}

	/**
	 *	listEventsOfType()
	 *
	 *	@param groupId the ID of the group to search events in
	 *	@param eventType the type of the events to look for
	 *	@param callback to call once results are available
	 *
	 *	<p>The callback receives an array of Event objects</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsOfType ( int groupId, String eventType, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			HashMap reqData = new HashMap();
			reqData.put( "type", eventType );
			new Thread( 
				new ApiRequest( this, api_key, EVENTS, host + "/group/" + groupId + "/events", ApiRequest.GET, reqData, callback ) 
			).start();
		}
	}

	/**
	 *	listEventsWithFields()
	 *
	 *	@param args First arg is expected to be the (int) group id, then none or more pairs of (String) id, (String) value for the fields to look for, then a (ApiCallback) callback
	 *
	 *	<p>The callback receives an array of Event objects</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsWithFields ( Object ... args )
	{
		if ( ensureApiKey() ) {
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
			new Thread( 
				new ApiRequest( this, api_key, EVENTS, host + "/group/" + groupId + "/events", ApiRequest.GET, fieldData, callback ) 
			).start();
		}
	}

	/**
	 *	Load events by timespan
	 *
	 *	@param groupId The id of the group to list events of
	 *	@param from A Date object for the left side / start of the timespan. Passing "null" denotes "beginning of time"
	 *	@param to A Date object for the right side / end of the timespan. Passing "null" says "until forever"
	 *	@param method One of TIMESTAMP, INTERSECTING, CONTAINED
	 *
	 *	<p>The callback receives an array of Event objects</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void listEventsForTimespan ( int groupId, Date from, Date to, String method, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			HashMap fromTo = new HashMap();

			if ( from == null && to == null ) {
				System.err.println( "PieceMakerApi.listEventsForTimespan() needs at least one of 'from', 'to' to be given" );
			}

			if ( from != null ) fromTo.put( "from", from.getTime() / 1000.0 );
			if ( to != null ) 	fromTo.put( "to",   to.getTime() / 1000.0 );

			fromTo.put( "fromto_query", method == null ? INTERSECTING : method );
		
			new Thread( 
				new ApiRequest( this, api_key, EVENTS, host + "/group/" + groupId + "/events", ApiRequest.GET, fromTo, callback ) 
			).start();
		}
	}

	/**
	 *	Find all events for given parameters
	 *
	 *	@param groupId The id of a group to look for events in
	 *	@param query A query that can contain all of: type, from, to, method, fields
	 *	@param callback The callback to be run once events become available
	 *
	 *	<p>The callback receives an array of Event objects</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void findEvents ( int groupId, HashMap query, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( 
				new ApiRequest( this, api_key, EVENTS, host + "/group/" + groupId + "/events", ApiRequest.GET, query, callback ) 
			).start();
		}
	}

	/**
	 *	Load one event by ID
	 *
	 *	@param groupId The group that the event belongs to
	 *	@param eventId The id of the event to load
	 *	@param callback The callback to be run once results are available
	 *
	 *	<p>The callback receives an Event object</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void getEvent ( int groupId, int eventId, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( 
				new ApiRequest( this, api_key, EVENT, host + "/event/" + eventId, ApiRequest.GET, null, callback ) 
			).start();
		}
	}

	/**
	 *	Create one event
	 *
	 *	@param groupId The group that the event should be created in
	 *	@param eventData A HashMap with the events data (utc_timestamp, duration, type, fields)
	 *	@param callback The callback to be run once the event is created
	 *
	 *	<p>The callback receives an Event object</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void createEvent ( int groupId, HashMap eventData, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			if ( eventData != null && eventData.get("type") != null ) {
				new Thread( new ApiRequest( this, api_key, EVENT, host + "/group/" + groupId + "/event", ApiRequest.POST, eventData, callback ) ).start();
			} else {
				System.err.println( "\"type\" is a required field" ); // TODO: throw error? better validation?
			}
		}
	}

	/**
	 *	Update one event by ID
	 *
	 *	@param groupId The group that the event belongs to
	 *	@param eventData A HashMap with the events data (utc_timestamp, duration, type, fields)
	 *	@param callback The callback to be run once the event becomes available
	 *
	 *	<p>The callback receives an Event object</p>
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void updateEvent ( int groupId, int eventId, HashMap eventData, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			eventData.put( "event_group_id", groupId );

			new Thread( new ApiRequest( this, api_key, EVENT, host + "/event/" + eventId, ApiRequest.PUT, eventData, callback ) ).start();
		}
	}

	/**
	 *	Delete one event by ID
	 *
	 *	@param groupId Then id of the group that the event belongs to
	 *	@param eventId The id of the event to delete
	 *	@param callback A callback to run once the event has been deleted
	 *
	 *	@see org.piecemaker2.models.Event
	 *	@see #createCallback( Object[] args )
	 */
	public void deleteEvent ( int groupId, int eventId, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread( 
				new ApiRequest( this, api_key, EVENT, host + "/event/" + eventId, ApiRequest.DELETE, null, callback ) 
			).start();
		}
	}

	// ----------------------------------------
	//	ROLES
	// ----------------------------------------

	/**
	 *	listRoles()
	 *
	 *	@param callback A callback to run once roles become available
	 *
	 *	<p>The callback receives an array of Role objects</p>
	 *
	 *	@see org.piecemaker2.models.Role
	 *	@see #createCallback( Object[] args )
	 */
	public void listRoles ( ApiCallback callback )
	{
		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, ROLES, host + "/roles", ApiRequest.GET, null, callback )
			).start();
		}
	}

	/**
	 *	createRole()
	 *
	 *	@param roleName Name / id of the role to create
	 *	@param inheritFromRoleName Another name / id of an existing role for new role to inherit from
	 *	@param description A description of the role
	 *	@param callback A callback to run once role has been created
	 *
	 *	<p>The callback receives a Role object</p>
	 *
	 *	@see org.piecemaker2.models.Role
	 *	@see #createCallback( Object[] args )
	 */
	public void createRole ( String roleName, String inheritFromRoleName, String description, ApiCallback callback )
	{
		HashMap data = new HashMap<String,String>();
		data.put( "id", roleName );
		data.put( "inherit_from_id", inheritFromRoleName == null ? "" : inheritFromRoleName );
		data.put( "description", description );

		if ( ensureApiKey() ) {
			new Thread(
				new ApiRequest( this, api_key, ROLE, host + "/role", ApiRequest.POST, data, callback )
			).start();
		}
	}

	/**
	 *	updateRole()
	 *
	 *	@param roleName Name / id of the role to update
	 *	@param inheritFromRoleName Another name / id of an existing role for role to inherit from
	 *	@param description A description of the role
	 *	@param callback A callback to run once role has been updated
	 *
	 *	<p>The callback receives the updated Role object</p>
	 *
	 *	@see org.piecemaker2.models.Role
	 *	@see #createCallback( Object[] args )
	 */
	public void updateRole ( String roleName, String inheritFromRoleName, String description, ApiCallback callback )
	{
		HashMap data = new HashMap<String,String>();
		data.put( "inherit_from_id", inheritFromRoleName == null ? "" : inheritFromRoleName );
		data.put( "description", description );

		if ( ensureApiKey() ) {
			new Thread(
				new ApiRequest( this, api_key, ROLE, host + "/role/" + roleName, ApiRequest.PUT, data, callback )
			).start();
		}
	}

	/**
	 *	deleteRole()
	 *
	 *	@param roleName Name / id of the role to delete
	 *	@param callback A callback to run once role has been deleted
	 *
	 *	<p>The callback receives the deleted Role object</p>
	 *
	 *	@see org.piecemaker2.models.Role
	 *	@see #createCallback( Object[] args )
	 */
	public void deleteRole ( String roleName, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread(
				new ApiRequest( this, api_key, ROLE, host + "/role/" + roleName, ApiRequest.DELETE, null, callback )
			).start();
		}
	}

	/**
	 *	getRole()
	 *
	 *	@param roleName Name / id of the role to load
	 *	@param callback A callback to run once role has been loaded
	 *
	 *	<p>The callback receives the Role object</p>
	 *
	 *	@see org.piecemaker2.models.Role
	 *	@see #createCallback( Object[] args )
	 */
	public void getRole ( String roleName, ApiCallback callback )
	{
		if ( ensureApiKey() ) {
			new Thread(
				new ApiRequest( this, api_key, ROLE, host + "/role/" + roleName, ApiRequest.GET, null, callback )
			).start();
		}
	}

	// ----------------------------------------
	//	PERMISSIONS
	// ----------------------------------------

	/**
	 *	listPermissions()
	 *
	 *	@param callback A callback to run once the permissions are available
	 *
	 *	<p>The callback receives an array of Permission objects</p>
	 *
	 *	@see org.piecemaker2.models.Permission
	 *	@see #createCallback( Object[] args )
	 */
	public void listPermissions ( ApiCallback callback )
	{
		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, PERMISSIONS, host + "/permissions", ApiRequest.GET, null, callback )
			).start();
		}
	}

	/**
	 *	addPermissionToRole()
	 *
	 *	@param roleName The name / id of the role to add a permission to
	 *	@param name The name / entity of the permission to add
	 *	@param permission Either "allow" or "forbid" 
	 *	@param callback A callback to run once the permissions are available
	 *
	 *	<p>The callback receives a Permission object</p>
	 *
	 *	@see org.piecemaker2.models.Permission
	 *	@see #createCallback( Object[] args )
	 */
	public void addPermissionToRole ( String roleName, String name, String permission, ApiCallback callback )
	{
		HashMap data = new HashMap<String,String>();
		data.put( "entity", name );
		data.put( "permission", permission );

		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, PERMISSION, 
								host + "/role/" + roleName + "/permission", 
								ApiRequest.POST, data, callback )
			).start();
		}
	}

	/**
	 *	changePermissionForRole()
	 *
	 *	@param roleName The name / id of the role
	 *	@param name The name / entity of the permission
	 *	@param permission Either "allow" or "forbid"
	 *	@param callback A callback to run once the permissions are available
	 *
	 *	<p>The callback receives a Permission object</p>
	 *
	 *	@see org.piecemaker2.models.Permission
	 *	@see #createCallback( Object[] args )
	 */
	public void changePermissionForRole ( String roleName, String name, String permission, ApiCallback callback )
	{
		HashMap data = new HashMap<String,String>();
		data.put( "entity", name );
		data.put( "permission", permission );

		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, PERMISSION, 
								host + "/role/" + roleName + "/permission/" + name, 
								ApiRequest.PUT, data, callback )
			).start();
		}
	}

	/**
	 *	removePermissionFromRole()
	 *
	 *	@param roleName The name / id of the role
	 *	@param name The name / entity of the permission
	 *	@param callback A callback to run once the permissions are available
	 *
	 *	<p>The callback receives a Permission object</p>
	 *
	 *	@see org.piecemaker2.models.Permission
	 *	@see #createCallback( Object[] args )
	 */
	public void removePermissionFromRole ( String roleName, String permission, ApiCallback callback ) 
	{
		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, PERMISSION, 
								host + "/role/" + roleName + "/permission/" + permission, 
								ApiRequest.DELETE, null, callback )
			).start();
		}
	}

	/**
	 *	getPermissionFromRole()
	 *
	 *	@param roleName The name / id of the role
	 *	@param name The name / entity of the permission
	 *	@param callback A callback to run once the permissions are available
	 *
	 *	<p>The callback receives a Permission object</p>
	 *
	 *	@see org.piecemaker2.models.Permission
	 *	@see #createCallback( Object[] args )
	 */
	public void getPermissionFromRole ( String roleName, String permission, ApiCallback callback )
	{
		if ( ensureApiKey() )
		{
			new Thread(
				new ApiRequest( this, api_key, PERMISSION, 
								host + "/role/" + roleName + "/permission/" + permission, 
								ApiRequest.GET, null, callback )
			).start();
		}
	}

	// ----------------------------------------
	//	SYSTEM
	// ----------------------------------------

	/**
	 *	Get the server's system time.
	 *
	 *	<p>Remember that the HTTP communication will add to this.</p>
	 *
	 *  <p>Requires no API_KEY</p>
	 *
	 *	@param callback The callback to run when the data becomes available
	 *
	 *	@see #createCallback( Object[] args )
	 */
	public void getSystemTime ( ApiCallback callback ) 
	{
		new Thread( new ApiRequest( this, api_key, SYSTEM, host + "/system/utc_timestamp", ApiRequest.GET, null, callback ) ).start();
	}

	// ----------------------------------------
	//	CALLBACK
	// ----------------------------------------

	/**
	 *	Create a callback to be called with results from API
	 *
	 *	<p>There are several ways to use this:</p>
	 *
	 *	<p>Given only a String it will use Java reflection to look up that method by name inside 
	 *	context as passed into the PieceMakerApi constructor</p>
	 *
	 *	<p>Given an Object and a String it will use Java reflection to look up that method by 
	 *	name inside the given Object</p>
	 *
	 *	<p>Any additional parameters are added to the method call after the parameters that the 
	 *	API returns by default: <code>createCallback( context, "myMethod", arg1, arg2 )</code> will
	 *	attempt to call: <code>context.myMethod( apiResult, arg1, arg2 )</code></p>
	 *
	 *	@param args Varargs as explained above
	 *
	 *	@return A callable object
	 */
	public ApiCallback createCallback ( Object ... args )
	{
		Object target = context;
		String method = "";
		int shift = 1;
		ApiCallback cb = null;

		if ( args.length >= 2 && args[0].getClass() != String.class )
		{
			target = args[0];
			method = (String)args[1];
			shift = 2;
			cb = new ApiCallback( target, method );
		}
		else if ( args[0].getClass() == String.class )
		{
			method = (String)args[0];
			cb = new ApiCallback( target, method );
		}
		else
		{
			cb = new ApiCallback( args[0] );
			return cb;
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
					Event event = eventFromJson( jsonEvents.getJSONObject( i ) );

					events[i] = event;
				}
			
				request.getCallback().call( (Object)events );
			}

			else if ( request.getType() == EVENT )
			{
				Event e = eventFromJson( new JSONObject( responseBody ) );

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

			else if ( request.getType() == LOG_IN_OUT )
			{
				JSONObject jsonKey = new JSONObject( responseBody );
				String api_key_new = jsonKey.getString("api_access_key");

				// TODO: keep this automatically?
				if ( api_key_new != null ) {
					try {
						setApiKey( api_key_new );
					} catch (Exception e) {
						e.printStackTrace();
						System.err.println("///////////////");
						System.err.println("An API_KEY returned by the API is wrong, "+
										   "please have an admin check this");
						System.err.println("///////////////");
						handleError(-1, "Bad API_KEY returned by API", request );
						return;
					}
				}

				if ( api_key_new == null )
					request.getCallback().call();
				else
					request.getCallback().call( api_key_new );
			}

			else if ( request.getType() == ROLES )
			{
				JSONArray jsonRoles = new JSONArray( responseBody );

				Role[] roles = new Role[ jsonRoles.length() ];

				for ( int i = 0, k = jsonRoles.length(); i < k; i++ )
				{
					Role role = roleFromJson( jsonRoles.getJSONObject( i ) );

					roles[i] = role;
				}
			
				request.getCallback().call( (Object)roles );
			}

			else if ( request.getType() == ROLE )
			{
				JSONObject responseObject = new JSONObject( responseBody );

				Role role = null;
				
				try {
					role = roleFromJson( responseObject.getJSONObject( "role" ) );

					JSONArray perms = responseObject.getJSONArray( "permissions" );
					if ( perms != null && perms.length() > 0 ) {
						role.permissions = new Permission[ perms.length() ];
						for ( int i = 0; i < perms.length(); i++ ) {
							role.permissions[i] = permissionFromJson( perms.getJSONObject(i) );
						}
					}
				} catch ( Exception excp ) {
					// ignore
				}

				if ( role == null ) {
					role = roleFromJson( responseObject );
				}

				request.getCallback().call( (Object)role );
			}

			else if ( request.getType() == PERMISSION ) 
			{
				JSONObject responseObject = new JSONObject( responseBody );

				Permission perm = permissionFromJson( responseObject );

				request.getCallback().call( (Object)perm );
			}

			else if ( request.getType() == PERMISSIONS ) 
			{
				JSONArray responseArr = new JSONArray( responseBody );
				
				Permission[] perms = null;

				if ( responseArr != null && responseArr.length() > 0 )
				{
					perms = new Permission[responseArr.length()];

					for ( int i = 0; i < responseArr.length(); i++ ) {
						perms[i] = new Permission();
						perms[i].name = responseArr.getString(i);
					}
				}

				request.getCallback().call( (Object)perms );
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

			else
			{
				request.getCallback().call();
			}

		} catch ( org.json.JSONException jse ) {
	    	jse.printStackTrace();
	    }
	}

	public void handleError ( int statusCode, String errorMessage, ApiRequest request )
	{
		ApiCallback callback = new ApiCallback( request.getCallback().getTarget(), DEFAULT_ERROR_CALLBACK );
		callback.setIgnoreNoMethod( true );
		callback.call( statusCode, errorMessage, request.getTypeString() + " " + request.getURL() );
	}

	public String toString ()
	{
		return "<"+getClass().getName()+", version ##version##, build ##build##>";
	}

	// -----------------------------------------
	//	Private methods
	// -----------------------------------------

	/**
	 *	groupFromJson()
	 *
	 *	Create a Group object from JSON data
	 *
	 *	@param groupJson The group JSON data in form of a JSONObject
	 *	@return The newly created Group object
	 */
	private Group groupFromJson ( JSONObject groupJson )
	{
		Group group = null;

		try 
		{
			group = new Group();
			group.id = groupJson.getInt( "id" );
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
			return null;
		}

		try {
			group.title 	  = groupJson.getString( "title" );
			group.description = groupJson.getString( "description" );
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
	 *	Create an Event object from JSON data
	 *
	 *	@param eventJson The event JSON data in form of a JSONObject
	 *	@return The newly created Event object
	 */
	private Event eventFromJson ( JSONObject eventJson )
	{
		Event event = null;
		JSONArray eventFields = null;

		try 
		{
			event = new Event();
			event.id = eventJson.getInt( "id" );
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
			return null;
		}

		try {
			event.utc_timestamp = new java.util.Date( (long)(eventJson.getDouble( "utc_timestamp" ) * 1000.0) );
			event.duration 		= eventJson.getLong( "duration" );
			event.type 			= eventJson.getString( "type" );

			event.fields 		= new HashMap<String, String>();
			eventFields 		= eventJson.getJSONArray("fields");

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

	/**
	 *	roleFromJson()
	 *
	 *	@param json The JSON data in form of a JSONObject
	 *  @return User The newly created Role object 
	 */
	private Role roleFromJson ( JSONObject e )
	{
		Role role = new Role();

		try 
		{
			role.id = e.getString( "id" );
			role.description = e.getString( "description" );

			// permissions?
		}
		catch ( Exception excp )
		{
			excp.printStackTrace();
			return null;
		}

		try {
			role.inherit_from_id = e.getString( "inherit_from_id" );
		} catch ( Exception excp ) {
			// ignore
		}

		try {
			JSONArray perms = e.getJSONArray("permissions");
			Permission[] rolePerms = new Permission[perms.length()];
			for ( int i = 0; i < perms.length(); i++ ) {
				rolePerms[i] = permissionFromJson( perms.getJSONObject(i) );
			}
			role.permissions = rolePerms;
		} catch ( Exception excp ) {
			// ignore
		}

		return role;
	}

	private Permission permissionFromJson ( JSONObject e )
	{
		Permission perm = new Permission();

		try {
			perm.name 		= e.getString("entity");
			perm.permission = e.getString("permission");

		} catch ( Exception excp ) {
			excp.printStackTrace();
			return null;
		}

		return perm; 
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
		} catch ( Exception excp ) {
			/* ignore for now */
		}

		try {
			user.password = e.getString( "password" );
		} catch ( Exception excp ) {
			/* ignore for now */
		}

		try {
			user.is_disabled = e.getBoolean( "is_disabled" );
		} catch ( Exception excp ) {
			/* ignore for now */
		}

		return user;
	}

	private boolean ensureApiKey ()
	{
		if ( api_key == null ) {
			System.err.println("A Piecemaker API-key is required!");
			return false;
		}
		return true;
	}

	private void setHost ( String host ) throws Exception
	{
		//System.out.println( host );
		if ( host != null && host.length() > 0 ) 
		{
			String host_full = host + "/api/v1";

			boolean validUrl = (new org.apache.commons.validator.UrlValidator(
									new String[]{ "http", "https" }
							   )).isValid( host_full );
			if ( validUrl || 
				 host_full.indexOf("localhost") != -1 || 
				 host_full.indexOf(".local") != -1 )
			{
				this.host = host_full;	
			}
		} else {
			throw( new Exception("host can not be null or empty") );
		}
	}

	private void setApiKey ( String api_key ) throws Exception
	{
		if ( api_key != null && api_key.length() > 0 )
		{
			this.api_key = api_key;
		} else {
			throw( new Exception("api_key can not be null or empty") );
		}
	}

	private void setContext ( Object context ) throws Exception
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
		} else {
			throw( new Exception( "Context can not be null" ) );
		}
	}
}
