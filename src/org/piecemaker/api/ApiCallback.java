package org.piecemaker.api;

import java.lang.reflect.*;

public class ApiCallback
{
	Method meth;
	Object obj;

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
		try {
			meth.invoke(obj, args);
		} catch ( Exception e ) {
			e.printStackTrace();
		} 
	}
}