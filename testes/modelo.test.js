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

test('Cadastro e recuperação de respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual a capital do Brasil?');
  const id_resp1 = modelo.cadastrar_resposta(id_pergunta, 'Brasília');
  const id_resp2 = modelo.cadastrar_resposta(id_pergunta, 'Rio de Janeiro');

  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas).toHaveLength(2);
  expect(respostas.map(r => r.texto)).toEqual(['Brasília', 'Rio de Janeiro']);
});

test('get_pergunta retorna a pergunta correta', () => {
  const id = modelo.cadastrar_pergunta('Quem descobriu o Brasil?');
  const pergunta = modelo.get_pergunta(id);

  expect(pergunta.texto).toBe('Quem descobriu o Brasil?');
  expect(pergunta.id_pergunta).toBe(id);
});

test('get_num_respostas retorna o número correto', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual a capital do Brasil?');
  modelo.cadastrar_resposta(id_pergunta, 'Brasília');
  modelo.cadastrar_resposta(id_pergunta, 'São Paulo');

  const num = modelo.get_num_respostas(id_pergunta);
  expect(num).toBe(2);
});

test('reconfig_bd permite redefinir o bd para testes', () => {
  const mock_bd = {
    queryAll: jest.fn(() => [{ id_pergunta: 1, texto: 'Mock?', id_usuario: 1 }]),
    exec: jest.fn(() => ({ lastInsertRowid: 42 })),
    query: jest.fn(() => ({ 'count(*)': 5 }))
  };

  modelo.reconfig_bd(mock_bd);
  const perguntas = modelo.listar_perguntas();
  expect(perguntas[0].texto).toBe('Mock?');

  const id = modelo.cadastrar_pergunta('Qual seu nome?');
  expect(id).toBe(42);

  const count = modelo.get_num_respostas(1);
  expect(count).toBe(5);
});