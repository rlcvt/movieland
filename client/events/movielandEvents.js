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
    }
});

Template.viewing.events({
    "click .delete": function () {
        var viewing = new Movie();
        viewing.remove(this._id);
    },
    "click .oneMovie": function () {
        //Session.set("oneMovie", this);

      Meteor.call("getTVPrimaryInfo",this.id, function( error, response ) {
        if (error) {
          handleAlert(error);
          console.log(error);
        } else {
          if(checkResponse(response)){
            var tvShow = response.data;
            //var seasons = getSeasonsForTV(tvShow);

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

    for (var i in selected) {
      var movie = new Movie();
      movie.insert(selected[i]);
    }
  },
  "click .movieCheckbox": function () {
    var checked = false;

    $('#addMovieDiv input:checked').each(function() {
      checked = true;
    });

    $(".movieSaveButton").prop("disabled",!checked); // if nothing is checked disable the saved button
  }
});

