<script lang="ts">
  import type { AuthSession } from "@supabase/supabase-js";
  import { supabase } from "../../supabaseClient";
  import FaSearch from "svelte-icons/fa/FaSearch.svelte";
  import FaTimes from "svelte-icons/fa/FaTimes.svelte";
  import ButtonWithIcon from "../ButtonWithIcon.svelte";
  export let session: AuthSession;
  let searching = false;

  const start = async () => {
    try {
      searching = true;
      const { user } = session;

      const payload = {
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      let { error } = await supabase
        .from("currently_searching")
        .insert(payload);

      if (error) {
        throw error;
      }
      const res = await fetch("https://kfsypqwxkjemxkzzpdcw.functions.supabase.co/findMatch", {
        method: 'POST',
        headers: {
          'Authorization':`Bearer ${session.access_token}`
        }
      })
      const json = await res.json()
      console.log(json)
      const {first_name, last_name} = json
      console.log(`matched with ${first_name} ${last_name}`)
      
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const cancel = async () => {
    try {
      const { user } = session;
      let { error } = await supabase
        .from("currently_searching")
        .delete()
        .eq("user_id", user.id)
      ;

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      searching = false;
    }
  };
</script>

<main class="p-4">
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
</main>
