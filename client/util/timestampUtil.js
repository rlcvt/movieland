var separator ="*_*";

addTimestamp = function(value) {
  if(hasValue(value)) {
    //var str = value + separator + Date.now();
    var str = Date.now() + separator + value;

    return str;
  }

  return "";
};

removeTimestamp = function(value) {
  if(hasValue(value)) {
    var str = value.split(separator);
    return str[1];
  }

  return "";
};
