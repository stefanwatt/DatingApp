<script lang="ts">
  import type { AuthSession } from "@supabase/supabase-js";
  import { v4 as uuidv4 } from "uuid";
  import { supabase } from "../../supabaseClient";
  import Peer from "peerjs";
  import FaSearch from "svelte-icons/fa/FaSearch.svelte";
  import FaTimes from "svelte-icons/fa/FaTimes.svelte";
  import ButtonWithIcon from "../ButtonWithIcon.svelte";
  import { onMount } from "svelte";
  export let session: AuthSession;
  let searching = false;

  const start = async () => {
    searching = true;
    const { user } = session;
    const payload = {
      user_id: user.id,
      created_at: new Date().toISOString(),
      peer_id: myPeerId,
    };

    const res1 = await supabase.from("currently_searching").insert(payload);
    if (res1.error) {
      throw res1.error;
    }

    const res2 = await fetch(
      "https://eftuzdqfmktuitpnczio.functions.supabase.co/findMatch",
      {
        method: "POST",
        body: JSON.stringify({ peer_id: myPeerId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
  };

  const cancel = async () => {
    const { user } = session;
    let { error } = await supabase
      .from("currently_searching")
      .delete()
      .eq("user_id", user.id);
    if (error) {
      throw error;
    }
    searching = false;
  };
  let availablePartners = [];
  let myPeerId;
  let partnerPeerId;
  let peer;
  let connected = false;

  const connect = () => {
    if (!partnerPeerId) return;
    const conn = peer.connect(partnerPeerId);
    conn.on("open", function () {
      conn.send("hi!");
      searching = false;
      connected = true;
    });
    peer.on("connection", function (conn) {
      console.log(conn);
      conn.on("data", function (data) {
        console.log(data);
      });
    });
  };
  supabase
    .channel("*")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "currently_searching" },
      (payload) => {
        const availablePartnersSet = new Set(availablePartners);
        availablePartnersSet.add(payload.new);
        availablePartners = [...availablePartnersSet] as any[];
      }
    )
    .subscribe();
  supabase
    .channel("*")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "match_offer" },
      (payload) => {
        if (payload.new.offered_by === myPeerId) {
          partnerPeerId = payload.new.offered_to;
          connect();
        }
        if (payload.new.offered_to === myPeerId) {
          partnerPeerId = payload.new.offered_by;
          connect();
        }
      }
    )
    .subscribe();
  onMount(async () => {
    myPeerId = uuidv4();
    peer = new Peer(myPeerId, {});
    const { data: currently_searching, error } = await supabase
      .from("currently_searching")
      .select("*")
      .neq("user_id", session.user.id);
    availablePartners = currently_searching;
  });
</script>

<main class="p-4">
  <h1 class="text-3xl">
    my peer id:{myPeerId}
  </h1>
  <div class="flex justify-center mb-4">
    <div>
      <h2 class="text-xl">available partners:</h2>
      <ul>
        {#each availablePartners as availablePartner}
          <li>{availablePartner.peer_id}</li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="flex justify-center">
    {#if !searching}
      <div on:click={start}>
        <ButtonWithIcon label={"Search"} style={"primary"}>
          <FaSearch />
        </ButtonWithIcon>
      </div>
    {:else}
      <div on:click={cancel}>
        <ButtonWithIcon label={"Cancel"} style={"error"}>
          <FaTimes />
        </ButtonWithIcon>
      </div>
    {/if}
  </div>
  <div class="mt-4 flex justify-center">
    {#if !connected}
      <input bind:value={partnerPeerId} type="text" class="" />
      <button on:click={connect} class="ml-2 btn btn-primary">connect</button>
    {:else}
      <p class="text-indigo-500 text-xl">Connected to {partnerPeerId}</p>
    {/if}
  </div>
</main>

<!-- const res = await fetch( -->
<!--   "https://eftuzdqfmktuitpnczio.functions.supabase.co/findMatch", -->
<!--   { -->
<!--     method: "POST", -->
<!--     headers: { -->
<!--       Authorization: `Bearer ${session.access_token}`, -->
<!--     }, -->
<!--   } -->
<!-- ); -->
<!-- const json = await res.json(); -->
<!-- const partnerPeerId = json.peer_id; -->
<!-- const { first_name, last_name } = json.user; -->
<!-- console.log(json); -->
<!-- console.log(`matched with ${first_name} ${last_name}`); -->
