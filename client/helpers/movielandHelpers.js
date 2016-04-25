subscriptionHandle = null;
currentSort = "createdAt";

Template.body.helpers({
    showviewings: function () {
      var cursor =  movieListSort(removeTimestamp(Session.get("currentSortType")));
      return cursor;
    },
    getDateSortType: function() {
      return getSortDateTypeValue();
    },
    getRatingSortType: function() {
      return getSortRateTypeValue();
    },
    getNameSortType: function() {
      return getSortNameTypeValue();
    },
    getTotalCount: function() {
      //Doing server side call because server goes to db directly
      Meteor.call("getTotalWatchedCount",  function (error, response) {
        moviesWatched = response;
        setWatchedDisplay(moviesWatched);
      });
    }
});

setWatchedDisplay = function (count){
  $("#watchedId").text(count);
  recordsToSkip = 0; // reset paging
}

Template.body.onCreated(function() {
  this.autorun(() => {
    subscriptionHandle = this.subscribe("getMovieListDefault",removeTimestamp(Session.get("currentSortType")), currentSortOrder, currentSearchTerm, recordsPerPage, recordsToSkip);
  });
});

UI.registerHelper('getInputValue', function() {
    var movie = Session.get("oneMovie");
    return movie.title;
});

Template.viewing.helpers({
    mediaIsTV: function(mediaType){
        return mediaType == "tv";
    },
    getSeasonsWatchedCount: function(id){
      var movie = new Movie(id);
      var count = movie.getSeasonsCount()

      return count > 0? " Seasons watched: " + count : "";
    }
});



