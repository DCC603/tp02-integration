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

test('Testando resposta de três perguntas', () => {
  modelo.cadastrar_resposta(0,'2');
  modelo.cadastrar_resposta(0,'3');
  modelo.cadastrar_resposta(0,'4');
  modelo.cadastrar_resposta(1,'4');
  modelo.cadastrar_resposta(1,'2');
  modelo.cadastrar_resposta(2,'6');
  const n_respostas0 = modelo.get_num_respostas(0);
  const n_respostas1 = modelo.get_num_respostas(1); 
  const n_respostas2 = modelo.get_num_respostas(2); 
  const respostas0 = modelo.get_respostas(0);
  const respostas1 = modelo.get_respostas(1);
  const respostas2 = modelo.get_respostas(2)
  expect(n_respostas0).toBe(3);
  expect(n_respostas1).toBe(2);
  expect(n_respostas2).toBe(1);
  expect(respostas0[0].texto).toBe('2');
  expect(respostas0[1].texto).toBe('3');
  expect(respostas0[2].texto).toBe('4');
  expect(respostas1[0].texto).toBe('4');
  expect(respostas1[1].texto).toBe('2');
  expect(respostas2[0].texto).toBe('6');
});

test('Testando função get_pergunta', () => {
  modelo.cadastrar_pergunta('5 + 5 = ?');
  const perguntas = modelo.listar_perguntas();
  const id_pergunta = perguntas[0].id_pergunta;
  const pergunta = modelo.get_pergunta(id_pergunta);
  expect(pergunta.texto).toBe('5 + 5 = ?');
});
