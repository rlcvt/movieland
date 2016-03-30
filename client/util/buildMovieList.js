buildMovieList = function (ulId, movieList) {
  var ul = document.getElementById(ulId);
  var li;
  var span;
  var checkbox;
  var overviewDiv;

  movie = new Movie();

  clearElement(ulId);

  for(var i=0; i < movieList.length; i++) {
    if(movieList[i].media_type == "person")
      continue;

    li = createLi();
    span = createSpan();

    if(!movie.haveWatched(movieList[i].id)) {
      checkbox = createCheckbox();
      addAttribute(checkbox, "data-movie", movieList[i]);
      addAttribute(checkbox, "class", "movieCheckbox");
      li.appendChild(checkbox);
    }
    var title;
    if(movieList[i].media_type == "movie") {
      title = movieList[i].title;
    }
    else {
      title = movieList[i].name + " - TV seasons";
    }

    span.innerHTML = title;
    li.appendChild(span);

    if(hasValue(movieList[i].overview)) {
      overviewDiv = createDiv();
      overviewDiv.innerHTML = movieList[i].overview;
      li.appendChild(overviewDiv);
    }

    ul.appendChild(li);
  }

}
