<template>
    <div>
        <h1>
            {{ id }}
        </h1>
    </div>
</template>

<script>
export default {
    name: "Product",
    data() {
        return {
            id: ''
        }
    },
    created() {
        console.log(this.$route.params.id)
        this.id = this.$route.params.id
    }
}
</script>