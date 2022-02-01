<script lang="ts">
  import _ from "lodash";
  import type { User } from "../types/data";
  import type { ResultsState } from "../types/state";
  import { getWarm } from "../util/color";
  import BarChart from "./bar-chart.svelte";

  export let user: User;
  export let state: ResultsState;

  $: result = state.context.result;
  $: datasets = result
    .getCriterionDatasets(user)
    .map(({ data, label }, i, { length }) => {
      const backgroundColor = getWarm(i, length);
      return { backgroundColor, data, label };
    });

  const chartLabels = _.map(state.context.options, "title");
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
</script>

<div class="uk-grid uk-grid-small" uk-grid>
  <div class="uk-width-1-2@m">
    <div class="uk-card uk-card-default uk-card-small uk-card-body">
      <BarChart
        {datasets}
        label="User results chart"
        labels={chartLabels}
        options={chartOptions}
      />
    </div>
  </div>
  <div class="uk-width-1-2@m">
    <ul class="uk-grid-small" uk-grid uk-height-match="target: > li > .uk-card">
      {#each result.getUser(user) as option (option.id)}
        <li class="uk-width-1-2@s">
          <div class="uk-card uk-card-default uk-card-small uk-card-body">
            <div class="uk-flex uk-flex-top">
              <span class="uk-margin-small-right">#{option.rank}</span>
              <span>{option.title}</span>
            </div>
            <hr />
            <p class="uk-text-small">
              {result.getUserOptionDescription(option, user)}
            </p>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
