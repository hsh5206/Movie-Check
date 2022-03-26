import { Content, IContent } from './../content'

interface ISimilar extends IContent {
  makePage(): void
}

export default class Similar extends Content implements ISimilar {
  private similarMovies: any[] = []
  constructor(id: number) {
    super()
    this.tmdb
      .getSimilarMovies(id)
      .then((movies) =>
        movies.some((movie: any, index: number) => {
          this.similarMovies.push([movie.id, movie.title, movie.poster_path])
          if (index === 10) return true
        })
      )
      .then(() => this.makePage())
  }

  makePage = () => {
    let temp = '<div class="similer-movie-container">'
    this.similarMovies.map((movie) => {
      console.log(movie)
      temp += `
      <div>
        <div class="similer-movie-title">${movie[1]}</div>
        <img src="https://image.tmdb.org/t/p/w200${movie[2]}" width="130" height="200"/>
      </div>
    `
    })
    temp += '</div>'
    this.element = temp
    this.renderPage()
  }
}
