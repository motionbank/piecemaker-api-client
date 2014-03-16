package org.piecemaker2.models;

/**
 *	Class Permission
 *
 *	<p>A permission reflects an action on the server that can be triggered through the API.</p>
 *
 *	<p>Permissions are grouped into roles.</p>
 *
 *	<p>The API has a predefined (hard coded) set of permissions that can be listed through the listPermissions() method.</p>
 *
 *	@version ##version## - ##build##
 *	@author florian@motionbank.org
 *	@see org.piecemaker2.models.Role
 */

public class Permission
{
	public String name;
	public String permission;
}
