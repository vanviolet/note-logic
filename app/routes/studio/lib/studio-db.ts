import type { StudioProjectSnapshot } from "./studio-types";

const STUDIO_DB = "music-theory-studio";
const STUDIO_STORE = "projects";

function openStudioDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(STUDIO_DB, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STUDIO_STORE)) {
        db.createObjectStore(STUDIO_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB error"));
  });
}

export async function getAllStudioProjects() {
  const db = await openStudioDb();

  return new Promise<StudioProjectSnapshot[]>((resolve, reject) => {
    const tx = db.transaction(STUDIO_STORE, "readonly");
    const store = tx.objectStore(STUDIO_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const rows = (request.result as StudioProjectSnapshot[]) ?? [];
      resolve(rows.sort((a, b) => b.updatedAt - a.updatedAt));
    };
    request.onerror = () =>
      reject(request.error ?? new Error("Failed reading projects"));
    tx.oncomplete = () => db.close();
  });
}

export async function saveStudioProject(project: StudioProjectSnapshot) {
  const db = await openStudioDb();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STUDIO_STORE, "readwrite");
    const store = tx.objectStore(STUDIO_STORE);
    const request = store.put(project);

    request.onsuccess = () => resolve();
    request.onerror = () =>
      reject(request.error ?? new Error("Failed saving project"));
    tx.oncomplete = () => db.close();
  });
}
