<script lang="ts">
  import Chart, { ChartConfiguration, ChartDataset } from "chart.js/auto";
  import { beforeUpdate, onMount } from "svelte";

  export let label: string;
  export let datasets: ChartDataset<"bar">[];
  export let labels: string[];
  export let options: ChartConfiguration<"bar">["options"];

  let canvas: HTMLCanvasElement;

  onMount(() => {
    new Chart(canvas, {
      type: "bar",
      data: {
        datasets,
        labels,
      },
      options,
    });
  });

  beforeUpdate(() => {
    const chart = Chart.getChart(canvas);
    if (!chart) {
      return;
    }
    chart.data.datasets = datasets;
    chart.update();
  });
</script>

<canvas bind:this={canvas} aria-label={label} />
