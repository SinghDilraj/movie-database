const apiKey = 'e6672dd2'
const button = document.querySelector('#search-button')
const search = document.querySelector('#search')
const movie = document.querySelector('#movie')
const series = document.querySelector('#series')
const episode = document.querySelector('#episode')
const list = document.querySelector('#list')
let results = []
let page = 1
let info
let type
let content = 0

let next = document.createElement('button')
document.body.appendChild(next)
next.textContent = 'NEXT PAGE'
next.style.width = '100px'
next.style.height = '50px'
next.style.marginLeft = '46%'
next.style.display = 'none'

const pager = () => {
  next.style.display = 'block'
  for (let x = 0; x < 10; x++) {
    let li = document.createElement('li')
    list.appendChild(li)
    li.innerHTML = `<img src=${results[x + content].Poster}/>
    <h3>${results[x + content].Type}</h3>
    <h2>${results[x + content].Title}</h2>`
    li.addEventListener('click', () => {
      fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${results[x + content].imdbID}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          li.insertAdjacentHTML('afterend', `<h4>ACTORS:- ${data.Actors}</h4>
        <h5>PLOT:- ${data.Plot}</h5>
        <h4>SCORE:- ${data.Metascore}</h4>
        <h3>RATING:- ${data.imdbRating}</h3>
        <h2>RELEASED:- ${data.Released}</h2>`)
        })
    })
  }
}

next.addEventListener('click', () => {
  content += 10
  pager()
})

const request = () => {
  for (let x = 0; x < list.children.length; x ++) {
    list.children[x].remove()
  }
  results = []
  const searchValue = search.value
  type = ''
  if (movie.checked === true && series.checked === true && episode.checked === true) {
    type = 'movies, series, episode'
  } else if (movie.checked === false && series.checked === true && episode.checked === true) {
    type = 'series, episode'
  } else if (movie.checked === true && series.checked === false && episode.checked === true) {
    type = 'movie, episode'
  } else if (movie.checked === true && series.checked === true && episode.checked === false) {
    type = 'movie, series'
  } else if (movie.checked === false && series.checked === false && episode.checked === true) {
    type = 'episode'
  } else if (movie.checked === true && series.checked === false && episode.checked === false) {
    type = 'movie'
  } else if (movie.checked === false && series.checked === true && episode.checked === false) {
    type = 'series'
  } else if (movie.checked === false && series.checked === false && episode.checked === false) {
    type = ''
  }
  fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}&type=${type}`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      info = data.Search
      info.forEach(ele => {
        results.push(ele)
      })
      let total = Number(data.totalResults)
      for (let x = 10; x < total; total = total - x) {
        page++
        fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}&type=${type}&page=${page}`)
          .then((response) => {
            return response.json()
          })
          .then((data) => {
            info = []
            info = data.Search
            info.forEach(ele => {
              results.push(ele)
            })
          })
      }
      pager()
    })
}
button.addEventListener('click', request)
