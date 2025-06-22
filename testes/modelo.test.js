const bd = require("../bd/bd_utils.js");
const modelo = require("../modelo.js");

beforeEach(() => {
  bd.reconfig("./bd/esmforum-teste.db");
  // limpa dados de todas as tabelas
  bd.exec("delete from perguntas", []);
  bd.exec("delete from respostas", []);
});

test("Testando banco de dados vazio", () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test("Testando cadastro de três perguntas", () => {
  modelo.cadastrar_pergunta("1 + 1 = ?");
  modelo.cadastrar_pergunta("2 + 2 = ?");
  modelo.cadastrar_pergunta("3 + 3 = ?");
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe("1 + 1 = ?");
  expect(perguntas[1].texto).toBe("2 + 2 = ?");
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test("Testando cadastro de resposta para uma pergunta", () => {
  const questionId = modelo.cadastrar_pergunta(
    "Eh possivel criar um algortimo para verificar se um programa para?",
  );
  const answerId = modelo.cadastrar_resposta(questionId, "Não é possível");

  expect(answerId).toEqual(expect.any(Number));
});

test("Testando get de pergunta", () => {
  const questionText =
    "Eh possivel criar um algortimo para verificar se um programa é igual ao outro?";
  const questionId = modelo.cadastrar_pergunta(questionText);

  const question = modelo.get_pergunta(questionId);
  expect(question.id_pergunta).toEqual(questionId);
  expect(question.texto).toEqual(questionText);
});

test("Testando get de todas as respostas", () => {
  const questionText = "Qual é a melhor série do mundo?";
  const questionId = modelo.cadastrar_pergunta(questionText);

  modelo.cadastrar_resposta(questionId, "SOA");
  modelo.cadastrar_resposta(questionId, "Mad Men");
  const answers = modelo.get_respostas(questionId);

  expect(answers[0].texto).toBe("SOA");
  expect(answers[1].texto).toBe("Mad Men");
});