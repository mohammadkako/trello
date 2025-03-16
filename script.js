// add local strogae

const itemArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem("items")) : []

document.querySelector("#enter").addEventListener('click' , function(){
   const item =  document.querySelector("#item")
   creatItem(item)
})

function creatItem(item) { 
    itemArray.push(item.value)
    localStorage.setItem("items" , JSON.stringify(itemArray))
    location.reload()
 }

// add your item in local strogae
function displayItems() {
    let items = ""
    for(let i = 0 ; i < itemArray.length; i++){
        items +=`
        <div class="item" draggable="true" data-index="${i}">
    <div class="input_controller">
        <textarea disabled>${itemArray[i]}</textarea>
        <div class="edit_controller">
            <i class="fa-solid fa-check deleteBtn"></i>
            <i class="fa-solid fa-pen-to-square editBtn"></i>
        </div>
    </div>
    <div class="update_controller">
        <button class="saveBtn">Save</button>
        <button class="cancelBtn">Cancel</button>
    </div>
</div>`
    }
    document.querySelector('.to_do_list').innerHTML = items;
    activateDeleteListeners()
    activateEditListeners()
    activateSaveListeners()
    activateCancelListeners()
    activateDragAndDrop()

  }


//   delete element

  function  activateDeleteListeners() { 
    let deleteBtn = document.querySelectorAll(".deleteBtn")
    deleteBtn.forEach((db, i) => {
        db.addEventListener("click" , function(){
           deleteItem(i)
        })
    });
   }
   function deleteItem(i){
      itemArray.splice(i , 1)
      localStorage.setItem('items' , JSON.stringify(itemArray))
      location.reload()
   }

   //   edit element
   function    activateEditListeners() { 
    let editBtn = document.querySelectorAll(".editBtn")
    const update_controller = document.querySelectorAll('.update_controller')
    const inputs = document.querySelectorAll('.input_controller textarea')
    const input_controller = document.querySelectorAll('.input_controller')
    editBtn.forEach((eb, i) => {
        eb.addEventListener("click" , function(){
            update_controller[i].classList.add('active');
            inputs[i].disabled = false;
        })
    });
   }

   //   save edit element
   function  activateSaveListeners() { 
    let saveBtn = document.querySelectorAll(".saveBtn")
    const inputs = document.querySelectorAll('.input_controller textarea')
    saveBtn.forEach((sb, i) =>{
        sb.addEventListener('click',function(){
            updateItem(inputs[i].value , i)
        })
    })
   }
   function  updateItem(text , i) { 
    itemArray[i] = text
    localStorage.setItem('items' , JSON.stringify(itemArray))
    location.reload()
    }
   //   cancel edit element
   function activateCancelListeners() { 
    let cancelBtns = document.querySelectorAll(".cancelBtn");
    const update_controllers = document.querySelectorAll(".update_controller");
    const inputs = document.querySelectorAll(".input_controller textarea");

    cancelBtns.forEach((cb, i) => {
        cb.addEventListener("click", function () {
            update_controllers[i].classList.remove("active");
            inputs[i].disabled = true;
        });
    });
}

// drag and drop

function activateDragAndDrop() {
    const items = document.querySelectorAll(".item");
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
    displayday()
    displayItems()
  }


