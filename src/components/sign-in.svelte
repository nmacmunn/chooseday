<script lang="ts">
  import { signInAnonymously, signInWithGoogle } from "../service/auth";
</script>

<div class="uk-margin-top uk-width-1-2@m uk-margin-auto">
  <h1 class="uk-margin-large">
    The decision making app that cures analysis paralysis.
  </h1>

  <div class="uk-card uk-placeholder uk-card-body uk-text-center">
    <h3 class="uk-card-title">Sign in to get started</h3>
    <button
      class="uk-button uk-button-primary uk-width-expand"
      on:click|preventDefault={signInWithGoogle}
    >
      <span uk-icon="icon: google;" class="uk-margin-small-right" />
      Sign in with Google
    </button>
    <div class="uk-margin-small-top">or</div>
    <a href="/signin/guest" on:click|preventDefault={signInAnonymously}
      >continue as a guest</a
    >
  </div>
</div>
