<script>
import ThePaginatedDataTable from "../components/ThePaginatedDataTable.vue";
import DataFilters from "../components/DataFilters.vue";
import DataPagination from "../components/DataPagination.vue";

export default {
  components: { ThePaginatedDataTable, DataFilters, DataPagination },
  data() {
    return {
      tableData: [],
      limit: 5,
      page: 1,
      headers: [
        { title: "#", sortable: false, key: "index", sortMode: null },
        { title: "#", sortable: false, key: "fav", sortMode: null },
        {
          title: "آیدی",
          sortable: true,
          key: "id",
          sortMode: null,
        },
        {
          title: "نام",
          sortable: true,
          key: "name",
          sortMode: null,
        },
        { title: "تاریخ", sortable: true, key: "date", sortMode: null },
        { title: "آدرس", sortable: true, key: "address", sortMode: null },
        { title: "تلفن", sortable: true, key: "phone", sortMode: null },
      ],
      filtersArray: [
        { field: "id", type: "text", label: "آیدی" },
        { field: "name", type: "text", label: "نام" },
        { field: "date", type: "date", label: "تاریخ" },
        { field: "address", type: "text", label: "آدرس" },
        { field: "phone", type: "text", label: "تلفن" },
      ],
    };
  },
  watch: {
    $route() {
      const { sort, filter, mode } = this.$route.query;
      try {
        this.updateSortMode(sort, mode)
        if (filter || sort) this.fetchData();
      } catch (ex) {
        console.log(ex)
      }
    },
  },
  methods: {
    constructFilterAndSorts() {
      const { sort, mode, filter } = this.$route.query;
      let filters = {};
      if (filter) {
        filters = JSON.parse(decodeURI(filter))
      }

      let filterStr = ""
      let sortStr = ""

      if (sort && mode) {
        sortStr = `&_sort=${sort}&_order=${mode.toLowerCase()}`
      }
      if (Object.keys(filters).length > 0) {
        Object.entries(filters).map(([key, val]) => {
          filterStr += `&${key}_like=${val}`
        })
      }

      return `${sortStr}${filterStr}`
    },
    async fetchData() {
      const res = await fetch(`http://localhost:8080/foreignUsers?_limit=${this.limit}&_page=${this.page}${this.constructFilterAndSorts()}`);
      const data = await res.json();
      this.tableData = data
    },
    toggleFavRow({ el, item }) {
      let favItemIds = JSON.parse(localStorage.getItem("favRows"));
      if (!favItemIds) {
        favItemIds = {};
      }
      if (favItemIds[item.id]) {
        el.currentTarget.parentNode.parentNode.classList.remove('favorite-row');
        delete favItemIds[item.id];
      }
      else {
        el.currentTarget.parentNode.parentNode.classList.add('favorite-row');
        favItemIds[item.id] = true;
      }

      localStorage.setItem("favRows", JSON.stringify(favItemIds));
    },
    changePagination(newPageNumber) {
      this.page = newPageNumber;
      this.fetchData();
    },
    changePageSize(newPageSize) {
      this.limit = newPageSize;
      this.fetchData();
    },
    updateSortMode(sortColumn, mode) {
      const cloneHeaders = JSON.parse(JSON.stringify(this.headers))
      this.headers = cloneHeaders.map(item => {
        if (item.key === sortColumn && mode) {
          item.sortMode = mode
        } else {
          item.sortMode = null
        }
        return item
      })
    }
  },
  created() {
    const { sort, filter, mode } = this.$route.query;
    if (sort && mode) {
      this.updateSortMode(sort, mode)
    }
    this.fetchData();
  },
};
</script>

<template>
  <main>
    <router-link to="/">
      <button>صفحه اصلی</button>
    </router-link>
    <DataFilters :filters="filtersArray" />
    <ThePaginatedDataTable v-if="tableData && tableData.length" :data="tableData" :headers="headers"
      @toggle-fav-row="toggleFavRow" />
    <DataPagination @changePage="changePagination" @changePageSize="changePageSize" :page="page" :pageSize="limit" />
  </main>
</template>

<style scoped>
button {
  background-color: rgba(0, 182, 205, 0.7);
  border: none;
  outline: none;
  padding: 8px;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.7);
}
</style>