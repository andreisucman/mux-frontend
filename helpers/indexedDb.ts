import { del, get, keys, set } from "idb-keyval";

function getCurrentTimestamp() {
  return new Date().getTime();
}

function isOlderThan7Days(timestamp: number) {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  return getCurrentTimestamp() - timestamp > sevenDaysInMs;
}

export async function getFromIndexedDb(key: string) {
  try {
    if (!key) return;
    const record = await get(`MUX-${key}`);
    if (record) {
      return record.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log("Error while getting from indexedDb");
  }
}

export async function getAllFromIndexedDb() {
  try {
    const allKeys = await keys();
    const allRecords = [];

    for (const key of allKeys) {
      if (`${key}`.includes("MUX")) {
        const record = await get(key);
        if (record) {
          const { data, timestamp } = record;

          if (isOlderThan7Days(timestamp)) {
            await del(key);
          } else {
            allRecords.push(record);
          }
        }
      }
    }

    return allRecords;
  } catch (err) {
    console.log("Error while getting from indexedDb");
  }
}

export async function deleteAllFromIndexedDb() {
  try {
    const allKeys = await keys();

    for (const key of allKeys) {
      if (key) await del(`MUX-${key}`);
    }
    return true;
  } catch (err) {
    console.log("Error while deleting from indexedDb");
  }
}

export async function deleteFromIndexedDb(key: string) {
  try {
    if (key) {
      await del(`MUX-${key}`);
    }
  } catch (err) {
    console.log("Error while deleting individual key from indexedDb");
  }
}

export async function saveToIndexedDb(key: string, data: any) {
  if (!key) return;

  try {
    const timestamp = getCurrentTimestamp();
    const record = {
      data,
      timestamp,
    };

    await set(`MUX-${key}`, record);

    await flushOldContent();

    return data;
  } catch (error) {
    console.error("Error saving data to indexedDb: ", error);
  }
}

async function flushOldContent() {
  try {
    const allKeys = await keys();

    for (const key of allKeys) {
      if (`${key}`.includes("MUX")) {
        const record = await get(key);
        if (record && isOlderThan7Days(record.timestamp)) {
          await del(key);
        }
      }
    }
  } catch (err) {
    console.log("Error while flushing old content from indexedDb");
  }
}
