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
	Method meth = null;
	Object obj;
	Object[] arguments;
	boolean ignoreNoMethod = false;

	// an org.mozilla.javascript.NativeFunction callback
	Object mozFn = null;

	/**
	 *	Constructor ApiCallback for Mozilla rhino (via ringo.js)
	 *
	 *	<p>
	 *	This constructor gets called if you pass one non-String Object into createCallback().
	 *  </p>
	 *
	 *	<p>See: http://ringojs.org/</p>
	 *
	 *	@param fn An org.mozilla.javascript.NativeFunction as callback
	 *
	 *	@see org.piecemaker2.api.PieceMakerApi#createCallback( Object[] args )
	 */
	public ApiCallback ( Object fn )
	{
		if ( fn == null ) 
		{
			System.err.println( "Function is null here!" );
		}
		else
		{
			Class fnClass = fn.getClass();
			Class superFnClass = fnClass.getSuperclass();
			if ( superFnClass != null && 
				 superFnClass.getName().equals( "org.mozilla.javascript.NativeFunction" ) )
			{
				mozFn = fn;
			}
			else
			{
				System.err.println( "createCallback( fn, ... ) assumes first argument to be "+
									"a JavaScript function!" );
			}
		}
	}

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

			// System.out.println( target.getClass() );
			// System.out.println( target.getClass().getSuperclass() );

			Method[] meths = target.getClass().getMethods();
			for ( Method meth : meths ) {
				
				// System.out.println( meth.getName() );
				
				if ( meth.getName().equals(method) ) {
					this.meth = meth;
					break;
				}
			}
			if ( meth == null ) {
				meths = target.getClass().getDeclaredMethods();
				for ( Method meth : meths ) {
					
					// System.out.println( meth.getName() );
					
					if ( meth.getName().equals(method) ) {
						this.meth = meth;
						break;
					}
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
		if ( arguments != null && arguments.length > 0 ) 
		{
			Object[] tmp = new Object[args.length + arguments.length];
			System.arraycopy( args, 0, tmp, 0, args.length );
			System.arraycopy( arguments, 0, tmp, args.length, arguments.length );
			args = tmp;
			tmp = null;
		}

		// this only exists to allow for passing functions in via Mozilla Rhino / ringo.org
		if ( mozFn != null )
		{
			try {
				Class fnClass = mozFn.getClass();

				Class ctxClass = Class.forName( "org.mozilla.javascript.Context" );
				Method ctxEnterMeth = ctxClass.getMethod( "enter", new Class[0] );
				Method ctxExitMeth = ctxClass.getMethod( "exit", new Class[0] );
				Object ctx = ctxEnterMeth.invoke( null, new Object[0] );

				Class scopeClass = Class.forName( "org.mozilla.javascript.Scriptable" );
				Method scopeMeth = fnClass.getMethod( "getParentScope", new Class[0] );
				Object scope = scopeMeth.invoke( mozFn, new Object[0] );

				Method callMeth = fnClass.getMethod( "call", new Class[]{ ctxClass, scopeClass, scopeClass, Object[].class } );
				callMeth.invoke( mozFn, new Object[]{ ctx, scope, mozFn, args } );

				ctxExitMeth.invoke( null, new Object[0] );
				return;

			} catch ( Exception e ) {
				e.printStackTrace();
			}
			return;
		}
		else if ( meth == null ) 
		{
			if ( !ignoreNoMethod ) 
			{
				System.err.println( "Method '" + methodName + "' was not found in '" + obj.getClass().getName() + "'!" );
			}
			return;
		}

		if ( false == meth.isAccessible() )
		{
			try {
				meth.setAccessible( true );
			} catch ( SecurityException se ) {
				/* ignore, will fail in the next step if this crashed */
			}
		}

		try {
			meth.invoke(obj, args);
		} catch ( Exception e ) {
			e.printStackTrace();
			System.err.println(String.format(
				"ApiCallback.call():\n\t-> %s\n\t() %s\n\t.. %s",
				obj.toString(),
				meth.toString(),
				args.toString()
			));
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
		if ( arguments == null || arguments.length == 0 ) 
		{
			arguments = args;
		}
		else
		{
			Object[] nArgs = new Object[ arguments.length + args.length ];
			System.arraycopy( nArgs, 0, arguments, 0, arguments.length );
			System.arraycopy( nArgs, arguments.length, args, 0, args.length );
			arguments = nArgs;
		}
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