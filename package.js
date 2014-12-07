Package.describe({
  summary: "Ravelry API wrapper using OAuth1Binding of Meteor Ravelry Service",
  name: "amschrader:ravelry-api",
  version: "0.1.0",
  git: "git@github.com:amschrader/meteor-ravelry-api.git"
});

Package.on_use(function (api, where) {
  api.use('oauth1', ['client', 'server']);
  api.add_files(['ravelry.js'], 'server');
  
  api.export && api.export('Ravelry', 'server');
});

Package.on_test(function (api) {
});