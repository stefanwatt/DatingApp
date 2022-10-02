<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "./supabaseClient";
  import Auth from "./lib/Auth.svelte";
  import Search from "./lib/Search/Search.svelte";
  import { authSession } from "./store";
  import { connectedTo, connectedToPeer } from "./lib/Search/store";
  import { call } from "./lib/Search/peer";
  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      $authSession = data.session;
    });

    supabase.auth.onAuthStateChange((_event, _session) => {
      $authSession = _session;
    });
  });
</script>

<div class="p-4">
  {#if !$authSession}
    <Auth />
  {:else if $connectedToPeer}
    <p>connected to: {$connectedTo}</p>
    <button on:click={call} class="btn btn-primary">Call</button>
    <audio id="audioStream" />
  {:else}
    <Search />
  {/if}
</div>
