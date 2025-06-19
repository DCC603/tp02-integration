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

test('Testando o cadastro de respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');

  const perguntas = modelo.listar_perguntas(); 
  const pergunta1 = perguntas[0].id_pergunta;
  const pergunta2 = perguntas[1].id_pergunta;

  modelo.cadastrar_resposta(pergunta1, '2');
  modelo.cadastrar_resposta(pergunta1, '8');
  modelo.cadastrar_resposta(pergunta2, '4');

  const respostas = modelo.get_respostas;
  
  expect(respostas(pergunta1).length).toBe(2);
  expect(respostas(pergunta2).length).toBe(1);
  expect(respostas(pergunta1)[1].texto).toBe('8');
});

test('Testando a busca de perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');

  const perguntas = modelo.listar_perguntas();
  const primeiraPergunta = perguntas[0].id_pergunta;
  const segundaPergunta = perguntas[1].id_pergunta;

  const perguntaEncontrada = modelo.get_pergunta(segundaPergunta).id_pergunta;

  expect(perguntaEncontrada).toBe(segundaPergunta);
  expect(perguntaEncontrada).not.toBe(primeiraPergunta);
});