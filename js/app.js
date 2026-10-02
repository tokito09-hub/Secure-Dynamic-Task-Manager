// Secure Dynamic Task Manager
// ITP10 | Event-Driven Programming


// ==========================================
// SELECT DOM ELEMENTS
// ==========================================

const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");

const taskList = document.querySelector("#taskList");

const taskMessage = document.querySelector("#taskMessage");

const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");


// ==========================================
// TASK ID COUNTER
// ==========================================

let nextTaskId = 1;


// ==========================================
// CREATE TASK ELEMENT
// ==========================================

function createTaskElement(taskText, taskId) {

    const taskItem = document.createElement("li");

    taskItem.classList.add("task-item");

    taskItem.dataset.taskId = taskId;

    taskItem.dataset.state = "pending";


    // Task text
    const textSpan = document.createElement("span");

    textSpan.classList.add("task-text");

    textSpan.textContent = taskText;


    // Complete button
    const completeButton = document.createElement("button");

    completeButton.classList.add("complete-btn");

    completeButton.type = "button";

    completeButton.textContent = "Complete";


    // Edit button
    const editButton = document.createElement("button");

    editButton.classList.add("edit-btn");

    editButton.type = "button";

    editButton.textContent = "Edit";


    // Remove button
    const removeButton = document.createElement("button");

    removeButton.classList.add("remove-btn");

    removeButton.type = "button";

    removeButton.textContent = "Remove";


    // Add all elements to the task item
    taskItem.append(
        textSpan,
        completeButton,
        editButton,
        removeButton
    );


    return taskItem;
}


// ==========================================
// ADD TASK
// ==========================================

function addTask(taskText) {

    const cleanText = taskText.trim();


    // Validate task
    if (cleanText === "") {

        taskMessage.textContent =
            "Task cannot be empty";

        return;
    }


    // Create unique task ID
    const taskId = `task-${nextTaskId}`;

    nextTaskId++;


    // Create task
    const taskItem =
        createTaskElement(
            cleanText,
            taskId
        );


    // Add task to DOM
    taskList.append(taskItem);


    // Clear input
    taskInput.value = "";


    // Clear error
    taskMessage.textContent = "";


    // Update counters
    updateTaskCounts();
}


// ==========================================
// TOGGLE TASK COMPLETE
// ==========================================

function toggleTaskComplete(taskItem) {

    taskItem.classList.toggle("completed");


    const isCompleted =
        taskItem.classList.contains("completed");


    if (isCompleted) {

        taskItem.dataset.state =
            "completed";

    } else {

        taskItem.dataset.state =
            "pending";
    }


    updateTaskCounts();
}


// ==========================================
// BEGIN TASK EDIT
// ==========================================

function beginTaskEdit(taskItem) {

    const textSpan =
        taskItem.querySelector(".task-text");

    const editButton =
        taskItem.querySelector(".edit-btn");


    if (!textSpan || !editButton) {
        return;
    }


    // Create edit input
    const editInput =
        document.createElement("input");

    editInput.classList.add("edit-input");

    editInput.type = "text";

    editInput.value =
        textSpan.textContent;


    // Replace text with input
    textSpan.replaceWith(editInput);


    // Change button text
    editButton.textContent = "Save";


    // Focus input
    editInput.focus();

    editInput.select();
}


// ==========================================
// SAVE TASK EDIT
// ==========================================

function saveTaskEdit(taskItem) {

    const editInput =
        taskItem.querySelector(".edit-input");

    const editButton =
        taskItem.querySelector(".edit-btn");


    if (!editInput || !editButton) {
        return;
    }


    const cleanText =
        editInput.value.trim();


    // Validate edit
    if (cleanText === "") {

        taskMessage.textContent =
            "Task cannot be empty";

        editInput.focus();

        return;
    }


    // Create new text span
    const textSpan =
        document.createElement("span");

    textSpan.classList.add("task-text");

    textSpan.textContent =
        cleanText;


    // Replace input
    editInput.replaceWith(textSpan);


    // Change button back to Edit
    editButton.textContent = "Edit";


    // Clear error
    taskMessage.textContent = "";
}


// ==========================================
// REMOVE TASK
// ==========================================

function removeTask(taskItem) {

    taskItem.remove();

    taskMessage.textContent = "";

    updateTaskCounts();
}


// ==========================================
// UPDATE TASK COUNTS
// ==========================================

function updateTaskCounts() {

    // Get all current task items
    const taskItems = [
        ...taskList.querySelectorAll(".task-item")
    ];


    // Total
    const total =
        taskItems.length;


    // Completed
    const completed =
        taskItems.filter(
            (taskItem) =>
                taskItem.dataset.state === "completed"
        ).length;


    // Pending
    const pending =
        taskItems.filter(
            (taskItem) =>
                taskItem.dataset.state === "pending"
        ).length;


    // Display counts
    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;


    // Show/hide empty message
    const emptyNote =
        document.querySelector(".empty-note");


    if (emptyNote) {

        emptyNote.hidden =
            total !== 0;
    }
}


// ==========================================
// HANDLE TASK LIST CLICK
// ==========================================

function handleTaskListClick(event) {

    const clickedButton =
        event.target;


    if (!(clickedButton instanceof HTMLElement)) {
        return;
    }


    // Make sure the clicked element
    // is one of the required buttons
    if (
        !clickedButton.matches(".complete-btn") &&
        !clickedButton.matches(".edit-btn") &&
        !clickedButton.matches(".remove-btn")
    ) {
        return;
    }


    // Find the task containing the button
    const taskItem =
        clickedButton.closest(".task-item");


    if (!taskItem) {
        return;
    }


    // Complete
    if (
        clickedButton.matches(".complete-btn")
    ) {

        toggleTaskComplete(taskItem);

        return;
    }


    // Edit / Save
    if (
        clickedButton.matches(".edit-btn")
    ) {

        if (
            taskItem.querySelector(".edit-input")
        ) {

            saveTaskEdit(taskItem);

        } else {

            beginTaskEdit(taskItem);
        }

        return;
    }


    // Remove
    if (
        clickedButton.matches(".remove-btn")
    ) {

        removeTask(taskItem);
    }
}


// ==========================================
// LOAD SAMPLE TASKS
// ==========================================

function loadSampleTasks() {

    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];


    // Create DocumentFragment
    const fragment =
        document.createDocumentFragment();


    // Create all three tasks
    sampleTasks.forEach(
        (taskText) => {

            const taskId =
                `task-${nextTaskId}`;

            nextTaskId++;


            const taskItem =
                createTaskElement(
                    taskText,
                    taskId
                );


            fragment.append(taskItem);
        }
    );


    // Append fragment ONCE
    taskList.append(fragment);


    taskMessage.textContent = "";

    updateTaskCounts();
}


// ==========================================
// BUTTON EVENTS
// ==========================================

addTaskBtn.addEventListener(
    "click",
    () => {

        addTask(taskInput.value);
    }
);


loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);


// ==========================================
// ENTER KEY
// ==========================================

taskInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            addTask(taskInput.value);
        }
    }
);


// ==========================================
// EVENT DELEGATION
// EXACTLY ONE CLICK LISTENER
// FOR TASK ACTIONS
// ==========================================

taskList.addEventListener(
    "click",
    handleTaskListClick
);


// ==========================================
// INITIAL STATE
// ==========================================

updateTaskCounts();