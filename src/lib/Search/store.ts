import { v4 as uuidv4 } from "uuid";
import { writable } from "svelte/store";

export const searchingForMatch = writable(false)
export const myPeerId = writable(uuidv4())
export const connectedToPeer = writable(false)
