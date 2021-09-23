var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// allow user to edit task description
$(".list-group").on("click", "p", function() {
  var text = $(this)
    .text()
    .trim();
  console.log(text);

  var textInput = $("<textarea>")
    .val(text)
    .addClass("form-control")
  console.log(textInput);

  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});

$(".list-group").on("blur", "textarea", function (){
  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();
  console.log("Edited text = " + text);
  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  console.log("status = " + status);

  // get the tasks's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();
  console.log("index = " + index);

  // recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);

  // set text property of the object the the given index in the array to equal variable "text"
  tasks[status][index].text = text;
  // save to local storage by calling saveTasks function()
  saveTasks();
});

// allow user to edit task dates
$(".list-group").on("click", "span", function(){
  // get current text
  var date = $(this)
    .val()
    .trim();

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // reaplce previous task date <input> element with newly edited task date <input> element
  $(this).replaceWith(dateInput);
  // automatically foucs on new element
  dateInput.trigger("foucs");
});

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function (){
  // get the input's current value/text
  var date = $(this)
    .val()
    .trim();
  console.log("Edited date = " + date);
  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  console.log("Status = " + status);
  // get the tasks's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();
  console.log("Index = " + index);

  // recreate span element
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);

  tasks[status][index].date = date;
  // save to local storage by calling saveTasks function()
  saveTasks();
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// Drag & Drop functionality
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event) {
    
  },
  deactivate: function(event) {
    
  },
  over: function(event) {
    
  },
  out: function(event) {
    
  },
  update: function(event) {
    // declare new array for updated task data (description & date) when moved to new cards
    var tempArr = [];

    // loop over current set of children in sortable list
    $(this).children().each(function(){
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();

      // add task dasta to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });

    // trim down list's ID to match object property
    var arrName = $(this)
    .attr("id")
    .replace("list-", "");

    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();    

    console.log(tempArr);
  }
});

// "Drop Here to Remove" functionality
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    console.log("drop");
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});

// load tasks for the first time
loadTasks();


