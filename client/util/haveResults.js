haveResults = function(result) {
  var hasResults = false;

  if(result.statusCode == 200 && result.data.total_results > 0) {
    hasResults = true;
    }
  else if(result.statusCode == 200 && result.data.total_results == 0) {
    handleAlert("No movies found");
  }
  else {
    handleAlert(result.response.data.status_message);
  }
  return hasResults;
}

checkResponse = function(result) {
  var hasResults = false;

  if(result.statusCode == 200) {
    hasResults = true;
  }
  else {
    handleAlert(result.response.data.status_message);
  }
  return hasResults;
}
handleAlert = function(message) {
  alert(message);
}
