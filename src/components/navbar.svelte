<script lang="ts">
  import { state } from "../machine";
  import { linkWithGoogle, signOut } from "../auth";
</script>

<nav class="uk-navbar-container uk-navbar-transparent uk-margin" uk-navbar>
  <div class="uk-navbar-center">
    <div class="uk-navbar-item uk-logo">Indecisionator II</div>
  </div>
  {#if $state.context.user}
    <div class="uk-navbar-right">
      <ul class="uk-navbar-nav">
        <li>
          <!-- svelte-ignore a11y-missing-content -->
          <a
            href="https://github.com/nmacmunn/indecisionator"
            target="_blank"
            uk-icon="icon: github"
          />
        </li>
        <li>
          <!-- svelte-ignore a11y-missing-content -->
          <a href="#signin" uk-icon="icon: user" />
          <div class="uk-navbar-dropdown">
            <ul class="uk-nav uk-navbar-dropdown-nav uk-nav-right">
              <li class="uk-text-light uk-text-small">
                <div class="uk-margin-small">
                  {$state.context.user.email || "Guest"}
                </div>
              </li>
              {#if !$state.context.user.email}
                <li>
                  <a href="#link" on:click|preventDefault={linkWithGoogle}>
                    <span
                      uk-icon="icon: google; ratio: 0.8"
                      class="uk-margin-small-right"
                    />
                    <span>Link to Google</span>
                  </a>
                </li>
              {/if}
              <li class="uk-nav-divider" />
              <li>
                <a href="#signout" on:click|preventDefault={signOut}>
                  <span
                    uk-icon="icon: sign-out; ratio: 0.8"
                    class="uk-margin-small-right"
                  />
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  {/if}
</nav>
