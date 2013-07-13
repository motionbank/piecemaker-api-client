package org.piecemaker2.api;

/**
 *	Class ApiCallback
 *
 *	<p>This class is used to facilitate asynchronous callback
 *	functionality in Java / Processing client</p>
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


	/**
	 *	Constructor ApiCallback
	 *
	 *	<p>
	 *	This constructor gets called in two situations 
	 * 	(and you normally should not need to do that yourself):<br/>
	 *	1) through PieceMakerApi.createCallback()<br/>
	 *	2) to internally create error callbacks to fire piecemakerError(..)
	 *  </p>
	 *
	 *	@param target The Object that has the method (that will be called upon)
	 *	@param method The name of the method to call .. note that you can only use this name once in that target object
	 *
	 *	@see org.piecemaker2.api.PieceMakerApi#createCallback( Object[] args )
	 */
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

	/**
	 *	call()
	 *
	 *	<p>Performs the actual method call</p>
	 *
	 *	@param args None, one or more additional arguments to call the method with
	 */
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

	/**
	 *	addArguments()
	 *
	 *	<p>Add arguments to the method call</p>
	 *
	 *	@param args The arguments to add to the call
	 */
	public void addArguments ( Object[] args )
	{
		arguments = args;
	}

	/** 
	 *	getTarget()
	 *
	 *	<p>Retrieve the target object that this callbacks method belongs to</p>
	 *
	 *	@return The target
	 */
	public Object getTarget ()
	{
		return obj;
	}

	/** 
     *	setIgnoreNoMethod()
     *
     *	@param yesNo To enable ignoring missing methods or not
     */
	public void setIgnoreNoMethod ( boolean yesNo )
	{
		ignoreNoMethod = yesNo;
	}

	/**
	 *	@see java.lang.Object#toString()
	 */
	public String toString ()
	{
		return String.format( "<ApiCallback #%s %s %s>", hashCode(), obj.toString(), meth );
	}
}