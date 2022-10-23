(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function() {
            let a = input.value.length;
            if (a > 0) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');
        let buttonGtoup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deletButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
        item.textContent = name;

        buttonGtoup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deletButton.classList.add('btn', 'btn-danger');
        deletButton.textContent = 'Удалить';

        buttonGtoup.append(doneButton);
        buttonGtoup.append(deletButton);
        item.append(buttonGtoup);

        return {
            item,
            doneButton,
            deletButton,
        };
    }

    function addEvents(todoItem, title, tasks, task) {
      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        task['done'] = !task['done'];
        updateStorage(title, tasks);
      });
      todoItem.deletButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          let a = tasks.indexOf(task);
          tasks.splice(a, 1);
          //tasks.remove(task);
          updateStorage(title, tasks);
        }
      });
    }

    function createTodoApp(container, title = 'Список дел', tasks=[]) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let otherTasks = JSON.parse(myStorage.getItem(title));


        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        for (task of tasks) {
          let todoItem = createTodoItem(task['name']);
          addEvents(todoItem, title, tasks, task);
          todoList.append(todoItem.item);
          if (task['done']) {
            todoItem.item.classList.toggle('list-group-item-success');
          }
        }

        for (task of otherTasks) {
          let todoItem = createTodoItem(task['name']);
          addEvents(todoItem, title, tasks, task);
          todoList.append(todoItem.item);
          if (task['done']) {
            todoItem.item.classList.toggle('list-group-item-success');
          }
          tasks.push(task);
        }

        updateStorage(title, tasks);


        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);

            let task = {
              name: todoItemForm.input.value,
              done: false
            };

            addEvents(todoItem, title, tasks, task);

            todoList.append(todoItem.item);

            tasks.push(task);

            updateStorage(title, tasks);

            todoItemForm.input.value = '';

            todoItemForm.button.disabled = true;
        });
    }

    // function updateStorage(title) {
    //   let m = document.getElementsByClassName('list-group-item');
    //   let tasks = [];
    //   for (task of m) {
    //     tasks.push({
    //      name: task.textContent.substring(0, task.textContent.length - 13),
    //      done: task.classList.contains('list-group-item-success')
    //     });
    //   }
    //   let a = JSON.stringify(tasks);
    //   myStorage.setItem(title, a);
    // }



    function updateStorage(title, tasks) {
      let a = JSON.stringify(tasks);
      myStorage.setItem(title, a);
    }

    window.createTodoApp = createTodoApp;
    myStorage = window.localStorage;
    if (myStorage.getItem('Рабочие дела') === null) {
      myStorage.setItem('Рабочие дела', '[]');
    }
    if (myStorage.getItem('Домашние дела') === null) {
      myStorage.setItem('Домашние дела', '[]');
    }
    //myStorage.setItem('Рабочие дела', '[]');
    //myStorage.setItem('Домашние дела', '[]');
})();

