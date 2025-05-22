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
    leaderboard: document.getElementById('leaderboard-section')
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

// Estado global
let currentUser = null;
let pontos = 0;
let nivel = 1;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let atividadeAtual = null;
let dificuldade = 'facil';

// Atividades por matéria e dificuldade
const perguntasFaceis = {
    matematica: [
        { pergunta: 'Quanto é 2 + 2?', resposta: '4', dica: 'Soma simples.' }
    ],
    portugues: [
        { pergunta: 'Plural de "flor"?', resposta: 'flores', dica: 'Adicione "es".' }
    ],
    ingles: [
        { pergunta: 'Traduza: "cat"', resposta: 'gato', dica: 'Animal doméstico.' }
    ],
    geografia: [
        { pergunta: 'Capital de SP?', resposta: 'são paulo', dica: 'Mesmo nome do estado.' }
    ],
    historia: [
        { pergunta: 'Ano da independência do Brasil?', resposta: '1822', dica: 'Século XIX.' }
    ]
};
const perguntasMedias = {
    matematica: [
        { pergunta: 'Quanto é 12 x 7?', resposta: '84', dica: 'Multiplicação.' }
    ],
    portugues: [
        { pergunta: 'Qual o antônimo de "feliz"?', resposta: 'triste', dica: 'Sentimento oposto.' }
    ],
    ingles: [
        { pergunta: 'Traduza: "window"', resposta: 'janela', dica: 'Presente em toda casa.' }
    ],
    geografia: [
        { pergunta: 'Qual continente é o Brasil?', resposta: 'américa do sul', dica: 'Fica ao sul.' }
    ],
    historia: [
        { pergunta: 'Quem descobriu o Brasil?', resposta: 'pedro álvares cabral', dica: 'Navegador português.' }
    ]
};
const perguntasDificeis = {
    matematica: [
        { pergunta: 'Qual é a raiz quadrada de 144?', resposta: '12', dica: 'Multiplicação reversa.' },
        { pergunta: 'Resolva: (5² + 3²) x 2', resposta: '68', dica: 'Lembre-se da ordem das operações.' }
    ],
    portugues: [
        { pergunta: 'O que é uma oração subordinada?', resposta: 'frase dependente', dica: 'Depende de outra oração.' }
    ],
    ingles: [
        { pergunta: 'Traduza: "environment"', resposta: 'meio ambiente', dica: 'Palavra comum em sustentabilidade.' }
    ],
    geografia: [
        { pergunta: 'Qual o maior deserto do mundo?', resposta: 'saara', dica: 'Fica na África.' }
    ],
    historia: [
        { pergunta: 'Quem assinou a Lei Áurea?', resposta: 'princesa isabel', dica: 'Foi uma princesa.' }
    ]
};

// Utilidades
function atualizarPerfil() {
    profilePoints.textContent = pontos;
    profileLevel.textContent = nivel;
}

function atualizarLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.sort((a, b) => b.pontos - a.pontos);
    leaderboard.slice(0, 10).forEach((aluno, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="rank">${i+1}º</span> <span class="nome">${aluno.nome}</span> <span class="pts">${aluno.pontos} pts</span>`;
        leaderboardList.appendChild(li);
    });
}

function salvarLeaderboard(nome, pontos) {
    const idx = leaderboard.findIndex(a => a.nome === nome);
    if (idx >= 0) {
        leaderboard[idx].pontos = pontos;
    } else {
        leaderboard.push({ nome, pontos });
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
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const type = document.getElementById('login-type').value;
    const user = users.find(u => u.email === email && u.password === password && u.type === type);
    if (user || type === 'aluno') {
        currentUser = user || { name: 'Visitante', type: type };
        loginContainer.style.display = 'none';
        mainApp.style.display = 'block';
        userGreeting.textContent = `Olá, ${currentUser.name}! Pronto para aprender hoje?`;
        loginError.textContent = '';
        profileName.textContent = currentUser.name;
        profileType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        pontos = 0;
        nivel = 1;
        atualizarPerfil();
        atualizarLeaderboard();
        showTab('activities');
    } else {
        loginError.textContent = 'Usuário ou senha inválidos.';
    }
});

// Logout
logoutBtn.addEventListener('click', function() {
    currentUser = null;
    mainApp.style.display = 'none';
    loginContainer.style.display = 'block';
    loginForm.reset();
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
});

// Esqueceu senha
document.getElementById('forgot-password-btn').addEventListener('click', function() {
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

submitAnswerBtn.addEventListener('click', function() {
    if (!atividadeAtual) return;
    const resposta = activityAnswer.value.trim().toLowerCase();
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
        setTimeout(novaAtividade, 1200);
    } else {
        answerFeedback.textContent = 'Tente novamente!';
        answerFeedback.className = 'incorrect';
        document.getElementById('activity-tip').textContent = atividadeAtual.dica ? `Dica: ${atividadeAtual.dica}` : '';
    }
});

// Menu responsivo
menuToggle.addEventListener('click', function() {
    mainMenu.classList.toggle('open');
});
mainMenu.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-btn') || e.target.id === 'logout-btn') {
        if (window.innerWidth <= 700) mainMenu.classList.remove('open');
    }
});

// Navegação
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        showTab(tab);
    });
});

// IA Simulada
askAiBtn.addEventListener('click', function() {
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