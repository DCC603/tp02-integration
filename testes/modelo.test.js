const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test('Testando get_pergunta retorna pergunta correta', () => {
  const id = modelo.cadastrar_pergunta('Pergunta correta');
  const pergunta = modelo.get_pergunta(id);
  expect(pergunta).toBeDefined();
  expect(pergunta.texto).toBe('Pergunta correta');
  expect(pergunta.id_pergunta).toBe(id);
});

test('Testando get_pergunta com id inexistente retorna undefined', () => {
  const pergunta = modelo.get_pergunta(99999);
  expect(pergunta).toBeUndefined();
});

test('Testando get_respostas para pergunta sem respostas', () => {
  const id = modelo.cadastrar_pergunta('Pergunta sem resposta');
  const respostas = modelo.get_respostas(id);
  expect(Array.isArray(respostas)).toBe(true);
  expect(respostas.length).toBe(0);
});

test('Testando listar_perguntas inclui num_respostas correto', () => {
  const id = modelo.cadastrar_pergunta('Pergunta para listar');
  modelo.cadastrar_resposta(id, 'Resposta X');
  const perguntas = modelo.listar_perguntas();
  const pergunta = perguntas.find(p => p.id_pergunta === id);
  expect(pergunta.num_respostas).toBe(1);
});


