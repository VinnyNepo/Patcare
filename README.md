# PetCare

Aplicação de gestão de pets desenvolvida com Vue 3, Vite e Vuetify.

## Integrantes

- Antonio Vinicius Lima Neponuceno - https://github.com/VinnyNepo
- Francisco Everaldo Lima Furtado - https://github.com/everaldo321
- Equipe PetCare

## Tema

Sistema para cadastrar, consultar e manter registros de pets, incluindo plano mensal, dados do responsável, endereço e histórico de visitas.

## Funcionalidades

- CRUD completo com tabela, edição e exclusão com confirmação
- Validação de campos obrigatórios e valores numéricos
- Consulta com busca textual e filtros combinados por tipo de pet, status do plano e faixa de valor mensal
- Botão para limpar todos os filtros da consulta
- Persistência em localStorage para manter os dados ao recarregar a página
- Integração com a API ViaCEP para preenchimento automático do endereço
- Navegação por rotas com Vue Router
- Interface responsiva em Vuetify

## Tecnologias

- Vue 3
- Vite
- Vuetify
- TypeScript
- Axios
- Vue Router

## Como executar

```bash
npm install
npm run dev
```

A aplicação ficará disponível em http://localhost:3000.

## Build

```bash
npm run build
```

## Scripts disponíveis

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run type-check`
