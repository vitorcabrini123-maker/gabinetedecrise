const { Client } = require('pg');

exports.handler = async (event, context) => {
    // Verifica se é um envio de dados (POST)
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método não permitido" };
    }

    const dados = JSON.parse(event.body);
    
    // Conecta no banco usando a senha do Netlify
    const client = new Client({
        connectionString: process.env.NETLIFY_DATABASE_URL,
        ssl: true
    });

    try {
        await client.connect();

        // Insere APENAS os dados finais (sem o histórico detalhado)
        const query = `
            INSERT INTO historico_jogos 
            (nome_jogador, perfil_final, veredito, divida_final, dolar_final, poder_final, pop_final)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        const values = [
            dados.nome,
            dados.perfil,
            dados.veredito,
            dados.divida,
            dados.dolar,
            dados.poder,
            dados.pop
        ];

        await client.query(query, values);
        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Salvo com sucesso!" })
        };

    } catch (error) {
        console.error("Erro ao salvar:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};