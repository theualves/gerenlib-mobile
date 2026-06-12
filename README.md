# Gerenlib Mobile (Acervus)

O **Gerenlib Mobile** é um aplicativo desenvolvido em React Native com Expo para o gerenciamento e registro de devoluções de livros. Ele funciona integrado à API do `gerenlib-backend` hospedada no Render, permitindo criar, listar, editar e excluir registros de empréstimos em tempo real.

## 📱 Funcionalidades

- **Registrar Devoluções:** Formulário dinâmico para cadastrar o título do livro, nome do leitor e data.
- **Histórico em Tempo Real:** Listagem rolável dos livros emprestados consumindo a API.
- **Editar e Excluir:** Gerenciamento completo (CRUD) dos registros direto pelo celular.
- **Pull-to-Refresh:** Deslize a tela para baixo no histórico para atualizar a lista instantaneamente.

---

## 🛠️ Tecnologias Utilizadas

- React Native
- Expo
- JavaScript (ES6+)
- Axios
- React Hooks (`useState` e `useEffect`)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- Node.js
- Git
- Expo Go (Android ou iOS)

---

### 1. Clone o repositório

```bash
git clone https://github.com/theualves/gerenlib-mobile.git
```

---

### 2. Acesse a pasta do projeto

```bash
cd gerenlib-mobile
```

---

### 3. Instale as dependências

```bash
npm install
```

ou

```bash
npm install --legacy-peer-deps
```

(caso ocorra algum conflito de dependências)

---

### 4. Verifique a URL da API

Abra o arquivo onde a API é configurada e confirme que a URL do backend está correta:

```javascript
const API_URL = "https://gerenlib-backend.onrender.com/api/loans";
```

Caso esteja executando o backend localmente, altere para o endereço correspondente.

---

### 5. Inicie o servidor Expo

```bash
npx expo start
```

ou

```bash
npm start
```

Após executar o comando, será aberto o Metro Bundler no navegador.

---

### 6. Execute no celular

1. Abra o aplicativo **Expo Go**.
2. Escaneie o QR Code exibido no terminal ou navegador.
3. Aguarde o carregamento do aplicativo.

---

### 7. Execute em um emulador (Opcional)

#### Android Studio

```bash
npx expo start --android
```

#### iOS (macOS)

```bash
npx expo start --ios
```

---

## 📂 Estrutura Básica do Projeto

```text
gerenlib-mobile/
│
├── assets/          # Imagens e ícones
├── App.js           # Tela principal da aplicação
├── package.json     # Dependências do projeto
└── README.md
```

---

## 🔗 Integração com Backend

O aplicativo consome a API REST do projeto:

```text
https://gerenlib-backend.onrender.com
```

Endpoints utilizados:

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /api/loans | Lista todos os registros |
| POST | /api/loans | Cria um novo registro |
| PUT | /api/loans/:id | Atualiza um registro |
| DELETE | /api/loans/:id | Remove um registro |

---

## ✨ Funcionalidades Implementadas

- Cadastro de empréstimos/devoluções.
- Atualização de registros.
- Exclusão de registros.
- Histórico de empréstimos.
- Atualização manual da lista.
- Comunicação em tempo real com a API.

---

Projeto desenvolvido para fins acadêmicos e educacionais.
