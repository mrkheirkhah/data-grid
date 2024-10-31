<script>
import ThePaginatedDataTable from "../components/ThePaginatedDataTable.vue";
import DataFilters from "../components/DataFilters.vue";

let rawData = [];
let filteredData = [];

export default {
  components: { ThePaginatedDataTable, DataFilters },
  data() {
    return {
      tableData: [],
      dataCount: 0,
      dataLengthToShow: 100,
      currentDataLengthShowing: 100,
      headers: [
        { title: "#", sortable: false, key: "index", sortMode: null },
        { title: "#", sortable: false, key: "fav", sortMode: null },
        {
          title: "نام تغییر دهنده",
          sortable: true,
          key: "name",
          sortMode: null,
        },
        { title: "تاریخ", sortable: true, key: "date", sortMode: null },
        { title: "نام آگهی", sortable: true, key: "title", sortMode: null },
        { title: "فیلد", sortable: true, key: "field", sortMode: null },
        {
          title: "مقدار قدیمی",
          sortable: true,
          key: "old_value",
          sortMode: null,
        },
        {
          title: "مقدار جدید",
          sortable: true,
          key: "new_value",
          sortMode: null,
        },
      ],
      filtersArray: [
        { field: "name", type: "text", label: "نام شخص تغییر دهنده" },
        { field: "date", type: "date", label: "تاریخ" },
        { field: "title", type: "text", label: "نام آگهی" },
        { field: "field", type: "text", label: "فیلد" },
      ],
    };
  },
  watch: {
    $route() {
      const { sort: key, mode, filter } = this.$route.query;
      try {
        if (filter) this.filterData({ filter: JSON.parse(decodeURI(filter)) });
      }catch(ex) {
        console.log(ex)
      }
      if (key && mode) {
        this.sortData({ key, mode });
      }
    },
  },
  methods: {
    async fetchData() {
      const res = await fetch("http://localhost:8080/foreignUsers");
      const data = await res.json();
      rawData = data;
      filteredData = data;
      this.dataCount = rawData.length
      this.tableData = rawData.slice(0, 100);
      const { sort: key, mode, filter } = this.$route.query;
      if (filter) {
        this.filterData({ filter: JSON.parse(decodeURI(filter)) });
      }
      if (key && mode) {
        this.sortData({ key, mode });
      }
    },
    sortData({ key, mode }) {
      const headerIndex = this.headers.findIndex((item) => item.key === key);
      switch (mode) {
        case "ASC":
          this.headers[headerIndex].sortMode = "ASC";
          filteredData = [...rawData].sort((a, b) =>
            a[key] < b[key] ? -1 : 1
          );
          break;
        case "null":
          this.headers[headerIndex].sortMode = null;
          filteredData = [...rawData];
          break;
        case "DEC":
          this.headers[headerIndex].sortMode = "DEC";
          filteredData = [...rawData].sort((a, b) =>
            a[key] < b[key] ? 1 : -1
          );
          break;
      }
      this.tableData = filteredData.slice(0, this.currentDataLengthShowing);
    },
    showMoreData() {
      const newDataLength =
        this.currentDataLengthShowing + this.dataLengthToShow;
      this.currentDataLengthShowing = newDataLength;
      this.tableData = filteredData.slice(0, newDataLength);
    },
    filterData({ filter }) {
      filteredData = rawData
      if (Object.keys(filter).length < 1) {
        this.tableData = filteredData.slice(0, this.currentDataLengthShowing);
        return;
      } else {
        for (const key in filter) {
          filteredData = filteredData.filter((item) => {
            return item[key].toLowerCase().includes(filter[key].toLowerCase());
          });
        }
        this.tableData = filteredData.slice(0, this.currentDataLengthShowing);
      }
    },
    toggleFavRow({ el, item}) {
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
    }
  },
  created() {
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
    <ThePaginatedDataTable
      v-if="tableData && tableData.length"
      :data="tableData"
      :dataCount="dataCount"
      :headers="headers"
      @show-more-data="showMoreData"
      @toggle-fav-row="toggleFavRow"
    />
  </main>
</template>

<style scoped>
  button {
    background-color: rgba(0, 182, 205, 0.7);
    border: none;
    outline: none;
    padding: 8px;
    border-radius: 8px;
    color: rgba(0,0,0,0.7);
  }
</style>