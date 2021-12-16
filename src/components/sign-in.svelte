<script lang="ts">
  import { signInAnonymously, signInWithGoogle } from "../service/auth";
</script>

<div class="uk-margin-top uk-width-1-2@m uk-margin-auto">
  <div class="uk-card uk-card-default uk-card-body">
    <div class="uk-card-title">Sign In</div>
    <hr />
    <div class="uk-margin uk-text-center">
      <button
        class="uk-button uk-button-default uk-width-expand"
        on:click|preventDefault={signInWithGoogle}
      >
        <span uk-icon="icon: google;" class="uk-margin-small-right" />
        Sign in with Google
      </button>
      <div class="uk-margin-top">or</div>
      <a href="#guest" on:click|preventDefault={signInAnonymously}
        >continue as a guest</a
      >
    </div>
  </div>
</div>
