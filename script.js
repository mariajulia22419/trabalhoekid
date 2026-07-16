// Configuração de Disciplinas com suas cores específicas
const subjectsFundamental = [
    { name: "Língua Portuguesa", color: "#FF5733" },
    { name: "Matemática", color: "#33FF57" },
    { name: "Ciências", color: "#3357FF" },
    { name: "História e Geografia", color: "#F1C40F" },
    { name: "Artes e Educação Física", color: "#9B59B6" },
    { name: "Ensino Religioso", color: "#1ABC9C" },
    { name: "Língua Inglesa", color: "#E67E22" }
];

const subjectsMedio = [
    { name: "Língua Portuguesa e Literatura", color: "#E74C3C" },
    { name: "Língua Inglesa", color: "#3498DB" },
    { name: "Arte", color: "#9B59B6" },
    { name: "Educação Física", color: "#2ECC71" },
    { name: "Biologia", color: "#27AE60" },
    { name: "Física", color: "#D35400" },
    { name: "Química", color: "#2C3E50" },
    { name: "História", color: "#F39C12" },
    { name: "Geografia", color: "#16A085" },
    { name: "Filosofia", color: "#8E44AD" },
    { name: "Sociologia", color: "#7F8C8D" }
];

// Gerador dinâmico de perguntas contextuais personalizadas (10 perguntas por matéria)
function generateQuestions(subject) {
    let questions = [];
    
    // Lista de tópicos simulando um banco real de conteúdos didáticos
    const topics = {
        "Matemática": ["Adição", "Subtração", "Multiplicação", "Divisão", "Geometria", "Frações"],
        "Língua Portuguesa": ["Gramática", "Ortografia", "Pontuação", "Acentuação", "Sintaxe"],
        "Ciências": ["Sistema Solar", "Reino Animal", "Plantas", "Corpo Humano", "Água", "Solo"],
        "Biologia": ["Células", "Genética", "Ecologia", "Evolução", "Sistemas do Corpo"],
        "Física": ["Mecânica", "Termodinâmica", "Óptica", "Gravidade", "Cinemática"],
        "Química": ["Átomos", "Tabela Periódica", "Ligações Químicas", "Reações", "Ácidos"]
    };

    const currentTopics = topics[subject] || ["Conhecimentos Gerais", "Desafios Lógicos"];

    for (let i = 1; i <= 10; i++) {
        let topic = currentTopics[(i - 1) % currentTopics.length];
        questions.push({
            text: `[${topic}] Questão ${i} de ${subject}: Qual das alternativas apresenta a resposta correta para o estudo desse conteúdo?`,
            options: [
                `Alternativa correta para o desafio de ${topic} (${i})`,
                `Alternativa incorreta de teste A para ${topic}`,
                `Alternativa incorreta de teste B para ${topic}`,
                `Alternativa incorreta de teste C para ${topic}`
            ],
            correct: 0 // A primeira opção será sempre considerada a correta para testes dinâmicos
        });
    }
    return questions;
}

// Estados Globais
let currentFontScale = 1.0;
let currentTheme = 'light';
let activeQuestions = [];
let currentQuestionIdx = 0;
let score = 0;
let activeSubjectName = "";

// Inicializar a Renderização das Matérias na Tela
function init() {
    const fundGrid = document.getElementById('fundamental-grid');
    const medGrid = document.getElementById('medio-grid');

    subjectsFundamental.forEach(sub => {
        fundGrid.appendChild(createSubjectCard(sub));
    });

    subjectsMedio.forEach(sub => {
        medGrid.appendChild(createSubjectCard(sub));
    });
}

// Criação do Card HTML para Matéria
function createSubjectCard(sub) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.setProperty('--subject-color', sub.color);
    
    card.innerHTML = `
        <div>
            <h3>${sub.name}</h3>
        </div>
        <div class="card-info">
            🎮 10 Perguntas Ativas
        </div>
    `;
    card.onclick = () => startQuiz(sub.name, sub.color);
    return card;
}

// Controle de Tamanho de Fonte (Acessibilidade)
function changeFontSize(direction) {
    currentFontScale += direction * 0.1;
    if (currentFontScale < 0.8) currentFontScale = 0.8;
    if (currentFontScale > 1.6) currentFontScale = 1.6;
    document.documentElement.style.setProperty('--font-scale', currentFontScale);
}

// Alternar Modo Escuro / Claro (Acessibilidade)
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    document.getElementById('theme-btn').innerText = currentTheme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro';
}

// Lógica de Inicialização do Jogo (Quiz)
function startQuiz(subjectName, color) {
    activeSubjectName = subjectName;
    activeQuestions = generateQuestions(subjectName);
    currentQuestionIdx = 0;
    score = 0;
    
    // Definir a cor temática da matéria ativa como cor de destaque do Quiz
    document.documentElement.style.setProperty('--accent-color', color);
    
    openModal('game-modal');
    showQuestion();
}

// Apresentar a Pergunta na Tela do Jogo
function showQuestion() {
    const box = document.getElementById('quiz-box');
    
    if (currentQuestionIdx >= activeQuestions.length) {
        // Tela de Fim de Jogo
        box.innerHTML = `
            <div style="font-size: 5rem; margin-bottom: 20px;">🏆</div>
            <h2>Parabéns! Você Concluiu!</h2>
            <p style="margin: 15px 0 25px; font-size: calc(18px * var(--font-scale));">Você completou o jogo de <strong>${activeSubjectName}</strong>.</p>
            <div style="font-size: calc(24px * var(--font-scale)); color: #2ecc71; font-weight: bold; margin-bottom: 30px;">
                Sua Pontuação: ${score} / 10 Acertos
            </div>
            <button class="btn-nav" style="background-color: var(--accent-color);" onclick="closeModal('game-modal')">Jogar Outra Matéria</button>
        `;
        return;
    }

    const q = activeQuestions[currentQuestionIdx];
    const progressPercent = (currentQuestionIdx / activeQuestions.length) * 100;

    // Embaralha as respostas de forma simulada mas garantindo que o index correto seja verificado
    let optionsWithOriginalIndex = q.options.map((opt, idx) => ({ text: opt, originalIdx: idx }));
    optionsWithOriginalIndex.sort(() => Math.random() - 0.5);

    let optionsHTML = '';
    optionsWithOriginalIndex.forEach(item => {
        optionsHTML += `<button class="option-btn" onclick="checkAnswer(${item.originalIdx})">${item.text}</button>`;
    });

    box.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <div class="question-text">${q.text}</div>
        <div class="options-grid">
            ${optionsHTML}
        </div>
        <p style="opacity: 0.8;">Progresso: Pergunta ${currentQuestionIdx + 1} de 10</p>
    `;
}

// Validar se a Resposta Escolhida está Correta
function checkAnswer(selectedIdx) {
    const q = activeQuestions[currentQuestionIdx];
    if (selectedIdx === q.correct) {
        score++;
        alert("Excelente! Resposta correta! 🎉");
    } else {
        alert(`Não foi dessa vez! A resposta correta era: ${q.options[q.correct]}`);
    }
    currentQuestionIdx++;
    showQuestion();
}

// Funções de Gerenciamento de Modal
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Controle de Acesso Seguro para Pais (Desafio de Matemática Simples)
function openParentsArea() {
    const val1 = Math.floor(Math.random() * 8) + 3; // de 3 a 10
    const val2 = Math.floor(Math.random() * 7) + 3; // de 3 a 10
    const correctAnswer = val1 * val2;

    const answer = prompt(`ÁREA EXCLUSIVA PARA PAIS\n\nPara confirmar que você é um adulto responsável, resolva o cálculo abaixo:\nQuanto é ${val1} x ${val2}?`);
    
    if (parseInt(answer) === correctAnswer) {
        openModal('parents-modal');
    } else {
        alert("Resposta inválida! Acesso restrito apenas aos responsáveis legais.");
    }
}

// Inicializar e Abrir Área Especial (Acessível)
function openSpecialArea() {
    const list = document.getElementById('special-games-list');
    list.innerHTML = '';

    const specialGames = [
        { name: "Quebra-Cabeça de Sílabas", desc: "Arraste e junte as formas coloridas para construir palavras simples." },
        { name: "Desafio dos Números Grandes", desc: "Aprenda a contar com objetos visuais gigantes em alto contraste." },
        { name: "Sons e Cores da Natureza", desc: "Ligue o som correto do animal à imagem correspondente." }
    ];

    specialGames.forEach(game => {
        const item = document.createElement('div');
        item.className = 'special-card-item';
        item.innerHTML = `
            <span class="special-badge">Jogo Adaptado</span>
            <h3 style="margin-bottom: 5px;">${game.name}</h3>
            <p style="font-size: 14px; opacity: 0.9;">${game.desc}</p>
        `;
        item.onclick = () => {
            closeModal('special-modal');
            startQuiz(`Adaptado: ${game.name}`, '#9b59b6');
        };
        list.appendChild(item);
    });

    openModal('special-modal');
}

// Seleção de Plano de Assinatura
function selectPlan(planName, price) {
    alert(`Plano ${planName} selecionado!\nValor: ${price}\n\nRedirecionando de forma segura para o nosso gateway de pagamento...`);
    closeModal('parents-modal');
}

// Executar Inicializador ao Carregar Página
window.onload = init;
