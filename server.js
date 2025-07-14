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
        
        res.status(200).send(`
        <h1>Obrigado, ${nome}!<h1>
        <p>Email: ${email}</p>
        <p>Assunto: ${assunto}</p>
        <p>Mensagem: ${mensagem}</p>
        <a href="/">Voltar para a página inicial</a>
    `);

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

app.get('/sugestao', (req, res) => {
    const { nome, ingredientes } = req.query;
    
    const filePath = path.join(__dirname, 'views', 'sugestao.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao carregar a página');
        }

        const htmlAtualizado = data
            .replace('{{NOME}}', nome || 'Não informado')
            .replace('{{INGREDIENTES}}', ingredientes || 'Não informados');

        res.send(htmlAtualizado);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});