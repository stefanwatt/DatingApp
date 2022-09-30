<script lang="ts">
  import type { AuthSession } from "@supabase/supabase-js";
  import { supabase } from "../../supabaseClient";
  import FaSearch from "svelte-icons/fa/FaSearch.svelte";
  import FaTimes from "svelte-icons/fa/FaTimes.svelte";
  import ButtonWithIcon from "../ButtonWithIcon.svelte";
  import { onMount } from "svelte";
  import { searchingForMatch, myPeerId, connectedToPeer } from "./store";
  import { startSearchingForMatch } from "./startSearchingForMatch";
  import { quitSearchingForMatch } from "./quitSearchingForMatch";
  import { connect } from "./peer";
  export let session: AuthSession;

  let availablePartners = [];
  let partnerPeerId;
  let peer;

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
        if (payload.new.offered_by === $myPeerId) {
          partnerPeerId = payload.new.offered_to;
          connect(partnerPeerId);
        }
        if (payload.new.offered_to === $myPeerId) {
          partnerPeerId = payload.new.offered_by;
          connect(partnerPeerId);
        }
      }
    )
    .subscribe();

  onMount(async () => {
    const { data: currently_searching, error } = await supabase
      .from("currently_searching")
      .select("*")
      .neq("user_id", session.user.id);
    availablePartners = currently_searching;
  });
</script>

<main class="p-4">
  <h1 class="text-3xl">
    my peer id:{$myPeerId}
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
    {#if !$searchingForMatch}
      <div on:click={startSearchingForMatch}>
        <ButtonWithIcon label={"Search"} style={"primary"}>
          <FaSearch />
        </ButtonWithIcon>
      </div>
    {:else}
      <div on:click={quitSearchingForMatch}>
        <ButtonWithIcon label={"Cancel"} style={"error"}>
          <FaTimes />
        </ButtonWithIcon>
      </div>
    {/if}
  </div>
  <div class="mt-4 flex justify-center">
    <input bind:value={partnerPeerId} type="text" class="" />
    <button
      on:click={() => {
        connect(partnerPeerId);
      }}
      class="ml-2 btn btn-primary">connect</button
    >
  </div>
</main>
