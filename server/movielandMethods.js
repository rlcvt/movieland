var Future = Npm.require( 'fibers/future' );

var api_key ="api_key=08d7f1ef5d14b57800fa986a6cca2680";
var baseUrl = "http://api.themoviedb.org/3";
var searchUrl = baseUrl + "/search/multi";
var countSearchResults = 0;

// using Node Futures here to make the call synchronous. Found code to do this here:
//https://themeteorchef.com/snippets/synchronous-methods/#tmc-using-futures
Meteor.methods({
  getMovie: function (title) {
    var future = new Future();
    var queryString = "query="+title+"&"+api_key;

    HTTP.get(searchUrl, {query: queryString}, function(error, response) {
      if ( error ) {
        future.return( error );
      } else {
        future.return( response );
      }
    });

    return future.wait();
  },
  getTVPrimaryInfo: function (tvId) {
    var future = new Future();
    var urlQuery = baseUrl+"/tv/"+tvId+"?"+api_key;

    HTTP.get(urlQuery, {}, function(error, response) {
      if ( error ) {
        future.return( error );
      } else {
        future.return( response );
      }
    });

    return future.wait();
  },
  getSeasonsInfo: function (tvId, season_number) {
    var future = new Future();
    var urlQuery = baseUrl+"/tv/"+tvId+"/season/"+ season_number+"?"+api_key;

    HTTP.get(urlQuery, {}, function(error, response) {
      if ( error ) {
        future.return( error );
      } else {
        future.return( response );
      }
    });

    return future.wait();
  },
  updateTVShow: function(movieId, selected){
    var movie = new Movie(movieId);
    movie.updateTVShow(selected);
  },
  getCast: function (id, mediaType) {
    var media = mediaType == "movie"? "movie" : "tv";

    var future = new Future();
    var urlQuery = baseUrl+"/" + media +"/"+id+"/credits?"+api_key;

    HTTP.get(urlQuery, {}, function(error, response) {
      if ( error ) {
        future.return( error );
      } else {
        future.return( response.data["cast"]);
      }
    });

    return future.wait();
  },
  insertNewMovies: function(selected) {
    for (var i in selected) {
      var movie = new Movie();
      var id = movie.insert(selected[i]);

      Meteor.call("getCast", selected[i].id, selected[i].media_type, function (error, response) {
        if (error) {
          alert(error);
          console.log(error);
        } else {
          if ((response != undefined && response.length > 0)) {
            movie.updateCast(id, response);
          }
        }
      });
    }
  },
  getTotalWatchedCount: function() {
    var future = new Future();
    future.return(MoviesWeWatched.find({userId: Meteor.userId()}).count());
    return future.wait();
  },
  getSearchCount: function() {
    var future = new Future();
    future.return(countSearchResults);
    return future.wait();
  },
  clearSearchCount: function() {
    countSearchResults = 0;
  }
});

Meteor.publish("getMovieListDefault", function(sortType, sortOrder, searchTerm, recordsPerPage, recordsToSkip) {
  if(sortType != "search") {
    var name = sortType;

    if(sortType == ""){
      name = "createdAt";
    }
    var value = sortOrder;
    var query = {};
    query[name] = value;

    if(sortType == "userRating") {
      var title = "title";
      query[title] = 1;
    }
    return MoviesWeWatched.find({userId: this.userId}, {sort: query, limit: recordsPerPage, skip: recordsToSkip });
  }
  else {
    var cursor = MoviesWeWatched.find({ $text: {$search: searchTerm} }, {fields: {score: {$meta: "textScore"}}, sort: {score: {$meta: "textScore"}}, limit: recordsPerPage, skip: recordsToSkip});
    countSearchResults = cursor.count();
    return cursor;
  }
});




