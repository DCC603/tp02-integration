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

test('Testando cadastro de quatro respostas a duas perguntas', () => {
  const p1 = modelo.cadastrar_pergunta('Pergunta 1?');
  const p2 = modelo.cadastrar_pergunta('Pergunta 2?');
  modelo.cadastrar_resposta(p1, 'Resposta 1.1');
  modelo.cadastrar_resposta(p1, 'Resposta 1.2');
  modelo.cadastrar_resposta(p2, 'Resposta 2.1');
  modelo.cadastrar_resposta(p2, 'Resposta 2.2');
  const respostas_p1 = modelo.get_respostas(p1);
  const respostas_p2 = modelo.get_respostas(p2);

  // testa quantidade de respostas de cada pergunta
  expect(respostas_p1.length).toBe(2);
  expect(respostas_p2.length).toBe(2);

  // testa o texto das respostas
  expect(respostas_p1[0].texto).toBe('Resposta 1.1');
  expect(respostas_p1[1].texto).toBe('Resposta 1.2');
  expect(respostas_p2[0].texto).toBe('Resposta 2.1');
  expect(respostas_p2[1].texto).toBe('Resposta 2.2');
});

test('Testando a captura de uma pergunta', () => {
  const id1 = modelo.cadastrar_pergunta('Pergunta 1?');
  const id2 = modelo.cadastrar_pergunta('Pergunta 2?');
  const pergunta1 = modelo.get_pergunta(id1);
  const pergunta2 = modelo.get_pergunta(id2);
  expect(pergunta1.id_pergunta).toBe(id1);
  expect(pergunta1.texto).toBe('Pergunta 1?');
  expect(pergunta2.id_pergunta).toBe(id2);
  expect(pergunta2.texto).toBe('Pergunta 2?');
});