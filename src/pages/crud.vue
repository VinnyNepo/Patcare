<template>
  <v-container class="py-8">
    <v-row class="align-center mb-4">
      <v-col cols="12" md="8">
        <div class="text-h4 font-weight-bold">Cadastro de pets</div>
        <div class="text-subtitle-1 text-medium-emphasis">
          Gerencie os animais e acompanhe o status dos planos.
        </div>
      </v-col>

      <v-col cols="12" md="4" class="text-md-right">
        <v-btn color="primary" size="large" @click="openCreateDialog">
          Novo cadastro
        </v-btn>
      </v-col>
    </v-row>

    <v-card rounded="xl" elevation="1">
      <v-data-table
        :headers="headers"
        :items="records"
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
          <v-chip
            :color="item.ativo ? 'success' : 'error'"
            variant="tonal"
            size="small"
          >
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template #item.acoes="{ item }">
          <div class="d-flex ga-2">
            <v-btn size="small" variant="text" @click="openEditDialog(item)">Editar</v-btn>
            <v-btn size="small" color="error" variant="text" @click="deletePet(item)">Excluir</v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <PetFormDialog v-model="dialogOpen" :pet="currentPet" @save="handleSave" />

    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="2600" location="bottom right">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PetFormDialog from '@/components/PetFormDialog.vue'
import { usePetcareStore, type PetRecord } from '@/composables/usePetcareStore'

const { records, addPet, updatePet, removePet } = usePetcareStore()

const headers = [
  { title: 'Pet', key: 'nome' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Responsável', key: 'responsavel' },
  { title: 'Cidade', key: 'cidade' },
  { title: 'Plano', key: 'valorMensal' },
  { title: 'Status', key: 'ativo' },
  { title: 'Ações', key: 'acoes', sortable: false },
]

const dialogOpen = ref(false)
const currentPet = ref<Partial<PetRecord> | null>(null)
const editingId = ref<number | null>(null)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))

const createEmptyPet = (): Partial<PetRecord> => ({
  nome: '',
  tipo: 'Cachorro',
  raca: '',
  idade: 1,
  peso: 1,
  responsavel: '',
  telefone: '',
  cep: '',
  rua: '',
  bairro: '',
  cidade: '',
  valorMensal: 0,
  ativo: true,
  dataCadastro: new Date().toISOString().slice(0, 10),
  ultimaVisita: new Date().toISOString().slice(0, 10),
  observacao: '',
})

const notify = (message: string, color: 'success' | 'error' = 'success') => {
  snackbarText.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

const openCreateDialog = () => {
  editingId.value = null
  currentPet.value = createEmptyPet()
  dialogOpen.value = true
}

const openEditDialog = (pet: PetRecord) => {
  editingId.value = pet.id
  currentPet.value = { ...pet }
  dialogOpen.value = true
}

const handleSave = (pet: PetRecord) => {
  if (editingId.value !== null) {
    updatePet(editingId.value, pet)
    notify('Cadastro atualizado com sucesso.')
  } else {
    addPet(pet)
    notify('Cadastro realizado com sucesso.')
  }

  dialogOpen.value = false
  currentPet.value = null
  editingId.value = null
}

const deletePet = (pet: PetRecord) => {
  if (!window.confirm(`Deseja excluir o cadastro de ${pet.nome}?`)) {
    return
  }

  removePet(pet.id)
  notify('Registro removido com sucesso.')
}
</script>
