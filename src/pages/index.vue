<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/home')
})
</script>

<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>
