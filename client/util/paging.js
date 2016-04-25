recordsPerPage = 3;
recordsToSkip = 0;
moviesWatched = -1;
numberOfPages = 0;
currentPage = 1;

clearPaging = function (){
  recordsToSkip = 0;
  numberOfPages = 0;
  currentPage = 1;
}

getNumberOfPages = function() {
  numberOfPages =Math.trunc(moviesWatched/recordsPerPage);
}

isPagingStart = function() {
  return recordsToSkip == 0;
}

incrementPage = function () {
  recordsToSkip = recordsToSkip + recordsPerPage;
  currentPage++;
}

isLastPage = function () {
  return currentPage == numberOfPages;
}

decrementPage = function () {
  recordsToSkip = recordsToSkip - recordsPerPage;
  currentPage--;
}