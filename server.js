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

app.get('/api/lanches', (req, res) => {
    const lanches = [
        {
            "id": 1,
            "nome": "DevBurger Clássico",
            "ingredientes": "Pão brioche, Carne 150g, Queijo cheddar, Alface americana, Tomate fresco, Molho especial",
            "imagem": "https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg"
        },
        {
            "id": 2,
            "nome": "DevBurger Bacon",
            "ingredientes": "Pão brioche, Carne 150g, Queijo cheddar, Bacon crocante, Alface americana, Molho barbecue",
            "imagem": "https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg"
        },
        {
            "id": 3,
            "nome": "DevBurger Duplo",
            "ingredientes": "Pão australiano, Duas carnes 150g, Queijo cheddar duplo, Cebola caramelizada, Molho especial",
            "imagem": "https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg"
        },
        {
            "id": 4,
            "nome": "DevBurger Veggie",
            "ingredientes": "Pão integral, Hambúrguer de grão-de-bico, Queijo prato, Alface, Tomate, Maionese vegana",
            "imagem": "https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg"
        },
        {
            "id": 5,
            "nome": "DevBurger Picante",
            "ingredientes": "Pão brioche, Carne 150g, Queijo pepper jack, Jalapeños, Alface, Molho picante",
            "imagem": "https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg"
        },
        {
            "id": 6,
            "nome": "DevBurger Blue",
            "ingredientes": "Pão rústico, Carne 200g, Queijo gorgonzola, Rúcula, Cebola roxa, Molho de mostarda e mel",
            "imagem": "https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg"
        }
    ];

    const isValid = lanches.every(lanche => {
        return (
            typeof lanche.id === 'number' &&
            typeof lanche.nome === 'string' && lanche.nome.trim() !== '' &&
            typeof lanche.ingredientes === 'string' && lanche.ingredientes.trim() !== '' &&
            typeof lanche.imagem === 'string' && lanche.imagem.trim() !== '' &&
            /^https?:\/\/.+\..+/.test(lanche.imagem)
        )
    });

    if (!isValid) {
        return res.status(500).json({
            error: "Dados de lanches inválidos",
            message: "Verifique a estrutura dos dados dos lanches"
        });
    }

    res.status(200).json(lanches);
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