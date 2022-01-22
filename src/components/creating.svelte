<script lang="ts">
  import { send } from "../machine";
  import type { CreatingState } from "../types/state";
  import Loading from "./loading.svelte";

  export let state: CreatingState;

  $: decision = state.context.creatorDecisions.find(
    ({ id }) => state.context.decisionId === id
  );
  $: if (decision) {
    send({ type: "DECISION", decision });
  }
</script>

<Loading text="Creating your decision, please wait..." />
