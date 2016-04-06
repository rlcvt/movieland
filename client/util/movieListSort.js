
var dateSortOrder = null;
var ratingSortOrder = null;
var nameSortOrder = null;

var sortTypeDate = "date";
var sortTypeRating = "rating";
var sortTypeName = "name";

movieListSort = function() {

  switch(removeTimestamp(Session.get("currentSortType"))) {
    case sortTypeDate:
      dateSortOrder = getSortOrder(dateSortOrder);
      return MoviesWeWatched.find({}, {sort: {createdAt: dateSortOrder}});
      break;

    case sortTypeRating:
      ratingSortOrder = getSortOrder(ratingSortOrder);
      return MoviesWeWatched.find({}, {sort: {userRating: ratingSortOrder}});
      break;

    case sortTypeName:
      nameSortOrder = getSortOrder(nameSortOrder);
      return MoviesWeWatched.find({}, {sort: {title: nameSortOrder}});
      break;

    default:
      return MoviesWeWatched.find({}, {sort: {createdAt: -1}});
  }
};

getSortDateTypeValue = function() {
  return sortTypeDate;
};

getSortRateTypeValue = function() {
  return sortTypeRating;
};

getSortNameTypeValue = function() {
  return sortTypeName;
};

getSortOrder = function(currentOrder) {
  if(currentOrder == null) {
    return -1; // default is descending order
  }

  return currentOrder == 1? -1 : 1;
};



