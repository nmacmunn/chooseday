<script lang="ts">
  import _ from "lodash";
  import type { ResultsState } from "../types/state";
  import { getCool } from "../util/color";
  import { getName } from "../util/name";
  import type { Processed } from "../util/results";
  import { getOptionDescription } from "../util/results";
  import BarChart from "./bar-chart.svelte";

  export let state: ResultsState;
  export let processed: Processed;

  const { options } = state.context;
  const { byOption, byUser, sorted } = processed;

  const chartLabels = options.map((option) => option.title);
  const chartOptions = {
    aspectRatio: 1,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        max: 1,
        ticks: {
          display: false,
        },
      },
    },
  };

  $: datasets = Object.entries(processed.byUser).map(
    ([_, userScores], i, { length }) => {
      const backgroundColor = getCool(i, length);
      const data = options.map(({ id }) => userScores.contribution[id]);
      const label = getName(
        userScores.user,
        state.context.user,
        state.context.decision
      );
      return { backgroundColor, data, label };
    }
  );
</script>

<div class="uk-grid uk-grid-small" uk-grid>
  <div class="uk-width-1-2@m">
    <ul class="uk-grid-small" uk-grid>
      {#each sorted as { options, rank }}
        {#each options as option (option.id)}
          <li
            class:uk-width-1-1:uk-text-large={rank === 1}
            class:uk-width-1-2@s={rank !== 1}
          >
            <div
              class="uk-card uk-card-default uk-card-small uk-card-body uk-height-small"
            >
              <div class:uk-text-large={rank === 1} class="uk-flex uk-flex-top">
                <span class="uk-margin-small-right">#{rank}</span>
                <span class="uk-margin-small-right uk-width-expand"
                  >{option.title}</span
                >
                <span
                  class="badge"
                  class:uk-text-success={byOption[option.id] > 0.7}
                  class:uk-text-danger={byOption[option.id] < 0.3}
                  >{Math.round(byOption[option.id] * 100)}</span
                >
              </div>
              <hr />
              <p class="uk-text-small">
                {getOptionDescription(
                  option,
                  byUser,
                  state.context.user,
                  state.context.decision
                )}
              </p>
            </div>
          </li>
        {/each}
      {/each}
    </ul>
  </div>

  <div class="uk-width-1-2@m">
    <div class="uk-card uk-card-default uk-card-small uk-card-body">
      <BarChart
        {datasets}
        label="Overall results chart"
        labels={chartLabels}
        options={chartOptions}
      />
    </div>
  </div>
</div>

<style>
  .badge {
    border: 1px solid;
    border-radius: 4px;
    padding: 0 0.2em;
  }
</style>
