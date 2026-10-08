// ========================================
// 1. العناصر الموجودة في HTML
// ========================================

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const tasksSection = document.querySelector(".tasks-section");

const dayName = document.querySelector(".day-name");
const dayNumber = document.querySelector(".day-number");
const month = document.querySelector(".month");

const progressText = document.querySelector(".progress-text");
const completedText = document.querySelectorAll(".progress-text")[1];
const progressFill = document.querySelector(".progress-fill");


// ========================================
// 2. قائمة المهام
// ========================================

let tasks = [];


// ========================================
// 3. التاريخ التلقائي
// ========================================

function displayDate() {

    const today = new Date();

    const days = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
    ];

    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];

    dayName.textContent = days[today.getDay()];
    dayNumber.textContent = today.getDate();
    month.textContent = months[today.getMonth()];
}


// ========================================
// 4. حفظ المهام
// ========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// ========================================
// 5. تحديث نسبة التقدم
// ========================================

function updateProgress() {

    const totalTasks = tasks.length;

    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    let progress = 0;

    if (totalTasks > 0) {

        progress = Math.round(
            (completedCount / totalTasks) * 100
        );
    }

    progressText.textContent = `${progress}%`;

    completedText.textContent =
        `Tâches terminées : ${completedCount}`;

    progressFill.style.width = `${progress}%`;
}


// ========================================
// 6. عرض المهام
// ========================================

function displayTasks() {

    // حذف المهام الموجودة في الصفحة
    document.querySelectorAll(".task").forEach(taskElement => {
        taskElement.remove();
    });


    // إنشاء المهام من جديد
    tasks.forEach((task, index) => {

        const taskElement = document.createElement("div");

        taskElement.classList.add("task");


        // إذا كانت المهمة مكتملة
        if (task.completed) {

            taskElement.classList.add("completed");
        }


        taskElement.innerHTML = `
            <p>${task.text}</p>

            <div class="task-actions">

                <button
                    class="complete-task"
                    data-index="${index}">
                    ✓
                </button>

                <button
                    class="edit-task"
                    data-index="${index}">
                    ✎
                </button>

                <button
                    class="delete-task"
                    data-index="${index}">
                    x
                </button>

            </div>
        `;


        tasksSection.appendChild(taskElement);
    });


    updateProgress();
}


// ========================================
// 7. إضافة مهمة جديدة
// ========================================

function addNewTask() {

    const taskText = taskInput.value.trim();


    // منع إضافة مهمة فارغة
    if (taskText === "") {

        return;
    }


    const newTask = {

        text: taskText,

        completed: false
    };


    tasks.push(newTask);


    saveTasks();

    displayTasks();


    // إفراغ input
    taskInput.value = "";


    // إعادة المؤشر إلى input
    taskInput.focus();
}


// ========================================
// 8. زر +
// ========================================

addTaskButton.addEventListener("click", () => {

    addNewTask();
});


// ========================================
// 9. زر Enter
// ========================================

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        addNewTask();
    }
});


// ========================================
// 10. أزرار المهام
// ========================================

tasksSection.addEventListener("click", (event) => {


    // ====================================
    // إنهاء / إلغاء إنهاء المهمة
    // ====================================

    if (
        event.target.classList.contains("complete-task")
    ) {

        const index = Number(
            event.target.dataset.index
        );


        tasks[index].completed =
            !tasks[index].completed;


        saveTasks();

        displayTasks();
    }


    // ====================================
    // حذف المهمة
    // ====================================

    if (
        event.target.classList.contains("delete-task")
    ) {

        const index = Number(
            event.target.dataset.index
        );


        tasks.splice(index, 1);


        saveTasks();

        displayTasks();
    }


    // ====================================
    // تعديل المهمة
    // ====================================

    if (
        event.target.classList.contains("edit-task")
    ) {

        const index = Number(
            event.target.dataset.index
        );


        const newText = prompt(
            "Modifier votre tâche :",
            tasks[index].text
        );


        if (
            newText !== null &&
            newText.trim() !== ""
        ) {

            tasks[index].text =
                newText.trim();


            saveTasks();

            displayTasks();
        }
    }

});


// ========================================
// 11. تحميل المهام المحفوظة
// ========================================

function loadTasks() {

    const savedTasks =
        localStorage.getItem("tasks");


    if (savedTasks) {

        try {

            const parsedTasks =
                JSON.parse(savedTasks);


            if (Array.isArray(parsedTasks)) {

                tasks = parsedTasks;
            }

        } catch (error) {

            console.error(
                "Impossible de charger les tâches :",
                error
            );

            tasks = [];
        }
    }
}


// ========================================
// 12. تشغيل المشروع
// ========================================

displayDate();

loadTasks();

displayTasks();