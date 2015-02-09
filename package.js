Package.describe({
  summary: "Ravelry API wrapper using OAuth1Binding of Meteor Ravelry Service",
  name: "amschrader:ravelry-api",
  version: "0.1.0",
  git: "https://github.com/amschrader/meteor-ravelry-api.git"
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('amschrader:ravelry');
  api.addFiles('ravelry-tests.js');
});

Package.onUse(function (api, where) {
  api.use('oauth1@1.1.2', ['client', 'server']);
  api.add_files(['ravelry.js'], 'server');
  
  api.export && api.export('Ravelry', 'server');
});
