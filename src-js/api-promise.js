import request from 'superagent'
import assert from 'assert'

class PieceMakerApi {
  // Class PieceMakerApi
  // ---------------------
  // new PieceMakerApi( <string> host [, <string> api_key ] )
  //
  // If the api_key is not present you must use login() before being
  // able to issue any other calls to the API.

  constructor (host, apiAccessKey = undefined) {
    assert.equal(typeof host, 'string', 'Host must be string')
    this.host = `${host}/api/v1`
    if (typeof apiAccessKey === 'string') this.api_access_key = apiAccessKey
  }

  // Users
  // ------
  // ###Log a user in

  // If the user has no API key, this will generate one

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_login_format

  // ```
  // api.login( <string> email, <string> password )
  // ```

  // Returns a promise yielding the access key

  login (email, password) {
    assert.equal(typeof email, 'string', 'email must be string')
    assert.equal(typeof password, 'string', 'password must be string')
    const ctx = this
    return this._apiRequest('/user/login', 'POST', { email, password })
      .then(res => {
        ctx.api_access_key = res.api_access_key
        return res
      })
  }

  // ###Log a user out

  // Clears the stored access key

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_logout_format

  // ```
  // api.logout()
  // ```

  logout () {
    this.api_access_key = undefined
  }

  // ###Get all users

  // Returns a list of all users

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/users/GET_api_version_users_format

  // ```
  // api.listUsers()
  // ```

  // Returns promise yielding list of users

  listUsers () {
    return this._apiRequest('/users')
  }

  // ###Get current user

  // Returns the currently logged in user by looking up the active API key

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_me_format

  // ```
  // api.whoAmI()
  // ```

  // Returns promise yielding current user

  whoAmI () {
    return this._apiRequest('/user/me')
  }

  // ###Create a user

  // Role id is optional, if none is provided it will be "user" (no permissions)

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/POST_api_version_user_format

  // ```
  // api.createUser( <string> name, <string> email [, <string> roleId ] )
  // ```

  // Returns promise yielding created user

  createUser (name, email, roleId = undefined) {
    assert.equal(typeof name, 'string', 'name must be string')
    assert.equal(typeof email, 'string', 'email must be string')
    if (roleId) assert.equal(typeof roleId, 'string', 'roleId must be string')
    return this._apiRequest('/user', 'POST', { name, email, user_role_id: roleId })
  }

  // ###Get one user by id

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_id_format

  // ```
  // api.getUser( <int> id )
  // ```

  // Returns promise yielding user

  getUser (id) {
    assert.equal(typeof id, 'number', 'id must be number')
    return this._apiRequest(`/user/${id}`)
  }

  // ###Update a user

  // Updating can change name, email or role_id and
  // it can disable a user and recreate a new password.

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/PUT_api_version_user_id_format

  // Versions:
  // ```
  // api.updateUser( <int> id, <string> name, <string> email )
  // api.updateUser( <int> id, <string> name, <string> email, <boolean> disable, <boolean> refreshPassword )
  // ```

  // Returns promise yielding updated user

  updateUser (id, name, email, disable = undefined, refreshPassword = undefined) {
    // TODO: change this to take a user id and an object containing the update payload
    assert.equal(typeof id, 'number', 'id must be number')
    assert.equal(typeof name, 'string', 'name must be string')
    assert.equal(typeof email, 'string', 'email must be string')
    if (disable) assert.equal(typeof disable, 'boolean', 'disable must be boolean')
    if (refreshPassword) assert.equal(typeof refreshPassword, 'boolean', 'refreshPassword must be boolean')
    return this._apiRequest(`/user/${id}`, 'PUT', {
      name,
      email,
      is_disabled: disable,
      new_password: refreshPassword
    })
  }

  // ###Delete one user

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/DELETE_api_version_user_id_format

  // ```
  // api.deleteUser( <int> id )
  // ```

  // Returns promise

  deleteUser (id) {
    return this._apiRequest(`/user/${id}`, 'DELETE')
  }

  // ###Get all groups visible to given user

  // This returns a list of groups that the user belongs to

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/user/GET_api_version_user_id_groups_format

  // ```
  // api.userGroups( <int> user_id )
  // ```

  // Returns promise yielding the group list

  userGroups (id) {
    return this._apiRequest(`/user/${id}/groups`)
  }

  // Groups
  // -------

  // Groups are what Piecemaker 1 called a "piece":
  // a collection of events (markers, videos, recordings, ...)

  // ###Get all groups

  // This returns a list of all groups (super admin only)

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/groups/GET_api_version_groups_format

  // ```
  // api.listGroups()
  // ```

  // Returns promise yielding the group list

  listGroups () {
    return this._apiRequest('/groups')
  }

  // ###Get all groups

  // Get a list of all available groups

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/groups/GET_api_version_groups_all_format

  // ```
  // api.listAllGroups()
  // ```

  // Returns promise yielding the group list

  listAllGroups () {
    return this._apiRequest('/groups/all')
  }

  // ###Create a group

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_format

  // ```
  // api.createGroup( <string> title [, <string> description ] )
  // ```

  // Returns promise yielding the created group

  createGroup (title, description = '') {
    assert.equal(typeof title, 'string', 'title must be string')
    assert.equal(typeof description, 'string', 'description must be string')
    return this._apiRequest('/group', 'POST', {
      title,
      description
    })
  }

  // ###Get a group by id

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_format

  // ```
  // api.getGroup( <int> id )
  // ```

  // Returns promise yielding the group

  getGroup (id) {
    assert.equal(typeof id, 'number', 'id must be number')
    return this._apiRequest(`/group/${id}`)
  }

  // ###Update a group by id

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/PUT_api_version_group_id_format

  // ```
  // api.updateGroup( <int> group_id, <object> data )
  // ```
  // where data is
  // ```
  // {
  //   title : <string>,
  //   text :  <string>
  // }
  // ```

  // Returns promise yielding the updated group

  updateGroup (id, data) {
    assert.equal(typeof id, 'number', 'id must be number')
    assert.equal(typeof data, 'object', 'data must be object')
    data = PieceMakerApi._convertData(data)
    return this._apiRequest(`/group/${id}`, 'PUT', data)
  }

  // ###Delete a group

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/DELETE_api_version_group_id_format

  // ```
  // api.deleteGroup( <int> id )
  // ```

  deleteGroup (id) {
    assert.equal(typeof id, 'number', 'id must be number')
    return this._apiRequest(`/group/${id}`, 'DELETE')
  }

  // ###Get all users in this group

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_users_format

  // ```
  // api.listGroupUsers( <int> id )
  // ```

  // Returns promise yielding all users in that group

  listGroupUsers (id) {
    assert.equal(typeof id, 'number', 'id must be number')
    return this._apiRequest(`/group/${id}/users`)
  }

  // ###Add a user to a group

  // Expects a user role id to be given as which the user will act in the group

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_event_group_id_user_user_id_format

  // ```
  // api.addUserToGroup( <int> id, <int> userId, <string> roleId )
  // ```

  // TODO: check what this returns

  addUserToGroup (id, userId, roleId) {
    assert.equal(typeof id, 'number', 'id must be number')
    assert.equal(typeof userId, 'number', 'userId must be number')
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    return this._apiRequest(`/group/${id}/user/${userId}`, 'POST', {
      user_role_id: roleId
    })
  }

  // ###Change a users role in a group

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/PUT_api_version_group_event_group_id_user_user_id_format

  // ```
  // api.changeUserRoleInGroup( <int> id, <int> userId, <string> roleId )
  // ```

  // TODO: check what this returns

  changeUserRoleInGroup (id, userId, roleId) {
    assert.equal(typeof id, 'number', 'id must be number')
    assert.equal(typeof userId, 'number', 'userId must be number')
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    return this._apiRequest(`/group/${id}/user/${userId}`, 'PUT', {
      user_role_id: roleId
    })
  }

  // ###Remove user from group

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/DELETE_api_version_group_event_group_id_user_user_id_format

  // ```
  // api.removeUserFromGroup( <int> id, <int> userId )
  // ```

  // TODO: check what this returns

  removeUserFromGroup (id, userId) {
    assert.equal(typeof id, 'number', 'id must be number')
    assert.equal(typeof userId, 'number', 'userId must be number')
    return this._apiRequest(`/group/${id}/user/${userId}`, 'DELETE')
  }

  // Roles
  // -------

  // A role is a predefined set of permissions. Each user has a global role and
  // roles per group that he/she is part of. Roles can inherit permissions from
  // other roles.

  // ###List all available roles

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/roles/GET_api_version_roles_format

  // ```
  // api.listRoles()
  // ```

  // Returns promise yielding all available roles

  listRoles () {
    return this._apiRequest('/roles')
  }

  // ###Add new role

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/POST_api_version_role_format

  // ```
  // api.createRole( <string> roleId [, <string> inheritRoleId ] [, <string> description ] )
  // ```

  // Returns promise yielding the new role created

  createRole (roleId, inheritRoleId = undefined, description = undefined) {
    assert.equal(typeof roleId, 'string', 'roleId must be number')
    if (typeof inheritRoleId !== 'undefined') {
      assert.equal(typeof inheritRoleId, 'number', 'inheritRoleId must be number')
    }
    if (typeof description !== 'undefined') {
      assert.equal(typeof description, 'string', 'description must be string')
    }
    return this._apiRequest('/role', 'POST', {
      id: roleId,
      inherit_from_id: inheritRoleId,
      description
    })
  }

  // ###Update role

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/PUT_api_version_role_id_format

  // ```
  // api.updateRole( <string> roleId, [, <string> inheritRoleId ] [, <string> description ] )
  // ```

  // Returns promise yielding the updated role

  updateRole (roleId, inheritRoleId = undefined, description = undefined) {
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    if (typeof inheritRoleId !== 'undefined') {
      assert.equal(typeof inheritRoleId, 'string', 'inheritRoleId must be string')
    }
    if (typeof description !== 'undefined') {
      assert.equal(typeof description, 'string', 'description must be string')
    }
    return this._apiRequest(`/role/${roleId}`, 'PUT', {
      inherit_from_id: inheritRoleId,
      description
    })
  }

  // ###Delete a role

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/DELETE_api_version_role_id_format

  // ```
  // api.deleteRole( <string> roleId )
  // ```

  deleteRole (roleId) {
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    return this._apiRequest(`/role/${roleId}`, 'DELETE')
  }

  // ###Get a role by id

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/GET_api_version_role_id_format

  // ```
  // api.getRole( <string> roleId )
  // ```

  // Returns promise yielding the role

  getRole (roleId) {
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    return this._apiRequest(`/role/${roleId}`)
  }

  // Role permissions
  // --------

  // A permission reflects a certain action on the server that can be triggered through the API.
  // Each permission can be set to allow or forbid one action.
  // Permissions are grouped into roles to allow for fine grained user rights control.

  // Permissions are predefined (hard coded) into the API, use listPermissions() to get a list.

  // ###Get all permissions

  // Only the permissions returned by this call are available

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/permissions/GET_api_version_permissions_format

  // ```
  // api.listPermissions()
  // ```

  // Returns promise yielding an array of permissions

  listPermissions () {
    return this._apiRequest('/permissions')
  }

  // ###Add a permission to a role

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/POST_api_version_role_format

  // ```
  // api.addPermissionToRole( <string> roleId, <string> action [, <boolean> isAllowed ] );
  // ```
  // "action" as available through listPermissions()

  // TODO: check what this returns

  addPermissionToRole (roleId, action, isAllowed = true) {
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    assert.equal(typeof action, 'string', 'action must be string')
    assert.equal(typeof isAllowed, 'boolean', 'isAllowed must be boolean')
    return this._apiRequest(`/role/${roleId}/permission`, 'POST', {
      action: action,
      // TODO: dear api "programmer", what's a bool? hint: it's not something you smoke
      allowed: isAllowed ? 'yes' : 'no'
    })
  }

  // ###Change a role permission

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/PUT_api_version_role_user_role_id_permission_role_permission_entity_format

  // ```
  // api.changePermissionForRole( <string> roleId, <string> action, <string> right )
  // ```
  // "action" as available through listPermissions()
  // "isAllowed" can be true or false

  // TODO: check what this returns

  changePermissionForRole (roleId, action, isAllowed) {
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    assert.equal(typeof action, 'string', 'action must be string')
    assert.equal(typeof isAllowed, 'boolean', 'isAllowed must be boolean')
    return this._apiRequest(`/role/${roleId}/permission/${action}`, 'PUT', {
      // TODO: oh, get out.
      allowed: isAllowed ? 'yes' : 'no'
    })
  }

  // ###Remove a permission from a role

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/DELETE_api_version_role_user_role_id_permission_role_permission_entity_format

  // ```
  // api.removePermissionFromRole( <string> roleId, <string> action )
  // ```

  removePermissionFromRole (roleId, action) {
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    assert.equal(typeof action, 'string', 'action must be string')
    return this._apiRequest(`/role/${roleId}/permission/${action}`, 'DELETE')
  }

  // ###Get a role permission

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/role/GET_api_version_role_user_role_id_permission_role_permission_entity_format

  // ```
  // api.getPermissionFromRole( <string> roleId, <string> action )
  // ```

  // Returns promise yielding the permission

  getPermissionFromRole (roleId, action) {
    assert.equal(typeof roleId, 'string', 'roleId must be string')
    assert.equal(typeof action, 'string', 'action must be string')
    return this._apiRequest(`/role/${roleId}/permission/${action}`)
  }

  // Events
  // --------

  // Anything on a timeline is an event in Piecemaker. That includes videos, data, annotations, ...

  // A bare event is a point in time (utc_timestamp), a duration in seconds and a type.
  // Each event can have an undefined amount of additional fields in the form of {key:value}.

  // ###Get all events from a group

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

  // ```
  // api.listEvents( <int> groupId )
  // ```

  // Returns promise yielding all events in the group

  listEvents (groupId) {
    assert.equal(typeof groupId, 'number', 'groupId must be number')
    return this._apiRequest(`/group/${groupId}/events`, undefined, PieceMakerApi._fixEventsResponse)
  }

  // ###Get all event types from a group

  // See:
  //

  // ```
  // api.listEventTypes( <int> groupId )
  // ```

  // Returns promise yielding an array with all distinct event types in the group

  listEventTypes (groupId) {
    assert.equal(typeof groupId, 'number', 'groupId must be number')
    return this._apiRequest(`/group/${groupId}/event-types`, undefined, PieceMakerApi._fixEventsResponse)
  }

  // ###Get all events of a certain type

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

  // ```
  // api.listEventsOfType( <int> group_id, <string> type )
  // ```

  // Returns promise yielding an array of events

  listEventsOfType (groupId, type) {
    assert.equal(typeof groupId, 'number', 'groupId must be number')
    assert.equal(typeof type, 'string', 'type must be string')
    // TODO: bad api design, type should be part of path instead of query params
    return this._apiRequest(`/group/${groupId}/events`, 'GET', { type }, PieceMakerApi._fixEventsResponse)
  }

  // ###Get all events that have certain fields (id and value must match)

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

  // ```
  // api.listEventsWithFields( <int> groupId [, <object> fields ] )
  // ```
  // The second parameter is an object with key-values:
  // ```
  // {
  //    key1 : value1,
  //    key2 : value2,
  //    ...
  // }
  // ```

  // Returns promise yielding an array of events

  listEventsWithFields (groupId, fields = undefined) {
    assert.equal(typeof groupId, 'number', 'groupId must be number')
    if (fields) {
      assert.equal(typeof fields, 'object', 'fields must be object')
    }
    return this._apiRequest(`/group/${groupId}/events`, 'GET', { fields }, PieceMakerApi._fixEventsResponse)
  }

  // ###Get all events that happened within given timeframe

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

  // Versions:
  // ```
  // TODO: check for a better way to express the optional date ranges
  // api.listEventsForTimespan( <int> groupId, <date> from, <date> to [, <string> method ] )
  // ```

  // If either *to* or *from* are undefined it is like saying *before to* or *after from*.

  // The *method* parameter is optional, can be any of:
  // ```
  // 'utc_timestamp', looking only at the start points
  // 'intersect', returning events that intersect the given time span or are contained within
  // 'contain', returning events that are fully contained (start+duration) in time span
  // ```
  // See here for details:
  // https://github.com/motionbank/piecemaker2-api/issues/76#issuecomment-37030586

  // Returns promise yielding an array of events

  listEventsForTimespan (groupId, from = undefined, to = undefined, method = 'intersect') {
    assert.equal(typeof groupId, 'number', 'groupId must be number')
    assert.ok(from || to, 'at least either from or to must be defined')
    if (from) {
      assert.equal(typeof from, 'date', 'from must be date')
    }
    if (to) {
      assert.equal(typeof to, 'date', 'to must be date')
    }
    assert.equal(typeof method, 'string', 'method must be string')
    assert.notEqual(['utc_timestamp', 'intersect', 'contain'].indexOf(method), -1,
      'method must be one of: "utc_timestamp", "intersect" or "contain" (case-sensitive)')
    return this._apiRequest(`/group/${groupId}/events`, 'GET', {
      from: from ? PieceMakerApi._jsDateToTs(from) : undefined,
      to: to ? PieceMakerApi._jsDateToTs(to) : undefined,
      fromto_query: method
    }, PieceMakerApi._fixEventsResponse)
  }

  // ###Get all events that match

  // This is a very generic method that allows for more complex searches

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/GET_api_version_group_id_events_format

  // ```
  // api.findEvents( <int> groupId, <object> query )
  // ```

  // Returns promise yielding an array of events

  findEvents (groupId, query) {
    assert.equal(typeof groupId, 'number', 'groupId must be number')
    assert.equal(typeof query, 'object', 'query must be object')
    return this._apiRequest(`/group/${groupId}/events`, 'GET',
      PieceMakerApi._convertData(query), PieceMakerApi._fixEventsResponse)
  }

  // ###Get one event by id

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/event/GET_api_version_event_id_format

  // ```
  // api.getEvent( <int> eventId )
  // ```

  // Returns promise yielding one event

  getEvent (eventId) {
    assert.equal(typeof eventId, 'number', 'eventId must be number')
    return this._apiRequest(`/event/${eventId}`, undefined, PieceMakerApi._expandEventToObject)
  }

  // ###Create one event

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/group/POST_api_version_group_id_event_format

  // ```
  // api.createEvent( <int> groupId, <object> eventData )
  // ```
  // Where *eventData* is:
  // ```
  // {
  //    utc_timestamp: <date>,
  //    duration:      <int>,
  //    type:          <string>,
  //    // optionally:
  //    fields: {
  //        key1 : value1,
  //        key2 : value2,
  //        ...
  //     }
  // }
  // ```

  // Returns promise yielding the newly created event

  createEvent (groupId, eventData) {
    assert.equal(typeof groupId, 'number', 'groupId must be number')
    assert.equal(typeof eventData, 'object', 'eventData must be object')
    return this._apiRequest(`/group/${groupId}/event`, 'POST', eventData, PieceMakerApi._expandEventToObject)
  }

  // ###Update one event

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/event/PUT_api_version_event_id_format

  // ```
  // api.updateEvent( <int> eventId, <object> eventData )
  // ```
  // Where *eventData* is:
  // ```
  // {
  //    utc_timestamp: <date>,
  //    duration:      <int>,
  //    type:          <string>,
  //    // optionally:
  //    fields: {
  //        key1 : value1,
  //        key2 : value2,
  //        ...
  //     }
  // }
  // ```

  // Returns promise yielding the updated event

  updateEvent (eventId, eventData) {
    assert.equal(typeof eventId, 'number', 'eventId must be number')
    assert.equal(typeof eventData, 'object', 'eventData must be object')
    return this._apiRequest(`/event/${eventId}`, 'PUT', eventData, PieceMakerApi._expandEventToObject)
  }

  // ###Delete one event

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/event/DELETE_api_version_event_id_format

  // ```
  // api.deleteEvent( <int> eventId )
  // ```

  // Returns promise

  deleteEvent (eventId) {
    assert.equal(typeof eventId, 'number', 'eventId must be number')
    return this._apiRequest(`/event/${eventId}`, 'DELETE')
  }

  // System related calls
  // ---------------------

  // ###Get the system (server) time

  // See:
  // http://motionbank.github.io/piecemaker2-api/swagger/#!/system/GET_api_version_system_utc_timestamp_format

  // ```
  // api.getSystemTime()
  // ```

  // Returns promise yielding UTC timestamp (date) of server

  getSystemTime () {
    return this._apiRequest('/system/utc_timestamp', 'GET',
      undefined, (res) => { return new Date(res.utc_timestamp * 1000) })
  }

  //
  //
  // Internals

  _apiRequest (path, method = 'GET', data = undefined, resultHandler = undefined) {
    const _ctx = this
    return new Promise((resolve, reject) => {
      const req = request(method, `${_ctx.host}${path}`)
        .accept('application/json')
        .set('Content-Type', 'application/json; charset=utf-8')
      if (typeof _ctx.api_access_key === 'string') {
        req.set('X-Access-Key', _ctx.api_access_key)
      }
      if (data) req.send(data)
      req.end((err, res) => {
        if (err || !res.ok) return reject(new PMApiError(err.message, res.status, path, method))
        if (typeof resultHandler === 'function') {
          return resolve(resultHandler(res.body))
        }
        resolve(res.body)
      })
    })
  }

  //
  //
  // Statics

  static _convertData (data) {
    if (!data) return data
    if (typeof data !== 'object') return data
    if ('entrySet' in data && typeof data.entrySet === 'function') {
      // var allowed_long_keys = ['utc_timestamp', 'duration', 'type', 'token'];
      const set = data.entrySet()
      if (!set) return data
      const obj = {}
      const iter = set.iterator()
      while (iter.hasNext()) {
        const entry = iter.next()
        let val = entry.getValue()
        if (val && typeof val === 'object' && 'entrySet' in val &&
          typeof val.entrySet === 'function') val = PieceMakerApi._convertData(val)
        const key = entry.getKey()
        if (!key) {
          throw new Error('Field key is not valid: ' + key)
        }
        obj[entry.getKey()] = val
      }
      return obj
    }
    else {
      if ('utc_timestamp' in data) data.utc_timestamp = PieceMakerApi._jsDateToTs(data.utc_timestamp)
      if ('created_at' in data) data.created_at = PieceMakerApi._jsDateToTs(data.created_at)
    }
    return data
  }

  // FIXME: these are temporary fixes for:
  // https://github.com/motionbank/piecemaker2/issues/54
  // https://github.com/motionbank/piecemaker2-api/issues/105

  static _fixEventsResponse (resp) {
    if (resp instanceof Array) {
      const arr = []
      for (let i = 0; i < resp.length; i++) {
        arr.push(PieceMakerApi._expandEventToObject(resp[i]))
      }
      return arr
    }
    return resp
  }

  static _expandEventToObject (event) {
    if (event.fields && event.fields.length > 0) {
      // fix JSON formatting
      const newFields = {}
      for (let i = 0, f = event.fields, l = f.length; i < l; i++) {
        const field = f[i]
        newFields[field['id']] = field['value']
      }
      event.fields = newFields
      // add a fake getter to make Processing.js happy
      event.fields.get = (function (e) {
        return function (k) {
          return e.fields[k]
        }
      })(event)
    }
    event.utc_timestamp = new Date(event.utc_timestamp * 1000.0)
    return event
  }

  static _jsDateToTs (dateTime) {
    if (dateTime instanceof Date) {
      return dateTime.getTime() / 1000.0
    }
    else {
      if (dateTime > 9999999999) {
        return dateTime / 1000.0 // assume it's a JS timestamp in ms
      }
      else {
        return dateTime // assume it's ok
      }
    }
  }

  static TIMESPAN () {
    return 'utc_timestamp'
  }

  static get INTERSECTING () {
    return 'intersect'
  }

  static get CONTAINED () {
    return 'contain'
  }
}

class PMApiError extends Error {
  // Custom API Error class
  constructor (msg, code = -1, url, type) {
    super(msg)
    this.code = code
    this.url = url
    this.type = type
    Error.captureStackTrace(this, PMApiError)
  }
}

if (typeof window !== 'undefined') {
  window.PieceMakerApi = PieceMakerApi
}

export default PieceMakerApi
