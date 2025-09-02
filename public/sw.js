/**
 * InnoSpot Service Worker
 * Handles caching strategies, offline functionality, and push notifications
 */

const CACHE_NAME = 'innospot-cache-v1';
const RUNTIME_CACHE = 'innospot-runtime-v1';
const DATA_CACHE = 'innospot-data-v1';

// Critical resources to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json',
];

// API endpoints and external resources cache patterns
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.openrouter\.ai\/.*/,
  /^https:\/\/.*\.supabase\.co\/.*/,
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Precaching critical resources');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Force the new service worker to take control immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== DATA_CACHE
            )
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { method, url } = request;
  
  // Only handle GET requests
  if (method !== 'GET') return;

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page for navigation requests
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Handle API requests
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url))) {
    event.respondWith(
      // Network first, then cache strategy for API calls
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DATA_CACHE)
              .then((cache) => {
                // Cache with expiration (1 hour for API responses)
                cache.put(request, responseClone);
                setTimeout(() => {
                  cache.delete(request);
                }, 60 * 60 * 1000); // 1 hour
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets (CSS, JS, images)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      // Cache first, then network strategy for static assets
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-patent-search') {
    event.waitUntil(performBackgroundSearch());
  } else if (event.tag === 'background-data-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'InnoSpot Notification',
    body: 'You have new patent intelligence updates',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'innospot-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-action.png'
      }
    ]
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  
  event.notification.close();

  // Handle notification actions
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(`/?notification=${event.notification.tag}`)
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification (already done above)
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Background functions
async function performBackgroundSearch() {
  try {
    // Implement background patent search logic
    console.log('Performing background patent search...');
    // This would typically sync with your patent database
    return Promise.resolve();
  } catch (error) {
    console.error('Background search failed:', error);
    return Promise.reject(error);
  }
}

async function syncOfflineData() {
  try {
    // Implement offline data synchronization
    console.log('Syncing offline data...');
    
    // Get offline data from IndexedDB or localStorage
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // Send offline data to server
      const response = await fetch('/api/sync-offline-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offlineData)
      });
      
      if (response.ok) {
        // Clear synced offline data
        await clearOfflineData();
        console.log('Offline data synced successfully');
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Data sync failed:', error);
    return Promise.reject(error);
  }
}

async function getOfflineData() {
  // This would typically use IndexedDB to retrieve offline data
  return [];
}

async function clearOfflineData() {
  // This would typically clear IndexedDB offline data
  return Promise.resolve();
}

// Utility functions for cache management
async function cleanupExpiredCache() {
  const cache = await caches.open(DATA_CACHE);
  const requests = await cache.keys();
  
  const now = Date.now();
  const expiredRequests = requests.filter(request => {
    // Check if cache entry is expired (implement your logic here)
    return false; // Placeholder
  });
  
  await Promise.all(
    expiredRequests.map(request => cache.delete(request))
  );
}

// Periodic cache cleanup
setInterval(cleanupExpiredCache, 24 * 60 * 60 * 1000); // Once per day