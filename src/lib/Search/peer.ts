import { get } from "svelte/store";
import { connectedTo, myPeerId as _myPeerId } from "./store";
import { searchingForMatch, connectedToPeer, peer as _peer } from "./store";
import { supabase } from "../../supabaseClient";
import { authSession } from "../../store";


interface MatchOffer {
  id: string;
  created_at: Date;
  offered_by: string;
  offered_to: string;

}
const deleteMatchOffer = async (id: string) => {
  await supabase
    .from("match_offer")
    .delete()
    .eq("id", id);
}
const attachRemoteStreamToAudioElement = (remoteStream) => {
  const audio: HTMLAudioElement = document.getElementById("audioStream") as HTMLAudioElement
  audio.autoplay = true
  audio.srcObject = remoteStream
}
const listenForCalls = () => {
  const peer = get(_peer)
  peer.on('call', function(call) {
    if (navigator.mediaDevices) {
      navigator.mediaDevices?.getUserMedia({ video: false, audio: true })
        .then(function onSuccess(stream) {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', function(remoteStream) {
            attachRemoteStreamToAudioElement(remoteStream)
          });
        })
        .catch(function onError() {
          alert('There has been a problem retrieving the streams - are you running on file:/// or did you disallow access?');
        });
    } else {
      alert('getUserMedia is not supported in this browser.');
    }
  })
}

export const connect = async (matchOffer: MatchOffer) => {
  const myPeerId = get(_myPeerId)
  const peer = get(_peer)
  const partnerPeerId = matchOffer.offered_by === myPeerId ? matchOffer.offered_to : matchOffer.offered_by
  connectedTo.set(partnerPeerId)
  const conn = peer.connect(partnerPeerId);

  conn.on("open", function() {
    conn.send("hi!");
    searchingForMatch.set(false)
    connectedToPeer.set(true)
  });

  peer.on("connection", async function(conn) {
    // await deleteMatchOffer(matchOffer.id)
    listenForCalls()
    conn.on("data", function(data) {
      console.log(data);
    });
  });
};

export const call = () => {
  if (navigator.mediaDevices) {
    navigator.mediaDevices?.getUserMedia({ video: false, audio: true })
      .then(function onSuccess(stream) {
        const peer = get(_peer)
        const partnerPeerId = get(connectedTo)
        const call = peer.call(partnerPeerId, stream);
        call.on('stream', function(remoteStream) {
          attachRemoteStreamToAudioElement(remoteStream)
        });
      })
      .catch(function onError() {
        alert('There has been a problem retrieving the streams - are you running on file:/// or did you disallow access?');
      });
  } else {
    alert('getUserMedia is not supported in this browser.');
  }
}
