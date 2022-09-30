<script lang="ts">
  import type { AuthSession } from "@supabase/supabase-js";
  import { supabase } from "../../supabaseClient";
  import FaSearch from "svelte-icons/fa/FaSearch.svelte";
  import FaTimes from "svelte-icons/fa/FaTimes.svelte";
  import ButtonWithIcon from "../ButtonWithIcon.svelte";
  import { searchingForMatch, myPeerId, connectedToPeer } from "./store";
  import { startSearchingForMatch } from "./startSearchingForMatch";
  import { quitSearchingForMatch } from "./quitSearchingForMatch";
  import { connect } from "./peer";

  supabase
    .channel("*")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "match_offer" },
      (payload) => {
        if (payload.new.offered_by === $myPeerId) {
          connect(payload.new.offered_to);
        }
        if (payload.new.offered_to === $myPeerId) {
          connect(payload.new.offered_by);
        }
      }
    )
    .subscribe();
</script>

<main class="p-4">
  <h1 class="text-3xl">
    my peer id:{$myPeerId}
  </h1>
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
</main>
