MoviesWeWatched = new Mongo.Collection("movieswewatched");

Movie = function (movieId) {
    this.name = "";
    this.id = "";
    this._id = "";
    this.title = "";
    this.media_type = "movie";
    this.overview = "";
    this.release_date = "";
    this.backdrop_path = "";
    this.poster_path = "";
    this.createdAt = "";
    this.seasons = [];
    this.userRating = -1;

    if(arguments.length > 0 && movieId != null){
      var movie = MoviesWeWatched.findOne({id: movieId});
        this.id = movie.id;
        this._id = movie._id;
        this.title = movie.title;
        this.media_type = movie.media_type;
        this.overview = movie.overview;
        this.release_date = movie.release_date;
        this.backdrop_path = movie.backdrop_path;
        this.poster_path = movie.poster_path;
        this.createdAt = movie.createdAt;
        this.userRating = movie.userRating;

        //if(hasValue(movie.seasons)) {
        if(movie.seasons != undefined && movie.seasons != null && movie.seasons.length > 0){
          this.seasons = movie.seasons;
        }
    }
  };

Movie.prototype.insert = function(movie) {
  var newId = MoviesWeWatched.insert({
        id: movie.id,
        title: (movie.media_type == 'movie' ? movie.title : movie.name),
        media_type: movie.media_type,
        overview: movie.overview,
        release_date: (movie.media_type == 'movie' ? movie.release_date: ""),
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        userRating: movie.userRating,
        createdAt: new Date()
    });

  return newId;
};

Movie.prototype.remove = function(id) {
    MoviesWeWatched.remove({_id: id});
};

Movie.prototype.updateOne = function(id, newText) {
    MoviesWeWatched.update(
        {_id: id},
        {$set: {text: newText}}
    );
};

Movie.prototype.updateCast = function(id, cast) {
  var castIndex = "";

  // building a string that can be used in search
  for(var i = 0; i < cast.length; i++) {
    try {
      castIndex = castIndex.concat(" " + cast[i].name + " " + cast[i].character);
    } catch (e) {
      console.log("updateCast error - index: " + i + " error: " + e);
    }
  }

  MoviesWeWatched.update(
    {_id: id},
    {$set: {cast: cast, castIndex: castIndex}}
  );
};

Movie.prototype.updateRating = function(rating) {
  MoviesWeWatched.update(
    {_id: this._id},
    {$set: {userRating: rating}}
  );
};

Movie.prototype.haveWatched = function(id) {
  return  MoviesWeWatched.find({id: id}).count() > 0;
};

Movie.prototype.updateTVShow = function(selected) {
  /*
   What we are updating are seasons and episodes within each season. seasons and episodes can be added or removed.

   To decide what is added vs removed we compare whats in the db, with what the user has selected. The basic algorithm is:
   If it's in the current selection, but not in the db, add it to the db
   If it's not in the current selection, but in the db, remove it from the db

   If there are no episodes in a season, then remove the season

   selected is an array of [season object, [episodes]]. If any episodes in a season are checked, the season is in the array.
   */

  if(selected.length == 0) {
    if(this.seasons.length > 0) { //remove all seasons, they unchecked everything.
      MoviesWeWatched.update(
        {_id: this._id}, {$unset: {seasons: ""}});
      }
    return;
  }

  for(var i = 0; i < selected.length; i++) {
      var season = selected[i][0];           // season is from the api, has list of all episodes
      var selectedEpisodes = selected[i][1]; // episodes that were checked

      // no season in the db, but user has checked some episodes, add the season and the episodes that were checked
      if(!this.hasSeason(season)) {
        MoviesWeWatched.update(
          {_id: this._id},
          {$push: {"seasons": {"id": season.id, "name": season.name, "season_number": season.season_number, "overview": season.overview,
          "episodes": selectedEpisodes}}}
        )
      }
      else { // add or remove episodes from a season as necessary
        var watchedEpisodes = this.getEpisodesForSeason(season.season_number);
        var newEpisodes = [];

        for(var j = 0; j < selectedEpisodes.length; j++) {
          if(!this.hasEpisode(watchedEpisodes, selectedEpisodes[j])) {
            newEpisodes.push(selectedEpisodes[j]);
          }
        }
        // add new episodes
        // query limits fields returned to _id and seasons. seasons.$.episodes uses $ positional notation as placeholder for
        // first match of the update query. We use $addToSet because it won't add a value if it is already present
        // we don't $push newEpisodes because it will add the array to the end, instead of the individual elements.
        if(newEpisodes.length > 0) {
          for (var k = 0; k < newEpisodes.length; k++) {
            MoviesWeWatched.update(
              {_id: this._id, seasons: {$elemMatch: {id: season.id}}},
              {$addToSet : {"seasons.$.episodes": newEpisodes[k]}}
            )
          }
        }

        // remove episodes. These are in the db, but have been unchecked.
        //  compare what was selected with what was recorded in the db as watched
        var removeEpisodes = [];
        var found;
        for(var l = 0; l < watchedEpisodes.length; l++) {
          found = false;

          // see if this episode is still selected
          for(var m = 0; m < selectedEpisodes.length; m++) {
            if (watchedEpisodes[l].id == selectedEpisodes[m].id) {
              found = true;
              break;
            }
          }

          if(!found){
            removeEpisodes.push(watchedEpisodes[l]);
          }
        }

        if(removeEpisodes.length > 0) {
          for (var n = 0; n < removeEpisodes.length; n++) {
            MoviesWeWatched.update(
              {_id: this._id, seasons: {$elemMatch: {id: season.id}}},
              {$pull : {"seasons.$.episodes": removeEpisodes[n]}}
            )
          }
        }
      }
  }

  // last check is to remove seasons that no longer have any episodes
  // we compare the seasons we have with what was selected. If a season exists, but is not in the selected list then
  // the assumption is that all it's episodes were unchecked.
  var removeSeasons = [];

  for (var i=0; i < this.seasons.length; i++) {
    var found = false;
    for (var j=0; j < selected.length; j++) {
      if(selected[j][0].id == this.seasons[i].id) {
        found = true;
        break;
      }
    }
    if(!found) {
     removeSeasons.push(this.seasons[i]) ;
    }
  }
  if(removeSeasons.length > 0) {
    for (var n = 0; n < removeSeasons.length; n++) {
      MoviesWeWatched.update(
        {_id:this._id},
        {$pull : {"seasons": removeSeasons[n]}}
      )
    }
  }
};

Movie.prototype.hasSeason = function(season) {
  var found = false;

  for(var i = 0; i < this.seasons.length; i++){
    if(this.seasons[i].season_number == season.season_number) {
      found = true;
      break;
    }
  }
  return found;
};

Movie.prototype.hasEpisode = function(watchedEpisodes, episode) {
  var found = false;

  for(var i = 0; i < watchedEpisodes.length; i++){
    if(watchedEpisodes[i].id == episode.id) {
      found = true;
      break;
    }
  }
  return found;
};


Movie.prototype.getEpisodesForSeason = function(season_number) {
  var episodes = null;

  for(var i = 0; i < this.seasons.length; i++){
    if(this.seasons[i].season_number == season_number) {
      episodes = this.seasons[i].episodes;
      break;
    }
  }
  return episodes;
};

Movie.prototype.getEpisodesCount = function(season) {
  var count = 0;

   if(season.episodes != null && season.episodes != undefined) {
    count = season.episodes.length;
  }
  return count;
};

Movie.prototype.getSeasonsCount = function() {
  var count = 0;

  if(this.seasons != null && this.seasons != undefined) {
    count = this.seasons.length;
  }
  return count;
};

