import { storage } from './storage.js';
import { taskManager } from './taskManager.js';

export const dragAndDrop = {
    init() {
        this.removeDragAndDropListeners();
        this.setupDragAndDrop();
    },

    removeDragAndDropListeners() {
        const tasks = document.querySelectorAll(".task");
        const columns = document.querySelectorAll(".charts");

        tasks.forEach(task => {
            const newTask = task.cloneNode(true);
            task.parentNode.replaceChild(newTask, task);
        });

        columns.forEach(column => {
            const newColumn = column.cloneNode(true);
            column.parentNode.replaceChild(newColumn, column);
        });
    },

    setupDragAndDrop() {
        const tasks = document.querySelectorAll(".task");
        const columns = document.querySelectorAll(".charts");
        let draggedTask = null;

        tasks.forEach(task => {
            task.addEventListener("dragstart", () => {
                draggedTask = task;
                task.classList.add("dragging");
                task.style.border = "2px solid blue";
            });

            task.addEventListener("dragend", () => {
                task.classList.remove("dragging");
                task.style.border = "";
                draggedTask = null;
            });
        });

        columns.forEach(column => {
            column.addEventListener("dragover", (e) => {
                e.preventDefault();
                if (draggedTask) {
                    const tasks = [...column.querySelectorAll(".task:not(.dragging)")];
                    const afterElement = this.getDragAfterElement(column, e.clientY);

                    if (afterElement) {
                        column.insertBefore(draggedTask, afterElement);
                    } else {
                        column.appendChild(draggedTask);
                    }
                }
            });

            column.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedTask) {
                    const newColumnIndex = parseInt(column.dataset.column);
                    const items = storage.getItems();
                    const taskIndex = parseInt(draggedTask.dataset.index);
                    
                    if (items[taskIndex]) {
                        items[taskIndex].chart = newColumnIndex;
                        storage.saveItems(items);
                        taskManager.displayTasks();
                    }
                }
            });
        });
    },

    getDragAfterElement(column, y) {
        const tasks = [...column.querySelectorAll(".task:not(.dragging)")];

        return tasks.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}; 