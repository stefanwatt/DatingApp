import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { errorResponse } from "../_shared/errorResponse.ts";
import { getUserFromJwt } from "../_shared/getUserFromJwt.ts";
import { supabase } from "../_shared/supabaseClient.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(
      "ok",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Expose-Headers": "Content-Length, X-JSON",
          "Access-Control-Allow-Headers":
            "apikey,X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
        },
      },
    );
  }
  try {
    const jwt = req.headers.get("Authorization")!.replace("Bearer ", "");
    supabase.auth.setAuth(jwt);
    const user = await getUserFromJwt(req);
    const { data, error } = await supabase
      .from("currently_searching")
      .select("*")
      .neq("user_id", user.id);
    if (!!error || !data || data.length === 0) {
      return errorResponse(error || { message: "error searching for match" });
    }
    const foundMatch = data[Math.floor(Math.random() * data.length)];
    const foundMatchUserId = foundMatch.user_id;
    const partner_peer_id = foundMatch.peer_id;
    const foundMatchUserRes = await supabase
      .from("users")
      .select("*")
      .eq("id", foundMatchUserId);
    if (!foundMatchUserRes.data) {
      return errorResponse({
        message: "error looking up data of matched user",
      });
    }

    const my_peer_id = (await req.json()).peer_id;
    const matchOfferRes = await supabase
      .from("match_offer")
      .insert([
        { offered_by: my_peer_id, offered_to: partner_peer_id },
      ]);

    console.log(matchOfferRes);
    const payload = {
      user: foundMatchUserRes.data[0],
      peer_id: partner_peer_id,
    };
    return new Response(JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
