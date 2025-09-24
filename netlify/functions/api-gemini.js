// Este código é uma função serverless que atua como um proxy para a API do Gemini.
// Ela é necessária para proteger a sua chave de API do Gemini, que não deve ser exposta no código-fonte do seu site (HTML).
// Você pode hospedar este arquivo em serviços como Netlify Functions, Vercel ou Cloudflare Workers.

// Insira sua chave de API do Gemini aqui
const GEMINI_API_KEY = "AIzaSyCExYe6xQOFLxmkPFhFPjZYNSEnCi9cQzc";

// URL da API do Gemini
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

// Conteúdo das propostas incluído diretamente no arquivo
const proposals = [
    {
        "category": "Contabilidade",
        "description": "Publicaremos relatórios digitais interativos para total transparência nos gastos e arrecadações. Buscaremos a negociação de contratos de fornecedores para reduzir custos. Estudaremos a viabilidade de geração de energia solar para criar uma renda extra para o condomínio."
    },
    {
        "category": "Zeladoria",
        "description": "Troca do piso do estacionamento para intertravado e manutenção geral do paisagismo. Melhora na iluminação da área gourmet e instalação de som ambiente para inibir o uso de som alto. Reforma e pintura do gradil e da quadra. Troca do tratamento de cloro da piscina para ozônio, gerando economia a longo prazo."
    },
    {
        "category": "Gestão de Pessoas",
        "description": "Criação de um canal de comunicação oficial para agilizar a troca de informações. Reuniões periódicas com representantes de blocos para ouvir demandas. Organização de feirinhas e atividades culturais para estimular a integração da comunidade. Política de valorização dos colaboradores."
    },
    {
        "category": "Segurança",
        "description": "Implementação de um sistema de leitura automática de placas de veículos. Melhora no sistema de monitoramento com mais câmeras bem posicionadas. Possibilidade de moradores concederem acesso a visitantes através de terminais nos portões. Parceria com a Polícia Militar para aprimorar a segurança."
    }
];

// Função que gera o prompt do sistema
function getSystemPrompt() {
    return `Você é um assistente virtual que representa os candidatos a síndico, Alvaro e Erica, do Condomínio Ponto Reserva. Seu principal objetivo é responder às perguntas dos moradores com base nas propostas de campanha. Aja de forma prestativa, formal e direta, utilizando apenas as informações fornecidas nas propostas abaixo.

Propostas de Campanha:
${proposals.map(p => `- ${p.category}: ${p.description}`).join('\n')}

Instruções Adicionais:
- Responda apenas com base nas propostas. Se a pergunta for sobre um tópico não listado, responda que essa questão não está contemplada nas propostas da chapa, mas pode ser avaliada se for eleita.
- Seja objetivo e conciso. Não crie informações novas nem divague sobre o assunto.
- Não mencione 'Alvaro e Erica' ou a 'chapa' na resposta. Fale em primeira pessoa, como se fosse o assistente deles, referindo-se a 'nossas propostas'.`;
}

// Função de tratamento da requisição
export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response('Método não permitido', { status: 405 });
    }

    try {
        const { userQuestion } = await request.json();

        // Obtém o prompt do sistema a partir da função
        const systemPrompt = getSystemPrompt();

        const payload = {
            contents: [{ parts: [{ text: userQuestion }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar sua pergunta no momento. Tente novamente mais tarde.';

        return new Response(JSON.stringify({ response: botResponse }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro na função serverless:', error);
        return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), { status: 500 });
    }
}
