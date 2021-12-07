<script lang="ts">
  export let onClick: () => unknown = noop;
  function noop() {}
</script>

<div
  class="uk-card uk-card-default uk-card-small uk-card-body"
  class:uk-card-hover={onClick !== noop}
>
  <div class="uk-grid uk-flex-middle">
    <div
      class="uk-width-expand"
      class:pointer={onClick !== noop}
      on:click={onClick}
    >
      <slot name="left" />
    </div>
    <div class="uk-width-auto">
      <slot name="right" />
    </div>
  </div>
</div>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
