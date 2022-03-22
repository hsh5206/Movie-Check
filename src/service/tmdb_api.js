export default class TMDB {
  constructor(key){
    this.key = key
    this.requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  }

  async getTrendMovies(){
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=ko&api_key=${this.key}`, this.requestOptions)
  const data = await response.json()
  return data.results
  }

  async getPopularMovies(){
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${this.key}&language=ko&page=1`, this.requestOptions)
    const data = await response.json()
    return data.results
  }
}


