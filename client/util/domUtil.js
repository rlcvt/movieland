addAttribute = function(element, attribute, value) {
  $(element).prop(attribute, value);
};

function addHRRule(table, colspan) {
  var row = createTableRow(table, "");
  var hr = document.createElement('hr');
  var cell = createElementCell(row, "", hr, "");
  cell.colSpan = colspan;
};

function addOnclick() {
  if(arguments.length < 3) {
    alert("domUtil.addOnclick not enough arguments: " + arguments.length);
  }

  // first argument is element, second is method name, arguments after that are values to pass and can be variable number
  var element = arguments[0];
  var methodName = arguments[1];
  var values = "('";

  for (var i = 2; i < arguments.length; i++) {
    values += arguments[i] + "','";
  }

  // remove trailing comma and quote
  values = values.substring(0, values.length-2);
  values += ");";

  element.onclick = new Function(methodName + values);
}

function addClassToElement(element, classname) {
  element.className += " " + classname ;  // adding a space for when we have multiple classes
}

createDiv = function (id) {
  var div = document.createElement("div");

  if(arguments.length > 0) {
    div.id = id;
  }

  return div;
};

 function createInputElement(type, name, id, classname, size, maxlength, value, required, vtype) {
	var element = null;

	  try {
		var arg = "<Input ";
		arg += 'type="' + type + '" ';
		arg += 'name="' + name + '" ';
		arg += 'id="' + id + '" ';
		arg += 'class="' + classname + '" ';
		arg += 'size="' + size + '" ';
		arg += 'maxlength="' + maxlength + '" ';
		arg += 'value="' + value + '" ';
		arg += 'required="' + required + '" ';
		arg += 'vtype="' + vtype + '" ';
		arg += " />";

		element = document.createElement(arg);
	  }
	  catch(err) {
		element = document.createElement('input');
		element.setAttribute('type', type);
		element.setAttribute('name', name);
		element.setAttribute('id', id);
		element.setAttribute('class', classname);
		element.setAttribute('size', size);
		element.setAttribute('maxlength', maxlength);
		element.setAttribute('value', value);
		element.setAttribute('required', required);
		element.setAttribute('vtype', vtype);
	  }
	  return element;
	}

  createCheckbox = function() {
    var cb = document.createElement("input");
    cb.setAttribute("type", "checkbox");
    return cb;
  };

  createLi = function (text) {
    var li = document.createElement("li");

    if(hasValue(text)) {
      li.innerHTML = text;
    }

    return li;
  };

  createSpan = function(text) {
    var span = document.createElement("span");

    if(hasValue(text)) {
      span.innerHTML = text;
    }
    return span;
  };

createUl = function() {
  var ul = document.createElement("ul");

  return ul;
};

	
	// table elements	
	function createTableRow(tableRef, className) {
	  var newRow = tableRef.insertRow(-1);
	  newRow.className = className;
	  return newRow;
	}

	function createTextCell(tableRow, className, text, width) {
	  var newCell = tableRow.insertCell(tableRow.cells.length);
	  newCell.className=className;
	  newCell.style.width = width;
	  newCell.appendChild(document.createTextNode(text));
	  return newCell;
	}

	function createElementCell(tableRow, className, element, width) {
	  var newCell = tableRow.insertCell(tableRow.cells.length);
	  newCell.className=className;
	  newCell.style.width = width;
	  newCell.appendChild(element);
	  return newCell;
	}

  clearElement = function (id) {
    $("#"+id).empty();
  };

  /*
  Clears the input elements in a table. Does not reset them to their defaults.
  Loops through the cells of each row looking for input elements and clearing them.
   */
  function clearTableInputs(tableId) {
    var table = document.getElementById(tableId);

    for(var i = 0; i < table.rows.length; i++) {
      var row = table.rows[i];
      for(var j = 0; j < row.cells.length; j++) {
        for (var k = 0; k < row.cells[j].children.length; k++) {
          var element = row.cells[j].children[k];
          var tag = element.tagName;
          if (tag == "INPUT") {
            switch (element.type) {
              case "checkbox":
              case "radio":
                element.checked = false;
                element.defaultChecked = false;
                break;

              case "text":
              case "password":
                element.value = "";
                element.defaultValue = "";
                break;
            }
          }
        }
      }
    }
  }

  function createImg(src) {
    var img = document.createElement('img');

    img.src = src;
    return img;
  }

createLink = function (text) {
  var link = document.createElement('a');

  if(hasValue(text)) {
    link.innerHTML = text;
  }
  return link;
};


createButton = function (text) {
    var button = document.createElement('button');

    // some versions of id will throw an error when setting button type
    // fortunatly in ie the default button type is button
    try {
      button.type = "button";
    }
    catch (err) {

    }

    if(hasValue(text)) {
        button.innerHTML = text;
    }
    return button;
  };

// looks for changes from default values. Returns number of changes
function tableChanges(tableId) {
  var table = document.getElementById(tableId);
  var changes = 0;

  for(var i = 0; i < table.rows.length; i++) {
    var row = table.rows[i];
    for(var j = 0; j < row.cells.length; j++) {
      for (var k = 0; k < row.cells[j].children.length; k++) {
        var element = row.cells[j].children[k];
        var tag = element.tagName;
        if (tag == "INPUT") {
          switch (element.type) {
            case "checkbox":
            case "radio":
              if (element.checked.toString() != element.defaultChecked.toString())
                changes++;
              break;

            case "text":
            case "password":
              if(element.value != element.defaultValue)
                changes++;
              break;
          }
        }
      }
    }
  }

  return changes;
}



