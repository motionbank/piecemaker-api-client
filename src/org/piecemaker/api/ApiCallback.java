package org.piecemaker.api;

import java.lang.reflect.*;

public class ApiCallback
{
	Method meth;
	Object obj;
	Object[] arguments;

	public ApiCallback ( Object target, String method )
	{
		Method[] meths = target.getClass().getMethods();
		for ( Method meth : meths ) {
			if ( meth.getName().equals(method) ) {
				this.meth = meth;
				break;
			}
		}
		obj = target;
	}

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
}