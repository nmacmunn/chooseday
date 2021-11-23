<script lang="ts">
  import Chart from "chart.js/auto";
  import { interpolateWarm } from "d3-scale-chromatic";
  import _ from "lodash";
  import { beforeUpdate, onMount } from "svelte";
  import type { Option } from "../types/data";
  import type { ResultsState } from "../types/states";
  import type { Processed } from "../util/results";

  export let state: ResultsState;
  export let processed: Processed;

  const { criteria, options, user } = state.context;
  const { byOption, byCriterion } = processed.byUser[user.id];
  const sorted = [...options].sort((a, b) => byOption[b.id] - byOption[a.id]);

  $: datasets = Object.entries(processed.byUser[user.id].byCriterion).map(
    ([criterionId, criterionScores], i, { length }) => {
      return {
        backgroundColor: interpolateWarm((i + 1) / (length + 1)),
        data: options.map(({ id }) => criterionScores.byOption[id]),
        label: criteria.find(({ id }) => id === criterionId)?.title,
      };
    }
  );

  let chartEl: HTMLCanvasElement;

  function description(option: Option) {
    const bestFor = _.chain(byCriterion)
      .values()
      .filter(({ sorted }) => sorted[0] === option.id)
      .map("criterion.title")
      .value();

    if (bestFor.length) {
      return `Best for ${bestFor.join(", ")}`;
    }
    return "";
  }

  onMount(() => {
    new Chart(chartEl, {
      type: "bar",
      data: {
        datasets,
        labels: _.map(options, "title"),
      },
      options: {
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
      },
    });
  });

  beforeUpdate(() => {
    const chart = Chart.getChart(chartEl);
    if (!chart) {
      return;
    }
    chart.data.datasets = datasets;
    chart.update();
  });
</script>

<div class="uk-grid uk-grid-small uk-child-width-1-2" uk-grid>
  <div>
    <div class="uk-card uk-card-default uk-card-small uk-card-body">
      <canvas bind:this={chartEl} />
    </div>
  </div>
  <ul
    class="uk-grid-small uk-child-width-1-2"
    uk-grid
    uk-height-match="target: > li > .uk-card"
  >
    {#each sorted as option, i (option.id)}
      <li>
        <div class="uk-card uk-card-default uk-card-small uk-card-body">
          <div class="uk-flex uk-flex-top">
            <span class="uk-margin-small-right">#{i + 1}</span>
            <span>{option.title}</span>
          </div>
          <hr />
          <p class="uk-text-small">{description(option)}</p>
        </div>
      </li>
    {/each}
  </ul>
</div>
