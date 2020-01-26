import axios from 'axios'

export default {
  getResourcesRelatedToTagQuery(tags) {
    let tag = ['BkZDEiK--',"B1TJziFZW","SySR1sK-W","Sy4Cyjt--","SyEaysY-b","BkWUx2mp4JW","HJ0Se37TVy-"]
    let include = tag[Math.floor(Math.random() * tag.length)]
    return axios.get('/api/resource', {
      params: {
        languageCode: 'en',
        include: include,
        exclude: [],
        // showViewed: this.showViewed, // option only if user is logged in
        // skip: skip,
        limit: 10,
        orderby: "votes",
        descending: false
      },
      before(request) { // abort current request, if there is one
        if (this.previousRequest) {
          this.previousRequest.abort()
        }
        this.previousRequest = request
      }
    }).then(response => {
      return response
    }, failed => {
      console.error('oops')
    })
  }
}
