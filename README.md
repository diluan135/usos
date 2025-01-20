# Public Transport Data Processor / Processador de Dados do Transporte Público

A system developed in **Vue.js** for processing millions of public transport user data in Ponta Grossa. It uses **Laravel** as the backend framework and **MySQL** as the database. The application does not include real user data, allowing users to configure their own environment as needed.

Um sistema desenvolvido em **Vue.js** para processar milhões de dados relacionados ao transporte público de Ponta Grossa. Ele utiliza **Laravel** como framework de backend e **MySQL** como banco de dados. O aplicativo não contém dados reais de usuários, permitindo que os usuários configurem seu próprio ambiente conforme necessário.

---

## Features / Funcionalidades

- High-performance data processing.
- Integration with **Laravel** for robust backend operations.
- Flexible database configuration with **MySQL**.
- Fully customizable via `.env` configuration.

- Processamento de dados de alta performance.
- Integração com **Laravel** para operações robustas no backend.
- Configuração flexível de banco de dados com **MySQL**.
- Totalmente personalizável através do arquivo `.env`.

---


## Technologies Used / Tecnologias Utilizadas
- Backend: Laravel (PHP)
- Frontend: Vue.js
- Database: MySQL

---
## Requirements / Requisitos

- **PHP** >= 8.0
- **Composer** >= 2.x
- **MySQL** >= 5.7
- **Laravel** >= 9.x

---

## Installation / Instalação

### Steps / Passos

1. Clone the repository / Clone o repositório:

   ```bash
   git clone https://github.com/diluan135/usos.git

2. Access the project directory / Acesse o diretório do projeto:

3. Install backend dependencies with Composer / Instale as dependências do backend com o Composer:

   ```bash
   composer install

4. Configure the .env file with your database credentials / Configure o arquivo .env com as credenciais do seu banco de dados.

5. Run database migrations / Execute as migrações do banco de dados:
   
   ```bash
   php artisan migrate

6. Start the development server / Inicie o servidor de desenvolvimento:
   
   ```bash
   php artisan serve

---

After starting the server, access the system at http://localhost:8000. Configure the .env file according to your database and system preferences.

Após iniciar o servidor, acesse o sistema em http://localhost:8000. Configure o arquivo .env de acordo com seu banco de dados e preferências do sistema.
