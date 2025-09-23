// Este código é uma função serverless que atua como um proxy para a API do Gemini.
// Ela é necessária para proteger a sua chave de API do Gemini, que não deve ser exposta no código-fonte do seu site (HTML).
// Você pode hospedar este arquivo em serviços como Netlify Functions, Vercel ou Cloudflare Workers.

// Insira sua chave de API do Gemini aqui
const GEMINI_API_KEY = "AIzaSyCExYe6xQOFLxmkPFhFPjZYNSEnCi9cQzc";

// URL da API do Gemini
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

// Função de tratamento da requisição
export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response('Método não permitido', { status: 405 });
    }

    try {
        const { userQuestion } = await request.json();

        // O prompt de sistema instrui o modelo a responder com base nas propostas de campanha
        const systemPrompt = `
            Atue como Álvaro, o candidato a síndico do Condomínio Ponto Reserva.
            Responda à seguinte pergunta baseando-se estritamente nas propostas de campanha que são:
            - Contabilidade: Transparência e Prestação de Contas (relatórios digitais), Redução de Gastos (negociação de contratos), Geração de Receita (energia solar).
            - Zeladoria: Troca do piso do estacionamento, manutenção e paisagismo, piscina com ozônio, iluminação e som na área gourmet, reforma do gradil e quadra.
            - Gestão de Pessoas: Valorização dos colaboradores, canal de comunicação oficial, reuniões periódicas, eventos e feirinhas.
            - Segurança: Controle de acesso (leitura de placas), monitoramento com mais câmeras, parcerias com a Polícia Militar.

            Seja amigável e informativo, e mantenha a resposta focada no tema. A pergunta é: "${userQuestion}"
        `;

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
