var Future = Npm.require( 'fibers/future' );

var api_key ="api_key=08d7f1ef5d14b57800fa986a6cca2680";
var baseUrl = "http://api.themoviedb.org/3";
var searchUrl = baseUrl + "/search/multi";


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
  }
});

Meteor.publish("getMovieListDefault", function(sortType, searchTerm) {
  if(sortType != "search") {
    return MoviesWeWatched.find({}, {sort: {createdAt: -1}});
  }
  else {
    var cursor = MoviesWeWatched.find({ $text: {$search: searchTerm} }, {fields: {score: {$meta: "textScore"}}, sort: {score: {$meta: "textScore"}}});
    return cursor;
  }
});

Meteor.publish("search", function(searchValue) {
  if (searchValue == null || searchValue == undefined ||searchValue.trim().length == 0) {
    return;
  }

  var cursor = MoviesWeWatched.find({ $text: {$search: searchValue} }, {fields: {score: {$meta: "textScore"}}, sort: {score: {$meta: "textScore"}}});
  return cursor;
});


