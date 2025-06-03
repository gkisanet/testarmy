// 버전 관리 및 캐시 이름 설정 (업데이트 시 버전 변경)
const cacheName = 'cache-v1';
// 캐싱할 파일 목록: HTML, CSS, JS, 이미지 등 모든 정적 자원
const assetsToCache = [
  './index.html',
  './claude2.html',
  './manifest.json',
  './jung.jpg',
  './water_mark.jpg',
];

// 설치 이벤트: 캐시를 미리 저장
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// 활성화 이벤트: 이전 캐시 정리 등
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// fetch 이벤트: 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 캐시된 응답을 반환
      if (response) {
        return response;
      }
      // 캐시에 없으면 네트워크 요청
      return fetch(event.request).then((response) => {
        // 유효한 응답이 아니면 그대로 반환
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // 응답을 복제하여 캐시에 저장
        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
