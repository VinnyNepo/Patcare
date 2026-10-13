<template>
  <v-container class="py-8">
    <v-row class="mb-5">
      <v-col cols="12">
        <div class="text-h4 font-weight-bold">Consulta de pets</div>
      </v-col>
    </v-row>

    <v-card rounded="xl" class="mb-6" elevation="1">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="filters.termo"
              label="Buscar por nome"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.tipo"
              :items="petTypeOptions"
              label="Tipo de pet"
              variant="outlined"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.ativo"
              :items="statusOptions"
              label="Status do plano"
              variant="outlined"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model.number="filters.valorMinimo"
              label="Plano a partir de"
              type="number"
              min="0"
              step="0.01"
              prefix="R$"
              variant="outlined"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model.number="filters.valorMaximo"
              label="Plano até"
              type="number"
              min="0"
              step="0.01"
              prefix="R$"
              variant="outlined"
              clearable
            />
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <v-btn variant="text" color="primary" @click="clearFilters">
            Limpar filtros
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-card rounded="xl" elevation="1">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Resultados</span>
        <v-chip color="primary">{{ filteredRecords.length }} registros</v-chip>
      </v-card-title>

      <v-card-text v-if="filteredRecords.length === 0" class="py-8 text-center text-medium-emphasis">
        Nenhum registro encontrado com os filtros selecionados.
      </v-card-text>

      <v-data-table
        v-else
        :headers="headers"
        :items="filteredRecords"
        :items-per-page="8"
        class="elevation-0"
      >
        <template #item.nome="{ item }">
          <div class="font-weight-medium">{{ item.nome }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.raca }}</div>
        </template>

        <template #item.tipo="{ item }">
          <v-chip size="small" color="secondary" variant="tonal">
            {{ item.tipo }}
          </v-chip>
        </template>

        <template #item.valorMensal="{ item }">
          {{ formatCurrency(item.valorMensal) }}
        </template>

        <template #item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'success' : 'error'" variant="tonal" size="small">
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template #item.ultimaVisita="{ item }">
          {{ formatDate(item.ultimaVisita) }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { petTypeOptions, usePetcareStore, type PetType } from '@/composables/usePetcareStore'

const { records } = usePetcareStore()

const statusOptions: { title: string; value: boolean | null }[] = [
  { title: 'Todos', value: null },
  { title: 'Ativo', value: true },
  { title: 'Inativo', value: false },
]

const headers = [
  { title: 'Nome', key: 'nome' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Responsável', key: 'responsavel' },
  { title: 'Cidade', key: 'cidade' },
  { title: 'Plano', key: 'valorMensal' },
  { title: 'Última visita', key: 'ultimaVisita' },
  { title: 'Status', key: 'ativo' },
]

const filters = reactive({
  termo: '',
  tipo: null as PetType | null,
  ativo: null as boolean | null,
  valorMinimo: null as number | null | '',
  valorMaximo: null as number | null | '',
})

const clearFilters = () => {
  filters.termo = ''
  filters.tipo = null
  filters.ativo = null
  filters.valorMinimo = null
  filters.valorMaximo = null
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))

const formatDate = (value: string) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

const filteredRecords = computed(() =>
  records.value.filter((pet) => {
    const term = filters.termo.trim().toLowerCase()
    const matchesName = !term || String(pet.nome).toLowerCase().includes(term)
    const matchesType = !filters.tipo || pet.tipo === filters.tipo
    const matchesStatus = filters.ativo === null || pet.ativo === filters.ativo
    const matchesMinimum =
      filters.valorMinimo === null ||
      filters.valorMinimo === '' ||
      pet.valorMensal >= filters.valorMinimo
    const matchesMaximum =
      filters.valorMaximo === null ||
      filters.valorMaximo === '' ||
      pet.valorMensal <= filters.valorMaximo

    return matchesName && matchesType && matchesStatus && matchesMinimum && matchesMaximum
  }),
)
</script>
