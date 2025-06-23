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

test('Testando cadastro de resposta', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital da França?');
  const idResposta = modelo.cadastrar_resposta(idPergunta, 'Paris');
  expect(idResposta).toBeGreaterThan(0);

  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Paris');
});

test('Testando contagem de respostas', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital da Alemanha?');
  modelo.cadastrar_resposta(idPergunta, 'Berlim');
  modelo.cadastrar_resposta(idPergunta, 'Hamburgo');

  const numRespostas = modelo.get_num_respostas(idPergunta);
  expect(numRespostas).toBe(2);
});

test('Testando busca de pergunta por ID', () => {
  const idPergunta = modelo.cadastrar_pergunta('Quanto é 10 / 2?');
  const pergunta = modelo.get_pergunta(idPergunta);

  expect(pergunta.texto).toBe('Quanto é 10 / 2?');
  expect(pergunta.id_usuario).toBe(1);
});

test('Testando listar perguntas com respostas associadas', () => {
  const idPergunta1 = modelo.cadastrar_pergunta('Pergunta 1');
  const idPergunta2 = modelo.cadastrar_pergunta('Pergunta 2');

  modelo.cadastrar_resposta(idPergunta1, 'Resposta para Pergunta 1');
  modelo.cadastrar_resposta(idPergunta1, 'Outra resposta para Pergunta 1');
  modelo.cadastrar_resposta(idPergunta2, 'Resposta para Pergunta 2');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(2);
  expect(perguntas[0].num_respostas).toBe(2);
  expect(perguntas[1].num_respostas).toBe(1);
});