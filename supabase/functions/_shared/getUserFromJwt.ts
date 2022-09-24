import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { supabase } from "./supabaseClient.ts";
import { User } from "./user-type.ts";

export const getUserFromJwt = async (req: Request): Promise<User> => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Auth header not found");
  const jwt = authHeader.replace("Bearer ", "");
  const [header, payload, signature] = decode(jwt);
  const user_id = (payload as any).sub;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id);

  if (!!error || !data) throw new Error(error.message||"Error retrieving user");
  return data[0];
};
