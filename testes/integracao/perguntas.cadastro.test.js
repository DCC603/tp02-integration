const fs = require('fs');
const path = require('path');
const betterSqlite3 = require('better-sqlite3');
const bd_utils = require('../../bd/bd_utils');


const origem = path.join(__dirname, '../../bd/esmforum.db');
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
const tmpDb = path.join(tmpDir, 'post_test.db');
fs.copyFileSync(origem, tmpDb);

const db = new betterSqlite3(tmpDb);
db.prepare('DELETE FROM perguntas').run();
db.close();


bd_utils.reconfig(tmpDb);


const request = require('supertest');
const app = require('../../server');

describe('POST /perguntas', () => {
  it('deve cadastrar e listar a nova pergunta', async () => {

    // 1. POST
    const postRes = await request(app)
      .post('/perguntas')
      .send({ pergunta: 'Quanto é 2 + 2?' });

    expect([200, 201]).toContain(postRes.statusCode);
    expect(postRes.body).toHaveProperty('id_pergunta');

    // 2. GET
    const getRes = await request(app).get('/perguntas');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBe(1);

    const pergunta = getRes.body[0];
    expect(pergunta.id_pergunta).toBe(postRes.body.id_pergunta);
    expect(pergunta.texto).toBe('Quanto é 2 + 2?');
  });
});
