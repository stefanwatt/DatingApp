<script lang="ts">
  import FaSearch from "svelte-icons/fa/FaSearch.svelte";
  import FaTimes from "svelte-icons/fa/FaTimes.svelte";
  import ButtonWithIcon from "../ButtonWithIcon.svelte";
  import { searchingForMatch, myPeerId, peer } from "./store";
  import { startSearchingForMatch } from "./startSearchingForMatch";
  import { quitSearchingForMatch } from "./quitSearchingForMatch";
  import { connectOnMatchOffer } from "./connectOnMatchOffer";
  import { clearCurrentlySearching } from "./clearCurrentlySearching";
  import { onMount } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import Peer from "peerjs";

    $myPeerId = uuidv4();
    $peer = new Peer($myPeerId, {});
  onMount(async () => {
    await clearCurrentlySearching();
    await connectOnMatchOffer();
  });
</script>

<main class="p-4">
  <h1 class="text-3xl mb-4">
    my peer id: {$myPeerId}
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
