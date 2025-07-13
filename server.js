const express = require('express')

const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.post('/contato', (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;
    
    const novoContato = {
        nome,
        email,
        assunto,
        mensagem
    };
    
    const arquivoContatos = path.join(__dirname, 'public', 'data', 'contatos.json');
    console.log('Caminho absoluto do arquivo:', arquivoContatos); 
    
    try {
        let contatos = [];
        if (fs.existsSync(arquivoContatos)) {
            const dados = fs.readFileSync(arquivoContatos, 'utf-8');
            contatos = JSON.parse(dados);
        }
        
        contatos.push(novoContato);
        
        fs.writeFileSync(arquivoContatos, JSON.stringify(contatos, null, 2));
        console.log('Dados salvos com sucesso em:', arquivoContatos);
        
        res.redirect('/contato/agradecimento');
    } catch (err) {
        console.error('Erro detalhado:', {
            message: err.message,
            code: err.code,
            path: err.path,
            stack: err.stack
        });
        res.status(500).send('Erro ao processar o formulário');
    }
});

app.get('/contato/agradecimento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'agradecimento.html'));
});

app.get('/sugestao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sugestao.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});