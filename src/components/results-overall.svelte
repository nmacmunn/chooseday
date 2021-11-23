<script lang="ts">
  import Chart from "chart.js/auto";
  import { interpolateCool } from "d3-scale-chromatic";
  import _ from "lodash";
  import type { Option } from "../types/data";
  import type { ResultsState } from "../types/states";
  import { getName } from "../util/name";
  import type { Processed } from "../util/results";
  import { beforeUpdate, onMount } from "svelte";

  export let state: ResultsState;
  export let processed: Processed;

  const { options } = state.context;
  const { byOption, byUser } = processed;
  const sorted = [...options].sort((a, b) => byOption[b.id] - byOption[a.id]);
  const userCount = _.size(processed.byUser);

  $: datasets = Object.entries(processed.byUser).map(
    ([_, userScores], i, { length }) => {
      const label = getName(
        userScores.user,
        state.context.user,
        state.context.decision
      );
      return {
        backgroundColor: interpolateCool((i + 1) / (length + 1)),
        data: options.map(({ id }) => userScores.byOption[id] / userCount),
        label,
      };
    }
  );

  function description(option: Option) {
    const topChoice = _.chain(byUser)
      .values()
      .filter(({ sorted }) => sorted[0] === option.id)
      .map(({ user }) => user)
      .value();

    if (topChoice.length) {
      const names = topChoice
        .map((user) =>
          getName(user, state.context.user, state.context.decision)
        )
        .join(", ");
      return `Top choice of ${names}`;
    }
    return "";
  }

  let chartEl: HTMLCanvasElement;

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

<div class="uk-grid uk-grid-small" uk-grid>
  <ul class="uk-grid-small uk-width-1-2" uk-grid>
    {#each sorted as option, i (option.id)}
      <li
        class:uk-width-1-1:uk-text-large={i === 0}
        class:uk-width-1-2={i !== 0}
      >
        <div
          class="uk-card uk-card-default uk-card-small uk-card-body uk-height-small"
        >
          <div class:uk-text-large={i === 0} class="uk-flex uk-flex-top">
            <span class="uk-margin-small-right">#{i + 1}</span>
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
          <p class="uk-text-small">{description(option)}</p>
        </div>
      </li>
    {/each}
  </ul>
  <div class="uk-width-1-2">
    <div class="uk-card uk-card-default uk-card-small uk-card-body">
      <canvas bind:this={chartEl} />
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
