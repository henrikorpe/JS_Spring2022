function Todo(id, content, isDone) {
  this.id = id;
  this.content = content;
  this.isDone = isDone;
};

function TodoController() {
  this.todoList = [];
  this.id = 1;
  this.ENTER_KEY = 13;
  this.todoInput = document.getElementById('newTodo');
  this.todoListView = document.getElementById('todoListView');
};

TodoController.prototype = {
  getTodoFromLocalstorage: function (key) {
    var todoList = JSON.parse(localStorage.getItem(key)) || [];
    return todoList;
  },

  setTodoLocalstorage: function (key) {
    localStorage.setItem('todoList', JSON.stringify(key));
  },

  handleTodoItem: function (value) {
    this.isDone = false;
    var mainArray = todoController.getTodoFromLocalstorage('todoList');
    this.id = todoController.idLargestOfLocal(mainArray) + 1;
    var todoItem = new Todo(this.id, value, this.isDone);
    return todoItem;
  },

  idLargestOfLocal: function (mainArray) {
    var lengthArr = mainArray.length;

    if (lengthArr !== 0) {
      return mainArray[lengthArr - 1].id;
    } else {
      return 0;
    }

    return lastId;
  },

  addNewTodo: function (todo, list) {
      if (todo == "") {
          alert("You must write something!");
        } else {
     list.push(todo);
    todoController.setTodoLocalstorage(list);
    return todo;
        }
  },

  setAttributes: function (element, attrs) {
    for (var key in attrs) {
      element.setAttribute(key, attrs[key]);
    }
  },

  checkboxView: function (todoId) {
    var inpCheckbox = document.createElement('input');
    this.setAttributes(inpCheckbox, { type: 'checkbox', class: 'itemList', id: todoId });
    inpCheckbox.addEventListener('click', function (e) {
      var list = todoController.getTodoFromLocalstorage('todoList');
      var id = e.target.getAttribute('id');
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
          list[i].isDone = e.target.checked;
        }
      }
      todoController.setTodoLocalstorage(list);
      todoController.countItem();
    });

    return inpCheckbox;
  },

  createLableView: function (todo) {
    var lbContent = document.createElement('label');
    this.setAttributes(lbContent, { value: todo.content, class: 'labelContent ' });
    lbContent.innerHTML = todo.content;
    return lbContent;
  },

  initTodoITem: function (todo) {
    var item = document.createElement('li');
    item.setAttribute('class', 'todoItem');
    item.addEventListener('dblclick', function (e){
      item.classList.add('editing');
    });
    return item;
  },

  editInputView: function (todo) {
    var list = todoController.getTodoFromLocalstorage('todoList');
    var inputEdit = document.createElement('input');
    this.setAttributes(inputEdit, {
      id: todo.id,
      class: 'edit',
      value: todo.content,
      type: 'text',
    });
    inputEdit.focus();
    inputEdit.onblur = function (e) {
      todoController.handleTodoUpdate(e);
    };

    inputEdit.onkeypress = function (e) {
      if (event.which == todoController.ENTER_KEY || event.keyCode == todoController.ENTER_KEY) {
        todoController.handleTodoUpdate(e);
      }
    };
    return inputEdit;
  },

  handleTodoUpdate: function (event) {
    var list = todoController.getTodoFromLocalstorage('todoList');
    var inputEdit = event.target;
    var todoItem = new Todo(inputEdit.id, inputEdit.value, false);
    todoController.updateTodoEdit(todoItem, list);
    var editing = document.querySelector('.editing');
    editing.classList.remove('editing');
    todoController.renderTodo();
  },

  updateTodoEdit: function (todo, list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == todo.id) {
        list[i].content = todo.content;
        todoController.setTodoLocalstorage(list);
        break;
      }
    }
    return todo;
  },

  removeButtonView: function (todo) {
    var btnRemove = document.createElement('button');
    this.setAttributes(btnRemove, { class: 'remove', id: todo.id });
    btnRemove.addEventListener('click', function (e) {
      var id = e.target.getAttribute('id');
      todoController.removeTodo(id);
      todoController.renderTodo();
      todoController.countItem();
    });
    return btnRemove;
  },

  todoView: function (todo) {
    var item = this.initTodoITem(todo);
    var inpCheckbox = this.checkboxView(todo.id),
      lbContent = this.createLableView(todo),
      inputEdit = this.editInputView(todo),
      btnRemove = this.removeButtonView(todo);

    item.appendChild(inpCheckbox);
    item.appendChild(lbContent);
    item.appendChild(inputEdit);
    item.appendChild(btnRemove);

    document.querySelector('#todoListView').appendChild(item);
    return item;
  },

  removeTodo: function (id, list) {
    list = todoController.getTodoFromLocalstorage('todoList');
    for (var i = 0; i < list.length; i++)  {
      if (list[i].id == id) {
        list.splice(i, 1);
        break;
      }
    }
    todoController.setTodoLocalstorage(list);
  },

  countItem: function (index, list) {
    list = todoController.getTodoFromLocalstorage('todoList');
    index = 0;
    for (var i = 0; i < list.length; i++) {
      if (!list[i].isDone) {
        index++;
      }
    }

    document.getElementById('todoCount').innerHTML = index;
  },

  events: function () {
    todoController.todoInput.onkeyup = function (event) {
      if (event.which == todoController.ENTER_KEY || event.keyCode == todoController.ENTER_KEY) {
        var todoList = todoController.getTodoFromLocalstorage('todoList');
        var todoItem = todoController.handleTodoItem(todoController.todoInput.value);
        var todo = todoController.addNewTodo(todoItem, todoList);
        todoController.todoView(todo);
        todoController.todoInput.value = '';
        todoController.countItem();
      }
    };

    var list = document.getElementsByClassName('itemList');
    var checkAll = document.getElementById('toggleInputAll');
    checkAll.addEventListener('change', function (e) {
      var check;
      for (var i = 0; i < list.length; i++) {
        list[i].checked = this.checked;
        check = e.target.checked;
        todoController.checkAllTodo(check);
      }
      todoController.countItem();
    });

    var listWork = document.getElementsByClassName('todoItem');
    var showAllItem = document.getElementById('allWorks');
    showAllItem.addEventListener('click', function () {
      for (var i = 0; i < listWork.length; i++) {
        listWork[i].style.display = 'block';
      }
    });

    var activeItem = document.getElementsByClassName('todoItem');
    var todoActive = document.getElementById('activedItems');
    todoActive.addEventListener('click', function () {
      for (var i = 0; i < list.length; i++) {
        if (!list[i].checked) {
          activeItem[i].style.display = 'block';
        } else {
          activeItem[i].style.display = 'none';
        }
      }
    });

    var completeItem = document.getElementsByClassName('todoItem');
    var todoCompleted = document.getElementById('completedTodos');
    todoCompleted.addEventListener('click', function () {
      for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
          completeItem[i].style.display = 'block';
        } else {
          completeItem[i].style.display = 'none';
        }
      }
    });

    var clearButton = document.getElementById('btnClear');
    clearButton.addEventListener('click', function () {
      var list = todoController.getTodoFromLocalstorage('todoList');
      todoController.clearCompleted(list);
      todoController.setTodoLocalstorage(list);
      todoController.renderTodo();
    });
  },

  clearCompleted: function (list) {
    while (list.find(({ isDone }) => isDone)) {
      list.splice(list.indexOf(list.find(({ isDone }) => isDone)), 1);
    }
  },

  checkAllTodo: function (check, todoList) {
    todoList = todoController.getTodoFromLocalstorage('todoList');
    for (var i = 0; i < todoList.length; i++) {
      todoList[i].isDone = check;
      todoController.setTodoLocalstorage(todoList);
    }
  },

  renderTodo: function () {
    var list = todoController.getTodoFromLocalstorage('todoList');
    todoController.removeElement();
    for (var i = 0; i < list.length; i++) {
      var element = todoController.todoView(list[i]);
      if (list[i].isDone) {
        element.classList.add('checked');
      }
    }
  },

  removeElement: function () {
    var todoListView = document.getElementById('todoListView');
    while (todoListView.hasChildNodes()) {
      todoListView.removeChild(todoListView.firstChild);
    }
  },
};

function changeClass(elem) {
  var a = document.getElementsByTagName('a');
  for (var i = 0; i < a.length; i++) {
    a[i].classList.remove('selected');
  };

  elem.classList.add('selected');
};

var todoController = new TodoController();
var todo = new Todo();
todoController.events();
todoController.renderTodo();
todoController.countItem()
