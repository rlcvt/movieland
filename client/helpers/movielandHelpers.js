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
    }
});
