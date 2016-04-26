currentSearchTerm = "";
currentSortOrder = -1;

Template.body.events({
    "submit .new-movie": function (event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        var text = event.target.text.value;

        // make sure we have a value
        if(text.trim().length == 0)
          return;

      // this is a syncronous call
      Session.set("currentMovieList", "");

      Meteor.call("getMovie",text, function( error, response ) {
        if (error) {
          handleAlert(error);
          console.log(error);
        } else {
          if(haveResults(response)){
            Session.set("currentMovieList", response.data.results);
            Modal.show("addMovieDialog");
          }
        }
      });

      event.target.text.value = "";
    },
  "click .mvl-sort-by": function(event) {
    var id = event.currentTarget.id;
    var sortByType = $("#"+id).attr("data-sort-type");
    clearPaging();
    currentSort = sortByType;

    currentSortOrder = getSortTypeOrder(sortByType);

    Session.set("currentSortType", addTimestamp(sortByType));
  },
  "submit .movie-search": function (event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var text = event.target.text.value;

    setSearchTerm(text);
    //event.target.text.value = "";
  },
  "click .search-button": function() {
    var text = $("#searchInput").val();
    console.log("search term: " + text);
    setSearchTerm(text);
  },
  "click .previous-button": function() {
    if(!isPagingStart()) {
      decrementPage();
      Session.set("currentSortType", addTimestamp(currentSort));
    }
  },
  "click .next-button": function(event) {
    if(isPagingStart()) {
      getNumberOfPages();
    }

    if(!isLastPage()) {
      incrementPage();
      Session.set("currentSortType", addTimestamp(currentSort));
    }
  }
});

setSearchTerm = function(text) {
  // make sure we have a value
  if(text.trim().length == 0) {
    return;
  }
  clearPaging();
  currentSearchTerm = text.trim();
  currentSort = "search";
  currentSortOrder = 1;
  Meteor.call("clearSearchCount");
  Session.set("currentSortType", addTimestamp("search"));
};

Template.viewing.events({
    "click .mvl-delete": function () {
        var viewing = new Movie();
        viewing.remove(this._id);
        moviesWatched--;
        setWatchedDisplay(moviesWatched);
    },
    "click .oneMovie": function () {

      Meteor.call("getTVPrimaryInfo",this.id, function( error, response ) {
        if (error) {
          handleAlert(error);
          console.log(error);
        } else {
          if(checkResponse(response)){
            var tvShow = response.data;

            var seasons = [];
            for (i = 0; i < tvShow.number_of_seasons; i++) {
              Meteor.call("getSeasonsInfo", tvShow.id, tvShow.seasons[i].season_number, function (error, response) {
                if (error) {
                  handleAlert(error);
                  console.log(error);
                } else {
                  if (checkResponse(response)) {
                    seasons.push(response.data); // saves season which has an array of episodes.

                    // waiting on all the api calls to finish before showing dialog
                    if(seasons.length == (tvShow.number_of_seasons)) {
                      Session.set("currentTVShow", tvShow);
                      Session.set("currentSeasons", seasons);
                      Modal.show("editMovieDialog");
                    }
                  }
                }
              });
            }
          }
        }
      });
    },
  "click .stars-rating": function (event) {
    var rating = $('#'+this.id).data('userrating');
    var movie =  MoviesWeWatched.findOne({_id: this.id});
    movie = new Movie(movie.id);
    movie.updateRating(rating);
  }
});

Template.editMovieDialog.events({
    "click .saveButton": function () {
     var movie = Session.get("oneMovie");
     var newName = $('#editNameId').val();

     var viewing = new Movie();
     viewing.updateOne(movie._id, newName);
    },
    "show.bs.modal": function () {
      buildSeasonsList("tvSeasons");
      $( ".season_div" ).hide();
    },
    "click .episodeVisability": function (event) {
      $( "#"+event.toElement.value ).toggle();

    },
    "click .saveEpisodes": function () {
      selected = [];

      var tvShow = Session.get("currentTVShow");
      var currentSeason = null; // the season we are collecting episodes for
      var episodes = [];

      $('#editMovieDiv input:checked').each(function() {
        var season = $(this).prop('data-season');
        var episode = $(this).prop('data-episode');
        var watched;

        // see if we have a new season
        if(currentSeason == null || currentSeason.season_number != season.season_number) {
          if(currentSeason != null){ // check to make sure this insn't first time through

            // save the current season
            watched = [currentSeason, episodes];
            selected.push(watched);
            episodes = new Array();
          }
          currentSeason = season;
        }
        episodes.push(episode);
      });

      // takes care of last instance
      if(currentSeason != null) {
        watched = [currentSeason, episodes];
        selected.push(watched);
      }

      // have to do this as a server side call, otherwise we get an "untrusted...." error. For an explanation:
      // http://stackoverflow.com/questions/15464507/understanding-not-permitted-untrusted-code-may-only-update-documents-by-id-m
      Meteor.call("updateTVShow", tvShow.id, selected);
    }
});

Template.addMovieDialog.events({
  "show.bs.modal": function () {
    buildMovieList("foundMovieList", Session.get("currentMovieList"));
    $(".movieSaveButton").prop("disabled",true);
  },
  "click .movieSaveButton": function () {
    selected = [];

    $('#addMovieDiv input:checked').each(function() {
      selected.push($(this).prop('data-movie'));
    });

    // doing this server side because it needs to be synchronous
    Meteor.call("insertNewMovies", selected, function (error, response) {
      if (error) {
        handleAlert(error);
        console.log(error);
      }
      moviesWatched = moviesWatched + selected.length;
      setWatchedDisplay(moviesWatched);
    });

    Session.set("currentSortType", addTimestamp(getSortDateTypeValue()));
  },
  "click .mvl-checkbox": function () {
    var checked = false;

    $('#addMovieDiv input:checked').each(function() {
      checked = true;
    });

    $(".movieSaveButton").prop("disabled",!checked); // if nothing is checked disable the saved button
  }
});

