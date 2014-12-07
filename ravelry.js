Ravelry = function(options) {
  this._url = "https://api.ravelry.com";
  this._version = "1";
  if (options) _.extend(this, options);
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
  var config = Accounts.loginServiceConfiguration.findOne({service: 'ravelry'});
  var urls = Accounts.ravelry.urls;
  return new OAuth1Binding(config, urls);
};

Ravelry.prototype.getOauthBindingForCurrentUser = function() {
  var oauthBinding = this.getOauthBinding();

  var user = Meteor.user();
  oauthBinding.accessToken = user.services.ravelry.accessToken;
  oauthBinding.accessTokenSecret = user.services.ravelry.accessTokenSecret;

  return oauthBinding;
};

/**
* Misc - current_user authenticated
* returns the current user's profile
*/
Ravelry.prototype.userProfile = function() {
  return this.get('current-user.json');
};

/**
* Misc - color_families
* returns a list of colors
*/
Ravelry.prototype.colorFamilies = function() {
  return this.get('color_families.json');
};

/**
* Misc - yarn_wieght
* returns a list of yarn wieghts
*/
Ravelry.prototype.yarnWeights = function() {
  return this.get('yarn_weights.json');
};

/**
* Misc - create attatchment
**/
Ravelry.prototype.createAttachment = function() {
  return this.get('/extras/create_attachment.json');
};



/**
* App - config
* Ravelry allows you to store config key/values
*/
Ravelry.prototype.setConfig = function(key, value) {
  return this.post('/app/config/set.json', {key: value});
};

Ravelry.prototype.getConfig = function(key) {
  return this.get('/app/config/get.json', {keys: key});
};

Ravelry.prototype.deleteConfig = function(key) {
  return this.post('/app/config/delete.json', {keys: key});
};

/**
* App - data
* Ravelry allows you to store data key/values
*/
Ravelry.prototype.setData = function(key, value) {
  return this.post('/app/data/set.json');
};

Ravelry.prototype.getData = function(key) {
  return this.get('/app/data/get.json');
};

Ravelry.prototype.deleteData = function(key) {
  return this.post('/app/data/delete.json');
};

/**
* Favorites 
* Ravelry allows you to favorite a number of object types
* project, pattern, yarn, stash, forumpost, designer, yarnbrand, yarnshop
* http://www.ravelry.com/api#favorites_list
*/
Ravelry.prototype.getFavorites = function(username) {
  return this.get('/people/' + username + '/favorites/list.json');
};

Ravelry.prototype.createFavorite = function(username, data) {
  return this.post('/people/' + username + '/favorites/create.json');
};

Ravelry.prototype.updateFavorite = function(username, data) {
  return this.post('/people/' + username + '/favorites/update.json');
};

Ravelry.prototype.deleteFavorite = function(username, data) {
  return this.post('/people/' + username + '/favorites/delete.json');
};

/**
* Projects 
* http://www.ravelry.com/api#projects_list
*/
Ravelry.prototype.getProjects = function(username) {
  return this.get('projects/' + username + '/list.json');
};

Ravelry.prototype.getProject = function(username, projectId) {
  return this.get('projects/' + username + '/' + projectId + '.json');
};
