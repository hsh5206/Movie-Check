import DB from '../../../service/db'
import TMDB from '../../../service/tmdb_api'

export default class Card {
  private tmdb: TMDB
  movie: any
  element: any
  date: string
  db: DB
  parent: HTMLElement
  leng: number
  now: number
  constructor(db: DB, tmdb: TMDB, list: NodeListOf<HTMLElement>, date: string) {
    this.db = db
    this.tmdb = tmdb
    this.date = date
    this.leng = list.length
    const template = document.createElement('template')
    let query = `
      <div class="card-list">
        <div class="card-back">X</div>
        <div class="card-slide-container">
          <div class="left"><</div>
          <div class="card-slide-view">
            <div class="card-slide"></div>
          </div>
          <div class="right">></div>
        </div>
      </div>`
    template.innerHTML = query
    const cardList = template.content.firstElementChild! as HTMLElement
    const page = document.querySelector('.card-page')! as HTMLElement
    page.appendChild(cardList)
    this.parent = document.querySelector('.card-slide')! as HTMLElement

    const button = document.querySelector('.card-back')! as HTMLButtonElement
    button.addEventListener('click', () => {
      this.removeMovie(cardList)
    })
    button.style.zIndex = '4'
    button.style.color = 'red'

    const left = document.querySelector('.left')! as HTMLElement
    const right = document.querySelector('.right')! as HTMLElement
    const cardSlideView = document.querySelector(
      '.card-slide-view'
    )! as HTMLElement
    this.now = 0
    if (this.leng == 1) {
      left.style.visibility = 'hidden'
      right.style.visibility = 'hidden'
    } else {
      left.addEventListener('click', () => {
        if (this.now == 0) {
          this.now = this.leng - 1
        } else {
          this.now -= 1
        }
        cardSlideView.style.transform = `translate(-${this.now * 64}vw)`
      })
      right.addEventListener('click', () => {
        if (this.now == this.leng - 1) {
          this.now = 0
        } else {
          this.now += 1
        }
        cardSlideView.style.transform = `translate(-${this.now * 64}vw)`
      })
    }

    list.forEach((div) => {
      const id = div.firstElementChild?.id
      if (id) {
        this.tmdb
          .getMoreMovieInfo(id)
          .then((result) => {
            this.movie = { ...result }
          })
          .then(() => {
            this.makeCard()
          })
      }
    })
  }

  makeCard = () => {
    const template = document.createElement('template')
    let query = `
    <div class="card-element">
      <div class="card-content">
        <div class="card-back-drop">
          <div class="card-info-header">
            <div class="card-movie-info">
              <div class="card-movie-title">${this.movie.title}</div>
              <div class="card-movie-tagline">"${this.movie.tagline}"</div>
              <div class="card-movie-release">${this.movie.release_date}</div>
              <div class="card-movie-vote">${this.movie.vote_average} / 10</div>
              <div class="card-movie-runtime">${this.movie.runtime}분</div>
              <div class="card-movie-genres"></div>
              <div class="card-movie-country">${this.movie.production_countries[0]?.name}</div>
            </div>
            <div class="card-movie-overview">${this.movie.overview}</div>
          </div>
          <div class="card-add-form">
            <div class="card-add-container">
              <input class="card-date" type="date" name="startday">
              <div class="card-edit-btn">수정하기</div>
              <div class="card-delete-btn">삭제하기</div>
            </div>
            <textarea class="card-thinking"></textarea>
          </div>
        </div>
      </div>
    </div>
    `

    template.innerHTML = query
    this.element = template.content.firstElementChild! as HTMLElement
    this.renderMovie(this.parent)

    this.element.style.backgroundImage = !this.movie.poster_path
      ? `url(./assets/images/defaultPoster.jpeg)`
      : `url(https://image.tmdb.org/t/p/w200${this.movie.poster_path})`
    const genres = this.element.querySelector(
      '.card-movie-genres'
    )! as HTMLElement
    let temp: string[] = []
    this.movie.genres.forEach((element: any) => {
      temp.push(element.name)
    })
    genres.innerText = temp.join(' | ')

    const del = this.element.querySelector('.card-delete-btn')! as HTMLElement
    del.addEventListener('click', () => {
      console.log(this.movie.id, this.date)
      this.db.removeCard(this.movie.id, this.date)
      alert('삭제 완료')
      location.reload()
    })
    const edit = this.element.querySelector('.card-edit-btn')! as HTMLElement
    edit.addEventListener('click', () => {
      const cardDate = this.element.querySelector(
        '.card-date'
      )! as HTMLInputElement
      const cardThinking = this.element.querySelector(
        '.card-thinking'
      )! as HTMLTextAreaElement
      if (!cardDate.value || !cardThinking.value) {
        window.alert('정보를 모두 입력해주세요')
      } else {
        this.db.removeCard(this.movie.id, this.date)
        this.db.addCard(this.movie.id, cardDate.value, cardThinking.value)
      }

      alert('수정 완료')
    })

    this.getCardInfo()
  }

  getCardInfo = () => {
    console.log(this.date)
    this.db.syncCards(this.movie.id, this.date, (x: any) => {
      const date = this.element.querySelector('.card-date')! as HTMLInputElement
      date.value = this.date
      const opinion = this.element.querySelector(
        '.card-thinking'
      )! as HTMLTextAreaElement
      opinion.innerHTML = x.data
      console.log(x)
    })
  }

  private renderMovie = (parent: HTMLElement) => {
    const body = document.querySelector('body')! as HTMLElement
    body.style.overflow = 'hidden'
    var winY = window.pageYOffset
    const moviePopup = document.querySelector('.card')! as HTMLElement
    moviePopup.style.display = 'flex'
    moviePopup.style.top = `${winY}px`
    parent.appendChild(this.element)
  }

  private removeMovie = (element: HTMLElement) => {
    const page = document.querySelector('.card-page')! as HTMLElement
    page.removeChild(element)
    const moviePopup = document.querySelector('.card')! as HTMLElement
    moviePopup.style.display = 'none'
    const body = document.querySelector('body')! as HTMLElement
    body.style.overflow = 'scroll'
  }
}
