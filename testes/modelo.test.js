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

test('Testando get pergunta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('test');
  const pergunta = modelo.get_pergunta(id_pergunta);
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe('test');
});

test('Testando get_respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('test');
  modelo.cadastrar_resposta(id_pergunta, 'resposta 1');
  modelo.cadastrar_resposta(id_pergunta, 'resposta 2');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('resposta 1');
  expect(respostas[1].texto).toBe('resposta 2');
});

test('Testando get_num_respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('test');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(0);
  modelo.cadastrar_resposta(id_pergunta, 'resposta 1');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(1);
  modelo.cadastrar_resposta(id_pergunta, 'resposta 2');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(2);
});

test('Testando reconfig_bd', () => {
  const mock_bd = {
    queryAll: jest.fn(() => []),
    exec: jest.fn(() => ({ lastInsertRowid: 1 })),
    query: jest.fn(() => ({ id_pergunta: 1, texto: 'mocked', id_usuario: 1 })),
  };
  
  modelo.reconfig_bd(mock_bd);
  
  modelo.cadastrar_pergunta('test');
  expect(mock_bd.exec).toHaveBeenCalledWith('INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta', ['test', 1]);
  
  const perguntas = modelo.listar_perguntas();
  expect(mock_bd.queryAll).toHaveBeenCalledWith('select * from perguntas', []);
  expect(perguntas.length).toBe(0); // mock retorna array vazio
});