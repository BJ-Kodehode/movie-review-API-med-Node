## Fjellfilm Movie Review API

Node.js + Express API backed by SQL Server for managing movies and reviews.

### Krav og oppsett

1) Installer Node 18+ og SQL Server (lokalt eller Azure SQL)

2) Installer dependencies
```bash
npm install
```

3) Konfigurer miljøvariabler
Lag en `.env` basert på feltene under:
```
DB_SERVER=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=fjellfilm
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
DB_PORT=1433
PORT=3000
```

4) Kjør database schema
Kjør `db/schema.sql` mot databasen `fjellfilm`.

5) Start server
```bash
npm run dev
```

### Endepunkter

- GET `/movies/` – Hent alle filmer
- GET `/movies/:id` – Hent én film
- POST `/movies/` – Opprett film (body: title, releaseYear, optional director, genre)
- PUT `/movies/:id` – Oppdater film (samme body-validering)
- POST `/movies/:id/reviews` – Opprett review (body: reviewAuthor, reviewText, rating 1-5)
- GET `/movies/:id/reviews` – Hent reviews for film

### Statuskoder og validering

- Manglende felt: 400
- Ikke funnet: 404
- Opprettet: 201
- Oppdatert: 200
- Uventet feil: 500

### Postman

Se `postman/Fjellfilm.postman_collection.json` for eksempel-requests.

### Scripts

Legg til i `package.json`:
```
"scripts": {
  "start": "node src/main.js",
  "dev": "nodemon"
}
```

### Ekstra dependencies
### Enkel web UI

Vi server en liten statisk side fra `public/` som lister filmer:

- Åpne `http://localhost:3000/` i nettleser for å se filmlisten
- Filene ligger i `public/index.html` og `public/styles.css`


- express – HTTP server
- mssql, tedious – SQL Server driver
- dotenv – miljøvariabler
 - nodemon (dev) – automatisk restart ved filendringer

