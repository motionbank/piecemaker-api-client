package org.piecemaker2.models;

/**
 *	Class Role
 *
 *	<p>A role is a set of permissions that can be set to "allow" or "forbit" certain server actions through the API.</p>
 *
 *	<p>Each user has a global role and one role per group that he/she is part of.</p>
 *
 *	@version ##version## - ##build##
 *	@author florian@motionbank.org
 *	@see org.piecemaker2.models.Permission
 */

public class Role
{
	public String id;
	public String inherit_from_id;
	public String description;
}
