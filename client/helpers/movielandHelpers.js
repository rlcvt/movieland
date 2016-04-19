subscriptionHandle = null;
currentSort = null;

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
    }
});

Template.body.onCreated(function() {
  this.autorun(() => {
    subscriptionHandle = this.subscribe("getMovieListDefault",removeTimestamp(Session.get("currentSortType")), currentSearchTerm);
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



