# 🐧 StudySync - Gamified Learning Platform

> Uma plataforma fullstack de ensino de programação gamificada, inspirada na experiência do Duolingo, focada em Lógica de Programação e JavaScript.

## 📖 Sobre o Projeto

O **StudySync** é uma aplicação web que transforma o estudo de código em um jogo. O usuário avança por um mapa de unidades (Fundamentos, Condicionais, Loops), resolve desafios gerados dinamicamente e ganha recompensas visuais.

Diferente de quizzes estáticos, o StudySync integra-se com a **QuizAPI** para fornecer um banco de dados infinito de questões técnicas reais, garantindo que o aprendizado nunca fique repetitivo.

### ✨ Principais Funcionalidades

* **🎮 Gamificação Real:** Sistema de XP, desbloqueio de fases (Lock/Unlock system) e feedback visual imediato.
* **🧠 Conteúdo Infinito (IA):** Integração com API externa para gerar perguntas de programação on-demand quando o conteúdo fixo acaba.
* **🎨 UI Dinâmica:**
    * **Ciclo Dia/Noite:** O tema muda automaticamente (Dia, Pôr do Sol, Noite) baseado no horário local.
    * **Estilo Kurzgesagt:** Design "Flat" com camadas de profundidade e cores vibrantes.
    * **Mascote Interativo:** O "BMO" reage aos acertos e erros do usuário.
* **💾 Persistência:** Sistema de Save automático no navegador (LocalStorage) para manter o progresso do usuário.

---

## 🛠️ Tecnologias Utilizadas

### Frontend ⚛️
* **React** (Vite): Construção da interface reativa e veloz.
* **CSS3 Moderno:** Animações CSS (Keyframes), Flexbox/Grid e Variáveis CSS.
* **Lucide React:** Ícones vetoriais leves.
* **Fetch API:** Comunicação assíncrona com o Backend.

### Backend ☕
* **Java 21+**: Linguagem base.
* **Spring Boot 3**: Framework para criação da API REST.
* **Spring Data JPA**: Camada de persistência de dados.
* **H2 Database**: Banco de dados em memória (rápido e sem configuração externa).
* **RestTemplate**: Consumo da API externa (QuizAPI).

### External API 🌐
* **QuizAPI.io**: Fonte de dados para questões de Linux, DevOps e Programação.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Java JDK 17 ou superior.
* Node.js e npm.
* Uma chave de API gratuita da [QuizAPI.io](https://quizapi.io/).

### 1. Configurando o Backend

1.  Entre na pasta do servidor:
    ```bash
    cd backend
    ```
2.  Configure sua chave da API. Abra (ou crie) o arquivo `src/main/resources/application.properties` e adicione:
    ```properties
    spring.application.name=DUO
    spring.datasource.url=jdbc:h2:mem:testdb
    spring.datasource.driverClassName=org.h2.Driver
    spring.datasource.username=sa
    spring.datasource.password=password
    spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
    spring.h2.console.enabled=true

    # QuizAPI Configuration
    quizapi.url=[https://quizapi.io/api/v1/questions](https://quizapi.io/api/v1/questions)
    quizapi.key=SUA_CHAVE_AQUI
    ```
3.  Rode o servidor Spring Boot:
    ```bash
    ./mvnw spring-boot:run
    ```
    *O Backend iniciará na porta `8080`.*

### 2. Configurando o Frontend

1.  Abra um novo terminal e entre na pasta web:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Rode o projeto:
    ```bash
    npm run dev
    ```
    *O Frontend estará disponível em `http://localhost:5173`.*

---

## 📸 Screenshots

| Mapa de Progresso | Quiz Interativo | Tela de Vitória |
|:---:|:---:|:---:|
| ![Map](link-da-imagem-mapa) | ![Quiz](link-da-imagem-quiz) | ![Win](link-da-imagem-win) |

*(Dica: Tire prints do seu projeto, suba na aba "Issues" do GitHub ou no Imgur e cole os links aqui)*

---

## 🤝 Contribuindo

Este é um projeto de portfólio, mas sugestões são bem-vindas!

1.  Faça um Fork do projeto.
2.  Crie uma Branch para sua Feature (`git checkout -b feature/NovaFeature`).
3.  Faça o Commit (`git commit -m 'Adicionando nova feature'`).
4.  Faça o Push (`git push origin feature/NovaFeature`).
5.  Abra um Pull Request.

---

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar e aprender com ele.

---

<p align="center">
  Feito com 🐧 e ☕ por <a href="https://github.com/erickvitor">Erick Vitor</a>
</p>