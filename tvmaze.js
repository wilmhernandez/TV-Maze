"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res  = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);

    const shows = res.data.map(result => {

    let show = result.show;

      return {

        id: show.id,
    
        name: show.name,
    
        summary: show.summary,
    
        image : show.image? show.image.medium : 'https://tinyurl.com/tv-missing'
      }
    });

    return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="show col-md-12 col-lg-6 mb-4">
          <div class="media">
           <img src="${show.image}" class="w-25 mr-3">
          <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm show-get-episodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>`
      );

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {

  const term = $("#search-query").val();

  const shows = await getShowsByTerm(term);

  $episodesArea.hide();

  populateShows(shows);
};

$searchForm.on("submit", async function (evt) {

  evt.preventDefault();

  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {

  const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)

  const episodes = response.data.map(element => {

    return {

      id: element.id,

      name: element.name,

      season: element.season,

      number: element.number
    }
  })

  return episodes;
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {

  const $episodesList = $('#episodes-list');

  $episodesList.empty();

  for (let episode of episodes) {

    let $listing = $(

      `<li>ID: ${episode.id}, Name: ${episode.name}, Season: ${episode.season}, Number: ${episode.number}</li>`
    )

    $episodesList.append($listing);
  }

  $('#episodes-area').show();
}

$('#shows-list').on('click', '.show-get-episodes', async function handleEpisodeClick(e) {

  let showID = $(e.target).closest('.show').data('show-id');

  let episodes = await getEpisodesOfShow(showID);

  populateEpisodes(episodes);
})