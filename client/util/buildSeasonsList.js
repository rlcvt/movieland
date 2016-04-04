buildSeasonsList = function (ulId) {
  var ul = document.getElementById(ulId);
  var li;
  var span;
  var checkbox;
  var tvShow = Session.get("currentTVShow");
  var seasons = Session.get("currentSeasons");

  clearElement(ulId);

  li = createLi();
  addAttribute(li,"class","list-group-item");
  span = createSpan();

  span.innerHTML = tvShow.name;
  li.appendChild(span);
  ul.appendChild(li);

  var movie = new Movie(tvShow.id);

  for(var i=0; i < seasons.length; i++) {

    // add the name of the season
    li = createLi();
    addAttribute(li,"class","list-group-item");

    span = createSpan();
    span.innerHTML = seasons[i].name;

    var watchedEpidodes = [];

    if(movie.hasSeason(seasons[i])) {
      watchedEpidodes = movie.getEpisodesForSeason(seasons[i].season_number);
    }

    // add the button to show/hide episodes div
    var button = createButton("show/hide");

    var season_number = "season_"+seasons[i].season_number;
    addAttribute(button, "class", "mvl-hide-show-button episodeVisability");
    addAttribute(button, "value", season_number);
    span.appendChild(button);

    li.appendChild(span);

    // add the div and the list of episodes for seasons[i]
    var div = createDiv(season_number)
    addAttribute(div, "class", "season_div mvl-episodes-div");

    var episodeUl = createUl();
    addAttribute(episodeUl,"class","list-group");

    for(var j = 0; j < seasons[i].episodes.length; j++) {
      var episodeLi = createLi();
      addAttribute(episodeLi,"class","list-group-item");

      var episodeSpan = createSpan(seasons[i].episodes[j].name);

      var checkbox = createCheckbox();
      addAttribute(checkbox, "data-episode", seasons[i].episodes[j]);
      addAttribute(checkbox, "data-season", seasons[i]);
      addAttribute(checkbox, "class", "episodeCheckbox");

      if(watchedEpidodes != null) {
        checkbox.checked = movie.hasEpisode(watchedEpidodes, seasons[i].episodes[j]);
      }
      episodeLi.appendChild(checkbox);
      episodeLi.appendChild(episodeSpan);

      episodeUl.appendChild(episodeLi);
    }

    div.appendChild(episodeUl);
    li.appendChild(div);

    ul.appendChild(li);
  }

}
