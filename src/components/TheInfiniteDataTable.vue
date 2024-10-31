<template>
  <div class="table-container">
    <table cellpadding="0" cellspacing="0" border="0">
      <thead>
        <tr>
          <th v-for="(header, ind) in headers" :class="`${header.sortable ? '' : 'nosort'}`" :key="ind" @click="() =>
            header.sortable
              ? changeSort({ key: header.key, mode: header.sortMode })
              : null
            ">
            <h3>{{ header.title }}</h3>
            <div v-if="header.sortMode === 'ASC'" class="arrow-up"></div>
            <div v-if="header.sortMode === 'DEC'" class="arrow-down"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="item.id" :class="`${checkIfIsFav(item) ? 'favorite-row' : ''}`">
          <td>{{ index + 1 }}</td>
          <td>
            <input type="checkbox" @change="(e) => toggleFavRow(item, e)" :checked="checkIfIsFav(item)" />
          </td>
          <td v-for="(col, index) in headers.slice(2)">{{ item[col.key] }}</td>
        </tr>
        <tr v-if="data.length !== dataCount" ref="lastrow">
          در حال بارگزاری ...
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      required: true,
      type: Array,
    },
    headers: {
      required: true,
      type: Array,
    },
    dataCount: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      observer: null,
    };
  },
  methods: {
    changeSort({ key, mode }) {
      const { sort: prevSort, mode: prevMode, ...prevQueries } = this.$route.query
      switch (mode) {
        case "ASC":
          this.$router.replace({ query: { ...prevQueries, sort: key, mode: 'DEC' } });
          break;
        case "DEC":
          this.$router.replace({ query: { ...prevQueries } });
          break;
        case null:
          this.$router.replace({ query: { ...prevQueries, sort: key, mode: 'ASC' } });
          break;
      }
    },
    onElementObserved(entries) {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) {
          return;
        }

        setTimeout(() => {
          this.$emit("show-more-data");
        }, 100);
      });
    },
    checkIfIsFav(item) {
      const favItemIds = JSON.parse(localStorage.getItem("favRows"));
      if (favItemIds) {
        return favItemIds[item.id] ? true : false;
      }
      return false;
    },
    toggleFavRow(item, e) {
      this.$emit("toggle-fav-row", { el: e, item });
    },
  },
  created() {
    this.observer = new IntersectionObserver(this.onElementObserved, {
      root: this.$el,
      threshold: 0.1,
      rootMargin: '0px',
    });
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
  mounted() {
    this.observer.observe(this.$refs.lastrow);
  },
};
</script>

<style>
@import "@/assets/grid.css";
</style>
