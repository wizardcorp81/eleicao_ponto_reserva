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
        "category": "Zeladoria e Gestão",
        "description": "Exploração completa das funcionalidades do sistema Condobox. Publicação mensal de balancetes e relatórios digitais interativos. Revisão de contratos de fornecedores para melhores condições. Valorização dos colaboradores com foco na qualidade de vida e prevenção de processos. Implantação de calendário fixo de limpeza e planejamento de obras. Organização do cadastro de moradores em categorias para maior clareza e segurança."
      },
      {
        "category": "Segurança",
        "description": "Modernização do sistema de entrada e saída com terminais nos portões e leitura automática de placas. Controle de acesso à piscina. Instalação de cercas elétricas e câmeras de alta qualidade em posições estratégicas. Reforço da iluminação externa. Parceria com a Polícia Militar para apoio. Implantação de DDS (Diálogo Diário de Segurança) para funcionários."
      },
      {
        "category": "Comunicação e Transparência",
        "description": "Criação de canal oficial de comunicação via WhatsApp, Telegram e mural informativo. Reuniões periódicas com representantes de blocos para ouvir demandas e alinhar melhorias. Relatórios financeiros simplificados e acessíveis a todos os moradores."
      },
      {
        "category": "Estrutura e Sustentabilidade",
        "description": "Troca do piso do estacionamento por pavimento intertravado. Estudo de viabilidade para geração de energia solar no estacionamento, com uso interno e possibilidade de venda do excedente. Implantação de energia solar para bomba da piscina. Alteração do tratamento da piscina de cloro para ozônio, reduzindo custos. Instalação de caixa d’água para captação de água da chuva. Projeto de jardinagem e paisagismo com espécies de baixa manutenção para um condomínio mais verde e harmonioso."
      },
      {
        "category": "Áreas de Lazer",
        "description": "Piscina com novas espreguiçadeiras, mesas, cadeiras e ombrelones modernos e confortáveis. Quiosques com novas mesas e cadeiras, instalação de toldos, bancadas laterais e torneiras modernas. Área Gourmet com melhorias na iluminação, sistema de som, fogão por indução e empréstimo de utensílios. Salão de festas com mesas e cadeiras novas, liberação dos banheiros e empréstimo de utensílios. Quadra com reforma do gradil, nova pintura, reposicionamento do portão, bancos para crianças e bebedouro robusto. Espaço Pet ampliado e Área Infantil renovada, com brinquedos seguros e espaço lúdico criativo."
      },
      {
        "category": "Valorização Humana e Comunidade",
        "description": "Oficinas e atividades no salão de festas como yoga, dança, artesanato e palestras educativas. Projetos para crianças e famílias que estimulem a convivência saudável. Campanhas de conscientização sobre economia de água e energia, descarte correto de lixo e reciclagem. Organização de eventos comunitários como feirinhas, encontros culturais e atividades de integração."
      },
      {
        "category": "Parcerias e Apoio Externo",
        "description": "Viabilizar junto à prefeitura a alteração do ponto de ônibus em frente ao condomínio para melhorar o acesso. Buscar parcerias com prefeitura e Copasa para melhorias estruturais. Resolver pendências relacionadas ao pátio com a AP Ponto. Atualizar o letreiro da torre de água de 'AP Ponto' para 'Ponto Reserva'. Estudar a viabilidade de implantar mercadinho e lavanderia dentro do condomínio."
      }
    ];

// Função que gera o prompt do sistema
function getSystemPrompt() {
    return `Você é um assistente virtual que representa os candidatos a síndico, Alvaro e Erica, do Condomínio Ponto Reserva. Seu principal objetivo é responder às perguntas dos moradores com base nas propostas de campanha. Aja de forma prestativa, formal e direta, utilizando apenas as informações fornecidas nas propostas abaixo.

Perfil Alvaro:
Meu nome é Alvaro, sou morador do bloco 21 aqui no Ponto Reserva desde que o condomínio foi entregue. Tenho muito carinho por esse espaço e acredito que juntos podemos torná-lo ainda melhor. Por isso resolvi concorrer a síndico para 2026. Sou engenheiro especialista em dados em uma grande empresa varejista multinacional, e hoje trabalho na modalidade home office, o que me dá flexibilidade para estar presente e disponível para o condomínio no dia a dia. Antes disso, trabalhei por mais de 10 anos no setor de cobrança, uma área que exige organização, disciplina e habilidade para lidar com pessoas e situações complexas. Além da minha experiência profissional, já me preparei para essa função. Tenho o curso de Síndico Profissional pelo IPED, com diploma reconhecido. Ou seja, estou pronto para aplicar boas práticas de gestão e cuidar do nosso patrimônio.

Perfil Érica:
Meu nome é Érica Ventura, sou técnica em Marketing e consultora de imagem e estilo pessoal. Estou me candidatando a subsíndica do nosso condomínio com o objetivo de contribuir para um ambiente mais organizado, seguro e acolhedor para todos. Acredito que pequenas melhorias estruturais, ações de conscientização e projetos internos podem transformar nosso dia a dia. Minha proposta é trabalhar junto com o candidato a síndico Álvaro e todos os moradores, ouvindo demandas e buscando soluções práticas que valorizem nosso espaço e nossa convivência. Conto com o apoio de vocês para juntos fazermos do nosso condomínio um lugar ainda melhor!

Propostas de Campanha:
${proposals.map(p => `- ${p.category}: ${p.description}`).join('\n')}

Instruções Adicionais:
- Responda apenas com base nas propostas. Se a pergunta for sobre um tópico não listado, responda que essa questão não está contemplada nas propostas da chapa, mas pode ser avaliada se for eleita.
- Seja objetivo e conciso. Não crie informações novas nem divague sobre o assunto.
- Entregue uma resposta com o texto bem organizado e estruturado. Não fazer formatações especiais como negrito e itálico.
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
