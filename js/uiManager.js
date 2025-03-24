import { taskManager } from './taskManager.js';
import { dragAndDrop } from './dragAndDrop.js';

export const uiManager = {
    init() {
        this.activateAddTaskListeners();
        this.activateDeleteListeners();
        this.activateEditListeners();
        this.activateSaveListeners();
        this.activateCancelListeners();
        this.activateDoneListeners();
        this.activateClearListeners();
        this.activateViewToggle();
        dragAndDrop.init();
    },

    // فعال‌سازی لیسنرهای اضافه کردن کارت
    activateAddTaskListeners() {
        const enterBtns = document.querySelectorAll(".enter");
        enterBtns.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                const items = document.querySelectorAll(".item");
                if (items[i].value.length === 0) {
                    confirm("Please, fill the input!");
                } else {
                    taskManager.createTask(items[i].value, i);
                    items[i].value = "";
                }
            });
        });

        // اضافه کردن event listener برای کلید Enter
        const inputs = document.querySelectorAll(".item");
        inputs.forEach((input, i) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (input.value.length === 0) {
                        confirm("Please, fill the input!");
                    } else {
                        taskManager.createTask(input.value, i);
                        input.value = "";
                    }
                }
            });
        });
    },

    // فعال‌سازی لیسنرهای حذف کارت
    activateDeleteListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('deleteBtn')) {
                if (confirm("You are going to delete this task!")) {
                    const taskElement = e.target.closest(".task");
                    const index = parseInt(taskElement.dataset.index);
                    taskManager.deleteTask(index);
                }
            }
        });
    },

    // فعال‌سازی لیسنرهای ویرایش کارت
    activateEditListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('editBtn')) {
                const taskElement = e.target.closest(".task");
                const updateController = taskElement.querySelector('.update_controller');
                const textarea = taskElement.querySelector('.done_controller textarea');
                const tasks = document.querySelectorAll(".task");

                updateController.classList.add('active');
                textarea.disabled = false;

                tasks.forEach((item) => {
                    item.style.pointerEvents = item === taskElement ? "auto" : "none";
                });
            }
        });
    },

    // فعال‌سازی لیسنرهای ذخیره تغییرات
    activateSaveListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('saveBtn')) {
                const taskElement = e.target.closest(".task");
                const textarea = taskElement.querySelector('.done_controller textarea');
                const index = parseInt(taskElement.dataset.index);
                taskManager.updateTask(index, textarea.value);
            }
        });
    },

    // فعال‌سازی لیسنرهای لغو ویرایش
    activateCancelListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancelBtn')) {
                location.reload();
            }
        });
    },

    // فعال‌سازی لیسنرهای تغییر وضعیت انجام
    activateDoneListeners() {
        document.addEventListener('click', (e) => {
            console.log('Clicked element:', e.target);
            if (e.target.classList.contains('doneBtns')) {
                console.log('Done button clicked');
                const taskElement = e.target.closest(".task");
                console.log('Task element:', taskElement);
                const index = parseInt(taskElement.dataset.index);
                console.log('Task index:', index);
                const doneBtn = e.target;
                const deleteBtn = taskElement.querySelector('.deleteBtn');
                const editBtn = taskElement.querySelector('.editBtn');
                
                console.log('Done button classes:', doneBtn.classList);
                // تغییر وضعیت دکمه
                if (doneBtn.classList.contains('done_status')) {
                    console.log('Changing from done to undone');
                    doneBtn.classList.remove('done_status');
                    doneBtn.classList.add('undone_status');
                    // نمایش دکمه‌های حذف و ویرایش
                    if (deleteBtn) deleteBtn.style.display = 'block';
                    if (editBtn) editBtn.style.display = 'block';
                } else {
                    console.log('Changing from undone to done');
                    doneBtn.classList.remove('undone_status');
                    doneBtn.classList.add('done_status');
                    // مخفی کردن دکمه‌های حذف و ویرایش
                    if (deleteBtn) deleteBtn.style.display = 'none';
                    if (editBtn) editBtn.style.display = 'none';
                }

                // تغییر وضعیت کارت
                taskManager.toggleTaskStatus(index);
                console.log('Task status toggled');
            }
        });
    },

    // فعال‌سازی لیسنرهای پاک کردن ستون
    activateClearListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('clearBtn')) {
                const column = e.target.closest('.todo, .doing, .check, .done');
                const columnIndex = parseInt(column.querySelector('.charts').dataset.column);
                
                if (confirm("Are you sure you want to delete all tasks in this column?")) {
                    taskManager.clearColumn(columnIndex);
                }
            }
        });
    },

    // فعال‌سازی تغییر بین نمای Board و Table
    activateViewToggle() {
        const boardView = document.querySelector('.list_to_do');
        const tableView = document.querySelector('.table_view');
        const boardBtn = document.querySelector('.board');
        const tableBtn = document.querySelector('.table');

        boardBtn.addEventListener('click', () => {
            boardView.style.display = 'flex';
            tableView.style.display = 'none';
            boardBtn.classList.add('active');
            tableBtn.classList.remove('active');
        });

        tableBtn.addEventListener('click', () => {
            boardView.style.display = 'none';
            tableView.style.display = 'block';
            tableBtn.classList.add('active');
            boardBtn.classList.remove('active');
        });
    }
}; 