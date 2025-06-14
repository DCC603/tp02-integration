const express = require('express')
const modelo = require('./modelo.js');

const app = express()
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/perguntas', (req, res) => {
  try {
    const perguntas = modelo.listar_perguntas();
    res.status(200).json(perguntas);   // importa devolver [] quando vazio
  } catch (erro) {
    res.status(500).json(erro.message);
  }
});

app.post('/perguntas', (req, res) => {
  try {
    const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
    res.status(201).json({ id_pergunta: id_pergunta });

  }
  catch(erro) {
    res.status(500).json(erro.message); 
  } 
});

app.get('/perguntas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const pergunta = modelo.get_pergunta(id);   // função já existe no server

    if (!pergunta) {
      return res.status(404).json({ erro: 'Pergunta não encontrada' });
    }

    res.status(200).json(pergunta);
  } catch (erro) {
    res.status(500).json(erro.message);
  }
});

app.post('/respostas', (req, res) => {
  try {
    const id_pergunta = req.body.id_pergunta;
    const resposta = req.body.resposta;
    const id_resposta = modelo.cadastrar_resposta(id_pergunta, resposta);
    res.json({id_resposta: id_resposta});
  }
  catch(erro) {
    res.status(500).json(erro.message); 
  } 
});

// espera e trata requisições de clientes
const port = 5000;

// Só liga o servidor se o arquivo for executado diretamente
if (require.main === module) {
  app.listen(port, 'localhost', () =>
    console.log(`ESM Forum rodando em ${port}`)
  );
}

module.exports = app;    // mantém para supertest
; 