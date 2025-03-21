// add local strogae

const itemArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem("items")) : []

function addTasks(){
    let enterBtns = document.querySelectorAll(".enter")

    enterBtns.forEach((eb,i) => {
        eb.addEventListener('click' , function(){
            let item =  document.querySelectorAll(".item")
            if (item[i].value.length === 0) {
                confirm("Please, fill the input!");
            } else {
                creatItem(item[i].value, i);
                item[i].value = "";
            }        
        })
    })
}


function creatItem(item,i) { 
    itemArray.push({ value : item , done : false , chart : i})
    localStorage.setItem("items" , JSON.stringify(itemArray))
    displayItems()

 }

// add your item in local strogae
function displayItems() {
    let toDoItems = "";
    let doingItems = "";
    let checkItems = "";
    let doneItems = "";
    let items = ""

    for(let i = 0 ; i < itemArray.length; i++){
        items =`
        <div class="task chart${itemArray[i].chart}" draggable="true" data-index="${i}">
            <div class="input_controller">
                <div class="done_controller">
                    <i class="fa-solid fa-check doneBtns doneBtn${itemArray[i].chart} BTN"></i>
                    <textarea disabled>${itemArray[i].value}</textarea>
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
        </div>`

        if (itemArray[i].chart === 0) {
            toDoItems += items;
        } else if (itemArray[i].chart === 1) {
            doingItems += items;
        } else if (itemArray[i].chart === 2) {
            checkItems += items;
        } else if (itemArray[i].chart === 3) {
            doneItems += items;
        }
    }

    document.querySelector('.to_do_list').innerHTML = toDoItems;
    document.querySelector('.doing_list').innerHTML = doingItems;
    document.querySelector('.check_list').innerHTML = checkItems;
    document.querySelector('.done_list').innerHTML = doneItems;
    activatListeners();
    doneStatus();

  }

  function activatListeners() {
    activateDeleteListeners();
    activateEditListeners();
    activateSaveListeners();
    activateCancelListeners();
    activateDoneListeners();
    activateDragAndDrop();
    clear()
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
        let clearBtns = document.querySelectorAll(".clearBtn")
        let tasks = document.querySelectorAll(".task")

        clearBtns.forEach((cb, i) => {
            cb.addEventListener("click", function () {
             tasks.forEach((task) => {
                if (task.classList.contains(`chart${i}`)) {
                    task.remove();
                }
            })
            let items = JSON.parse(localStorage.getItem('items')) || [];
            items = items.filter((item) => item.chart !== i);
            localStorage.setItem('items', JSON.stringify(items))
          })  
        })
    }    
// drag and drop

function activateDragAndDrop() {
    const items = document.querySelectorAll(".task"); // تغییر به ".task"
    let draggedItem = null;

    items.forEach((item) => {
        item.addEventListener("dragstart", (e) => {
            draggedItem = item;
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", item.dataset.index);
            item.classList.add("dragging");
        });

        item.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        item.addEventListener("drop", (e) => {
            e.preventDefault();
            const fromIndex = e.dataTransfer.getData("text/plain");
            const toIndex = item.dataset.index;

            if (fromIndex !== toIndex) {
                swapItems(fromIndex, toIndex);
            }
        });

        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
        });
    });
}

function swapItems(fromIndex, toIndex) {
    fromIndex = parseInt(fromIndex);
    toIndex = parseInt(toIndex);

    const temp = itemArray[fromIndex];
    itemArray[fromIndex] = itemArray[toIndex];
    itemArray[toIndex] = temp;

    localStorage.setItem("items", JSON.stringify(itemArray));
    displayItems();
}

// date

function displayday(){
    let date = new Date()
    date =date.toString().split(" ")
    document.querySelector("#date").innerHTML = date[1] + " " +date[2] + " " +date[3]
}

// add your function
window.onload = function () {
    addTasks()
    displayday()
    displayItems()
    doneStatus()
    let item =  document.querySelectorAll(".item") 
    item.forEach((i)=> i.value = "")
}


