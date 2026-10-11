<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable" dark>
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />

      <div class="d-flex align-center px-2">
        <v-icon class="me-2">mdi-paw</v-icon>
        <span class="text-h6 font-weight-bold">PetCare</span>
      </div>

      <v-spacer />

      <div class="d-none d-md-flex ga-2">
        <v-btn to="/home" variant="text">Início</v-btn>
        <v-btn to="/crud" variant="text">CRUD</v-btn>
        <v-btn to="/consulta" variant="text">Consulta</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary location="left">
      <v-list>
        <v-list-item to="/home" title="Início" prepend-icon="mdi-home" />
        <v-list-item to="/crud" title="CRUD" prepend-icon="mdi-database" />
        <v-list-item to="/consulta" title="Consulta" prepend-icon="mdi-filter" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)
</script>