import { computed, ref } from 'vue'

export const petTypeOptions = ['Cachorro', 'Gato', 'Pássaro', 'Peixe', 'Exótico'] as const

export type PetType = (typeof petTypeOptions)[number]

export interface PetRecord {
  id: number
  nome: string
  tipo: PetType
  raca: string
  idade: number
  peso: number
  responsavel: string
  telefone: string
  cep: string
  rua: string
  bairro: string
  cidade: string
  valorMensal: number
  ativo: boolean
  dataCadastro: string
  ultimaVisita: string
  observacao: string
}

const defaultRecords: PetRecord[] = [
  {
    id: 1,
    nome: 'Luna',
    tipo: 'Cachorro',
    raca: 'Shih Tzu',
    idade: 4,
    peso: 6.5,
    responsavel: 'Marina Costa',
    telefone: '(11) 98888-1234',
    cep: '01000-000',
    rua: 'Avenida Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    valorMensal: 220,
    ativo: true,
    dataCadastro: '2024-01-15',
    ultimaVisita: '2025-08-10',
    observacao: 'Necessita acompanhamento de alergias sazonais.',
  },
  {
    id: 2,
    nome: 'Nina',
    tipo: 'Gato',
    raca: 'Siamês',
    idade: 3,
    peso: 3.4,
    responsavel: 'João Pereira',
    telefone: '(21) 99999-4444',
    cep: '20040-020',
    rua: 'Rua do Catete',
    bairro: 'Catete',
    cidade: 'Rio de Janeiro',
    valorMensal: 180,
    ativo: true,
    dataCadastro: '2024-03-02',
    ultimaVisita: '2025-08-18',
    observacao: 'Cuidados com dieta renal.',
  },
  {
    id: 3,
    nome: 'Pip',
    tipo: 'Pássaro',
    raca: 'Calopsita',
    idade: 2,
    peso: 0.18,
    responsavel: 'Ana Souza',
    telefone: '(31) 98877-2020',
    cep: '30130-110',
    rua: 'Rua da Bahia',
    bairro: 'Centro',
    cidade: 'Belo Horizonte',
    valorMensal: 110,
    ativo: false,
    dataCadastro: '2024-05-08',
    ultimaVisita: '2025-07-21',
    observacao: 'Monitorar comportamento e vocalização.',
  },
]

const records = ref<PetRecord[]>([...defaultRecords])

const normalizePet = (pet: Partial<PetRecord>): PetRecord => ({
  id: Number(pet.id ?? Date.now()),
  nome: String(pet.nome ?? '').trim(),
  tipo: (pet.tipo as PetType) ?? 'Cachorro',
  raca: String(pet.raca ?? '').trim(),
  idade: Number(pet.idade ?? 0),
  peso: Number(pet.peso ?? 0),
  responsavel: String(pet.responsavel ?? '').trim(),
  telefone: String(pet.telefone ?? '').trim(),
  cep: String(pet.cep ?? '').trim(),
  rua: String(pet.rua ?? '').trim(),
  bairro: String(pet.bairro ?? '').trim(),
  cidade: String(pet.cidade ?? '').trim(),
  valorMensal: Number(pet.valorMensal ?? 0),
  ativo: Boolean(pet.ativo ?? true),
  dataCadastro: String(pet.dataCadastro ?? new Date().toISOString().slice(0, 10)),
  ultimaVisita: String(pet.ultimaVisita ?? new Date().toISOString().slice(0, 10)),
  observacao: String(pet.observacao ?? '').trim(),
})

export function usePetcareStore() {
  const addPet = (pet: Partial<PetRecord>) => {
    const nextRecord = normalizePet({ ...pet, id: Date.now() })
    records.value = [...records.value, nextRecord]
    return nextRecord
  }

  const updatePet = (id: number, pet: Partial<PetRecord>) => {
    const nextRecord = normalizePet({ ...pet, id })
    records.value = records.value.map((item) => (item.id === id ? nextRecord : item))
    return nextRecord
  }

  const removePet = (id: number) => {
    records.value = records.value.filter((item) => item.id !== id)
  }

  return {
    records,
    totalAtivos: computed(() => records.value.filter((pet) => pet.ativo).length),
    totalInativos: computed(() => records.value.filter((pet) => !pet.ativo).length),
    ticketMedio: computed(() => {
      if (!records.value.length) {
        return 0
      }

      const total = records.value.reduce((sum, pet) => sum + Number(pet.valorMensal || 0), 0)
      return total / records.value.length
    }),
    addPet,
    updatePet,
    removePet,
  }
}
