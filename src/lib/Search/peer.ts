import { get } from "svelte/store";
import { myPeerId } from "./store";
import Peer from "peerjs";
import { searchingForMatch, connectedToPeer } from "./store.ts";

const peer = new Peer(get(myPeerId), {});

export const connect = (partnerPeerId:string) => {
  if (!partnerPeerId) return;
  const conn = peer.connect(partnerPeerId);
  conn.on("open", function () {
    conn.send("hi!");
    searchingForMatch.set(false)
    connectedToPeer.set(true)
  });
  peer.on("connection", function (conn) {
    console.log(conn);
    conn.on("data", function (data) {
      console.log(data);
    });
  });
};
