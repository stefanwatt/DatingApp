import type { AuthSession } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";
import { get } from "svelte/store";
import { authSession as _authSession} from "../../store";
import { supabaseUrl } from "../constants";
import { myPeerId as _myPeerId, searchingForMatch } from "./store";
import { post } from "../api";

export const startSearchingForMatch = async () => {
  searchingForMatch.set(true);
  const authSession: AuthSession = get(_authSession);
  const { user } = authSession;
  const myPeerId = get(_myPeerId)
  const payload = {
    user_id: user.id,
    created_at: new Date().toISOString(),
    peer_id: myPeerId,
  };

  const res = await supabase.from("currently_searching").insert(payload);
  if (res.error) {
    throw res.error;
  }
  await post("findMatch", { peer_id: myPeerId }, authSession.access_token);
};
