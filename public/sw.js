var CACHE_STATIC_NAME = 'static';
var CACHE_DYNAMIC_NAME = 'dynamic';

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
            .then(function(keyList){
                return Promise.all(keyList.map(function(keyletter){
                    if(keyletter !== CACHE_STATIC_NAME && keyletter !== CACHE_DYNAMIC_NAME){
                        console.log('[Service Worker] Removing old cache. ', keyletter);
                        return caches.delete(keyletter);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event){
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
});