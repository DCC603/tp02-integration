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

test('Testando cadastro de respostas para uma pergunta existente', () => {
  modelo.cadastrar_pergunta('Qual a capital do Brasil?');
  const perguntas = modelo.listar_perguntas();
  const idPergunta = perguntas[0].id_pergunta;

  modelo.cadastrar_resposta(idPergunta, 'Brasília');
  modelo.cadastrar_resposta(idPergunta, 'Rio de Janeiro (errado)');
  modelo.cadastrar_resposta(idPergunta, 'São Paulo (errado)');

  const respostas = modelo.listar_respostas(idPergunta);
  expect(respostas.length).toBe(3);
  expect(respostas[0].texto).toBe('Brasília');
  expect(respostas[1].texto).toBe('Rio de Janeiro (errado)');
  expect(respostas[2].texto).toBe('São Paulo (errado)');
  expect(respostas[0].id_pergunta).toBe(idPergunta);
  expect(respostas[1].id_pergunta).toBe(idPergunta);

  const perguntasAtualizadas = modelo.listar_perguntas();
  expect(perguntasAtualizadas[0].num_respostas).toBe(3);
});

test('Testando listar respostas para pergunta sem respostas', () => {
  modelo.cadastrar_pergunta('Pergunta sem respostas?');
  const perguntas = modelo.listar_perguntas();
  const idPergunta = perguntas[0].id_pergunta;

  const respostas = modelo.listar_respostas(idPergunta);
  expect(respostas.length).toBe(0);
});

test('Testando cadastrar resposta para pergunta inexistente', () => {
  const idPerguntaInexistente = 999;
  modelo.cadastrar_resposta(idPerguntaInexistente, 'Resposta para lugar nenhum');
  const respostas = modelo.listar_respostas(idPerguntaInexistente);
  expect(respostas.length).toBe(0);
});