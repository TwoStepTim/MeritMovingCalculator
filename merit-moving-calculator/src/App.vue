<script setup></script>

<<template>
  <div class="mmc-root">
    <div class="mmc-card">
      <h2 class="mmc-title">Raleigh Moving Cost Calculator</h2>

      <div class="mmc-grid">
        <label class="mmc-field">
          <span>Bedrooms</span>
          <select v-model.number="bedrooms">
            <option v-for="n in 5" :key="n" :value="n">{{ n }} Bedroom{{ n>1?'s':'' }}</option>
          </select>
        </label>

        <label class="mmc-field">
          <span>Flights of Stairs</span>
          <select v-model.number="flights">
            <option v-for="n in [0,1,2,3,4,5]" :key="n" :value="n">{{ n === 5 ? '5+' : n }}</option>
          </select>
        </label>

        <label class="mmc-field">
          <span>Movers</span>
          <select v-model.number="movers">
            <option v-for="n in [2,3,4,5]" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>

        <label class="mmc-check">
          <input type="checkbox" v-model="truck" /> <span>Include Truck</span>
        </label>
      </div>

      <fieldset class="mmc-fieldset">
        <legend>Specialty Items</legend>
        <label class="mmc-check"><input type="checkbox" value="appliances" v-model="specials" /> Appliances</label>
        <label class="mmc-check"><input type="checkbox" value="workoutEquipment" v-model="specials" /> Workout Equipment</label>
        <label class="mmc-check"><input type="checkbox" value="safe" v-model="specials" /> Safe</label>
        <label class="mmc-check"><input type="checkbox" value="piano" v-model="specials" /> Piano</label>
        <label class="mmc-check"><input type="checkbox" value="other" v-model="specials" /> Other</label>
      </fieldset>

      <button class="mmc-btn" @click="calc">Get Estimate</button>

      <div class="mmc-results" v-if="showResults">
        <div><strong>Estimated Time:</strong> {{ hours.toFixed(2) }} hours</div>
        <div><strong>Estimated Cost:</strong> {{ currency(cost) }}</div>
        <div><strong>Protection Price:</strong> {{ currency(protection) }}</div>
        <div class="mmc-cta">
          <a :href="quoteHref" class="mmc-btn mmc-btn-primary">Lock in this quote</a>
        </div>
        <small class="mmc-note">Estimates are for planning; final price depends on onsite conditions & time used.</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {
    quoteUrl: { type: String, default: '/quote' },
    // You can also pass pricing config props later if you wish
  },
  data() {
    return {
      // UI state
      bedrooms: 2,
      flights: 0,
      movers: 2,
      truck: true,
      specials: [],
      showResults: false,

      // Outputs
      hours: 0,
      cost: 0,
      protection: 0,

      // Config (editable or load from /pricing.json later)
      CONFIG: {
        minBillableHours: 0,
        hourlyRate: {
          truck:   { 2:175, 3:225, 4:275, 5:325 },
          noTruck: { 2:100, 3:150, 4:200, 5:250 }
        },
        bedroomBaseHours: { 1:5, 2:7, 3:9, 4:11, 5:12 },
        stairsMinutesByFlights: { 0:0, 1:25, 2:30, 3:45, 4:60, '5+':75 },
        specialtyMinutes: { appliances:30, workoutEquipment:30, safe:30, piano:30, other:60 },
        protectionPriceByBedrooms: { 1:110, 2:155, 3:225, 4:290, 5:335 }
      }
    };
  },
  computed: {
    quoteHref() {
      const p = new URLSearchParams({
        bedrooms: String(this.bedrooms),
        flights: String(this.flights),
        movers: String(this.movers),
        truck: String(this.truck),
        hours: this.hours.toFixed(2),
        rate: String(this.rate()),
        est_cost: this.cost.toFixed(2),
      });
      return `${this.quoteUrl}?${p.toString()}`;
    }
  },
  methods: {
    currency(n) {
      return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
    },
    rate() {
      return this.truck ? this.CONFIG.hourlyRate.truck[this.movers] : this.CONFIG.hourlyRate.noTruck[this.movers];
    },
    estimateTimeHours() {
      let hrs = this.CONFIG.bedroomBaseHours[this.bedrooms] || 0;

      const fm = this.flights >= 5 ? this.CONFIG.stairsMinutesByFlights['5+'] : this.CONFIG.stairsMinutesByFlights[this.flights];
      hrs += (fm || 0) / 60;

      this.specials.forEach(key => {
        const add = this.CONFIG.specialtyMinutes[key] || 0;
        hrs += add / 60;
      });

      if (hrs < this.CONFIG.minBillableHours) hrs = this.CONFIG.minBillableHours;
      return hrs;
    },
    calc() {
      this.hours = this.estimateTimeHours();
      const r = this.rate();
      this.cost = this.hours * r;
      this.protection = this.CONFIG.protectionPriceByBedrooms[this.bedrooms] || 0;
      this.showResults = true;

      // Optional GA4
      // window.gtag?.('event','estimate_viewed', { bedrooms:this.bedrooms, flights:this.flights, movers:this.movers, truck:this.truck, hours:this.hours, rate:r, est_cost:this.cost });
    }
  }
};
</script>

<style>
/* Scoped, minimal, and easy to expand */
.mmc-root { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
.mmc-card { border:1px solid rgba(0,0,0,.1); border-radius:12px; padding:16px; background:#fff; }
.mmc-title { margin:0 0 10px; font-size:1.25rem; }
.mmc-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin-bottom:12px; }
.mmc-field { display:flex; flex-direction:column; gap:6px; }
.mmc-check { display:inline-flex; align-items:center; gap:8px; margin:6px 12px 6px 0; }
.mmc-fieldset { border:1px dashed rgba(0,0,0,.2); border-radius:8px; padding:10px 12px; margin:8px 0 16px; }
.mmc-btn { display:inline-block; padding:10px 14px; border-radius:10px; border:1px solid rgba(0,0,0,.1); background:#f5f5f5; cursor:pointer; text-decoration:none; }
.mmc-btn:hover { filter:brightness(0.97); }
.mmc-btn-primary { background:#0b7; color:#fff; border-color:transparent; }
.mmc-results { margin-top:14px; display:grid; gap:8px; }
.mmc-cta { margin-top:8px; }
.mmc-note { color:#666; }
</style>
