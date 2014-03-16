package org.piecemaker2.models;

/**
 *	Class User
 *
 *	<p>A container for Piecemaker users</p>
 *
 *	@version ##version## - ##build##
 *	@author florian@motionbank.org
 */

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class User
{
	public int id;
	public String name;
	public String email;
	public String password;
	public String api_key;
	public boolean is_disabled;
}