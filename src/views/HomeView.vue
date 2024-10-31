<script>
export default {};
</script>

<template>
  <main>
    <router-link :to="{name: 'infiniteScrollView'}">
      <button>
        جدول با infinite scroll
      </button>
    </router-link>
    <router-link :to="{name: 'paginationView'}">
      <button>
        جدول با paginated view
      </button>
    </router-link>
  </main>
</template>

<style scoped>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button {
    background-color: rgba(0, 182, 205, 0.7);
    border: none;
    outline: none;
    padding: 16px;
    border-radius: 8px;
    color: rgba(0,0,0,0.7);
    margin: 0 20px;
  }
</style>
