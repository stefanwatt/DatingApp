import { v4 as uuidv4 } from "uuid";
import { writable } from "svelte/store";
import Peer from "peerjs";

const uuid = uuidv4()
export const searchingForMatch = writable(false)
export const myPeerId = writable(uuid)
export const peer = writable<Peer>()
export const connectedToPeer = writable(false)
