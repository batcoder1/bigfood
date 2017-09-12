module.exports = {
  staticFileGlobs: [
    'dist/**.html',
    'dist/**.js',
    'dist/**.css',
    'dist/assets/**.png',
    'dist/vendor.**.bundle.js'
  ],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallback: '/index.html',
  runtimeCaching: [{
    origin: /fonts\.gstatic\.com/,
      urlPattern: /(.*)$/,
      handler: 'fastest',
   
    },
    {
    
      urlPattern: /^(https\:)(\/\/)([^\:\/]*)(\:\d{1,5})?(\/)([^\/\?\&\#\:]*)?\/?([^\/\?\&\#\:]*)?\/?([^\/\?\&\#\:]*)?\/?([^\/\?\&\#\:]*)?\/?([^\/\?\&\#\:]*)?\/?([^\/\?\&\#\:]*)?\/?([^\/\?\&\#\:]*)?\/?([^\/\?\&\#\:]*)?\/?(.*)$/,
      handler: 'fastest',
   
    }
    
    
  ]
};
