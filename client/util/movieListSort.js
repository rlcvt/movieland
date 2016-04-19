
var dateSortOrder = null;
var ratingSortOrder = null;
var nameSortOrder = null;

var sortTypeDate = "date";
var sortTypeRating = "rating";
var sortTypeName = "name";
var sortTypeSearch = "search";

movieListSort = function(sortType) {
    switch(sortType) {
      case sortTypeDate:
        dateSortOrder = getSortOrder(dateSortOrder);
        return MoviesWeWatched.find({}, {sort: {createdAt: dateSortOrder}});
        break;

      case sortTypeRating:
        ratingSortOrder = getSortOrder(ratingSortOrder);
        var cursor = MoviesWeWatched.find({}, {sort: {userRating: ratingSortOrder, title: -1}});
        console.log("after rating");
        return cursor;
        break;

      case sortTypeName:
        nameSortOrder = getSortOrder(nameSortOrder);
        return MoviesWeWatched.find({}, {sort: {title: nameSortOrder}});
        break;

      case sortTypeSearch:
        var  x =  MoviesWeWatched.find({}, {sort: [['score', 'title']]});
        return x;
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

isReady = function() {
  if(subscriptionHandle.ready()) {
    return;
  }
  else {
    isReady();
  }
}


