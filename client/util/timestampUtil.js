var separator ="*_*";

addTimestamp = function(value) {
  if(hasValue(value)) {
    var str = value + separator + Date.now();
    return str;
  }

  return "";
};

removeTimestamp = function(value) {
  if(hasValue(value)) {
    var str = value.split(separator);
    return str[0];
  }

  return "";
};
