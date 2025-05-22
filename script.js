// EducaAI - JS otimizado e responsivo

// Usuários simulados
const users = [
    { email: 'aluno@escola.com', password: '123456', name: 'Aluno', type: 'aluno' },
    { email: 'professor@escola.com', password: 'prof123', name: 'Professor', type: 'professor' }
];

// Elementos principais
const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const mainApp = document.getElementById('main-app');
const loginError = document.getElementById('login-error');
const userGreeting = document.getElementById('user-greeting');
const logoutBtn = document.getElementById('logout-btn');

// Perfil
const profileName = document.getElementById('profile-name');
const profilePoints = document.getElementById('profile-points');
const profileLevel = document.getElementById('profile-level');
const profileType = document.getElementById('profile-type');

// Navegação
const navBtns = document.querySelectorAll('.nav-btn');
const tabSections = {
    profile: document.getElementById('profile-section'),
    activities: document.getElementById('activity-section'),
    ai: document.getElementById('ai-help-section'),
    leaderboard: document.getElementById('leaderboard-section'),
    config: document.getElementById('config-section'), // <-- já está correto!
    videos: document.getElementById('videos-section'), // se quiser navegação para vídeos
    professor: document.getElementById('professor-section') // se quiser navegação para professor
};

// Atividades
const activitiesList = document.getElementById('activities-list');
const getActivityBtn = document.getElementById('get-activity-btn');
const subjectSelect = document.getElementById('subject-select');
const answerSection = document.getElementById('answer-section');
const activityAnswer = document.getElementById('activity-answer');
const submitAnswerBtn = document.getElementById('submit-answer-btn');
const answerFeedback = document.getElementById('answer-feedback');
const pointsDisplay = document.getElementById('points');
const leaderboardList = document.getElementById('leaderboard-list');

// IA
const askAiBtn = document.getElementById('ask-ai-btn');
const userQuestion = document.getElementById('user-question');
const aiResponse = document.getElementById('ai-response');

// Menu responsivo
const menuToggle = document.getElementById('menu-toggle');
const mainMenu = document.getElementById('main-menu');

// Tela de boas-vindas
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeMsg = document.getElementById('welcome-msg');

// Configurações
const configSection = document.getElementById('config-section');
const configForm = document.getElementById('config-form');
const configFeedback = document.getElementById('config-feedback');

// Estado global
let currentUser = null;
let pontos = 0;
let nivel = 1;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let atividadeAtual = null;
let dificuldade = 'facil';
let errosPorMateria = { matematica: 0, portugues: 0, ingles: 0, geografia: 0, historia: 0 };

// Histórico de desempenho por matéria e dificuldade
let historicoDesempenho = JSON.parse(localStorage.getItem('historicoDesempenho')) || {};

// Atividades por matéria e dificuldade (todas com 3 perguntas, mais desafiadoras)
const perguntasFaceis = {
    matematica: [
        { pergunta: 'Qual é o valor de 15 + 27?', resposta: '42', dica: 'Soma de dois números.' },
        { pergunta: 'Resolva: 8 x 6', resposta: '48', dica: 'Multiplicação simples.' },
        { pergunta: 'Quanto é 100 dividido por 4?', resposta: '25', dica: 'Divida 100 em 4 partes.' },
        { pergunta: 'Se um triângulo tem lados de 3, 4 e 5, qual é o perímetro?', resposta: '12', dica: 'Some todos os lados.' },
        { pergunta: 'Qual é o resultado de 5²?', resposta: '25', dica: 'Potência de 5.' }
    ],
    portugues: [
        { pergunta: 'Qual o plural de "cidadão"?', resposta: 'cidadãos', dica: 'Termina com "ãos".' },
        { pergunta: 'Complete: "Eles ___ indo à escola."', resposta: 'estão', dica: 'Verbo de estado.' },
        { pergunta: 'Qual o feminino de "leão"?', resposta: 'leoa', dica: 'Troque "ão" por "oa".' },
        { pergunta: 'Qual o antônimo de "feliz"?', resposta: 'triste', dica: 'Sentimento oposto.' },
        { pergunta: 'Como se chama o lugar onde se guardam livros?', resposta: 'biblioteca', dica: 'Começa com "biblio".' }
    ],
    ingles: [
        { pergunta: 'Traduza: "house"', resposta: 'casa', dica: 'Onde você mora.' },
        { pergunta: 'Como se diz "amigo" em inglês?', resposta: 'friend', dica: 'Começa com "f".' },
        { pergunta: 'Traduza: "car"', resposta: 'carro', dica: 'Meio de transporte.' },
        { pergunta: 'Como se diz "professor" em inglês?', resposta: 'teacher', dica: 'Pessoa que ensina.' },
        { pergunta: 'Traduza: "water"', resposta: 'água', dica: 'Líquido essencial.' }
    ],
    geografia: [
        { pergunta: 'Qual é o maior país do mundo em área?', resposta: 'rússia', dica: 'Fica na Europa e Ásia.' },
        { pergunta: 'Qual é o rio mais extenso do Brasil?', resposta: 'amazonas', dica: 'Corta a floresta.' },
        { pergunta: 'Qual é o continente do Egito?', resposta: 'áfrica', dica: 'Começa com "á".' },
        { pergunta: 'Qual é o menor continente?', resposta: 'oceania', dica: 'Fica do outro lado do mundo.' },
        { pergunta: 'Qual oceano banha o litoral leste do Brasil?', resposta: 'atlântico', dica: 'Começa com "a".' }
    ],
    historia: [
        { pergunta: 'Quem foi o primeiro presidente do Brasil?', resposta: 'marechal deodoro', dica: 'Marechal.' },
        { pergunta: 'Ano da Proclamação da República?', resposta: '1889', dica: 'Século XIX.' },
        { pergunta: 'Quem assinou a Lei Áurea?', resposta: 'princesa isabel', dica: 'Foi uma princesa.' },
        { pergunta: 'Quem descobriu o Brasil?', resposta: 'pedro álvares cabral', dica: 'Navegador português.' },
        { pergunta: 'Qual era o nome do imperador do Brasil em 1822?', resposta: 'dom pedro i', dica: 'Primeiro imperador.' }
    ]
};
const perguntasMedias = {
    matematica: [
        { pergunta: 'Resolva: 3² + 4²', resposta: '25', dica: 'Potências e soma.' },
        { pergunta: 'Qual é o MMC de 12 e 18?', resposta: '36', dica: 'Mínimo múltiplo comum.' },
        { pergunta: 'Quanto é 144 dividido por 12?', resposta: '12', dica: 'Divisão exata.' },
        { pergunta: 'Se um retângulo tem lados 7 e 9, qual é a área?', resposta: '63', dica: 'Base x altura.' },
        { pergunta: 'Qual é a raiz quadrada de 169?', resposta: '13', dica: 'Multiplicação reversa.' }
    ],
    portugues: [
        { pergunta: 'O que é um advérbio?', resposta: 'palavra que modifica o verbo', dica: 'Relaciona-se ao verbo.' },
        { pergunta: 'Qual é o aumentativo de "casa"?', resposta: 'casarão', dica: 'Termina com "ão".' },
        { pergunta: 'O que é um sujeito oculto?', resposta: 'não está explícito', dica: 'Não aparece na frase.' },
        { pergunta: 'Qual é o coletivo de "peixe"?', resposta: 'cardume', dica: 'Grupo de peixes.' },
        { pergunta: 'O que é uma interjeição?', resposta: 'palavra que expressa emoção', dica: 'Expressa sentimentos.' }
    ],
    ingles: [
        { pergunta: 'Traduza: "window"', resposta: 'janela', dica: 'Presente em toda casa.' },
        { pergunta: 'Como se diz "irmã" em inglês?', resposta: 'sister', dica: 'Começa com "s".' },
        { pergunta: 'Traduza: "mountain"', resposta: 'montanha', dica: 'Elevação natural.' },
        { pergunta: 'Como se diz "trabalho" em inglês?', resposta: 'work', dica: 'Começa com "w".' },
        { pergunta: 'Traduza: "street"', resposta: 'rua', dica: 'Onde passam carros.' }
    ],
    geografia: [
        { pergunta: 'Qual é o maior oceano do mundo?', resposta: 'pacífico', dica: 'Começa com "p".' },
        { pergunta: 'Qual país faz fronteira com o Brasil ao sul?', resposta: 'uruguai', dica: 'Famoso pelo churrasco.' },
        { pergunta: 'Qual é a capital da Argentina?', resposta: 'buenos aires', dica: 'Cidade famosa pelo tango.' },
        { pergunta: 'Qual é o clima predominante na Amazônia?', resposta: 'equatorial', dica: 'Muito úmido e quente.' },
        { pergunta: 'Qual é o deserto mais seco do mundo?', resposta: 'atacama', dica: 'Fica no Chile.' }
    ],
    historia: [
        { pergunta: 'Quem descobriu o Brasil?', resposta: 'pedro álvares cabral', dica: 'Navegador português.' },
        { pergunta: 'Em que ano terminou a Segunda Guerra Mundial?', resposta: '1945', dica: 'Década de 40.' },
        { pergunta: 'Quem foi Tiradentes?', resposta: 'líder da inconfidência mineira', dica: 'Movimento de Minas Gerais.' },
        { pergunta: 'O que foi a Revolução Industrial?', resposta: 'mudança na produção', dica: 'Máquinas e fábricas.' },
        { pergunta: 'Quem foi Zumbi dos Palmares?', resposta: 'líder quilombola', dica: 'Lutou contra a escravidão.' }
    ]
};
const perguntasDificeis = {
    matematica: [
        { pergunta: 'Resolva: (3³ x 2) + (5² - 7)', resposta: '49', dica: 'Potências, multiplicação e soma.' },
        { pergunta: 'Qual é o valor de x na equação 2x + 5 = 21?', resposta: '8', dica: 'Isolar o x.' },
        { pergunta: 'Se um círculo tem raio 7, qual é sua área? (Use π ≈ 3,14)', resposta: '153.86', dica: 'π x raio² (arredonde para 2 casas).' },
        { pergunta: 'Qual é o determinante da matriz [[2,3],[1,4]]?', resposta: '5', dica: 'ad - bc.' },
        { pergunta: 'Resolva: 5! (fatorial de 5)', resposta: '120', dica: 'Multiplique todos os inteiros de 1 a 5.' }
    ],
    portugues: [
        { pergunta: 'O que é uma oração subordinada?', resposta: 'frase dependente', dica: 'Depende de outra oração.' },
        { pergunta: 'O que é um predicativo do sujeito?', resposta: 'termo que caracteriza o sujeito', dica: 'Caracteriza o sujeito.' },
        { pergunta: 'O que é uma metáfora?', resposta: 'figura de linguagem', dica: 'Comparação implícita.' },
        { pergunta: 'O que é um aposto?', resposta: 'termo explicativo', dica: 'Explica um termo anterior.' },
        { pergunta: 'O que é uma anáfora?', resposta: 'repetição de palavra', dica: 'Figura de linguagem.' }
    ],
    ingles: [
        { pergunta: 'Traduza: "environment"', resposta: 'meio ambiente', dica: 'Palavra comum em sustentabilidade.' },
        { pergunta: 'Traduza: "thought"', resposta: 'pensamento', dica: 'Vem do verbo "think".' },
        { pergunta: 'Como se diz "desenvolvimento" em inglês?', resposta: 'development', dica: 'Começa com "d".' },
        { pergunta: 'Traduza: "challenge"', resposta: 'desafio', dica: 'Algo difícil.' },
        { pergunta: 'Como se diz "conhecimento" em inglês?', resposta: 'knowledge', dica: 'Começa com "k".' }
    ],
    geografia: [
        { pergunta: 'Qual o maior deserto do mundo?', resposta: 'saara', dica: 'Fica na África.' },
        { pergunta: 'Qual é o rio mais extenso do mundo?', resposta: 'nilo', dica: 'Fica na África.' },
        { pergunta: 'Qual é a capital da Austrália?', resposta: 'camberra', dica: 'Não é Sydney.' },
        { pergunta: 'Qual é o ponto mais alto do Brasil?', resposta: 'pico da neblina', dica: 'Fica no Amazonas.' },
        { pergunta: 'Qual é o país mais populoso da África?', resposta: 'nigéria', dica: 'Começa com "n".' }
    ],
    historia: [
        { pergunta: 'Quem assinou a Lei Áurea?', resposta: 'princesa isabel', dica: 'Foi uma princesa.' },
        { pergunta: 'O que foi a Revolução Francesa?', resposta: 'mudança política na frança', dica: 'Liberdade, igualdade, fraternidade.' },
        { pergunta: 'Quem foi Dom Pedro II?', resposta: 'imperador do brasil', dica: 'Segundo imperador.' },
        { pergunta: 'O que foi a Guerra Fria?', resposta: 'conflito entre eua e urss', dica: 'Sem confronto direto.' },
        { pergunta: 'Quem foi Martin Luther King?', resposta: 'líder dos direitos civis', dica: 'EUA, anos 60.' }
    ]
};

// Utilidades
function atualizarPerfil() {
    profilePoints.textContent = pontos;
    profileLevel.textContent = nivel;
    // Salva pontos do usuário logado no localStorage
    if (currentUser && currentUser.email) {
        localStorage.setItem('pontos_' + currentUser.email, pontos);
    }
}

function atualizarLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.sort((a, b) => b.pontos - a.pontos);
    leaderboard.slice(0, 10).forEach((aluno, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="rank">${i + 1}º</span> <span class="nome">${aluno.nome}</span> <span class="pts">${aluno.pontos} pts</span>`;
        leaderboardList.appendChild(li);
    });
}

function salvarLeaderboard(nome, pontos) {
    // Salva pontos por usuário (nome ou email) e impede duplicidade
    const userKey = currentUser && currentUser.email ? currentUser.email : nome;
    let found = false;
    leaderboard = leaderboard.map(entry => {
        if (entry.userKey === userKey) {
            found = true;
            // Só atualiza se os pontos forem maiores
            return { ...entry, nome, pontos: Math.max(entry.pontos, pontos), userKey };
        }
        return entry;
    });
    if (!found) {
        leaderboard.push({ nome, pontos, userKey });
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    atualizarLeaderboard();
}

function showTab(tab) {
    Object.values(tabSections).forEach(sec => sec.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));
    if (tabSections[tab]) tabSections[tab].classList.add('active');
    navBtns.forEach(btn => {
        if (btn.dataset.tab === tab) btn.classList.add('active');
    });
}

// Login
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const type = document.getElementById('login-type').value;
    const user = users.find(u => u.email === email && u.password === password);

    // Bloqueio de acesso cruzado
    if (user) {
        if (user.type !== type) {
            loginError.textContent = 'Tipo de usuário incorreto para este email.';
            return;
        }
    } else if (type === 'professor' || type === 'aluno') {
        loginError.textContent = 'Usuário ou senha inválidos.';
        return;
    }

    if (user || type === 'aluno') {
        currentUser = user || { name: 'Visitante', type: type, email: email };
        loginContainer.style.display = 'none';

        // Mostra tela de saudação centralizada personalizada para professor/aluno
        if (type === 'professor') {
            welcomeMsg.textContent = `Olá professor, vamos ensinar hoje?`;
        } else {
            welcomeMsg.textContent = `Olá, ${currentUser.name}! Pronto para aprender hoje?`;
        }
        welcomeScreen.style.display = 'flex';

        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            mainApp.style.display = 'block';
            loginError.textContent = '';
            profileName.textContent = currentUser.name;
            profileType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            // Carrega pontos salvos do usuário
            const pontosSalvos = localStorage.getItem('pontos_' + email);
            pontos = pontosSalvos ? parseInt(pontosSalvos, 10) : 0;
            nivel = 1 + Math.floor(pontos / 100);
            atualizarPerfil();
            atualizarLeaderboard();
            if (type === 'professor') {
                // Mostra aba do professor, esconde as de aluno
                document.getElementById('professor-tab-btn').style.display = '';
                document.getElementById('professor-section').style.display = '';
                document.getElementById('activities-tab-btn').style.display = 'none';
                document.getElementById('ai-tab-btn').textContent = 'IA Criar Questão';
                document.getElementById('videos-section').style.display = 'none';
                document.getElementById('difficulty-li').style.display = 'none';
                showTab('professor');
                document.getElementById('add-video-area').style.display = '';
            } else {
                // Aluno vê abas normais
                document.getElementById('professor-tab-btn').style.display = 'none';
                document.getElementById('professor-section').style.display = 'none';
                document.getElementById('activities-tab-btn').style.display = '';
                document.getElementById('ai-tab-btn').textContent = 'Assistente IA';
                document.getElementById('videos-section').style.display = '';
                document.getElementById('difficulty-li').style.display = '';
                showTab('config'); // <-- CORREÇÃO AQUI!
                document.getElementById('add-video-area').style.display = 'none';
            }
        }, 2200);
    } else {
        loginError.textContent = 'Usuário ou senha inválidos.';
    }
});

// Logout
logoutBtn.addEventListener('click', function () {
    currentUser = null;
    mainApp.style.display = 'none';
    loginContainer.style.display = 'block';
    loginForm.reset();
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
});

// Esqueceu senha
document.getElementById('forgot-password-btn').addEventListener('click', function () {
    alert('Para redefinir sua senha, entre em contato com o suporte da escola.');
});

// Dificuldade visual
const diffBtns = [
    document.getElementById('btn-diff-facil'),
    document.getElementById('btn-diff-medio'),
    document.getElementById('btn-diff-dificil')
];
diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        dificuldade = btn.dataset.diff;
        novaAtividade();
    });
});

// Unifica perguntas por dificuldade
function getPerguntasPorDificuldade(materia, dificuldade) {
    if (dificuldade === 'facil') return perguntasFaceis[materia] || [];
    if (dificuldade === 'medio') return perguntasMedias[materia] || [];
    if (dificuldade === 'dificil') return perguntasDificeis[materia] || [];
    return [];
}

// Atividades com dicas e feedback animado
function novaAtividade() {
    const materia = subjectSelect.value;
    const lista = getPerguntasPorDificuldade(materia, dificuldade);
    if (!lista.length) {
        activitiesList.textContent = 'Sem perguntas cadastradas para esta matéria/dificuldade.';
        answerSection.style.display = 'none';
        return;
    }
    const idx = Math.floor(Math.random() * lista.length);
    atividadeAtual = lista[idx];
    activitiesList.textContent = atividadeAtual.pergunta;
    answerSection.style.display = 'flex';
    activityAnswer.value = '';
    answerFeedback.textContent = '';
    answerFeedback.className = '';
    document.getElementById('activity-tip').textContent = '';
}

getActivityBtn.addEventListener('click', novaAtividade);
subjectSelect.addEventListener('change', novaAtividade);

submitAnswerBtn.addEventListener('click', function () {
    if (!atividadeAtual) return;
    const resposta = activityAnswer.value.trim().toLowerCase();
    const materia = subjectSelect.value;
    const dificuldadeAtual = dificuldade;
    if (resposta === atividadeAtual.resposta) {
        const pontosGanhos = 10 * (dificuldade === 'facil' ? 1 : dificuldade === 'medio' ? 2 : 3);
        pontos += pontosGanhos;
        nivel = 1 + Math.floor(pontos / 100);
        pointsDisplay.textContent = pontos;
        profilePoints.textContent = pontos;
        profileLevel.textContent = nivel;
        answerFeedback.textContent = `Correto! +${pontosGanhos} pontos`;
        answerFeedback.className = 'correct';
        document.getElementById('activity-tip').textContent = atividadeAtual.dica ? `Dica: ${atividadeAtual.dica}` : '';
        salvarLeaderboard(profileName.textContent, pontos);
        atualizarHistorico(materia, dificuldadeAtual, true);
        const dificuldadeAnterior = dificuldade;
        ajustarDificuldade(true);
        // Se a dificuldade aumentou, atualiza a pergunta rapidamente
        if (dificuldade !== dificuldadeAnterior) {
            setTimeout(novaAtividade, 400); // Troca a pergunta rapidamente se a dificuldade mudou
        } else {
            setTimeout(novaAtividade, 4000); // Atualiza a pergunta após 4 segundos
        }
    } else {
        answerFeedback.textContent = 'Tente novamente!';
        answerFeedback.className = 'incorrect';
        document.getElementById('activity-tip').textContent = atividadeAtual.dica ? `Dica: ${atividadeAtual.dica}` : '';
        errosPorMateria[subjectSelect.value] = (errosPorMateria[subjectSelect.value] || 0) + 1;
        atualizarHistorico(materia, dificuldadeAtual, false);
        const dificuldadeAnterior = dificuldade;
        ajustarDificuldade(false);
        // Se a dificuldade diminuiu, atualiza a pergunta rapidamente
        if (dificuldade !== dificuldadeAnterior) {
            setTimeout(novaAtividade, 400); // Troca a pergunta rapidamente se a dificuldade mudou
        }
    }
});

// Botão para pedir à IA os pontos que mais erra
document.getElementById('ask-weakness-btn').addEventListener('click', function () {
    const weaknessDiv = document.getElementById('weakness-response');
    let maior = 0, materia = '';
    for (const mat in errosPorMateria) {
        if (errosPorMateria[mat] > maior) {
            maior = errosPorMateria[mat];
            materia = mat;
        }
    }
    if (maior === 0) {
        weaknessDiv.innerHTML = 'Você ainda não errou nenhuma matéria!';
    } else {
        weaknessDiv.innerHTML = `Você está errando mais em <b>${materia.charAt(0).toUpperCase() + materia.slice(1)}</b>. Que tal focar nela?`;
    }
});

// Adiciona botão de dica
const hintBtn = document.createElement('button');
hintBtn.id = 'show-hint-btn';
hintBtn.textContent = 'Mostrar dica';
hintBtn.type = 'button';
hintBtn.style.marginTop = '6px';

// Insere o botão de dica abaixo do botão de responder
submitAnswerBtn.parentNode.insertBefore(hintBtn, submitAnswerBtn.nextSibling);

// Evento do botão de dica
hintBtn.addEventListener('click', function () {
    if (atividadeAtual && atividadeAtual.dica) {
        document.getElementById('activity-tip').textContent = `Dica: ${atividadeAtual.dica}`;
    } else {
        document.getElementById('activity-tip').textContent = 'Nenhuma dica disponível para esta pergunta.';
    }
});

// Permitir enviar resposta com Enter no campo de resposta da atividade
activityAnswer.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitAnswerBtn.click();
    }
});

// Menu responsivo
menuToggle.addEventListener('click', function () {
    mainMenu.classList.toggle('open');
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 700) mainMenu.classList.remove('open');
});
mainMenu.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-btn') || e.target.id === 'logout-btn') {
        if (window.innerWidth <= 700) mainMenu.classList.remove('open');
    }
});

// Navegação
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        showTab(tab);

        if (tab === 'videos') {
            if (currentUser && currentUser.type === 'professor') {
                showAddVideoBtn.style.display = 'block';
                addVideoArea.style.display = 'none';
            } else {
                showAddVideoBtn.style.display = 'none';
                addVideoArea.style.display = 'none';
            }
        }
    });
});

// IA Simulada
askAiBtn.addEventListener('click', function () {
    const question = userQuestion.value.trim();
    if (!question) {
        aiResponse.textContent = 'Por favor, digite sua dúvida.';
        aiResponse.classList.remove('loading');
        return;
    }
    aiResponse.textContent = '';
    aiResponse.classList.add('loading');
    setTimeout(() => {
        aiResponse.classList.remove('loading');
        aiResponse.innerHTML = gerarRespostaSimulada(question);
    }, 1200);
});

function gerarRespostaSimulada(pergunta) {
    const p = pergunta.toLowerCase();
    if (p.includes('matemática') || p.match(/\d+[\+\-\*\/]\d+/)) {
        return `<b>Matemática:</b> Para resolver contas, siga a ordem das operações. Se precisar de ajuda, envie a conta.<br><i>Dica: Use parênteses para operações complexas.</i>`;
    }
    if (p.includes('português') || p.includes('texto')) {
        return `<b>Português:</b> Leia o texto com atenção, destaque ideias principais e tente resumir.<br><i>Dica: Procure palavras-chave.</i>`;
    }
    if (p.includes('inglês') || p.includes('translate')) {
        return `<b>Inglês:</b> Para traduzir, pense no significado geral e use frases simples.<br><i>Dica: Use dicionários online para palavras difíceis.</i>`;
    }
    if (p.includes('geografia')) {
        return `<b>Geografia:</b> Procure mapas e informações atualizadas. Se quiser, pergunte sobre capitais, continentes ou clima!`;
    }
    if (p.includes('história')) {
        return `<b>História:</b> Busque datas, personagens e causas dos eventos. Se quiser, peça uma linha do tempo!`;
    }
    return `Ótima pergunta! Tente dividir o problema em partes menores e me envie detalhes se quiser uma resposta mais específica.<br><i>Dica: Seja claro e objetivo para respostas melhores.</i>`;
}

// Inicialização
pointsDisplay.textContent = pontos;
atualizarPerfil();
atualizarLeaderboard();
showTab('activities');

// Salvar preferências
configForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const prefs = {
        tdah: document.getElementById('tdah').checked,
        ansiedade: document.getElementById('ansiedade').checked,
        daltonismo: document.getElementById('daltonismo').checked
    };
    localStorage.setItem('acessibilidade_' + currentUser.email, JSON.stringify(prefs));
    configFeedback.textContent = 'Preferências salvas!';
    setTimeout(() => showTab('activities'), 1200);
});

// Crie a seção do professor:
const professorSection = document.createElement('section');
professorSection.id = 'professor-section';
professorSection.className = 'tab-section';
professorSection.innerHTML = `
    <h2>Criar Atividade</h2>
    <form id="prof-create-form">
        <select id="prof-materia">
            <option value="matematica">Matemática</option>
            <option value="portugues">Português</option>
            <option value="ingles">Inglês</option>
            <option value="geografia">Geografia</option>
            <option value="historia">História</option>
        </select>
        <select id="prof-dificuldade">
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
        </select>
        <input type="text" id="prof-question" placeholder="Digite a questão">
        <input type="text" id="prof-answer" placeholder="Resposta correta">
        <button type="submit">Adicionar Atividade</button>
    </form>
    <button id="prof-ai-btn">Pedir sugestão à IA</button>
    <div id="prof-ai-response"></div>
`;
document.getElementById('main-app').appendChild(professorSection);
tabSections.professor = document.getElementById('professor-section');

document.getElementById('prof-create-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const materia = document.getElementById('prof-materia').value;
    const dificuldade = document.getElementById('prof-dificuldade').value;
    const question = document.getElementById('prof-question').value.trim();
    const answer = document.getElementById('prof-answer').value.trim();
    if (!question || !answer) {
        alert('Por favor, preencha a questão e a resposta.');
        return;
    }
    // Aqui você pode adicionar a lógica para salvar a nova atividade criada pelo professor
    alert(`Atividade criada em ${materia} (${dificuldade}): ${question} - Resposta: ${answer}`);
    document.getElementById('prof-question').value = '';
    document.getElementById('prof-answer').value = '';
});

document.getElementById('prof-ai-btn').addEventListener('click', function () {
    const question = document.getElementById('prof-question').value.trim();
    if (!question) {
        document.getElementById('prof-ai-response').textContent = 'Por favor, digite sua dúvida.';
        return;
    }
    document.getElementById('prof-ai-response').textContent = 'Gerando resposta...';
    setTimeout(() => {
        document.getElementById('prof-ai-response').innerHTML = gerarRespostaSimulada(question);
    }, 1200);
});

function ajustarDificuldade(acertou) {
    const ordem = ['facil', 'medio', 'dificil'];
    let idx = ordem.indexOf(dificuldade);
    if (acertou && idx < ordem.length - 1) idx++;
    if (!acertou && idx > 0) idx--;
    dificuldade = ordem[idx];
    diffBtns.forEach(b => b.classList.remove('active'));
    document.getElementById('btn-diff-' + ordem[idx]).classList.add('active');
}

// Lógica para adicionar vídeo (deixe isso fora do login, para rodar sempre)
document.getElementById('add-video-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('video-url').value.trim();
    const title = document.getElementById('video-title').value.trim();
    const feedback = document.getElementById('add-video-feedback');
    const videoList = document.getElementById('video-list');

    // Extrai o ID do vídeo do YouTube
    const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([\w-]+)/);
    if (!match) {
        feedback.textContent = 'URL inválida. Use um link do YouTube.';
        return;
    }
    const videoId = match[1];

    // Cria o iframe e adiciona à lista
    const iframe = document.createElement('iframe');
    iframe.width = 320;
    iframe.height = 180;
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.title = title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    videoList.appendChild(iframe);

    feedback.textContent = 'Vídeo adicionado com sucesso!';
    document.getElementById('video-url').value = '';
    document.getElementById('video-title').value = '';
});

const showAddVideoBtn = document.getElementById('show-add-video-btn');
const addVideoArea = document.getElementById('add-video-area');

// Após login do professor, garanta que o botão aparece
function atualizarBotaoVideo() {
    if (currentUser && currentUser.type === 'professor') {
        showAddVideoBtn.style.display = 'block';
        addVideoArea.style.display = 'none';
    } else {
        showAddVideoBtn.style.display = 'none';
        addVideoArea.style.display = 'none';
    }
}

// Chame após login:
setTimeout(() => {
    atualizarBotaoVideo();
    // Se a aba de vídeos estiver ativa após login, garanta que o botão aparece:
    if (tabSections.videos.classList.contains('active')) {
        if (currentUser && currentUser.type === 'professor') {
            showAddVideoBtn.style.display = 'block';
            addVideoArea.style.display = 'none';
        } else {
            showAddVideoBtn.style.display = 'none';
            addVideoArea.style.display = 'none';
        }
    }
}, 2200);

// Ao clicar na aba de vídeos
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        showTab(tab);

        if (tab === 'videos') {
            if (currentUser && currentUser.type === 'professor') {
                showAddVideoBtn.style.display = 'block';
                addVideoArea.style.display = 'none';
            } else {
                showAddVideoBtn.style.display = 'none';
                addVideoArea.style.display = 'none';
            }
        }
    });
});

// Ao clicar no botão "Adicionar novo vídeo"
showAddVideoBtn.addEventListener('click', function () {
    addVideoArea.style.display = '';
    showAddVideoBtn.style.display = 'none'; // Mantém assim para esconder o botão ao abrir o formulário
});

// Função para atualizar histórico
function atualizarHistorico(materia, dificuldade, acertou) {
    if (!historicoDesempenho[materia]) historicoDesempenho[materia] = {};
    if (!historicoDesempenho[materia][dificuldade]) historicoDesempenho[materia][dificuldade] = { acertos: 0, erros: 0 };
    if (acertou) {
        historicoDesempenho[materia][dificuldade].acertos++;
    } else {
        historicoDesempenho[materia][dificuldade].erros++;
    }
    localStorage.setItem('historicoDesempenho', JSON.stringify(historicoDesempenho));
}

// Função para renderizar o histórico na tabela do perfil
function renderizarHistorico() {
    const tbody = document.querySelector('#tabela-historico tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const materias = ['matematica', 'portugues', 'ingles', 'geografia', 'historia'];
    const dificuldades = ['facil', 'medio', 'dificil'];
    const nomes = {
        matematica: 'Matemática',
        portugues: 'Português',
        ingles: 'Inglês',
        geografia: 'Geografia',
        historia: 'História'
    };
    materias.forEach(materia => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding:7px 4px; font-weight:600; color:#225a99;">${nomes[materia]}</td>
            ${dificuldades.map(dif => {
                const stats = (historicoDesempenho[materia] && historicoDesempenho[materia][dif]) || { acertos: 0, erros: 0 };
                return `
                    <td style="padding:7px 4px; color:#38a169; text-align:center;">${stats.acertos}</td>
                    <td style="padding:7px 4px; color:#e53e3e; text-align:center;">${stats.erros}</td>
                `;
            }).join('')}
        `;
        tbody.appendChild(tr);
    });
}

// Atualize o histórico ao mostrar o perfil (só para alunos)
const originalShowTab = showTab;
showTab = function(tab) {
    originalShowTab(tab);
    if (tab === 'profile') {
        // Mostra histórico só se for aluno
        const isAluno = (profileType.textContent.trim().toLowerCase() === 'aluno');
        document.getElementById('historico-desempenho').style.display = isAluno ? '' : 'none';
        if (isAluno) renderizarHistorico();
    }
};

// Atualize o histórico ao iniciar
renderizarHistorico();
