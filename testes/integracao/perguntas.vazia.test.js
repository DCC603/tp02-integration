const fs = require('fs');
const path = require('path');
const bd_utils = require('../../bd/bd_utils');

// ---- 1) cria um clone zerado do banco original -----------------
const origem = path.join(__dirname, '../../bd/esmforum.db');
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
const tmpDb = path.join(tmpDir, 'test.db');

// copia o arquivo físico para garantir o mesmo esquema
fs.copyFileSync(origem, tmpDb);

// limpa a tabela (caso o banco original tenha dados de seed)
const betterSqlite3 = require('better-sqlite3');
const dbTemp = new betterSqlite3(tmpDb);
dbTemp.prepare('DELETE FROM perguntas').run();
dbTemp.close();


bd_utils.reconfig(tmpDb);


const request = require('supertest');
const app = require('../../server');


describe('GET /perguntas (vazio)', () => {
  it('deve retornar 200 e uma lista vazia', async () => {
    const res = await request(app).get('/perguntas');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
