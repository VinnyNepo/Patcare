<template>
  <v-dialog
    :model-value="modelValue"
    max-width="760"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 text-h5">
        {{ pet?.id ? 'Editar cadastro' : 'Novo cadastro' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="savePet">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localPet.nome"
                label="Nome do pet"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="localPet.tipo"
                :items="petTypeOptions"
                label="Tipo"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="localPet.raca"
                label="Raça"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                v-model.number="localPet.idade"
                label="Idade"
                type="number"
                min="0"
                variant="outlined"
                :rules="[requiredNumberRule]"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                v-model.number="localPet.peso"
                label="Peso (kg)"
                type="number"
                min="0"
                step="0.1"
                variant="outlined"
                :rules="[requiredNumberRule]"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="localPet.valorMensal"
                label="Valor mensal"
                type="number"
                min="0"
                prefix="R$"
                variant="outlined"
                :rules="[requiredNumberRule]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localPet.responsavel"
                label="Responsável"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localPet.telefone"
                label="Telefone"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="localPet.cep"
                label="CEP"
                variant="outlined"
                :rules="[requiredRule]"
                @keyup.enter="buscarCep"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-btn
                color="primary"
                class="mt-1"
                :loading="loadingCep"
                block
                @click="buscarCep"
              >
                Buscar
              </v-btn>
            </v-col>

            <v-col cols="12" md="6">
              <v-checkbox
                v-model="localPet.ativo"
                label="Ativo no plano"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localPet.rua"
                label="Rua"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="localPet.bairro"
                label="Bairro"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="localPet.cidade"
                label="Cidade"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localPet.dataCadastro"
                label="Data de cadastro"
                type="date"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localPet.ultimaVisita"
                label="Última visita"
                type="date"
                variant="outlined"
                :rules="[requiredRule]"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="localPet.observacao"
                label="Observações"
                rows="3"
                auto-grow
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-alert
            v-if="cepError"
            type="error"
            variant="tonal"
            class="mb-4"
            dense
          >
            {{ cepError }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="savePet">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import type { PetRecord } from '@/composables/usePetcareStore'
import { petTypeOptions } from '@/composables/usePetcareStore'

const props = defineProps<{
  modelValue: boolean
  pet: Partial<PetRecord> | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [value: PetRecord]
}>()

const form = ref<any>(null)
const loadingCep = ref(false)
const cepError = ref('')

const createBlankPet = (): Partial<PetRecord> => ({
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

const localPet = ref<Partial<PetRecord>>(createBlankPet())

watch(
  () => props.pet,
  (nextPet) => {
    localPet.value = { ...createBlankPet(), ...(nextPet ?? {}) }
    cepError.value = ''
  },
  { immediate: true, deep: true },
)

const closeDialog = () => {
  emit('update:modelValue', false)
}

const requiredRule = (value: string | number | boolean | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return 'Campo obrigatório.'
  }

  if (typeof value === 'string' && value.trim() === '') {
    return 'Campo obrigatório.'
  }

  return true
}

const requiredNumberRule = (value: number | string | null | undefined) => {
  const numericValue = Number(value)
  if (Number.isNaN(numericValue) || numericValue <= 0) {
    return 'Informe um valor válido.'
  }

  return true
}

const buscarCep = async () => {
  const formattedCep = localPet.value.cep?.replace(/\D/g, '')

  if (!formattedCep || formattedCep.length !== 8) {
    cepError.value = 'Informe um CEP válido com 8 dígitos.'
    return
  }

  loadingCep.value = true
  cepError.value = ''

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`)

    if (response.data.erro) {
      throw new Error('CEP não encontrado')
    }

    localPet.value.rua = response.data.logradouro ?? ''
    localPet.value.bairro = response.data.bairro ?? ''
    localPet.value.cidade = response.data.localidade ?? ''
  } catch (error) {
    console.error(error)
    cepError.value = 'Não foi possível carregar o endereço. Verifique o CEP e tente novamente.'
  } finally {
    loadingCep.value = false
  }
}

const savePet = async () => {
  const validation = await form.value?.validate()
  if (validation && !validation.valid) {
    return
  }

  const record = {
    ...createBlankPet(),
    ...(props.pet ?? {}),
    ...localPet.value,
  } as PetRecord

  emit('save', record)
  closeDialog()
}
</script>
