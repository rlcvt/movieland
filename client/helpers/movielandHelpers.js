Template.body.helpers({
    showviewings: function () {
        return MoviesWeWatched.find({}, {sort: {createdAt: -1}});
    }
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

