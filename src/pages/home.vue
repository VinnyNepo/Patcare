<template>
  <v-container class="py-8">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card color="primary" class="pa-6 rounded-xl text-white" elevation="4">
          <v-row align="center">
            <v-col cols="12" md="8">
              <div class="text-overline mb-2">Painel de gestão</div>
              <div class="text-h3 font-weight-bold mb-2">PetCare</div>
              <div class="text-body-1 opacity-90">
                Centralize cadastros, consultas e monitoramento do atendimento dos seus pets.
              </div>
            </v-col>

            <v-col cols="12" md="4" class="text-md-right">
              <v-btn color="white" variant="flat" class="text-primary" to="/crud">
                Cadastrar agora
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="metric in metrics" :key="metric.title" cols="12" sm="6" md="3">
        <v-card rounded="xl" elevation="1" class="h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-subtitle-2 text-medium-emphasis">{{ metric.title }}</div>
              <v-icon :color="metric.color">{{ metric.icon }}</v-icon>
            </div>
            <div class="text-h4 font-weight-bold">{{ metric.value }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1" class="h-100">
          <v-card-title class="d-flex align-center justify-space-between pa-5">
            <span>Atalhos</span>
            <v-icon color="primary">mdi-lightning-bolt</v-icon>
          </v-card-title>

          <v-card-text class="pa-5 pt-0">
            <v-btn block color="primary" class="mb-3" to="/crud">
              Ir para o CRUD
            </v-btn>
            <v-btn block variant="outlined" color="primary" to="/consulta">
              Abrir consulta
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1" class="h-100">
          <v-card-title class="pa-5">Cadastros recentes</v-card-title>
          <v-card-text class="pa-0 px-5 pb-5">
            <v-list lines="two">
              <v-list-item
                v-for="pet in recentRecords"
                :key="pet.id"
                :title="pet.nome"
                :subtitle="`${pet.tipo} • ${pet.responsavel}`"
              >
                <template #prepend>
                  <v-avatar color="primary-lighten-4">
                    <v-icon color="primary">mdi-paw</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePetcareStore } from '@/composables/usePetcareStore'

const { records, totalAtivos, ticketMedio } = usePetcareStore()

const metrics = computed(() => [
  { title: 'Pets cadastrados', value: records.value.length, icon: 'mdi-dog', color: 'primary' },
  { title: 'Ativos', value: totalAtivos.value, icon: 'mdi-check-circle', color: 'success' },
  { title: 'Inativos', value: records.value.length - totalAtivos.value, icon: 'mdi-bell-alert', color: 'warning' },
  { title: 'Ticket médio', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio.value), icon: 'mdi-currency-brl', color: 'teal' },
])

const recentRecords = computed(() =>
  [...records.value]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 4),
)
</script>