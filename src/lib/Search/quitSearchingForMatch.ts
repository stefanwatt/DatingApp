import type { AuthSession } from "@supabase/supabase-js";
import { searchingForMatch } from "./store";
import { authSession } from "../../store.ts";
import { supabase } from "../../supabaseClient";
import { get } from "svelte/store";

export const quitSearchingForMatch = async () => {
  const session: AuthSession = get(authSession);
  const { user } = session;
  const { error } = await supabase
    .from("currently_searching")
    .delete()
    .eq("user_id", user.id);
  if (error) {
    throw error;
  }
  searchingForMatch.set(false);
};
