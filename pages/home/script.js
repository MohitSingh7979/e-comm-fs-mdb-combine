const userNameElem = document.getElementById("user_name");
const logoutBtn = document.getElementById("logout_btn");
const formAddTask = document.getElementById("form_add_task");
const taskListElem = document.getElementById("task_list");

fetch("/user")
  .then((res) => res.json())
  .then((info) => {
    userNameElem.textContent = info.user;
  });

fetch("/todo")
  .then((res) => res.json())
  .then((data) => {
    const list = data.list;
    for (const taskId in list) {
      const task = list[taskId];
      showTask(task);
    }
  }).catch(console.error);

logoutBtn.addEventListener("click", () => {
  fetch("/user", { method: "DELETE" })
    .then(() => {
    })
    .catch(console.error);
});

formAddTask.addEventListener("submit", (eve) => {
  eve.preventDefault();
  const fd = new FormData(formAddTask);
  fetch("/todo", { method: "POST", body: fd })
    .then((res) => res.json())
    .then((data) => {
      showTask(data.task);
      formAddTask.reset();
      location.href = "/";
    }).catch(console.error);
});

function createTaskElem(id, info, imagePath, completed) {
  const li = document.createElement("li");
  li.id = id;
  li.className = "list-group-item container";
  li.innerHTML = `
              <div class="row justify-content-between align-items-center ">
                <h2 class="col-8 ${
    completed ? "text-decoration-line-through" : ""
  }"
                    style="cursor: pointer"
                    aria-elem="task_info">${info}</h2>
                <div class="col-2">
                  <img src="/static/images/${imagePath}" class="img-fluid"/>
                </div>
                <div class="form-check col ">
                  <input aria-elem="task_check"
                         type="checkbox"
                         name="completed"
                         style="cursor: pointer;"
                         ${completed ? "checked" : ""}
                         class="form-check-input border border-dark">
                </div>
                <div class="col">
                  <i aria-elem="task_button"
                     class=" fa fa-trash-can"
                     style="cursor: pointer; color: red"></i>
                </div>
              </div>`;
  return li;
}

function showTask(task) {
  const { id, info, imagePath, completed } = task;
  const taskElem = createTaskElem(id, info, imagePath, completed);
  taskListElem.appendChild(taskElem);

  const infoElem = taskElem.querySelector("h2");
  const checkbox = taskElem.querySelector("input");
  const deleteBtn = taskElem.querySelector("i");

  deleteBtn.addEventListener("click", () => {
    fetch(`/todo/task/${id}`, { method: "DELETE" })
      .then(() => {
        taskElem.remove();
      }).catch(console.error);
  });

  function handleCheck() {
    fetch(`/todo/task/${id}`, { method: "POST" })
      .then(res => res.json())
      .then((data) => {
        const completed = data.task.completed;
        checkbox.checked = completed;
        if (completed) {
          infoElem.classList.add("text-decoration-line-through");
        } else {
          infoElem.classList.remove("text-decoration-line-through");
        }
      }).catch(console.error);
  }

  infoElem.addEventListener("click", handleCheck);
  checkbox.addEventListener("click", handleCheck);
}
