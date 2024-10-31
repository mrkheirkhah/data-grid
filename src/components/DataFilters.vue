<template>
  <div class="filters-container">
    <div v-for="(filter, index) in filters" :key="index">
      {{ filter.label }}
      <br />
      <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 4px;
        ">
        <input :type="filter.type" :ref="filter.type + index" :field-name="filter.field"
          @change="(ev) => searchValChanged(ev, filter.field)" :value="getValueIfAvailable(filter.field) || ''" />
        <button @click="() => removeFilter(filter.type + index)">×</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filters: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      filtersObj: {},
    };
  },
  methods: {
    searchValChanged(ev, fieldName) {
      const value = ev.target.value;
      if (!value) {
        delete this.filtersObj[fieldName];
      } else {
        this.filtersObj[fieldName] = value;
      }
      const { sort, ...prevQueries } = this.$route.query
      this.$router.replace({
        query: { ...prevQueries, filter: encodeURI(JSON.stringify(this.filtersObj)), },
      });
    },
    removeFilter(refName) {
      const el = this.$refs[refName][0];
      el.value = "";
      const event = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(event);
    },
    getValueIfAvailable(fieldName) {
      const { filter } = this.$route.query;
      try {
        const filtersObj = JSON.parse(decodeURI(filter));
        if (filtersObj) {
          this.filtersObj = { ...filtersObj };
          return filtersObj[fieldName];
        }
      } catch (ex) {
        console.log("failed to restore filters");
      }
    },
  },
};
</script>

<style scoped>
.filters-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.filters-container div {
  margin-left: 16px;
}

input {
  width: 220px;
  background-color: #f1f1f8;
  color: rgba(0, 0, 0, 0.7);
  height: 32px;
  border: 0;
  outline: 0;
  padding: 7px;
  border-radius: 0 7px 7px 0;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.3);
}

button {
  width: 32px;
  background-color: #f1f1f8;
  color: #c4c4c4;
  height: 32px;
  font-size: 22px;
  line-height: 22px;
  margin: 0;
  margin-right: -5px;
  border: 0;
  outline: 0;
  border-radius: 7px 0 0 7px;
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.3);
}

@media screen and (max-width: 992px) {
  .filters-container {
    justify-content: center;
  }

  input {
    width: calc(42vw - 52px);
    margin-bottom: 12px;
  }

  button {
    margin-bottom: 12px;
  }
}
</style>
