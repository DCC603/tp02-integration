const fs = require('fs');
const path = require('path');
const betterSqlite3 = require('better-sqlite3');
const bd_utils = require('../../bd/bd_utils');

/* ---------- prepara banco limpo (clone) ---------- */
const origem = path.join(__dirname, '../../bd/esmforum.db');
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
const tmpDb = path.join(tmpDir, 'id_test.db');
fs.copyFileSync(origem, tmpDb);

const db = new betterSqlite3(tmpDb);
db.prepare('DELETE FROM perguntas').run();
db.close();

bd_utils.reconfig(tmpDb);

/* ---------- app / supertest ---------- */
const request = require('supertest');
const app = require('../../server');

describe('GET /perguntas/:id', () => {
  let idGerado;

  /* cadastra 1 pergunta via API antes dos testes */
  beforeAll(async () => {
    const post = await request(app)
      .post('/perguntas')
      .send({ pergunta: 'Qual a capital da França?' });

    idGerado = post.body.id_pergunta;
    expect([200, 201]).toContain(post.statusCode);
  });

  it('deve devolver a pergunta existente (200)', async () => {
    const res = await request(app).get(`/perguntas/${idGerado}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id_pergunta).toBe(idGerado);
    expect(res.body.texto).toBe('Qual a capital da França?');
  });

  it('deve devolver 404 quando o ID não existe', async () => {
    const res = await request(app).get('/perguntas/9999');
    expect(res.statusCode).toBe(404);
  });
});
