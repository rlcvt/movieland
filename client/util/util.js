hasValue = function (value) {
  return (value != undefined && value != null && value.length > 0);
};

toggleVisibility = function(elementToToggle, clickedElement)
{
  $( "#"+elementToToggle ).toggle();

  if ($("#"+elementToToggle).is(":visible")) {
    $("#"+clickedElement).text("less..");
  }
  else {
    $("#"+clickedElement).text("more..");
  }
};