import type { AuthSession } from "@supabase/supabase-js";
import { writable, type Writable } from "svelte/store";

export const authSession:Writable<AuthSession> = writable<AuthSession>()
