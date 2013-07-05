package org.piecemaker2.api;

import java.util.*;
import java.io.*;

import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;

public class ApiRequest implements Runnable
{
	public final static int GET  = 0;
	public final static int POST = 1;

	public static boolean DEBUG = false;

	PieceMakerApi api;
	String url;
	int methodType;
	int requestType;
	HashMap<String,String> data;
	ApiCallback callBack;

	HttpMethodBase method = null;
	String serverResponse;

	public ApiRequest ( PieceMakerApi api, int requestType, String url, int methodType, HashMap<String,String> data, ApiCallback callBack )
	{
		this.api = api;
		this.url = url;
		this.requestType = requestType;
		this.methodType = methodType == POST ? POST : GET;
		this.data = data;
		this.callBack = callBack;

		if ( DEBUG ) System.out.println( (methodType == POST ? "POST" : "GET") + " " + url + ".json" );
	}

	public void run ()
	{
		HttpClient client = new HttpClient();

		// construct the data object for the request

		NameValuePair[] requestData = null;
		if ( data != null && data.size() > 0 )
		{
			requestData = new NameValuePair[data.size()];
			int i = 0;
			for ( Map.Entry<String,String> e : data.entrySet() )
			{
				requestData[i] = new NameValuePair( e.getKey(), e.getValue() );
				i++;
			}
		}

		// make the method depending on type
		
		method = null;

		if ( methodType == GET )
		{
			GetMethod getMethod = new GetMethod( url );
			if ( requestData != null )
				getMethod.setQueryString( requestData );
			method = getMethod;
		}
		else
		{
			PostMethod postMethod = new PostMethod( url );
			if ( requestData != null )
				postMethod.setRequestBody( requestData );
			method = postMethod;
		}

		// set the header to receive JSON data

		method.addRequestHeader( new Header( "Accept", "application/json, text/javascript" ) );

		// request it ...

		try 
	    {
	        int statusCode = client.executeMethod(method);

	        switch ( statusCode ) 
	        {
	        case HttpStatus.SC_OK:
	            break;
	        	// TODO: implement better HTTP error handling here, redirect, moved, 404, 403, ... 
	        default:
	            System.err.println( "Method failed: " + method.getStatusLine() );
	            return;
	        }

	        byte[] responseBody = method.getResponseBody();
	        serverResponse = new String( responseBody );
	    }
	    catch ( HttpException e ) 
	    {
	        System.err.println( "Fatal protocol violation: " + e.getMessage() );
	        e.printStackTrace();
	    } 
	    catch ( IOException e ) 
	    {
	        System.err.println( "Fatal transport error: " + e.getMessage() );
	        e.printStackTrace();
	    } 
	    finally
	    {
	        method.releaseConnection();
	    }

	    // let API handle it

	    if ( serverResponse != null && serverResponse.length() > 0 ) {
	    	api.handleResponse( this );
	    }
	    else
	    {
	    	System.out.println( "No response." );
	    }
	}

	public ApiCallback getCallback ()
	{
		return callBack;
	}

	public String getResponse ()
	{
		return serverResponse;
	}

	public int getType ()
	{
		return requestType;
	}

	public String toString ()
	{
		return String.format( "<ApiRequest #%s %s>", hashCode(), callBack.toString() );
	}
}