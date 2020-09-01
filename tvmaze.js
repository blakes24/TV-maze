/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	const results = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
	const data = results.data;
	const showArr = [];
	for (let item of data) {
		showArr.push({
			id: item.show.id,
			name: item.show.name,
			summary: item.show.summary,
			image: item.show.image
		});
	}
	return showArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let image = 'https://tinyurl.com/tv-missing';
		if (show.image !== null) {
			image = show.image.original;
		}
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
           <div class="card" data-show-id="${show.id}">
           <img src="${image}" class="card-img-top" alt="${show.name}">
             <div class="card-body">
               <h5 class="card-title">${show.name}</h5>
               <p class="card-text">${show.summary}</p>
             </div>
             <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#episodeModal">Episodes</button>
           </div>
         </div>
        `
		);
		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	const results = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	const episodeArr = [];
	for (let episode of results.data) {
		episodeArr.push({
			id: episode.id,
			name: episode.name,
			season: episode.season,
			number: episode.number
		});
	}
	return episodeArr;
}

/** Given an array of objects w/ episode data create an li for each episode and append to episode list ul. Set episode section display to show.  */

function populateEpisodes(episodes) {
	const $episodeList = $('#episodeList');
	$episodeList.empty();
	for (let episode of episodes) {
		const $li = $(`<li><b>${episode.name}</b> (season ${episode.season}, number ${episode.number})</li>`);
		$episodeList.append($li);
	}
}

/** Add event listener to card buttons to retrieve show id and append episode list to DOM. */

$('#shows-list').on('click', 'button', async function handleClick(e) {
	id = $(this).closest('div.card').data('show-id');

	let episodes = await getEpisodes(id);

	populateEpisodes(episodes);
});
