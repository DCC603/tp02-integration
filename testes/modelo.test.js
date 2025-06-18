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

test('Testando cadastro de três respostas', () => {
  const id_pergunta1 = modelo.cadastrar_pergunta('1 + 1 = ?');
  const id_pergunta2 = modelo.cadastrar_pergunta('2 + 2 = ?');
  const id_pergunta3 = modelo.cadastrar_pergunta('3 + 3 = ?');

  const id_resposta1 = modelo.cadastrar_resposta(id_pergunta1, '2');
  const id_resposta2 = modelo.cadastrar_resposta(id_pergunta2, '4');
  const id_resposta3 = modelo.cadastrar_resposta(id_pergunta3, '6');

  expect(id_resposta1).toEqual(expect.any(Number));
  expect(id_resposta2).toEqual(expect.any(Number));
  expect(id_resposta3).toEqual(expect.any(Number));
})

test('Testando get de perguntas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('1 + 1 = ?');
  const pergunta = modelo.get_pergunta(id_pergunta);
  
  expect(pergunta.id_pergunta).toEqual(id_pergunta);
  expect(pergunta.texto).toEqual('1 + 1 = ?');
})

test('Testando get de respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual o melhor time de Minas?');
  const id_resposta1 = modelo.cadastrar_resposta(id_pergunta, 'Galo');
  const id_resposta2 = modelo.cadastrar_resposta(id_pergunta, 'Clube Atlético Mineiro');
  const id_resposta3 = modelo.cadastrar_resposta(id_pergunta, 'CAM');

  const respostas = modelo.get_respostas(id_pergunta); 
  const numRespostas = modelo.get_num_respostas(id_pergunta);

  expect(respostas[0].texto).toBe('Galo');
  expect(respostas[1].texto).toBe('Clube Atlético Mineiro');
  expect(respostas[2].texto).toBe('CAM');
  expect(respostas.length).toBe(3); 
  expect(numRespostas).toBe(3);
})