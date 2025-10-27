const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const taskList = document.getElementById('task-list');


function saveTasks() {
    const tasks = [];
    
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const text = taskItem.querySelector('.task-text').textContent;
        const completed = taskItem.classList.contains('completed');
        const timestamp = taskItem.querySelector('.task-timestamp').textContent;
        tasks.push({ text, completed, timestamp });
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    
    if (tasks) {
        tasks.forEach(task => {
            
            createTaskElement(task.text, task.completed, task.timestamp);
        });
    }
}


function createTaskElement(taskText, isCompleted = false, timestamp) {
    
    
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('material-icons', 'check-icon');
    checkIcon.textContent = 'radio_button_unchecked'; 

    
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text'; 
    taskSpan.textContent = taskText;

    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'task-timestamp';
    timeSpan.textContent = timestamp;

    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '<i class="material-icons">delete</i>'; 
    deleteButton.disabled = true; 

    
    deleteButton.addEventListener('click', function() {
        
        taskItem.style.opacity = '0';
        
        
        setTimeout(() => {
            taskItem.remove();
            saveTasks(); 
        }, 300); 
    });

    
    checkIcon.addEventListener('click', function() {
        const isCompleted = taskItem.classList.toggle('completed');

        
        checkIcon.textContent = isCompleted ? 'check_circle' : 'radio_button_unchecked';
        
        
        deleteButton.disabled = !isCompleted;
        saveTasks(); 
    });

    
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


function addTask() {
    const taskText = taskInput.value.trim(); 

    
    if (taskText === "") {
        alert("Por favor, digite uma tarefa.");
        return; 
    }

    
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    createTaskElement(taskText, false, timestamp); 

    
    taskInput.value = '';
    taskInput.focus();
    saveTasks(); 
}


function clearAllTasks() {
    
    if (taskList.children.length === 0) {
        alert("A lista de tarefas já está vazia!");
        return;
    }
    
    
    const userConfirmed = confirm("Você tem certeza que deseja apagar todas as tarefas?");

    if (userConfirmed) {
        const tasks = taskList.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            task.style.opacity = '0';
        });

        
        setTimeout(() => {
            taskList.innerHTML = ''; 
            saveTasks(); 
        }, 500); 
    }
}


addButton.addEventListener('click', addTask); 
taskInput.addEventListener('keypress', function(event) { 
    if (event.key === 'Enter') {
        addTask();
    }
});
clearButton.addEventListener('click', clearAllTasks); 


document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    
    addButton.classList.add('animated-border');
    clearButton.classList.add('animated-border');

    
    const copyrightSpan = document.getElementById('copyright');
    copyrightSpan.innerHTML += `${new Date().getFullYear()} NexusCleo.`;

    const backgroundMusic = document.getElementById('background-music');
    const muteToggle = document.getElementById('mute-toggle');

    
    const startMusicOnFirstInteraction = () => {
        backgroundMusic.play().catch(e => console.log("A interação do usuário é necessária para iniciar o áudio.", e));
        
        document.body.removeEventListener('click', startMusicOnFirstInteraction);
    };
    document.body.addEventListener('click', startMusicOnFirstInteraction);

    
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


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        
        
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('Service Worker registrado com sucesso:', registration))
            .catch(err => console.log('Falha ao registrar Service Worker:', err));
    });
}