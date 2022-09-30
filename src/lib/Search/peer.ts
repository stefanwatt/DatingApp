import { get } from "svelte/store";
import { myPeerId as _myPeerId } from "./store";
import Peer from "peerjs";
import { searchingForMatch, connectedToPeer } from "./store";
import { supabase } from "../../supabaseClient";
import { authSession } from "../../store";

const peer = new Peer(get(_myPeerId), {});

interface MatchOffer{
  id: string;
  created_at: Date;
  offered_by: string;
  offered_to: string;

}
const deleteMatchOffer = async (id:string)=>{
  await supabase
    .from("match_offer")
    .delete()
    .eq("id", id);
}

export const connect = async (matchOffer:MatchOffer) => {
  const myPeerId = get(_myPeerId)
  const partnerPeerId = matchOffer.offered_by === myPeerId ? matchOffer.offered_to : matchOffer.offered_by
  const conn = peer.connect(partnerPeerId);

  conn.on("open", function () {
    conn.send("hi!");
    searchingForMatch.set(false)
    connectedToPeer.set(true)
  });

  peer.on("connection", async function (conn) {
    await deleteMatchOffer(matchOffer.id)
    conn.on("data", function (data) {
      console.log(data);
    });
  });

};
