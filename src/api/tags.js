import axios from 'axios'

export default {
    getTopAll () {
        return axios.get('/api/tag/most', {
            params: {
                languageCode: 'en'
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
            console.error(failed)
        })
    },
    getRelated(include, exclude) {
        console.log(include)
        return axios.get('/api/set/', {
            params: {
                languageCode: 'en',
                include: include,
                exclude: ['test'],
                type: 'none'
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
                console.error(failed)
            })

    },
    getContains (id) {
        return axios.get('/api/set/' + id + '/contains/', {
            params: {
                languageCode: 'en'
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
            console.error(failed)
        })
    },
    getWithin (id) {
        return axios.get('/api/set/' + id + '/within/', {
            params: {
                languageCode: 'en'
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
            console.error(failed)
        })
    },
}

// // ---------------------------------------
// getTags () {

//     var include = []
//     // var exclude = []
//     for (var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
//       include.push(this.tagQuery[tagIndex].setID)
//     }
//     // this.tagSuggestions = []
//     this.$http.get('/api/set/', {
//       params: {
//         languageCode: 'en',
//         include: include,
//         exclude: [''],
//         type: this.suggestionDisplay
//       }
//     }).then(response => {
//       this.tagSuggestions = response.data

//       if (this.tagSuggestions.length === 0) {
//         this.suggestionDisplay = 'disciplines'
//         Materialize.toast('Add tags to search first!', 2000)
//       }
//       this.$nextTick(() => {
//         this.layout()
//       })
//     })

//   },

//   getTagsByName () {
//     this.$http.get('/api/tag/byname', {
//       params: {
//         // languageCode: 'en', // necessary ?
//         tagString: this.$route.params.tagquery
//       }
//     }).then(response => {
//       this.$emit('updateTagQuery', response.data)
//     })
//   },

//   getBase () {
//     this.fetching = true
//     this.tagSuggestions = []
//     this.$http.get('/api/set/' + 'rJgyQNK64f' + '/crossSection', { // hard coding base-set uid
//       params: {
//         languageCode: 'en'
//       },
//       before (request) {
//         if (this.previousRequest) {
//           this.previousRequest.abort()
//         }
//         this.previousRequest = request
//       }
//     }).then(response => {
//       this.tags = response.data.map(x => x.group[0])

//       // this.$refs.rtags.layout()
//       this.fetching = false
//     })
//   },
//   getGroups () {
//     this.fetching = true
//     var include = []
//     for (var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
//       include.push(this.tagQuery[tagIndex].setID)
//     }
//     this.$http.get('/api/set/', {
//       params: {
//         languageCode: 'en',
//         include: include,
//         exclude: [''],
//         type: this.displayed
//       },
//       before (request) {
//         if (this.previousRequest) {
//           this.previousRequest.abort()
//         }
//         this.previousRequest = request
//       }
//     }).then(response => {
//       this.groupSet = response.data
//       this.showAllGroups()
//       this.fetching = false
//     })
//   },
//   getTopRelated () {
//     this.fetching = true
//     let include = []
//     // var exclude = []
//     for (var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
//       include.push(this.tagQuery[tagIndex].setID)
//     }
//     this.$http.get('/api/set/', {
//       params: {
//         languageCode: 'en',
//         include: include,
//         exclude: [''],
//         type: 'none'
//       }
//     }).then(response => {
//       this.tags = response.data
//       // this.$refs.rtags.layout()
//       this.fetching = false
//     })
//   }
// },