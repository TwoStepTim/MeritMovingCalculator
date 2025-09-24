import { createApp } from 'vue';
import App from './App.vue';

export function mountCalculator(el, props = {}) {
  const app = createApp(App, props);
  app.mount(el);
}

// Expose a global for Webflow
window.MeritCalc = {
  mount: (el, props) => mountCalculator(el, props)
};
