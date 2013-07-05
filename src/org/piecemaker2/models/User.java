package org.piecemaker2.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

/*
+---------------------------+--------------+------+-----+---------+----------------+
| Field                     | Type         | Null | Key | Default | Extra          |
+---------------------------+--------------+------+-----+---------+----------------+
| id                        | int(11)      | NO   | PRI | NULL    | auto_increment |
| login                     | varchar(40)  | YES  |     | NULL    |                |
| name                      | varchar(100) | YES  |     | NULL    |                |
| email                     | varchar(100) | YES  |     | NULL    |                |
| crypted_password          | varchar(40)  | YES  |     | NULL    |                |
| salt                      | varchar(40)  | YES  |     | NULL    |                |
| created_at                | datetime     | YES  |     | NULL    |                |
| updated_at                | datetime     | YES  |     | NULL    |                |
| remember_token            | varchar(40)  | YES  |     | NULL    |                |
| remember_token_expires_at | datetime     | YES  |     | NULL    |                |
| group_id                  | int(11)      | YES  | MUL | NULL    |                |
| role_id                   | int(11)      | YES  | MUL | 1       |                |
| performer                 | tinyint(1)   | YES  |     | 0       |                |
| role_name                 | varchar(255) | YES  |     | NULL    |                |
| notes_on                  | tinyint(1)   | YES  |     | 1       |                |
| markers_on                | tinyint(1)   | YES  |     | 1       |                |
| refresh_pref              | int(11)      | YES  |     | 0       |                |
| truncate                  | varchar(255) | YES  |     | more    |                |
| inherit_cast              | tinyint(1)   | YES  |     | 0       |                |
| last_assemblage_id        | int(11)      | YES  |     | NULL    |                |
| last_login                | datetime     | YES  |     | NULL    |                |
| scratchpad                | text         | YES  |     | NULL    |                |
+---------------------------+--------------+------+-----+---------+----------------+
*/

public class User extends BasicModel
{
	// columns
	public int id;
	public String login;
	public String name;
	public String email;
	private String cryptedPassword;
	private String salt;
	public Date createdAt;
	public Date updatedAt;
	public String rememberToken;
	public Date rememberTokenExpiresAt;
	public int groupId;
	public int roleId;
	public boolean performer;
	public String roleName;
	public boolean notesOn;
	public boolean markersOn;
	public int refreshPerf;
	public String truncate;
	public boolean inheritCast;
	public int lastAssemblageId;
	public Date lastLogin;
	public String scratchpad;
	
	// relations
	public ArrayList<XXX> logins; //
	public ArrayList<XXX> messages; //
	public ArrayList<XXX> performers; //
	public ArrayList<XXX> events; //, :order => :happened_at, :include => [:sub_scenes,:tags,:notes,:video,:users]
	
	public User () {
	}
	
	public User ( HashMap properties ) {
		super( properties );
	}
}