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

    var watchedEpidodes = [];
    var totalEpisodes = seasons[i].episodes.length;

    if(movie.hasSeason(seasons[i])) {
      watchedEpidodes = movie.getEpisodesForSeason(seasons[i].season_number);
    }

    span = createSpan();
    var seasonName = seasons[i].name;

    if(!hasValue(seasonName)) {
      seasonName = "Season " + (i+1);
    }

    var watchedSpan = createSpan();
    watchedSpan.innerHTML = " - watched " + watchedEpidodes.length;
    addAttribute(watchedSpan, "id", "watched_"+seasons[i].season_number);

    span.innerHTML = seasonName  + ": " + totalEpisodes + " episodes";

    span.appendChild(watchedSpan);
    // add the button to show/hide episodes div
    var link = createLink("more...");

    var season_number = "season_"+seasons[i].season_number;
    addAttribute(link, "class", "mvl-hide-show-link episodeVisability");
    addAttribute(link, "value", season_number);
    addAttribute(link, "id", season_number+"Id");
    span.appendChild(link);

    li.appendChild(span);

    // add the div and the list of episodes for seasons[i]
    var div = createDiv(season_number);
    addAttribute(div, "class", "season_div mvl-episodes-div");

    var allToggle = createLink("all");
    addAttribute(allToggle, "class", "mvl-toggle-episodes");
    addAttribute(allToggle, "data-divId",div.id);
    addAttribute(allToggle, "data-season-number", seasons[i].season_number);
    div.appendChild(allToggle);

    var episodeUl = createUl();
    addAttribute(episodeUl,"class","list-group");

    for(var j = 0; j < seasons[i].episodes.length; j++) {
      var episodeLi = createLi();
      addAttribute(episodeLi,"class","list-group-item");

      var episodeSpan = createSpan(seasons[i].episodes[j].name);

      var checkbox = createCheckbox();
      addAttribute(checkbox, "data-episode", seasons[i].episodes[j]);
      addAttribute(checkbox, "data-season", seasons[i]);
      addAttribute(checkbox, "data-divId",div.id)
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

};
