import Vue from "vue";
import { Line, Doughnut, Bar, Pie } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  ArcElement
);

Vue.component("line-chart", {
  extends: Line,
});
Vue.component("doughnut-chart", {
  extends: Doughnut,
});
Vue.component("bar-chart", {
  extends: Bar,
});
Vue.component("pie-chart", {
  extends: Pie,
});