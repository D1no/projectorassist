import { makeObjectValueChangesDeepObservable } from "#lib/makeObjectValueChangesDeepObservable.ts";
import {
  ProjectionBackgroundColor,
  ProjectionOrientation,
} from "#types/projectionTypes.ts";
import type { DataModel, ModelSchemaVersion } from "./model.ts";

export const currentModelSchemaVersion: ModelSchemaVersion = "0.1.0";

// Default store values.
export let store: DataModel = {
  schemaVersion: currentModelSchemaVersion,
  projection: {
    orientation: ProjectionOrientation.Portrait,
    backgroundColor: ProjectionBackgroundColor.Invisible,
  },
  corners: {
    topLeft: { x: 30, y: 5 },
    topRight: { x: 90, y: 5 },
    bottomRight: { x: 90, y: 95 },
    bottomLeft: { x: 30, y: 95 },
  },
};

// A flag to indicate that the store has changed.
export let storeChanged = false;

// Wrap the store in a deep observable Proxy so that any nested changes mark it as dirty.
store = makeObjectValueChangesDeepObservable(store, () => {
  storeChanged = true;
});

// Helper function to mark the store as dirty.
export function setChangesPending(isDirty: boolean = false) {
  storeChanged = isDirty;
}
