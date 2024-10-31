<template>
    <div class="pagination-container">
        <div>
            <template v-if="page > 1">
                <button @click="$emit('changePage', page - 1)">صفحه قبل</button>
            </template>
            <div style="margin: 0 12px">صفحه {{ page.toLocaleString('fa-IR') }}</div>
            <br />
            <button @click="$emit('changePage', page + 1)">صفحه بعد</button>
        </div>
        <input min="5" type="number" @change="(e) => $emit('changePageSize', e.target.value)" :value="pageSize">
    </div>
</template>

<script>
export default {
    props: {
        page: {
            required: true,
            type: Number,
        },
        pageSize: {
            required: true,
            type: Number,
        },
    },
};
</script>

<style scoped>
.pagination-container {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.pagination-container div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

input {
    width: 100px;
    background-color: #f1f1f8;
    color: rgba(0, 0, 0, 0.7);
    height: 32px;
    border: 0;
    outline: 0;
    padding: 7px;
    border-radius: 0 7px 7px 0;
    box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.3);
    margin: 0 15px 0 0;
}

button {
    width: fit-content;
    background-color: #f1f1f8;
    color: rgba(0, 0, 0, 0.5);
    height: 32px;
    font-size: 22px;
    line-height: 22px;
    margin: 0;
    border: 0;
    outline: 0;
    border-radius: 7px 0 0 7px;
    box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.3);
}
</style>
