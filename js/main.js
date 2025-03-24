import { taskManager } from './taskManager.js';
import { uiManager } from './uiManager.js';
import { dateManager } from './dateManager.js';

// نمایش کارت‌ها در هنگام لود صفحه
window.addEventListener('load', () => {
    taskManager.displayTasks();
    uiManager.init();
    dateManager.init();
}); 