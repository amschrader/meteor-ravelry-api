Ravelry = function(options) {
  this._url = "https://api.ravelry.com";
  this._version = "1";
  this._userId = undefined;
  if (options) _.extend(this, options);
};

Ravelry.prototype.setUserId = function(userId) {
  this._userId = userId;
};

Ravelry.prototype.getUserId = function() {
  return this._userId;
};

Ravelry.prototype._getUrl = function(url) {
  return [this._url, url].join('/');
};

Ravelry.prototype.get = function(url, params) {
  return this.call('GET', url, params);
};

Ravelry.prototype.post = function(url, params) {
  return this.call('POST', url, params);
};

Ravelry.prototype.delete = function(url) {
  return this.call('DELETE', url);
};

Ravelry.prototype.call = function(method, url, params) {
  oauthBinding = this.getOauthBindingForCurrentUser();

  result = oauthBinding.call(method,
    this._getUrl(url),
    params
  );

  return result;
};

Ravelry.prototype.getOauthBinding = function() {
  var config = Accounts.loginServiceConfiguration.findOne({
    service: 'ravelry'
  });
  var urls = Accounts.ravelry.urls;
  return new OAuth1Binding(config, urls);
};

Ravelry.prototype.getOauthBindingForCurrentUser = function() {
  var oauthBinding = this.getOauthBinding();

  var user = undefined;

  if (this._userId) {
    user = Meteor.users.findOne(this._userId);
  } else {
    try {
      user = Meteor.user();
    } catch (error) {
      console.log("Meteory.user() is unavailable, please set Ravelry.userId");
    }
  }

  oauthBinding.accessToken = user.services.ravelry.accessToken;
  oauthBinding.accessTokenSecret = user.services.ravelry.accessTokenSecret;

  return oauthBinding;
};

/**
 * Misc - current_user authenticated
 * returns the current user's profile
 **/
Ravelry.prototype.userProfile = function() {
  return this.get('current-user.json');
};

/**
 * Misc - /color_families
 *
 * Retrieve list of color families
 * color families
 **/
Ravelry.prototype.getColorFamilies = function() {
  return this.get('color_families.json');
}

/**
 * Misc - /current_user
 * authenticated
 *
 * Get current user
 **/
Ravelry.prototype.getCurrentUser = function() {
  return this.get('current_user.json');
}

/**
 * Misc - /yarn_weights
 *
 * Retrieve list of active yarn weights
 * active yarn weights
 **/
Ravelry.prototype.getYarnWeights = function() {
  return this.get('yarn_weights.json');
}

/**
 * app - app/config/set
 * authenticated
 *
 * Set Ravelry-specific application configuration
 * value pairs to set
 * of keys that were updated
 **/
Ravelry.prototype.postApp = function(data) {
  return this.post('app/config/set.json');
}

/**
 * app - app/config/get
 * authenticated
 *
 * Get Ravelry-specific application configuration
 * delimited list of keys to retrieve
 * of keys that were updated
 **/
Ravelry.prototype.getApp = function(data) {
  return this.get('app/config/get.json');
}

/**
 * app - app/config/delete
 * authenticated
 *
 * Delete a Ravelry-specific application configuration setting
 * delimited list of keys to delete
 * contents of keys that were deleted
 **/
Ravelry.prototype.postAppConfig = function(data) {
  return this.post('app/config/delete.json');
}

/**
 * app - app/data/set
 * authenticated
 *
 * Store user and application-specific data.
 * value pairs to set
 * of keys that were updated
 **/
Ravelry.prototype.postAppConfig = function(data) {
  return this.post('app/data/set.json');
}

/**
 * app - app/data/get
 * authenticated
 *
 * Get user and application specific data
 * delimited list of keys to retrieve
 * of keys that were updated
 **/
Ravelry.prototype.getAppData = function(data) {
  return this.get('app/data/get.json');
}

/**
 * app - app/data/delete
 * authenticated
 *
 * Delete a user and application specific piece of data (key/value)
 * delimited list of keys to delete
 * contents of keys that were deleted
 **/
Ravelry.prototype.postAppData = function(data) {
  return this.post('app/data/delete.json');
}

/**
 * carts - carts/create
 * authenticated
 *
 * Create a new cart. Used to integrate external pattern stores with the Ravelry library.
 * of store to associate with the cart. Contact Ravelry for your cart access and your store ID.
 * newly created cart
 **/
Ravelry.prototype.createCart = function(data) {
  return this.post('carts/create.json');
}

/**
 * carts - carts/add
 * authenticated
 *
 * Add a product to a cart. Used to integrate external pattern stores with the Ravelry library.
 * of the cart to update
 * of the product to add. Configurable in your Ravelry store as alphanumeric "Item number".
 * cart and its current contents
 **/
Ravelry.prototype.updateCart = function(id, data) {
  return this.post('carts/' + id + '/add.json');
}

/**
 * carts - carts/external_checkout
 * authenticated
 *
 * Notify Ravelry that a cart has been checked out (paid for) externally. This will
 * create an invoice, mark it as paid, and deliver the products to the customer.
 * of the cart to checkout text to associate with the Ravelry invoice/receipt.
 * Not visible to customer. Normally, you'd use your internal invoice number
 * generated invoice. You may want to store the ID for future reference.
 **/
Ravelry.prototype.saveExternalCart = function(id, data) {
  return this.post('carts/' + id + '/external_checkout.json');
}

/**
 * deliveries - deliveries/renew
 *
 * Renew an expired digital product delivery token/url.
 * ID email address supplied during the initial checkout
 * renewed delivery
 **/
Ravelry.prototype.renewDeliveries = function(id, data) {
  return this.post('deliveries/#' + id + '/renew.json');
}

/**
 * extras - extras/create_attachment
 * authenticated
 *
 * Convert an upload into an (image) attachment that can be referenced in fields that accept markdown or HTML
 * image to use, created via /upload/image.json
 * image URL that can be inserted into a forum post or other markdown document
 **/
Ravelry.prototype.createAttachment = function(data) {
  return this.post('extras/create_attachment.json');
}

/**
 * favorites - favorites/list
 * authenticated
 *
 * Get favorite list
 * to retrieve projects from
 * delimited list of types of favorites to retrieve. Accepted options: project, pattern, yarn, stash, forumpost, designer, yarnbrand, yarnshop. Defaults to all types.
 * query for full text search. Cannot be combined with "tag" parameter.
 * text search should search inside text of favorited items (notes, etc). Defaults to false.
 * query for tag search. Cannot be combined with "query" parameter.
 * page to retrieve. Defaults to 1 (the first page).
 * to 25. Maximum size accepted = 100
 * favorites
 * object with total results, pages
 **/
Ravelry.prototype.getFavorites = function(username, data) {
  return this.get('people/' + username + '/favorites/list.json');
}

/**
 * favorites - favorites/create
 * authenticated
 *
 * Create favorite record
 * who owns the favorite record
 * (favorite) JSON object
 * newly created record
 **/
Ravelry.prototype.createFavorite = function(username, data) {
  return this.post('people/' + username + '/favorites/create.json');
}

/**
 * favorites - favorites/update
 * authenticated
 *
 * Update a favorite record
 * who owns the favorite record
 * of the favorite record that should be updated
 * (favorite) JSON object
 * updated record
 **/
Ravelry.prototype.updateFavorite = function(username, id, data) {
  return this.post('people/' + username + '/favorites/' + id + '.json');
}

/**
 * favorites - favorites/delete
 * authenticated
 *
 * Delete a favorite record
 * who owns the favorite record
 * of the favorite record that should be deleted
 * deleted record
 **/
Ravelry.prototype.deleteFavorites = function(username, id) {
  return this.delete('people/' + username + '/favorites/' + id + '.json');
}

/**
 * fiber - fiber/show
 * authenticated
 *
 * Get fiber stash record
 * to retrieve stash from
 * to retrieve
 **/
Ravelry.prototype.getFiber = function(username, id) {
  return this.get('people/' + username + '/fiber/' + id + '.json');
}

/**
 * fiber - fiber/create
 * authenticated
 *
 * Create fiber stash record
 * to create fiber stash for
 * Stash JSON object
 * Stash
 **/
Ravelry.prototype.createFiber = function(username, data) {
  return this.post('people/' + username + '/fiber/create.json');
}

/**
 * fiber - fiber/update
 * authenticated
 *
 * Update an existing fiber stash record
 * who owns the fiber entry
 * of the fiber stash entry to update
 * Stash JSON object
 * Stash
 **/
Ravelry.prototype.updateFiber = function(username, id, data) {
  return this.post('people/' + username + '/fiber/' + id + '.json');
}

/**
 * fiber - fiber/create_photo
 * authenticated
 *
 * Add a photo to a stashed fiber (using an uploaded image or URL as a source)
 * of the user who owns the fiber stash entry
 * Stash ID
 * image to use, created via /upload/image.json
 * of the image to use (preferably high-res)
 * that can be used to check the status of the photo
 **/
Ravelry.prototype.createFiberPhoto = function(username, id, data) {
  return this.post('people/' + username + '/fiber/' + id + '/create_photo.json');
}

/**
 * forum_posts - forum_posts/show
 * authenticated
 *
 * Get single forum post
 * post to retrieve
 * post
 **/
Ravelry.prototype.getForumPost = function(forum_post_id) {
  return this.get('forum_posts/' + forum_post_id + '.json');
}

/**
 * forum_posts - forum_posts/update
 * authenticated
 *
 * Update a forum post
 * post to update
 * forum post body
 * forum post
 **/
Ravelry.prototype.updateForumPost = function(forum_post_id, data) {
  return this.post('forum_posts/' + forum_post_id + '.json');
}

/**
 * forum_posts - forum_posts/vote
 * authenticated
 *
 * Update your vote on one of the forum post voting buttons
 * post to vote on
 * vote. Accepted values are 0 and 1: 1 to set your vote, 0 to clear it
 * of vote to cast. Accepted options: interesting, educational, funny, agree, disagree, love
 * (grouped by by type) of all votes on this post
 * of the types that the current user has voted on
 **/
Ravelry.prototype.updateForumPostVote = function(forum_post_id, data) {
  return this.post('forum_posts/' + forum_post_id + '/vote.json');
}

/**
 * forum_posts - forum_posts/unread
 *
 * Get list of unread posts, across all forums
 * result parts to include. Space delimited. Accepted options: vote_totals, user_votes
 * page to retrieve. Defaults to first page.
 * size. Defaults to 25.
 * of posts
 * are returned if they are requested with the "include" parameter
 * are returned if they are requested with the "include" parameter
 * object with total results, pages, etc
 **/
Ravelry.prototype.getForumPostsUnread = function(data) {
  return this.get('forum_posts/unread.json');
}

/**
 * forums - forums/sets
 * authenticated
 *
 * Get forum sets for current user (or default set)
 * sets
 **/
Ravelry.prototype.getForums = function() {
  return this.get('forums/sets.json');
}

/**
 * forums - forums/topics
 * authenticated
 *
 * Get topic list for a specific forum, personalize for the authenticated user
 * to retrieve topics from
 * page to retrieve. Defaults to first page.
 * forum
 * of topics
 * object with total results, pages, etc
 **/
Ravelry.prototype.getForumTopics = function(forum_id, data) {
  return this.get('forums/' + forum_id + '/topics.json');
}

/**
 * friends - friends/list
 * authenticated
 *
 * Get friend list
 * to retrieve projects from
 * sets
 * friendships
 **/
Ravelry.prototype.getFriends = function(username) {
  return this.get('people/' + username + '/friends/list.json');
}

/**
 * friends - friends/activity
 * authenticated
 *
 * Retrieve recent friends' activity
 * will be selected from this user
 * page to retrieve. Defaults to 1 (the first page).
 * to 25. Maximum size accepted = 50
 * delimited list of activity types. Currently accepted types: added-project-photo, added-stash-photo, queued-pattern, added-favorite, added-handspun-photo
 * of activity records
 * object with total results, pages
 **/
Ravelry.prototype.getFriendsActivity = function(username, data) {
  return this.get('people/' + username + '/friends/activity.json');
}

/**
 * friends - friends/create
 * authenticated
 *
 * Add a friend
 * who owns the friendship record (ie. the currently logged in user)
 * ID of the user who should be added as a friend
 * newly created friendship record
 **/
Ravelry.prototype.createFriend = function(username, data) {
  return this.post('people/' + username + '/friends/create.json');
}

/**
 * friends - friends/destroy
 * authenticated
 *
 * Delete a friendship record
 * who owns the friendship record (ie. the currently logged in user)
 * of the friendship record that should be deleted(not the user ID)
 * deleted friendship record
 **/
Ravelry.prototype.deleteFriend = function(username, id) {
  return this.post('people/' + username + '/friends/' + id + '/destroy.json');
}

/**
 * in_store_sales - in_store_sales/create
 *
 * Create a new cart
 *
 *
 *
 *
 * newly created cart
 **/
Ravelry.prototype.createInStoreSales = function(data) {
  return this.post('in_store_sales/carts/create.json');
}

/**
 * in_store_sales - in_store_sales/show
 *
 * View a previously created cart
 *
 *
 * cart
 **/
Ravelry.prototype.getInStoreSales = function(id) {
  return this.get('in_store_sales/carts/' + id + '.json');
}

/**
 * in_store_sales - in_store_sales/add
 *
 * Add a product to a cart
 * ID
 * ID. An error will be returned if this product is not available for sale.
 * newly updated cart
 **/
Ravelry.prototype.updateInStoreSales = function(id, data) {
  return this.post('in_store_sales/carts/#' + id + '/add.json');
}

/**
 * in_store_sales - in_store_sales/add_by_pattern
 *
 * Add a product to a cart using a pattern ID of a related pattern.
 * ID
 * ID. An error will be returned if the pattern is not associated with a single product or if the product is not available for sale.
 * newly updated cart
 **/
Ravelry.prototype.createInStoreSalesByPattern = function(id, data) {
  return this.post('in_store_sales/carts/#' + id + '/add_by_pattern.json');
}

/**
 * in_store_sales - in_store_sales/checkout
 *
 * Checkout a cart. The wholesale price will be added to your monthly bill.
 * ID
 * to false (0) Set to 1 to prevent Ravelry from sending out a download receipt to the purchaser via email
 * completed sales records (including any digital deliveries)
 **/
Ravelry.prototype.saveInStoreSalesCheckout = function(id, data) {
  return this.post('in_store_sales/carts/#' + id + '/checkout.json');
}

/**
 * library - library/search
 * authenticated
 *
 * Search a library
 * to search
 * text search string
 * of source. Accepted options: book, magazine, booklet, pattern
 * order. Accepted options: title, added, published, author. Multiple space-delimited options are accepted.
 * page to retrieve. Defaults to 1 (the first page).
 * of results per page. Defaults to 100
 * object with total results, pages
 * volumes
 **/
Ravelry.prototype.getLibrary = function(username, data) {
  return this.get('people/' + username + '/library/search.json');
}

/**
 * messages - messages/show
 * authenticated
 *
 * Get message
 * ID to retrieve
 **/
Ravelry.prototype.getMessage = function(id) {
  return this.get('messages/' + id + '.json');
}

/**
 * messages - messages/mark_read
 * authenticated
 *
 * Mark a message as read
 * ID to mark
 **/
Ravelry.prototype.saveMessageRead = function(id) {
  return this.post('messages/' + id + '/mark_read.json');
}

/**
 * messages - messages/mark_unread
 * authenticated
 *
 * Mark a message as unread
 * ID to mark
 **/
Ravelry.prototype.saveMessageUnread = function(id) {
  return this.post('messages/' + id + '/mark_unread.json');
}

/**
 * messages - messages/create
 *
 * Create and send a private message to another Ravelry user
 * JSON object
 * newly created message
 **/
Ravelry.prototype.createMessage = function(data) {
  return this.post('messages/create.json');
}

/**
 * messages - messages/reply
 *
 * Reply to a private message to another Ravelry user, same as create but links the messages together as a conversat
 * of the message being replied to. Must be a message that has the current user listed as the recipient
 * JSON object
 * newly created message
 **/
Ravelry.prototype.createMessageReply = function(id, data) {
  return this.post('messages/' + id + '/reply.json');
}

/**
 * messages - messages/list
 * authenticated
 *
 * Get message list
 * to list - one of: inbox, sent, archived
 * page to retrieve. Defaults to first page.
 * of result pages. Defaults to 100.
 * term for fulltext searching messages
 * to 1 to only return unread messages
 * format. Defaults to list (Message#list) Accepted options: list, full
 *
 * object with total results, pages, etc
 **/
Ravelry.prototype.getMessages = function(data) {
  return this.get('messages/list.json');
}

/**
 * needles - needles/types
 * authenticated
 *
 * Get needle types
 * types
 **/
Ravelry.prototype.getNeedleTypes = function() {
  return this.get('needles/types.json');
}

/**
 * needles - needles/sizes
 * authenticated
 *
 * Get available sizes for each needle type
 * of tool to return. "crochet" for hooks only, "knitting" for knitting needles only. Default is empty (return both)
 * sizes
 **/
Ravelry.prototype.getNeedleSizes = function(data) {
  return this.get('needles/sizes.json');
}

/**
 * needles - needles/list
 * authenticated
 *
 * Get needle records
 * to retrieve needles for
 * records
 **/
Ravelry.prototype.getNeedles = function(username) {
  return this.get('people/' + username + '/needles/list.json');
}

/**
 * packs - packs/show
 * authenticated
 *
 * Get single pack
 * to retrieve
 **/
Ravelry.prototype.getPacks = function(pack_id) {
  return this.get('packs/' + pack_id + '.json');
}

/**
 * packs - packs/create
 * authenticated
 *
 * Create pack
 * JSON object
 **/
Ravelry.prototype.createPack = function(data) {
  return this.post('packs/create.json');
}

/**
 * packs - packs/update
 * authenticated
 *
 * Update a pack
 * to update
 * JSON object
 **/
Ravelry.prototype.savePack = function(pack_id, data) {
  return this.put('packs/' + pack_id + '.json');
}

/**
 * packs - packs/delete
 * authenticated
 *
 * Delete pack
 * to delete
 * that was deleted
 **/
Ravelry.prototype.deletePack = function(pack_id) {
  return this.delete('packs/' + pack_id + '.json');
}

/**
 * pages - pages/show
 * authenticated
 *
 * Get page
 * to retrieve
 **/
Ravelry.prototype.getPage = function(id) {
  return this.get('pages/' + id + '.json');
}

/**
 * pages - pages/update
 * authenticated
 *
 * Update page
 * to update
 * title
 * body
 * page
 **/
Ravelry.prototype.updatePage = function(id, data) {
  return this.post('pages/' + id + '.json');
}

/**
 * pattern_sources - pattern_sources/patterns
 * authenticated
 *
 * Get the set of patterns that a given source contains
 * of the pattern source
 * page to retrieve. Defaults to 1 (the first page).
 * to 50 results per page.
 * of patterns contained in this source
 * object with total results, pages, etc
 **/
Ravelry.prototype.getPatternSources = function(id, data) {
  return this.get('pattern_sources/' + id + '/patterns.json');
}

/**
 * pattern_sources - pattern_sources/search
 *
 * Search pattern source database
 * term for fulltext searching patterns
 * page to retrieve. Defaults to first page.
 * of results to retrieve. Defaults to 100.
 * pattern sources
 * object with total results, pages, etc
 **/
Ravelry.prototype.getPatternSourceSearch = function(data) {
  return this.get('pattern_sources/search.json');
}

/**
 * patterns - patterns/show
 *
 * Get pattern details
 * to retrieve
 **/
Ravelry.prototype.getPattern = function(id) {
  return this.get('patterns/' + id + '.json');
}

/**
 * patterns - patterns/projects
 *
 * Retrieve the list of projects that are linked to this pattern
 * of the pattern
 * a query to optionally full text search inside of linked projects
 * order. Accepted options are: favorites", and "completed". Default is "completed".
 * to "1" if want to return results that do not have a photo
 * page to retrieve. Defaults to 1 (the first page).
 * of results per page. Defaults to 100
 * of projects that are linked to the pattern
 * object with total results, pages
 **/
Ravelry.prototype.getPatternProjects = function(id, data) {
  return this.get('patterns/' + id + '/projects.json');
}

/**
 * patterns - patterns/search
 *
 * Search pattern database
 * term for fulltext searching patterns
 * page to retrieve. Defaults to first page.
 * of results to retrieve. Defaults to 100.
 * to 1 if you would like to return the personal_attributes hash in the result objects
 * patterns
 * object with total results, pages, etc
 **/
Ravelry.prototype.getPatternSearch = function(data) {
  return this.get('patterns/search.json');
}

/**
 * people - people/show
 * authenticated
 *
 * Get user profile
 * of user to lookup. Integer identifiers are also accepted.
 **/
Ravelry.prototype.getPeople = function(id) {
  return this.get('people/' + id + '.json');
}

/**
 * photos - photos/delete
 * authenticated
 *
 * Delete photo
 * to delete
 * that was deleted
 **/
Ravelry.prototype.deletePhoto = function(id) {
  return this.delete('photos/' + id + '.json');
}

/**
 * photos - photos/update
 * authenticated
 *
 * Update photo attributes
 * ID
 * offset for centered photo. See notes.
 * offset for centered photo. See notes.
 * line. See notes.
 *
 *
 * object, after updates have been applied
 **/
Ravelry.prototype.updatePhoto = function(id, data) {
  return this.post('photos/' + id + '.json');
}

/**
 * photos - photos/sizes
 * authenticated
 *
 * Get available photo sizes
 * to lookup
 *
 * sizes
 **/
Ravelry.prototype.getPhotoSizes = function(id) {
  return this.get('photos/' + id + '/sizes.json');
}

/**
 * photos - photos/status
 * authenticated
 *
 * Get the status of a photo creation that is in progress
 * token that you received when creating the photo
 *, if the process is complete
 * progress, from 1..100
 * if the photo creation has completed
 * if the photo creation was not possible (most common cause is an unsupported file type)
 **/
Ravelry.prototype.getPhotoStatus = function(data) {
  return this.get('photos/status.json');
}

/**
 * projects - projects/list
 * authenticated
 *
 * Get project list
 * to retrieve projects from
 * order. Accepted options: status, name, created, started, favorites, happiness. Multiple space-delimited options are accepted.
 * result parts to include. Accepted options: collections
 * page to retrieve. Defaults to 1 (the first page).
 * to null (the entire result set in 1 page)
 * sets
 * projects
 * object with total results, pages
 **/
Ravelry.prototype.getProjects = function(username, data) {
  return this.get('projects/' + username + '/list.json');
}

/**
 * projects - projects/show
 * authenticated
 *
 * Get project detail
 * to retrieve projects from
 * ID
 * result parts to include. Accepted options: comments
 **/
Ravelry.prototype.getProject = function(username, id, data) {
  return this.get('projects/' + username + '/' + id + '.json');
}

/**
 * projects - projects/create_photo
 * authenticated
 *
 * Add a photo to a project (using an uploaded image or URL as a source)
 * of the user who owns the project
 * ID
 * image to use, created via /upload/image.json
 * of the image to use (preferably high-res)
 * that can be used to check the status of the photo
 **/
Ravelry.prototype.createProjectPhoto = function(username, id, data) {
  return this.post('projects/' + username + '/' + id + '/create_photo.json');
}

/**
 * projects - projects/reorder_photos
 * authenticated
 *
 * Change order of associated photos
 * who owns the project
 * ID
 * of photo IDs, space delimited
 * of project photos with updated ordering
 **/
Ravelry.prototype.updateProjectPhotoOrder = function(username, id, data) {
  return this.post('projects/' + username + '/' + id + '/reorder_photos.json');
}

/**
 * projects - projects/create
 * authenticated
 *
 * Create project
 * to create a project for
 * JSON object
 **/
Ravelry.prototype.createProject = function(username, data) {
  return this.post('projects/' + username + '/create.json');
}

/**
 * projects - projects/update
 * authenticated
 *
 * Update project
 * to update a project for
 * ID
 * JSON object
 **/
Ravelry.prototype.updateProject = function(username, id, data) {
  return this.post('projects/' + username + '/' + id + '.json');
}

/**
 * projects - projects/crafts
 * authenticated
 *
 * Get list of crafts that are valid for use within projects
 * of crafts
 **/
Ravelry.prototype.getProjectsCrafts = function() {
  return this.post('projects/crafts.json');
}

/**
 * projects - projects/project_statuses
 * authenticated
 *
 * Get list of statuses that are valid for use within projects
 * of project statuses
 **/
Ravelry.prototype.getProjectsStatus = function() {
  return this.post('projects/project_statuses.json');
}

/**
 * projects - projects/search
 *
 * Search the project database
 * term for fulltext searching
 * page to retrieve. Defaults to first page.
 * to 50 results per page.
 * order. Options are: best, started, completed, favorites, helpful, updated, happiness
 * projects
 * object with total results, pages, etc
 **/
Ravelry.prototype.getProjectsSearch = function(data) {
  return this.get('projects/search.json');
}

/**
 * queue - queue/create
 * authenticated
 *
 * Create a queued project
 * who owns the queued project
 * project JSON object
 * newly created queued project
 **/
Ravelry.prototype.createQueueProject = function(username, data) {
  return this.post('people/' + username + '/queue/create.json');
}

/**
 * queue - queue/update
 * authenticated
 *
 * Update a queued projectn
 * who owns the queued project
 * project JSON object. Attributes that are not being changed can be omitted.
 * newly updated queued project
 **/
Ravelry.prototype.updateQueueProject = function(username, data) {
  return this.post('people/' + username + '/queue/' + id + '/update.json');
}

/**
 * queue - queue/reposition
 * authenticated
 *
 * Move a queued project to a new position
 * who owns the queued project
 * of the queued project
 * position for the queued project, range from 1 - (number of items in queue)
 * updated queued project
 **/
Ravelry.prototype.repositionQueueProjects = function(username, id, data) {
  return this.post('people/' + username + '/queue/' + id + '/reposition.json');
}

/**
 * queue - queue/order
 * authenticated
 *
 * Get queue ordering (list of all names, ids, and positions)
 * to retrieve queued projects from
 * queued projects
 **/
Ravelry.prototype.getQueueProjectOrder = function(username) {
  return this.get('people/' + username + '/queue/order.json');
}

/**
 * queue - queue/list
 * authenticated
 *
 * Get queued project list
 * to retrieve queued projects from
 * ID to filter for
 * text search query
 * page to retrieve. Defaults to 1 (the first page).
 * to 50 results per page.
 * queued projects
 * object with total results, pages, etc
 **/
Ravelry.prototype.getQueueProjects = function(username, data) {
  return this.get('people/' + username + '/queue/list.json');
}

/**
 * queue - queue/show
 * authenticated
 *
 * Get queued project detail
 * to retrieve queued project from
 * project ID
 * project
 **/
Ravelry.prototype.getQueueProject = function(username, id) {
  return this.get('people/' + username + '/queue/' + id + '.json');
}

/**
 * queue - queue/delete
 * authenticated
 *
 * Delete a queued project
 * project to delete
 * project that was deleted
 **/
Ravelry.prototype.deleteQueueProject = function(queued_project_id) {
  return this.delete('people/' + username + '/queue/{queued_project_id}.json');
}

/**
 * saved_searches - saved_searches/list
 *
 * Get list of saved searches for the current user
 **/
Ravelry.prototype.getSavedSearches = function() {
  return this.get('saved_searches/list.json');
}

/**
 * shops - shops/search
 *
 * Search yarn shop database
 * query for full text search
 * shop type, 1 = Local Yarn Store
 * for geographical search
 * for geographical search
 * for geographical search
 * for geo search, "miles" or "km"
 * page to retrieve. Defaults to 1 (the first page).
 * of results per page. Defaults to 100
 *
 *
 * object with total results, pages
 **/
Ravelry.prototype.getShops = function(data) {
  return this.get('shops/search.json');
}

/**
 * shops - shops/show
 *
 * Get shop details
 * to retrieve
 * result parts to include. Accepted options: brands, ad, schedules, photo
 *
 *
 * purchased at the store (verified => false and yarns array empty) and advertised by the store (verified => true and yarns array filled)
 **/
Ravelry.prototype.getShop = function(id, data) {
  return this.get('shops/' + id + '.json');
}

/**
 * stash - stash/search
 *
 * Search the project database
 * term for fulltext searching
 * page to retrieve. Defaults to first page.
 * to 50 results per page.
 * order. Options are: best, added, favorites
 * stashed yarns
 * object with total results, pages, etc
 **/
Ravelry.prototype.getStashSearch = function(data) {
  return this.get('stash/search.json');
}

/**
 * stash - stash/list
 * authenticated
 *
 * Get stash list
 * to retrieve stash from
 * paging is desired, result page to retrieve. Defaults to 1 (the first page).
 * paging is desired, number of results per page. Defaults to 50 results per page.
 * order. Should be one of: recent, alpha, weight, colorfamily, yards. Defaults to "alpha".
 * stash
 **/
Ravelry.prototype.getStashForUser = function(username, data) {
  return this.get('people/' + username + '/stash/list.json');
}

/**
 * stash - stash/unified/list
 * authenticated
 *
 * Get unified stash list that combines yarn stash with fiber stash
 * to retrieve stash from
 * paging is desired, result page to retrieve. Defaults to 1 (the first page).
 * paging is desired, number of results per page. Defaults to 50 results per page.
 * by should be one of: recent, alpha, weight, colorfamily, grams. Defaults to "alpha".
 * of unified stash records, either {stash: [Stash#list object]} or {fiber_stash: [FiberStash#list object]}
 **/
Ravelry.prototype.getUnifiedStashForUser = function(username, data) {
  return this.get('people/' + username + '/stash/unified/list.json');
}

/**
 * stash - stash/show
 * authenticated
 *
 * Get stash list
 * to retrieve stash from
 * to retrieve
 **/
Ravelry.prototype.getStashItem = function(username, id) {
  return this.get('people/' + username + '/stash/' + id + '.json');
}

/**
 * stash - stash/create
 * authenticated
 *
 * Create stash record
 * to create stash for
 * JSON object
 **/
Ravelry.prototype.createStashItem = function(username, data) {
  return this.post('people/' + username + '/stash/create.json');
}

/**
 * stash - stash/update
 * authenticated
 *
 * Update a stash record
 * who owns stash
 * record to update
 * JSON object
 **/
Ravelry.prototype.updateStashItem = function(username, id, data) {
  return this.post('people/' + username + '/stash/' + id + '.json');
}

/**
 * stash - stash/create_photo
 * authenticated
 *
 * Add a photo to a stashed yarn (using an uploaded image or URL as a source)
 * of the user who owns the stash entry
 * ID
 * image to use, created via /upload/image.json
 * of the image to use (preferably high-res)
 * that can be used to check the status of the photo
 **/
Ravelry.prototype.createStashPhoto = function(username, id, data) {
  return this.post('people/' + username + '/stash/' + id + '/create_photo.json');
}

/**
 * stash - stash/reorder_photos
 * authenticated
 *
 * Change order of associated photos
 * who owns the stash entry
 * ID
 * of photo IDs, space delimited
 * of project photos with updated ordering
 **/
Ravelry.prototype.reorderStashPhotos = function(username, id, data) {
  return this.post('people/' + username + '/stash/' + id + '/reorder_photos.json');
}

/**
 * stores - stores/list
 *
 * List the current user's pattern stores
 * of pattern stores that the current user administers
 **/
Ravelry.prototype.getStores = function() {
  return this.get('stores/list.json');
}

/**
 * stores - stores/products
 *
 * List the products in a user's stores
 * store to query
 * of active products in the selected store
 **/
Ravelry.prototype.getStoreProducts = function(data) {
  return this.get('stores/#' + store_id + '/list.json');
}

/**
 * topics - topics/show
 * authenticated
 *
 * Get topic information
 * to retrieve
 **/
Ravelry.prototype.getTopic = function(topic_id) {
  return this.get('topics/' + topic_id + '.json');
}

/**
 * topics - topics/posts
 * authenticated
 *
 * Get post list for a specific forum, personalize for the authenticated user
 * to retrieve posts from
 * page to retrieve. Defaults to first page.
 * size. Defaults to 25.
 * sort is oldest posts first. Set to 1 to reverse sort order.
 * result parts to include. Space delimited. Accepted options: vote_totals, user_votes
 * of posts
 * object with total results, pages, etc
 * are returned if they are requested with the "include" parameter
 * are returned if they are requested with the "include" parameter
 **/
Ravelry.prototype.getTopicPosts = function(topic_id, data) {
  return this.get('topics/' + topic_id + '/posts.json');
}

/**
 * topics - topics/read
 * authenticated
 *
 * Update read/unread marker for a specific topic
 * to update
 * read post number
 * = Force setting last read, even if has decreased
 * status - last read/latest reply/etc
 **/
Ravelry.prototype.postTopicRead = function(topic_id, data) {
  return this.post('topics/' + topic_id + '/read.json');
}

/**
 * topics - topics/create
 *
 * Create a new topic
 * that should contain the created topic
 * of this topic. 250 character limit.
 * of tags, space delimited
 * for the (first) forum post that will kick off this topic
 * of this topic. Can only be set by a moderator.
 * status, show at top of board. Defaults to false. Can only be set by a moderator.
 * status, new posts can not be added. Defaults to false. Can only be set by a moderator.
 *. Post appears in "archive" section of forum. Can only be set by a moderator.
 * created topic
 * created forum post, the first post in the topic
 **/
Ravelry.prototype.createTopic = function(forum_id, data) {
  return this.post('topics/create.json');
}

/**
 * topics - topics/update
 *
 * Update a topic
 * to update
 * of this topic. 250 character limit.
 * of tags, space delimited
 * of this topic. Can only be set by a moderator.
 * status, show at top of board. Defaults to false. Can only be set by a moderator.
 * status, new posts can not be added. Defaults to false. Can only be set by a moderator.
 *. Post appears in "archive" section of forum. Can only be set by a moderator.
 * updated topic
 **/
Ravelry.prototype.updateTopics = function(id, data) {
  return this.post('topics/' + id + '.json');
}

/**
 * topics - topics/reply
 *
 * Post a reply to a topic
 * to reply to
 * post content
 * replying to a specific post, ID of post being replied to
 * created forum post
 **/
Ravelry.prototype.createTopicsReply = function(topic_id, data) {
  return this.post('topics/' + topic_id + '/reply.json');
}

/**
 * upload - upload/request_token
 *
 * Generate an upload token
 **/
Ravelry.prototype.createUploadRequestToken = function() {
  return this.post('upload/request_token.json');
}

/**
 * upload - upload/status
 *
 * Get uploaded image IDs
 * token received from upload/request_token
 * with result for each uploaded file. See notes.
 **/
Ravelry.prototype.getUploadStatus = function(data) {
  return this.get('upload/image/status.json');
}

/**
 * upload - upload/image
 *
 * Upload an image file for later processing or attaching
 * token received from upload/request_token
 * access key
 * data
 * data, second file
 * data, third file...
 * data, tenth file
 * with result for each uploaded file. See notes.
 **/
Ravelry.prototype.createUpload = function(data) {
  return this.post('upload/image.json');
}

/**
 * volumes - volumes/show
 * authenticated
 *
 * Get volume details
 * ID to retrieve
 * object
 **/
Ravelry.prototype.getVolume = function(id) {
  return this.get('volumes/' + id + '.json');
}

/**
 * yarns - yarns/search
 *
 * Search yarn database
 * term for fulltext searching yarns
 * page to retrieve. Defaults to first page.
 * to 50 results per page.
 * order. Options are: best, rating, projects
 * yarns
 * object with total results, pages, etc
 **/
Ravelry.prototype.getYarns = function(data) {
  return this.get('yarns/search.json');
}

/**
 * yarns - yarns/show
 *
 * Get yarn details
 * to retrieve
 **/
Ravelry.prototype.getYarn = function(id) {
  return this.get('yarns/' + id + '.json');
}