import { get } from "svelte/store";
import { supabase } from "../../supabaseClient";
import { connect } from "./peer";
import { myPeerId as _myPeerId } from "./store";

export const connectOnMatchOffer = async ()=>{
  const myPeerId = get(_myPeerId)
  supabase
    .channel("*")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "match_offer" },
      async (payload) => {
        await connect(payload.new);
      }
    )
    .subscribe();
}
