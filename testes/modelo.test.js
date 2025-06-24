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
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('cadastrar_resposta deve adicionar uma resposta a uma pergunta existente', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Pergunta de teste para respostas');
  const texto_resposta = 'Esta é uma resposta de teste.';
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, texto_resposta);
  expect(id_resposta).toBeGreaterThan(0);
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe(texto_resposta);
});

test('get_pergunta deve retornar undefined para um ID de pergunta inexistente', () => {
  const id_inexistente = 999;
  const pergunta = modelo.get_pergunta(id_inexistente);
  expect(pergunta).toBeUndefined();
});

