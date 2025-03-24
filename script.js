// add local strogae
let itemArray = JSON.parse(localStorage.getItem('items')) || [];

function addTasks(){
    let enterBtns = document.querySelectorAll(".enter")

    enterBtns.forEach((eb,i) => {
        eb.addEventListener('click' , function(){
            let items = document.querySelectorAll(".item")
            if (items[i].value.length === 0) {
                confirm("Please, fill the input!");
            } else {
                creatItem(items[i].value, i);
                items[i].value = "";
            }        
        })
    })
}


function creatItem(item,i) { 

    
    itemArray.push({ 
        value: item, 
        done: false, 
        chart: i,
        id: Date.now()
    });
    

    localStorage.setItem("items" , JSON.stringify(itemArray))
    displayItems()

 }

// add your item in local strogae
function displayItems() {
 
    
    // Group items by column and maintain order
    const columnItems = {
        0: [],
        1: [],
        2: [],
        3: []
    };

    // Group items by column while maintaining their order
    itemArray.forEach((item, index) => {
        columnItems[item.chart].push({
            ...item,
            index: index
        });
    });

    // Generate HTML for each column
    const toDoItems = generateColumnHTML(columnItems[0]);
    const doingItems = generateColumnHTML(columnItems[1]);
    const checkItems = generateColumnHTML(columnItems[2]);
    const doneItems = generateColumnHTML(columnItems[3]);

    // Update DOM
    document.querySelector('.to_do_list').innerHTML = toDoItems;
    document.querySelector('.doing_list').innerHTML = doingItems;
    document.querySelector('.check_list').innerHTML = checkItems;
    document.querySelector('.done_list').innerHTML = doneItems;

    activatListeners();
    doneStatus();
}

function generateColumnHTML(items) {
    return items.map(item => `
        <div class="task" draggable="true" data-index="${item.index}">
            <div class="input_controller">
                <div class="done_controller">
                    <i class="fa-solid fa-check doneBtns BTN"></i>
                    <textarea disabled>${item.value}</textarea>
                </div>
                <div class="edit_controller">
                    <i class="fa-solid fa-eraser deleteBtn BTN"></i>
                    <i class="fa-solid fa-pen-to-square editBtn BTN"></i>
                </div>
            </div>
            <div class="update_controller">
                <button class="saveBtn">Save</button>
                <button class="cancelBtn">Cancel</button>
            </div>
        </div>
    `).join('');
}

function activatListeners() {
    activateDeleteListeners();
    activateEditListeners();
    activateSaveListeners();
    activateCancelListeners();
    activateDoneListeners();
    activateDragAndDrop();
}


//   delete element

function  activateDeleteListeners() { 
    let deleteBtn = document.querySelectorAll(".deleteBtn")
    deleteBtn.forEach(db => {
        db.addEventListener("click" , function(){
            if (confirm("You are going to delete this task!")){
                const taskElement = this.closest(".task");
                const index = parseInt(taskElement.dataset.index);
                deleteItem(index);
            }
        })
    });
}
function deleteItem(i){
    itemArray.splice(i, 1)
    localStorage.setItem('items' , JSON.stringify(itemArray))
    displayItems()
}

//   edit element
function    activateEditListeners() { 
    let editBtns = document.querySelectorAll(".editBtn")
    const update_controller = document.querySelectorAll('.update_controller')
    const inputs = document.querySelectorAll('.done_controller textarea')
    let items = document.querySelectorAll(".task")

    editBtns.forEach((eb, i) => {
        eb.addEventListener("click" , function(){
            update_controller[i].classList.add('active');
            inputs[i].disabled = false;

            items.forEach((item, index) => {
                index !== i ?  item.style.pointerEvents = "none" : item.style.pointerEvents = "auto";
            })
        })      
    })
}

//   save edit element
function activateSaveListeners() {
    let saveBtns = document.querySelectorAll(".saveBtn");

    saveBtns.forEach(saveBtn => {
        saveBtn.addEventListener('click', function () {
            const taskElement = saveBtn.closest(".task");
            if (taskElement) {
                const textarea = taskElement.querySelector('.done_controller textarea');
                if (textarea) {
                    const index = parseInt(taskElement.dataset.index);
                    updateItem(textarea.value, index);
                }
            }
        });
    });
}
function  updateItem(text , i) { 
    itemArray[i].value = text
    localStorage.setItem('items' , JSON.stringify(itemArray))
    displayItems()
}
//   cancel edit element
function activateCancelListeners() { 
    let cancelBtns = document.querySelectorAll(".cancelBtn");

    cancelBtns.forEach((cb) => {
        cb.addEventListener("click", function () {
            location.reload()
        });
    });
}
// make done tasks when done button is clicked
function  activateDoneListeners() { 
    let doneBtns = document.querySelectorAll(".doneBtns")

    doneBtns.forEach((db,i) => {
        db.addEventListener("click" , function(){
            addDoneClass(db,i)
        });
    })
}
function addDoneClass (db,i){
    itemArray[i].done = !itemArray[i].done;
    itemArray[i].done === true ? db.classList.add("done_status") : db.classList.add("undone_status")
    localStorage.setItem("items", JSON.stringify(itemArray));
    displayItems();
}

// check done tasks when window loads
function doneStatus(){    
    let doneBtns = document.querySelectorAll(".doneBtns")
    let deleteBtn = document.querySelectorAll(".deleteBtn")
    let editBtn = document.querySelectorAll(".editBtn")

    doneBtns.forEach((db,i) => {
        itemArray[i].done === true ? db.classList.add("done_status") : db.classList.add("undone_status")
        itemArray[i].done === true ? deleteBtn[i].style.display = "none" : deleteBtn[i].style.display = "block"
        itemArray[i].done === true ? editBtn[i].style.display = "none" : editBtn[i].style.display = "block"
    })
}

//clear
function clear() {
    const clearBtns = document.querySelectorAll(".clearBtn");
    
    clearBtns.forEach((btn) => {
        // Remove any existing click listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener("click", function () {
            const column = this.closest('.todo, .doing, .check, .done');
            const columnIndex = column.querySelector('.charts').dataset.column;
            
            if (confirm("Are you sure you want to delete all tasks in this column?")) {
                // Filter out items that don't belong to this column
                itemArray = itemArray.filter(item => item.chart !== parseInt(columnIndex));
                
                // Update localStorage
                localStorage.setItem('items', JSON.stringify(itemArray));
                
                // Refresh the display
                displayItems();
            }
        });
    });
}    
// drag and drop

function activateDragAndDrop() {
    const tasks = document.querySelectorAll(".task");
    const columns = document.querySelectorAll(".charts");
    let draggedTask = null;
    let draggedTaskIndex = null;

    tasks.forEach(task => {
        task.addEventListener("dragstart", (e) => {
            draggedTask = task;
            draggedTaskIndex = parseInt(task.dataset.index);

            e.dataTransfer.effectAllowed = "move";
            task.classList.add("dragging");
        });

        task.addEventListener("dragend", () => {

            task.classList.remove("dragging");
            draggedTask = null;
            draggedTaskIndex = null;
        });
    });

    columns.forEach(column => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            column.classList.add("dragging");
        });

        column.addEventListener("dragleave", () => {
            column.classList.remove("dragging");
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            column.classList.remove("dragging");
            
            if (draggedTask && draggedTaskIndex !== null) {
                const toColumn = parseInt(column.dataset.column);
                const fromColumn = itemArray[draggedTaskIndex].chart;
                
                if (fromColumn !== toColumn) {
                    // Get items in the target column
                    const columnItems = itemArray.filter(item => item.chart === toColumn);
                    const insertIndex = columnItems.length;
                    
                    // Remove item from its current position
                    const [movedItem] = itemArray.splice(draggedTaskIndex, 1);
                    movedItem.chart = toColumn;
                    
                    // Find the position to insert the item
                    const targetIndex = itemArray.findIndex(item => item.chart > toColumn);
                    if (targetIndex === -1) {
                        itemArray.push(movedItem);
                    } else {
                        itemArray.splice(targetIndex, 0, movedItem);
                    }
                    
                    localStorage.setItem("items", JSON.stringify(itemArray));
                    displayItems();
                }
            }
        });
    });
}

// date

function displayday(){
    let date = new Date()
    date =date.toString().split(" ")
    document.querySelector("#date").innerHTML = date[1] + " " +date[2] + " " +date[3]
}
//table
function table(){
    let tableBtn = document.querySelector(".table")
    let boardBtn = document.querySelector(".board")
    let listView = document.querySelector(".list_to_do")
    let tableView = document.querySelector(".table_view")
    
    tableBtn.addEventListener("click" , function(){
        // Toggle views
        listView.style.display = listView.style.display === "none" ? "flex" : "none"
        tableView.style.display = tableView.style.display === "none" ? "block" : "none"
        
        // Update table content
        if (tableView.style.display === "block") {
            updateTableView()
        }
    })

    boardBtn.addEventListener("click", function() {
        // Show list view and hide table view
        const board = document.querySelector(".board")
        board.classList.add("active")
        const table = document.querySelector(".table")
        table.classList.remove("active")
        listView.style.display = "flex"
        tableView.style.display = "none"
    })
}

function updateTableView() {
    const table = document.querySelector(".table")
    table.classList.add("active")
    const board = document.querySelector(".board")
    board.classList.remove("active")
    const tableBody = document.getElementById("tableBody")
    tableBody.innerHTML = ""
    
    // Sort items by chart (To Do -> Doing -> Check -> Done)
    const sortedItems = [...itemArray].sort((a, b) => a.chart - b.chart);
    
    sortedItems.forEach((item, index) => {
        const row = document.createElement("tr")
        
        // Task cell
        const taskCell = document.createElement("td")
        taskCell.innerHTML = `
            <div class="task-cell">
                <span>${item.value}</span>
            </div>
        `
        row.appendChild(taskCell)        
        tableBody.appendChild(row)
    })
    

}


// add your function
window.onload = function () {
    addTasks()
    displayday()
    displayItems()
    doneStatus()
    clear()
    table()
    let item =  document.querySelectorAll(".item") 
    item.forEach((i)=> i.value = "")
}