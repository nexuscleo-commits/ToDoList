// 1. Selecionar os elementos do HTML
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const taskList = document.getElementById('task-list');

// Função para salvar as tarefas no localStorage
function saveTasks() {
    const tasks = [];
    // Itera sobre cada item de tarefa na lista do DOM
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const text = taskItem.querySelector('.task-text').textContent;
        const completed = taskItem.classList.contains('completed');
        const timestamp = taskItem.querySelector('.task-timestamp').textContent;
        tasks.push({ text, completed, timestamp });
    });
    // Converte o array de tarefas para uma string JSON e salva
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    // Se existirem tarefas salvas, cria os elementos para cada uma
    if (tasks) {
        tasks.forEach(task => {
            // Reutiliza a lógica de criação de tarefa, mas sem limpar o input
            createTaskElement(task.text, task.completed, task.timestamp);
        });
    }
}

// Função para criar o elemento da tarefa no DOM
function createTaskElement(taskText, isCompleted = false, timestamp) {
    // 3. Criar os novos elementos da tarefa
    // Cria o container do item
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    // Cria o ícone que funcionará como checkbox
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('material-icons', 'check-icon');
    checkIcon.textContent = 'radio_button_unchecked'; // Ícone inicial

    // Cria o texto da tarefa
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text'; // Adiciona uma classe para diferenciar do timestamp
    taskSpan.textContent = taskText;

    // Cria o elemento para o horário
    const timeSpan = document.createElement('span');
    timeSpan.className = 'task-timestamp';
    timeSpan.textContent = timestamp;

    // Cria o botão de lixeira
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '<i class="material-icons">delete</i>'; // Ícone de lixeira do Google Icons
    deleteButton.disabled = true; // Desabilitado por padrão

    // Adiciona evento para o botão de lixeira apagar a tarefa
    deleteButton.addEventListener('click', function() {
        // Adiciona um efeito de fade-out antes de remover
        taskItem.style.opacity = '0';
        
        // Espera a transição terminar para remover o elemento do DOM
        setTimeout(() => {
            taskItem.remove();
            saveTasks(); // Salva a lista DEPOIS de remover o item do DOM
        }, 300); // Este tempo deve ser igual à duração da transição no CSS
    });

    // Adiciona um evento ao ícone para marcar como concluído
    checkIcon.addEventListener('click', function() {
        const isCompleted = taskItem.classList.toggle('completed');

        // Aplica/remove o estilo de "concluído"
        checkIcon.textContent = isCompleted ? 'check_circle' : 'radio_button_unchecked';
        
        // Habilita ou desabilita o botão de lixeira com base no estado do checkbox
        deleteButton.disabled = !isCompleted;
        saveTasks(); // Salva o estado de concluído
    });

    // 4. Montar o item da tarefa e adicioná-lo à lista
    taskItem.appendChild(checkIcon);
    taskItem.appendChild(taskSpan);
    taskItem.appendChild(timeSpan);
    taskItem.appendChild(deleteButton);

    if (isCompleted) {
        taskItem.classList.add('completed');
        checkIcon.textContent = 'check_circle';
        deleteButton.disabled = false;
    }

    taskList.appendChild(taskItem);
}

// 2. Função para adicionar uma nova tarefa
function addTask() {
    const taskText = taskInput.value.trim(); // Pega o texto e remove espaços em branco

    // Verifica se o input não está vazio
    if (taskText === "") {
        alert("Por favor, digite uma tarefa.");
        return; // Para a execução da função
    }

    // Cria o carimbo de data/hora formatado (ex: 14:30)
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    createTaskElement(taskText, false, timestamp); // Cria o elemento visual da tarefa com o horário

    // 5. Limpar o campo de input, focar nele e salvar
    taskInput.value = '';
    taskInput.focus();
    saveTasks(); // Salva a nova lista de tarefas
}

// 7. Função para limpar todas as tarefas
function clearAllTasks() {
    // Verifica se a lista de tarefas já está vazia
    if (taskList.children.length === 0) {
        alert("A lista de tarefas já está vazia!");
        return; // Para a execução da função
    }
    
    // Pede confirmação ao usuário antes de apagar tudo
    const userConfirmed = confirm("Você tem certeza que deseja apagar todas as tarefas?");

    if (userConfirmed) {
        const tasks = taskList.querySelectorAll('.task-item');
        // Anima a saída de todas as tarefas
        tasks.forEach(task => {
            task.style.opacity = '0';
        });

        // Espera a animação terminar para limpar o HTML e salvar
        setTimeout(() => {
            taskList.innerHTML = ''; // Remove todos os elementos filhos da lista
            saveTasks(); // Salva a lista vazia
        }, 500); // Tempo deve ser igual à transição no CSS
    }
}

// Adicionar eventos
addButton.addEventListener('click', addTask); // Adiciona tarefa ao clicar no botão
taskInput.addEventListener('keypress', function(event) { // Adiciona tarefa ao pressionar "Enter"
    if (event.key === 'Enter') {
        addTask();
    }
});
clearButton.addEventListener('click', clearAllTasks); // Limpa a lista ao clicar no botão

// Carrega as tarefas salvas quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    // Adiciona a classe para o efeito de borda animada nos botões
    addButton.classList.add('animated-border');
    clearButton.classList.add('animated-border');

    // Atualiza o ano do copyright dinamicamente
    const copyrightSpan = document.getElementById('copyright');
    copyrightSpan.innerHTML += `${new Date().getFullYear()} NexusCleo.`;

    const backgroundMusic = document.getElementById('background-music');
    const muteToggle = document.getElementById('mute-toggle');

    // Inicia a música na primeira interação do usuário para contornar o bloqueio de autoplay
    const startMusicOnFirstInteraction = () => {
        backgroundMusic.play().catch(e => console.log("A interação do usuário é necessária para iniciar o áudio.", e));
        // Remove o listener após a primeira execução para não rodar novamente
        document.body.removeEventListener('click', startMusicOnFirstInteraction);
    };
    document.body.addEventListener('click', startMusicOnFirstInteraction);

    // Atualiza os ícones com base no estado inicial do áudio
    if (backgroundMusic.muted) {
        muteToggle.querySelector('i').textContent = 'volume_off';
    }

    muteToggle.addEventListener('click', () => {
        backgroundMusic.muted = !backgroundMusic.muted;
        if (backgroundMusic.muted) {
            muteToggle.querySelector('i').textContent = 'volume_off';
        } else {
            muteToggle.querySelector('i').textContent = 'volume_up';
        }
    });
});

// Registra o Service Worker para funcionalidade PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Usamos um caminho relativo para garantir que funcione em qualquer ambiente (local ou produção)
        // 'service-worker.js' procura o arquivo na mesma pasta que o index.html
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('Service Worker registrado com sucesso:', registration))
            .catch(err => console.log('Falha ao registrar Service Worker:', err));
    });
}
