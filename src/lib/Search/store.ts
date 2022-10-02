import { writable } from "svelte/store";
import Peer from "peerjs";

export const searchingForMatch = writable(false)
export const myPeerId = writable<string>()
export const connectedTo = writable<string>()
export const peer = writable<Peer>()
export const connectedToPeer = writable(false)
