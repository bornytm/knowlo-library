import axios from 'axios'

export default {
  getResourcesRelatedToTags(options) {
    
    // let tag = ['BkZDEiK--',"B1TJziFZW","SySR1sK-W","Sy4Cyjt--","SyEaysY-b","BkWUx2mp4JW","HJ0Se37TVy-"]
    // let tag = ['Syh41sK--']
    
    // let include = tag[Math.floor(Math.random() * tag.length)]
    
  
    if(typeof options == 'undefined'){
      options = {}
    }
   
    let params = {
      languageCode: 'en',
      include: [] || options.include,
      exclude: [],
      // showViewed: this.showViewed, // option only if user is logged in
      skip: options.skip || 0,
      limit: options.limit || 10,
      orderby: options.orderby || "quality",
      descending: typeof (options.descending) === 'boolean'? options.descending : true 
    }
    console.log(params)
    return axios.get('/api/resource', {
      params: params,
      before(request) { // abort current request, if there is one
        if (this.previousRequest) {
          this.previousRequest.abort()
        }
        this.previousRequest = request
      }
    }).then(response => {
      return response
    }, failed => {
      console.error(failed)
    })
  }
}
