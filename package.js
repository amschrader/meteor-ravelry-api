Package.describe({
  summary: "Ravelry API wrapper using OAuth1Binding of Meteor Ravelry Service",
  name: "amschrader:ravelry-api",
  version: "0.1.3",
  git: "https://github.com/amschrader/meteor-ravelry-api.git"
});

Package.onUse(function (api, where) {
  api.use('oauth1@1.1.2', ['client', 'server']);
  api.add_files(['ravelry.js'], 'server');
  
  api.export && api.export('Ravelry', 'server');
});
