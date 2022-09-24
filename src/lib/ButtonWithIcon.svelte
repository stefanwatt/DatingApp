<script lang="ts">
  export let style: "primary" | "secondary" | "warning" | "error" = "primary",
    label = "";
</script>

<button class="btn btn-{style} flex"
  ><span class="w-4 mr-2"><slot /></span> <span>{label}</span>
</button>
