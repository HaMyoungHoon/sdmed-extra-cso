import * as FAmhohwa from "./f-amhohwa";
import * as FConstants from "./f-constants";
import * as FExtensions from "./f-extensions";

export async function getImage(url: string): Promise<Blob | undefined> {
  const openCache = await caches.open(FConstants.CACHES_IMAGE_CACHE);
  const buff = await openCache.match(url);
  return buff?.blob();
}
export async function putImage(url: string, blob: Blob, timeStampDay: number = 3): Promise<void> {
  const openCache = await caches.open(FConstants.CACHES_IMAGE_CACHE);
  const headers = new Headers();
  headers.append(FConstants.HEADERS_CACHE_TIMESTAMP, FExtensions.plusDays(new Date(), timeStampDay).getTime().toString());
  await openCache.put(url, new Response(blob, { headers }));
}
export async function deleteImage(url: string): Promise<void> {
  const openCache = await caches.open(FConstants.CACHES_IMAGE_CACHE);
  const buff = await openCache.match(url);
  if (buff) {
    await openCache.delete(url);
  }
}
export async function clearExpiredImage(): Promise<void> {
  if (!ableImageClear()) {
    return;
  }

  const openCache = await caches.open(FConstants.CACHES_IMAGE_CACHE);
  const keys = await openCache.keys();
  const now = new Date().getTime();
  const buff = keys.map(async(key) => {
    const res = await openCache.match(key);
    if (res == undefined) {
      return openCache.delete(key);
    }
    const cacheTime = res.headers.get(FConstants.HEADERS_CACHE_TIMESTAMP);
    if (cacheTime == null) {
      return openCache.delete(key);
    }
    if (now - parseInt(cacheTime) > 0) {
      return openCache.delete(key);
    }

    return null;
  });

  await Promise.all(buff);
}
export function ableImageClear(cycleHour: number = 8): boolean {
  const previousTime = FAmhohwa.getLocalStorage(FConstants.STORAGE_IMAGE_CACHE_CLEAR_TIME);
  if (previousTime.length <= 0) {
    FAmhohwa.setLocalStorage(FConstants.STORAGE_IMAGE_CACHE_CLEAR_TIME, new Date().getTime().toString());
    return true;
  }

  if (FExtensions.plusHours(new Date(), -cycleHour).getTime() - parseInt(previousTime) > 0) {
    FAmhohwa.setLocalStorage(FConstants.STORAGE_IMAGE_CACHE_CLEAR_TIME, new Date().getTime().toString());
    return true;
  }

  return false;
}
