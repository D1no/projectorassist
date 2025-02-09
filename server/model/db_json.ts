import type { DataModel } from "./model.ts";
import {
  currentModelSchemaVersion,
  setChangesPending,
  store as DB,
  storeChanged,
} from "./store.ts";

// The file path for our JSON store.
const DB_JSON_PATH = "./db.json";
/**
 * The interval in milliseconds at which the store is saved
 * to disk if changes are existing.
 */
const DB_CHECK_INTERVAL = 3000;

/**
 * Loads the store from DB_JSON_PATH if it exists.
 * If the file exists, the schemaVersion is compared to the currentModelSchemaVersion.
 * If they do not match, a warning is printed and the process exits.
 */
async function loadDB() {
  try {
    // Check if the file exists.
    await Deno.stat(DB_JSON_PATH);
    // If it exists, read the file.
    const text = await Deno.readTextFile(DB_JSON_PATH);
    const loaded: DataModel = JSON.parse(text);

    // Compare the schema versions.
    if (loaded.schemaVersion !== currentModelSchemaVersion) {
      console.error(
        `🚨🚨🚨 SERVER EXIT 🚨🚨🚨\nServer exiting due to Schema version mismatch. Expected ${currentModelSchemaVersion}, got ${loaded.schemaVersion}`,
      );
      throw new Error(`🛑 Incompatible Schema Version in ${DB_JSON_PATH}`);
    }

    // If they match, update our store with the loaded data.
    Object.assign(DB, loaded);
    console.log("Store loaded successfully from", DB_JSON_PATH);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.log("No store file found. Using default store.");
    } else {
      console.error("Error loading store:", error);
      Deno.exit(1);
    }
  }
}

/**
 * Saves the current store to DB_JSON_PATH.
 */
async function saveStore() {
  try {
    const json = JSON.stringify(DB, null, 2);
    await Deno.writeTextFile(DB_JSON_PATH, json);
    console.log("Store saved successfully to", DB_JSON_PATH);
    // Reset the dirty flag after saving.
    setChangesPending(false);
  } catch (error) {
    console.error("Error saving store:", error);
  }
}

// Every 3 seconds, if the store has been marked as dirty, save it.
setInterval(() => {
  if (storeChanged) {
    saveStore();
  }
}, DB_CHECK_INTERVAL);

// Export the store and helper functions so that other parts of your application can read/update it.
export { DB, loadDB, setChangesPending };
