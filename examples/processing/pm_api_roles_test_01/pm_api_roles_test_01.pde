/** 
 *    Motion Bank research, http://motionbank.org/
 *
 *    Piecemaker 2 API test: 
 *    create, update and delete some roles ...
 *
 *    Processing 2.0
 *    created: fjenett 20140315
 */

import org.piecemaker2.api.*;
import org.piecemaker2.models.*;

PieceMakerApi api;

void setup ()
{
    size( 200, 200 );
    
    api = new PieceMakerApi( this, "http://localhost:9292", "0310XdIkvf75OS3s" );
    api.whoAmI( api.createCallback( "selfLoaded" ) );
    
    // api.login( "administrator@fake-email.motionbank.org", 
    //            "Administrator", 
    //            api.createCallback( "loggedIn" ) );
}

// void loggedIn ( String api_key )
// {    
//     api.whoAmI( api.createCallback( "selfLoaded" ) );
// }

void draw ()
{
}

void selfLoaded ( User u )
{
    println( "You are: " + u.email );
    
    api.listRoles( api.createCallback("rolesLoaded") );
}

void rolesLoaded ( Role[] roles )
{
    for ( Role r : roles )
    {
        api.getRole( r.id, api.createCallback( "roleLoaded" ) );
    }
    
    api.createRole( "test_role", "", "Just a simple test role", api.createCallback( "roleCreated" ) );
}

void roleLoaded ( Role r )
{
    println( r.id );
    if ( r.permissions != null )
    { 
       for ( Permission p : r.permissions )
       {
           println( "    " + p.name );
       }
    }
}

void roleCreated ( Role r )
{
    println( "created " + r.id );
    
    api.updateRole( r.id, "user", "Changing the description as well", api.createCallback( "roleUpdated" ) );
}

void roleUpdated ( Role r )
{
    println( "updated " + r.id );
    
    api.listPermissions( api.createCallback( "permissionsLoaded", r ) );
}

void permissionsLoaded ( Permission[] perms, Role r )
{
    println( perms.length + " permissions loaded" );
    
    api.addPermissionToRole( r.id, "get_events", "allow", api.createCallback( "rolePermissionAdded", r ) );
}

void rolePermissionAdded ( Permission p, Role r )
{
    println( "added " + p.name + " " + p.permission );
    
    api.changePermissionForRole( r.id, p.name, "forbid", api.createCallback( "rolePermissionChanged", r ) );
}

void rolePermissionChanged ( Permission p, Role r )
{
    println( "changed " + p.name + " " + p.permission );
    
    api.removePermissionFromRole( r.id, p.name, api.createCallback( "rolePermissionRemoved", r ) );
}

void rolePermissionRemoved ( Permission p, Role r )
{
    println( "removed " + p.name );
    
    api.deleteRole( r.id, api.createCallback( "roleDeleted" ) );
}

void roleDeleted ( Role r )
{
    println( "deleted " + r.id );
    println( "done" );
}

void piecemakerError ( int status, String errMsg, String request )
{
    println( "Failed: " + status + " " + errMsg + " at " + request );
}
