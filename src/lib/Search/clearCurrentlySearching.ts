import { supabase } from "../../supabaseClient";
import { get } from "svelte/store";
import { authSession as _authSession } from "../../store";

export const clearCurrentlySearching = async ()=>{
  const authSession = get(_authSession)
  await supabase
    .from("match_offer")
    .delete()
    .eq("user_id", authSession.user.id);
}
