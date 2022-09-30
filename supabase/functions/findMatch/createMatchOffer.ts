import { getUserById } from "../_shared/getUserById.ts";
import { supabase } from "../_shared/supabaseClient.ts";
import { User } from "../_shared/user-type.ts";

interface MatchOffer {
  offered_to: string;
  offered_by: string;
}
interface CurrentlySearching {
  id: number;
  createdAt: Date;
  user_id: string;
  peer_id: string;
}

const getPotentialMatch = async (
  userId: string,
): Promise<CurrentlySearching> => {
  const { data, error } = await supabase
    .from("currently_searching")
    .select("*")
    .neq("user_id", userId);

  if (!!error || !data || data.length === 0) {
    throw new Error(error?.message || "error searching for match");
  }
  return data[Math.floor(Math.random() * data.length)];
};

export const createMatchOffer = async (
  user: User,
  myPeerId: string,
): Promise<MatchOffer> => {
  const {user_id,peer_id} = await getPotentialMatch(user.id)
  const foundMatchUserRes = await getUserById(user_id)
  const offer = { offered_by: myPeerId, offered_to: peer_id };
  await supabase
    .from("match_offer")
    .insert([offer]);
  return offer;
};
