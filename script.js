/* =========================================
   STATE
========================================= */

let tasks = JSON.parse(localStorage.getItem("dashboardTasks")) || [];

let notes = JSON.parse(localStorage.getItem("dashboardNotes")) || [];


/* =========================================
   DOM ELEMENTS
========================================= */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

const notesList = document.getElementById("notesList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const totalNotes = document.getElementById("totalNotes");
const taskProgress = document.getElementById("taskProgress");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressMessage = document.getElementById("progressMessage");

const currentDate = document.getElementById("currentDate");

const noteModal = document.getElementById("noteModal");

const addNoteButton = document.getElementById("addNoteButton");
const closeModal = document.getElementById("closeModal");
const cancelNote = document.getElementById("cancelNote");

const clearCompleted = document.getElementById("clearCompleted");

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

const themeToggle = document.getElementById("themeToggle");


/* =========================================
   DATE
========================================= */

function updateDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    currentDate.textContent = date.toLocaleDateString(
        "en-US",
        options
    );
}

updateDate();


/* =========================================
   LOCAL STORAGE
========================================= */

function saveTasks() {

    localStorage.setItem(
        "dashboardTasks",
        JSON.stringify(tasks)
    );
}


function saveNotes() {

    localStorage.setItem(
        "dashboardNotes",
        JSON.stringify(notes)
    );
}


/* =========================================
   TASKS
========================================= */

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-state">
                No tasks yet. Add your first task.
            </div>
        `;

        updateStats();

        return;
    }


    tasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "task-item";

        if (task.completed) {
            taskElement.classList.add("completed");
        }


        taskElement.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button
                class="delete-task"
                aria-label="Delete task"
            >
                ×
            </button>

        `;


        const checkbox =
            taskElement.querySelector(".task-checkbox");

        const deleteButton =
            taskElement.querySelector(".delete-task");


        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });


        deleteButton.addEventListener("click", () => {

            tasks = tasks.filter(
                item => item.id !== task.id
            );

            saveTasks();

            renderTasks();

        });


        taskList.appendChild(taskElement);

    });


    updateStats();
}


/* =========================================
   ADD TASK
========================================= */

taskForm.addEventListener("submit", event => {

    event.preventDefault();

    const text = taskInput.value.trim();


    if (!text) {
        return;
    }


    const task = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.unshift(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();

});


/* =========================================
   CLEAR COMPLETED
========================================= */

clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();

});


/* =========================================
   STATISTICS
========================================= */

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;


    let progress = 0;

    if (total > 0) {
        progress = Math.round(
            (completed / total) * 100
        );
    }


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    totalNotes.textContent = notes.length;

    taskProgress.textContent = `${progress}%`;

    progressText.textContent = `${progress}%`;

    progressBar.style.width = `${progress}%`;


    if (total === 0) {

        progressMessage.textContent =
            "Start by adding a task.";

    } else if (progress === 100) {

        progressMessage.textContent =
            "Everything is complete. Great work! 🎉";

    } else if (progress >= 50) {

        progressMessage.textContent =
            "You're making good progress. Keep going!";

    } else {

        progressMessage.textContent =
            "Keep working through your tasks.";

    }
}


/* =========================================
   NOTES
========================================= */

function renderNotes() {

    notesList.innerHTML = "";


    if (notes.length === 0) {

        notesList.innerHTML = `
            <div class="empty-state">
                No notes yet. Create one to get started.
            </div>
        `;

        updateStats();

        return;
    }


    notes.forEach(note => {

        const noteElement =
            document.createElement("article");


        noteElement.className = "note";


        noteElement.innerHTML = `

            <h3>
                ${escapeHTML(note.title)}
            </h3>

            <p>
                ${escapeHTML(note.content)}
            </p>

            <button
                class="delete-note"
                aria-label="Delete note"
            >
                ×
            </button>

        `;


        const deleteButton =
            noteElement.querySelector(".delete-note");


        deleteButton.addEventListener("click", () => {

            notes = notes.filter(
                item => item.id !== note.id
            );

            saveNotes();

            renderNotes();

        });


        notesList.appendChild(noteElement);

    });


    updateStats();
}


/* =========================================
   ADD NOTE
========================================= */

addNoteButton.addEventListener("click", () => {

    noteModal.classList.add("show");

    noteTitle.focus();

});


/* =========================================
   CLOSE NOTE MODAL
========================================= */

function closeNoteModal() {

    noteModal.classList.remove("show");

    noteForm.reset();
}


closeModal.addEventListener(
    "click",
    closeNoteModal
);


cancelNote.addEventListener(
    "click",
    closeNoteModal
);


noteModal.addEventListener("click", event => {

    if (event.target === noteModal) {

        closeNoteModal();

    }

});


/* =========================================
   SAVE NOTE
========================================= */

noteForm.addEventListener("submit", event => {

    event.preventDefault();


    const title = noteTitle.value.trim();

    const content = noteContent.value.trim();


    if (!title || !content) {
        return;
    }


    const note = {

        id: Date.now(),

        title: title,

        content: content

    };


    notes.unshift(note);

    saveNotes();

    renderNotes();

    closeNoteModal();

});


/* =========================================
   MOBILE MENU
========================================= */

menuButton.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        document
            .querySelectorAll(".nav-link")
            .forEach(item => {
                item.classList.remove("active");
            });


        link.classList.add("active");


        if (window.innerWidth <= 800) {

            sidebar.classList.remove("open");

        }

    });

});


/* =========================================
   DARK MODE
========================================= */

const savedTheme =
    localStorage.getItem("dashboardTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent =
        "☀️ Light mode";

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    if (isDark) {

        localStorage.setItem(
            "dashboardTheme",
            "dark"
        );

        themeToggle.textContent =
            "☀️ Light mode";

    } else {

        localStorage.setItem(
            "dashboardTheme",
            "light"
        );

        themeToggle.textContent =
            "🌙 Dark mode";

    }

});


/* =========================================
   SECURITY HELPER
========================================= */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* =========================================
   INITIAL RENDER
========================================= */

renderTasks();

renderNotes();

updateStats();