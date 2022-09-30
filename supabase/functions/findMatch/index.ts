import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { getCorsResponse } from "../_shared/corsResponse.ts";
import { errorResponse } from "../_shared/errorResponse.ts";
import { getUserFromJwt } from "../_shared/getUserFromJwt.ts";
import { supabase } from "../_shared/supabaseClient.ts";
import { createMatchOffer } from "./createMatchOffer.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return getCorsResponse();
  }
  try {
    const jwt = req.headers.get("Authorization")!.replace("Bearer ", "");
    supabase.auth.setAuth(jwt);
    const user = await getUserFromJwt(req);

    const myPeerId = (await req.json()).peer_id;

    const { offered_by, offered_to } = await createMatchOffer(user, myPeerId);

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
