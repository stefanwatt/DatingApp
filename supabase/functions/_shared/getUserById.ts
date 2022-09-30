import { supabase } from "../_shared/supabaseClient.ts";
import { User } from "./user-type.ts";

export const getUserById = async (userId:string):Promise<User> => {
  const res = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);
  if (!res.data || res.data.length !== 1) {
    throw new Error("error retrieving user");
  }
  return res.data[0]
};
