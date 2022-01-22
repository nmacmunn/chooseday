<script lang="ts">
  import _ from "lodash";
  import { getWarm } from "../util/color";
  import type { Option } from "../types/data";
  import type { ResultsState } from "../types/state";
  import type { Processed } from "../util/results";
  import BarChart from "./bar-chart.svelte";

  export let state: ResultsState;
  export let processed: Processed;

  const { options, user } = state.context;
  const { byCriterion, sorted } = processed.byUser[user.id];

  $: datasets = Object.values(byCriterion).map(
    (criterionScores, i, { length }) => {
      const backgroundColor = getWarm(i, length);
      const data = options.map(({ id }) => criterionScores.byOption[id]);
      const label = criterionScores.criterion.title;
      return { backgroundColor, data, label };
    }
  );

  function description(option: Option) {
    const bestFor = _.chain(byCriterion)
      .values()
      .filter(({ sorted }) => _.includes(sorted[0].options, option))
      .map("criterion.title")
      .value();

    if (bestFor.length) {
      return `Best for ${bestFor.join(", ")}`;
    }
    return "";
  }

  const chartLabels = _.map(options, "title");
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
      {#each sorted as { options, rank }}
        {#each options as option (option.id)}
          <li class="uk-width-1-2@s">
            <div class="uk-card uk-card-default uk-card-small uk-card-body">
              <div class="uk-flex uk-flex-top">
                <span class="uk-margin-small-right">#{rank}</span>
                <span>{option.title}</span>
              </div>
              <hr />
              <p class="uk-text-small">{description(option)}</p>
            </div>
          </li>
        {/each}
      {/each}
    </ul>
  </div>
</div>
