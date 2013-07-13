package org.piecemaker2.api;

/**
 *	Class ApiCallback
 *
 *	<p>This class is used to facilitate asynchronous callback
 *	functionality in Java / Processing.</p>
 *
 *	@version ##version## - ##build##
 *	@author florian@motionbank.org
 */

import java.lang.reflect.*;

public class ApiCallback
{
	String methodName;
	Method meth;
	Object obj;
	Object[] arguments;
	boolean ignoreNoMethod = false;

	public ApiCallback ( Object target, String method )
	{
		if ( target == null || method == null ) 
		{
			System.err.println( "Either target or method are null here!" );
		}
		else
		{
			methodName = method;

			Method[] meths = target.getClass().getMethods();
			for ( Method meth : meths ) {
				if ( meth.getName().equals(method) ) {
					this.meth = meth;
					break;
				}
			}
			obj = target;
		}
	}

	public void call ( Object...args )
	{
		if ( meth == null ) 
		{
			if ( !ignoreNoMethod ) 
			{
				System.err.println( "Method '" + methodName + "' was not found in '" + obj.toString() + "'!" );	
			}
			return;
		}

		if ( arguments != null && arguments.length > 0 ) 
		{
			Object[] tmp = new Object[args.length + arguments.length];
			System.arraycopy( args, 0, tmp, 0, args.length );
			System.arraycopy( arguments, 0, tmp, args.length, arguments.length );
			args = tmp;
			tmp = null;
		}

		try {
			meth.invoke(obj, args);
		} catch ( Exception e ) {
			e.printStackTrace();
		} 
	}

	public void addArguments ( Object[] args )
	{
		arguments = args;
	}

	public Object getTarget ()
	{
		return obj;
	}

	public void setIgnoreNoMethod ( boolean yesNo )
	{
		ignoreNoMethod = yesNo;
	}

	public String toString ()
	{
		return String.format( "<ApiCallback #%s %s %s>", hashCode(), obj.toString(), meth );
	}
}