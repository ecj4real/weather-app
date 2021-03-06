var CACHE_STATIC_NAME = 'static-v8';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function(cache){
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    'https://fonts.googleapis.com/css2?family=Kufam&display=swap',
                    '/src/css/app.css'
                ]);
            })
    );
});

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys()
            .then(function(keys){
                return Promise.all(keys.map(function(key){
                    if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME){
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event){
    var url = "openweathermap.org/img";
    let openWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    if(event.request.url.indexOf(openWeatherUrl) > -1){
        event.respondWith(fetch(event.request)
            .then(function(res){
                return res;
            })   
        );
    }
    else if(event.request.url.indexOf(url) > -1){
        event.respondWith(
            caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache){
                    return fetch(event.request)
                        .then(function(res){
                            cache.put(event.request, res.clone());
                            return res;
                        })
                })
        );
    }
    else{
        event.respondWith(
            caches.match(event.request)
                .then(function(response){
                    if(response){
                        return response;
                    }
                    else{
                        return fetch(event.request)
                            .then(function(res){
                                caches.open(CACHE_DYNAMIC_NAME)
                                    .then(function(cache){
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    });
                            })
                            .catch(function(err){
                                
                            });
                    }
                })
        );
    }
});