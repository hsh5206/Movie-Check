import TMDB from '../service/tmdb_api'
import Similar from './moviePage/similar'
import Trailer from './moviePage/trailer'

export default class MoviePage<T extends HTMLElement> {
  private element: T | undefined
  private movie: any
  constructor(movie_id: any) {
    const tmdb = new TMDB(process.env.TMDB_API_KEY)
    const moreInfo = tmdb.getMoreMovieInfo(movie_id)
    moreInfo
      .then((movie) => {
        this.movie = { ...movie }
      })
      .then(() => this.addPage())
  }

  private addPage = () => {
    const template = document.createElement('template')
    template.innerHTML = `
    <div class="popup-movie-container">
      <div class="back">X</div>
      <div class="header-img">
        <div class="movie-info">
          <img class="movie-poster" src="https://image.tmdb.org/t/p/w200${this.movie.poster_path}" width="180" height="250"/>
          <div class="movie-main">
            <div class="movie-title">${this.movie.title}</div>
            <div class="movie-tagline">"${this.movie.tagline}"</div>
            <div class="movie-release">${this.movie.release_date}</div>
            <div class="movie-vote">${this.movie.vote_average} / 10</div>
            <div class="movie-runtime">${this.movie.runtime}분</div>
            <div class="movie-genres"></div>
            <div class="movie-genres">${this.movie.production_countries[0].name}</div>
          </div>
      </div>
        <nav class="movie-nav">
          <ul class="movie-nav-ul">
            <li class="movie-story clicked">줄거리</li>
            <li class="movie-trailer">트레일러</li>
            <li class="movie-people">출연진</li>
            <li class="movie-similar">비슷한 컨텐츠</li>
          </ul>
        </nav>
        <div class="movie-content"></div>
      </div>
    </div>`
    this.element = template.content.firstElementChild! as T
    const parent = document.querySelector('.movie-page')! as HTMLElement
    this.renderMovie(parent)
    const button = document.querySelector('.back')! as HTMLButtonElement
    button.addEventListener('click', () => {
      this.removeMovie(parent)
    })
    const headerImg = document.querySelector('.header-img')! as HTMLElement
    headerImg.style.backgroundImage = `url(https://image.tmdb.org/t/p/w200${this.movie.backdrop_path})`
    const genres = document.querySelector('.movie-genres')! as HTMLElement
    let temp: string[] = []
    this.movie.genres.forEach((element: any) => {
      temp.push(element.name)
    })
    genres.innerText = temp.join(' | ')

    /**네비게이터 */
    const content = document.querySelector('.movie-content')! as HTMLElement
    const story = document.querySelector('.movie-story')! as HTMLElement
    story.addEventListener('click', () => {
      const clicked = document.querySelector('.clicked')! as HTMLElement
      clicked.style.borderBottom = '2px solid #4b4a54'
      clicked.classList.remove('clicked')
      story.classList.add('clicked')
      story.style.borderBottom = '0'
      content.innerText = `${this.movie.overview}`
    })
    const trailer = document.querySelector('.movie-trailer')! as HTMLElement
    trailer.addEventListener('click', () => {
      const clicked = document.querySelector('.clicked')! as HTMLElement
      clicked.style.borderBottom = '2px solid #4b4a54'
      clicked.classList.remove('clicked')
      trailer.classList.add('clicked')
      trailer.style.borderBottom = '0'
      new Trailer(this.movie.id)
    })
    const people = document.querySelector('.movie-people')! as HTMLElement
    people.addEventListener('click', () => {
      const clicked = document.querySelector('.clicked')! as HTMLElement
      clicked.style.borderBottom = '2px solid #4b4a54'
      clicked.classList.remove('clicked')
      people.classList.add('clicked')
      people.style.borderBottom = '0'
    })
    const similar = document.querySelector('.movie-similar')! as HTMLElement
    similar.addEventListener('click', () => {
      const clicked = document.querySelector('.clicked')! as HTMLElement
      clicked.style.borderBottom = '2px solid #4b4a54'
      clicked.classList.remove('clicked')
      similar.classList.add('clicked')
      similar.style.borderBottom = '0'
      new Similar(this.movie.id)
    })
    story.click()
  }

  private renderMovie(parent: HTMLElement) {
    var winY = window.pageYOffset
    const moviePopup = document.querySelector('.movie-popup')! as HTMLElement
    moviePopup.style.top = `${winY}px`
    parent.appendChild(this.element! as T)
  }

  private removeMovie = (parent: HTMLElement) => {
    parent.removeChild(this.element! as T)
    const moviePopup = document.querySelector('.movie-popup')! as HTMLElement
    moviePopup.style.display = 'none'
    const body = document.querySelector('body')! as HTMLElement
    body.style.overflow = 'scroll'
  }
}