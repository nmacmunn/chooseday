<script lang="ts">
  import type { ResultsState } from "../types/state";
  import { getCool } from "../util/color";
  import BarChart from "./bar-chart.svelte";

  export let state: ResultsState;

  const { options } = state.context;

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

  $: result = state.context.result;
  $: datasets = result
    .getUserDatasets()
    .map(({ data, label }, i, { length }) => {
      const backgroundColor = getCool(i, length);
      return { backgroundColor, data, label };
    });
</script>

<div class="uk-grid uk-grid-small" uk-grid>
  <div class="uk-width-1-2@m">
    <ul class="uk-grid-small" uk-grid>
      {#each result.getOverall() as option (option.id)}
        <li
          class:uk-width-1-1:uk-text-large={option.rank === 1}
          class:uk-width-1-2@s={option.rank !== 1}
        >
          <div
            class="uk-card uk-card-default uk-card-small uk-card-body uk-height-small"
          >
            <div
              class:uk-text-large={option.rank === 1}
              class="uk-flex uk-flex-top"
            >
              <span class="uk-margin-small-right">#{option.rank}</span>
              <span class="uk-margin-small-right uk-width-expand"
                >{option.title}</span
              >
              <span
                class="badge"
                class:uk-text-success={option.score > 0.7}
                class:uk-text-danger={option.score < 0.3}
                >{Math.round(option.score * 100)}</span
              >
            </div>
            <hr />
            <p class="uk-text-small">
              {result.getOverallOptionDescription(option)}
            </p>
          </div>
        </li>
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
