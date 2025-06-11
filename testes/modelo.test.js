const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando get_pergunta', () => {
  const id = modelo.cadastrar_pergunta('Qual a capital do Brasil?');
  const pergunta = modelo.get_pergunta(id);
  expect(pergunta.texto).toBe('Qual a capital do Brasil?');
});

test('Testando cadastrar_resposta e get_respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('5 + 5 = ?');
  modelo.cadastrar_resposta(id_pergunta, '10');
  modelo.cadastrar_resposta(id_pergunta, 'dez');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('10');
  expect(respostas[1].texto).toBe('dez');
});

test('Testando get_num_respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Cor do céu?');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(0);
  modelo.cadastrar_resposta(id_pergunta, 'Azul');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(1);
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
