/* Home Workout — offline cache (app shell + exercise videos) */
var CACHE = "home-workout-v1";
var ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "videos/bench-press.mp4",
  "videos/bicycle-crunch.mp4",
  "videos/burpee.mp4",
  "videos/calf-raises.mp4",
  "videos/chair-dips.mp4",
  "videos/crunch.mp4",
  "videos/diamond-push-up.mp4",
  "videos/glute-bridge.mp4",
  "videos/high-knees.mp4",
  "videos/jumping-jack.mp4",
  "videos/jumping-squats.mp4",
  "videos/leg-raise.mp4",
  "videos/lunge.mp4",
  "videos/mountain-climber.mp4",
  "videos/pike-push-up.mp4",
  "videos/plank.mp4",
  "videos/push-up.mp4",
  "videos/reverse-crunch.mp4",
  "videos/russian-twist.mp4",
  "videos/side-plank.mp4",
  "videos/squat.mp4",
  "videos/step-ups.mp4",
  "videos/superman.mp4",
  "videos/wall-sit.mp4",
  "videos/wide-push-up.mp4"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        if (e.request.mode === "navigate") return caches.match("index.html");
        return Response.error();
      });
    })
  );
});
