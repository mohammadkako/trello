import { storage } from './storage.js';
import { dragAndDrop } from './dragAndDrop.js';

export const taskManager = {
    // ایجاد یک کارت جدید
    createTask(value, columnIndex) {
        const newTask = {
            value: value,
            done: false,
            chart: columnIndex,
            id: Date.now()
        };
        storage.addItem(newTask);
        this.displayTasks();
    },

    // نمایش کارت‌ها در ستون‌ها
    displayTasks() {
        const items = storage.getItems();
        
        // گروه‌بندی آیتم‌ها بر اساس ستون
        const columnItems = {
            0: [],
            1: [],
            2: [],
            3: []
        };

        // گروه‌بندی آیتم‌ها
        items.forEach((item, index) => {
            columnItems[item.chart].push({
                ...item,
                index: index
            });
        });

        // تولید HTML برای هر ستون
        const toDoItems = this.generateColumnHTML(columnItems[0]);
        const doingItems = this.generateColumnHTML(columnItems[1]);
        const checkItems = this.generateColumnHTML(columnItems[2]);
        const doneItems = this.generateColumnHTML(columnItems[3]);

        // به‌روزرسانی DOM
        document.querySelector('.to_do_list').innerHTML = toDoItems;
        document.querySelector('.doing_list').innerHTML = doingItems;
        document.querySelector('.check_list').innerHTML = checkItems;
        document.querySelector('.done_list').innerHTML = doneItems;

        // به‌روزرسانی جدول
        this.updateTable(items);

        // تنظیم مجدد drag & drop بعد از به‌روزرسانی DOM
        setTimeout(() => {
            dragAndDrop.init();
        }, 0);
    },

    // تولید HTML برای هر ستون
    generateColumnHTML(items) {
        return items.map(item => `
            <div class="task" draggable="true" data-index="${item.index}">
                <div class="input_controller">
                    <div class="done_controller">
                        <i class="fa-solid fa-check doneBtns BTN ${item.done ? 'done_status' : 'undone_status'}"></i>
                        <textarea disabled>${item.value}</textarea>
                    </div>
                    <div class="edit_controller">
                        <i class="fa-solid fa-eraser deleteBtn BTN" style="display: ${item.done ? 'none' : 'block'}"></i>
                        <i class="fa-solid fa-pen-to-square editBtn BTN" style="display: ${item.done ? 'none' : 'block'}"></i>
                    </div>
                </div>
                <div class="update_controller">
                    <button class="saveBtn">Save</button>
                    <button class="cancelBtn">Cancel</button>
                </div>
            </div>
        `).join('');
    },

    // به‌روزرسانی جدول
    updateTable(items) {
        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = items.map(item => `
                <tr>
                    <td>${item.value}</td>
                    <td>${this.getColumnName(item.chart)}</td>
                </tr>
            `).join('');
        }
    },

    // دریافت نام ستون
    getColumnName(columnIndex) {
        const columns = ['To Do', 'Doing', 'Check', 'Done'];
        return columns[columnIndex] || 'Unknown';
    },

    // حذف یک کارت
    deleteTask(index) {
        storage.deleteItem(index);
        this.displayTasks();
    },

    // به‌روزرسانی یک کارت
    updateTask(index, newValue) {
        storage.updateItem(index, newValue);
        this.displayTasks();
    },

    // تغییر وضعیت انجام یک کارت
    toggleTaskStatus(index) {
        console.log('toggleTaskStatus called with index:', index);
        const items = storage.getItems();
        console.log('Current items:', items);
        if (items[index]) {
            // تغییر وضعیت done
            items[index].done = !items[index].done;
            console.log('Updated item:', items[index]);
            
            // ذخیره تغییرات
            storage.saveItems(items);
            
            // به‌روزرسانی نمایش کارت‌ها
            this.displayTasks();
            
            // تنظیم مجدد drag & drop
            setTimeout(() => {
                dragAndDrop.init();
            }, 0);
        }
    },

    // پاک کردن همه کارت‌های یک ستون
    clearColumn(columnIndex) {
        const items = storage.getItems();
        const filteredItems = items.filter(item => item.chart !== columnIndex);
        storage.saveItems(filteredItems);
        this.displayTasks();
    }
}; 