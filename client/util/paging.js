recordsPerPage = 8;
recordsToSkip = 0;
moviesWatched = -1;
numberOfPages = 0;
currentPage = 1;

clearPaging = function (){
  recordsToSkip = 0;
  numberOfPages = 0;
  currentPage = 1;
};

getNumberOfPages = function() {

  if(currentSort != "search") {
    numberOfPages = Math.round(moviesWatched / recordsPerPage);
  }
  else {
    var countSearchResults = -1;
    Meteor.call("getSearchCount", function( error, response ) {
      countSearchResults = response;
      numberOfPages = Math.round(countSearchResults / recordsPerPage);
    });
  }
};

isPagingStart = function() {
  return recordsToSkip == 0;
};

incrementPage = function () {
  recordsToSkip = recordsToSkip + recordsPerPage;
  currentPage++;
};

isLastPage = function () {
  return currentPage == numberOfPages;
};

decrementPage = function () {
  recordsToSkip = recordsToSkip - recordsPerPage;
  currentPage--;
};