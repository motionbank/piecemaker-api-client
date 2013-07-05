
// TODO: Implement Iterateble, Compareable

package org.piecemaker2.models;

import java.util.Map;
import java.util.HashMap;
import java.lang.reflect.*;

public class BasicModel
{
	public int id;
	
	/**
	 *	Just to make Java happy.
	 */
	public BasicModel () {}

	/**
	 *	Because every kid needs a name
	 */

	public void setId ( int id ) {
		this.id = id;
	}

	public int getId () {
		return this.id;
	}
	
	/**
	 *	Takes a HashMap and sets objects fields to it's values.
	 */
	public BasicModel ( Object ... args ) 
	{
		if ( args != null )
		{
			if ( args.length == 1 && args[0].getClass() == HashMap.class ) 
			{
				set( (HashMap)args[0] );
			}
			else if ( (args.length % 2) == 0 )
			{
				set( hash( args ) );
			}
		}
	}
	
	/**
	 *	Set this objects values to the elements of given HashMap.
	 */
	public void set ( HashMap properties ) 
	{
		if ( properties != null ) 
		{
			for ( Object e : properties.entrySet() ) 
			{
				Field field = null;
				Exception exception = null;
				String fieldName = ((Map.Entry)e).getKey().toString();
				// try {
				// 	field = getClass().getField( fieldName );
				// } catch ( Exception ex ) {
				// 	//ex.printStackTrace();
				// 	exception = ex;
				// }
				if ( field == null ) 
				{
					try {
						field = getClass().getDeclaredField( fieldName );
						exception = null;
					} catch ( Exception ex ) {
						//ex.printStackTrace();
						exception = ex;
					}
				}
				if ( field != null ) 
				{
					//System.out.println( field );
					try {
						field.set( this, ((Map.Entry)e).getValue() );
					} catch ( Exception ex ) {
						ex.printStackTrace();
					}
				} else if ( exception != null ) {
					exception.printStackTrace();
				}
			}
		}
	}
	
	public boolean has ( HashMap properties )
	{
		if ( properties != null ) 
		{
			for ( Object e : properties.entrySet() ) 
			{
				Field field = null;
				Exception exception = null;
				String fieldName = ((Map.Entry)e).getKey().toString();
				Object o = null;
				
				try {
					field = getClass().getDeclaredField( fieldName );
					o = field.get( this );
					exception = null;
				} catch ( Exception ex ) {
					//ex.printStackTrace();
					exception = ex;
				}
				if ( o == null ) {
					try {
						Method meth = getClass().getMethod( toGetterName( fieldName ) );
						if ( meth != null ) {
							o = meth.invoke( this );
						}
					} catch (Exception ex) {
						exception = ex;
					}
				}
				if ( o != null ) 
				{
					try {
						Object v = ((Map.Entry)e).getValue();
						if ( o.getClass().isInstance(java.lang.Comparable.class.getName()) ) {
							if ( ((Comparable)o).compareTo(v) != 0 )
								return false;
						} else if ( o != v ) {
							return false;
						}
					} catch ( Exception ex ) {
						ex.printStackTrace();
						return false;
					}
				} else {
					if ( exception != null )
						exception.printStackTrace();
					return false;
				}
			}
		}
		return true;
	}
	
	/**
	 *	Take array or varargs in form <String,Object> and turn it into an HashMap:
	 *
	 *	hash( ["key", Value, "key2", Value2] ) -> { key:Value, key2:Value2 }
	 *  or
	 *  hash( "key", Value, "key2", Value2 ) -> { key:Value, key2:Value2 }
	 */
	public static HashMap hash ( Object ... args )
	{
		if ( args == null ) return null;
		if ( args.length == 1 ) {
			args = (Object[])args[0];
		}
		
		if ( args != null ) 
		{
			HashMap hash = new HashMap( (args.length % 2) == 0 ? args.length/2 : args.length );
			if ( (args.length % 2) == 0 ) {
				try {
			    	for ( int i = 0; i < args.length-1; i+=2 )
				    {
				        if ( args[i].getClass() != String.class ) {
				            throw new Exception( "Hash(): Pairs of <String, Object> only please!" );
				        }
				        hash.put( args[i], args[i+1] );
				    }
			    } catch ( Exception e ) {
			        e.printStackTrace();
			    }
			
				return hash;
			}
		}
		
		return null;
	}
	
	/**
	 *	A generic pretty print object ... sort of.
	 */
	public String toString ()
	{
		String s = getClass().getName() + "\n";

		Field[] fields = getDeclaredFields( getClass() );
		
		if ( fields != null && fields.length > 0 ) 
		{
			java.util.Arrays.sort( fields, new java.util.Comparator(){
				public int compare ( Object a, Object b ) {
					return ((Field)a).getName().compareTo(((Field)b).getName());
				}
			});
			
			for ( Field f : fields ) 
			{
				String val = null;
				Object v = null;
				
				try {
					v = f.get(this);
				} catch ( Exception e ) {
					
					try {
						Method m = getClass().getMethod( toGetterName(f.getName()) );
						if ( m != null ) {
							v = m.invoke( this );
						}
					} catch ( Exception e2 ) {
						val = "--";
						if ( Modifier.isPrivate(f.getModifiers()) ) {
							val += "private";
						} else if ( Modifier.isProtected(f.getModifiers()) ) {
							val += "protected";
						}
						val += "--";
					}
				}
				
				if ( v == null && val == null ) val = "null";
				else val = v+"";
				
				s += String.format("    %-25s %s\n", f.getName(), val);
			}
		}	

		return s;
	}
	
	private Field[] getDeclaredFields ( Class klass )
	{
		Field[] fields = null;
		
		try {
			fields = klass.getDeclaredFields();
		} catch ( Exception e ) { /* ignore */ }
		
		try {
			Class superClass = klass.getSuperclass();
			if ( superClass != null ) {
				Field[] superFields = getDeclaredFields( superClass );
				
				if ( fields == null ) return superFields;
				
				Field[] tmp = new Field[ fields.length + superFields.length ];
				System.arraycopy( superFields, 0, tmp, 0, superFields.length );
				System.arraycopy( fields, 0, tmp, superFields.length, fields.length );
				fields = tmp;
				superFields = null;
				tmp = null;
			}
		} catch ( Exception e ) { /* ignore */ }
		
		return fields;
	}
	
	private String toGetterName ( String name ) {
		return "get" + name.substring(0,1).toUpperCase() + name.substring(1);
	}
}