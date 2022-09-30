import type { AuthSession } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient.ts";
import { get } from "svelte/store";
import { authSession } from "../../store.ts";
import { supabaseUrl } from "../constants";
import { myPeerId, searchingForMatch } from "./store";
import { post } from "../api";

export const startSearchingForMatch = async () => {
  searchingForMatch.set(true);
  const session: AuthSession = get(authSession);
  const { user } = session;
  const payload = {
    user_id: user.id,
    created_at: new Date().toISOString(),
    peer_id: get(myPeerId),
  };

  const res = await supabase.from("currently_searching").insert(payload);
  if (res.error) {
    throw res.error;
  }
  await post("findMatch", { peer_id: myPeerId }, session.access_token);
};
