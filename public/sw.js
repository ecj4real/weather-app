var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event){
    console.log("[Service Worker] Installing Service Worker ...", event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function(cache){
                console.log("[Service Worker] Precaching App Shell");
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/promise.js',
                    '/src/js/fetch.js',
                    'https://fonts.googleapis.com/css2?family=Kufam&display=swap',
                    '/src/css/app.css'
                ]);
            })
    );
});

self.addEventListener('activate', function(event){
    console.log("[Service Worker] Activating Service Worker ...", event);
    event.waitUntil(
        caches.keys()
            .then(function(keys){
                return Promise.all(keys.map(function(key){
                    if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME){
                        console.log('[Service Worker] Removing old cache. ', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event){
    var url = "openweathermap.org";
    if(event.request.url.indexOf(url) > -1){
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
                                return caches.open(CACHE_STATIC_NAME)
                                    .then(function(cache){
                                        return cache.match('/offline.html');
                                    });
                            });
                    }
                })
        );
    }
});