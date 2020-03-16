<template>
<div id="q-app" >

  <!-- TODO: make component - top nav -->
  <div id="nav-slide" class="navbar-fixed">
    <nav class=''>
      <div class="nav-wrapper">
        <router-link to="/" class="brand-logo center thin">knowlo <span class="gt-sm">library</span></router-link>
        <ul class="left ">
          <li><a data-activates="slide-out" class="navbar-collapse show-on-large"><i class="material-icons">menu</i></a></li>
        </ul>
        <ul class="right ">
          <li v-if="!member.uid" style="margin-right:13px">
            <!-- <a @click="loginModal" class="hide-on-med-and-down">Login | Sign Up</a>
            <a @click="loginModal" class="hide-on-med-and-up"><i class="material-icons fa fa-lg fa-sign-in"></i></a> -->
          </li>
          <li v-else v-cloak style="margin-right:13px">
            <!-- member icon here? -->
            <router-link :to="'/m/'+member.uid">{{member.first}}</router-link>
          </li>
          <!-- <li><a data-activates="query-slide" class="tagQuery-collapse show-on-large "><i class="material-icons">menu</i></a></li> -->
        </ul>
      </div>
    </nav>
  </div>


  <sidemenu :member="member"></sidemenu>


  <!-- TODO: make component  firebase login-->
  <div id="login-modal" class="modal">
    <div class="modal-content">
      <h4 class='login-head'>Login | Sign Up</h4>
      <div id="firebaseui-auth-container"></div>
    </div>
    <div class="modal-footer">
      <a class="modal-action modal-close waves-effect waves-blue btn-flat">Close</a>
    </div>
  </div>

  <!-- main view -->
  <transition name="fade" mode="out-in" appear>
    <router-view
    @clear="tagQuery = []"
    @updateTagQuery="updateTagQuery"
    @updateSettings="updateSettings"
    :tag-query="tagQuery"
    :member="member"
    :settings="settings"
    style="padding-top:50px" />
  </transition>

  <footer class="page-footer ">
    <div class="container">
      <div class="row">
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container center">knowlo</div>
      <a style="margin-left:20px; margin-top:5px; position:absolute;" href="https://github.com/MintyOrb/knowlo-library"><img style="width:25px" src="statics/github.png"></a>
    </div>
  </footer>

</div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import Materialize from 'materialize-css'
import Headroom from 'headroom.js'
import Cookies from 'js-cookie'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import sidemenu from 'components/sideMenu'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import VueMeta from 'vue-meta'

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})

Vue.use(VuePlyr)

export default {
  name: 'app',
  components: { sidemenu },
  data () {
    return {
      member: {
        uid: null
      }, // id and info for member if logged in, uid null if not
      tagQuery: [], // array of tag objects to be queried
      settings: { // user setting defaults
      //   showToolTips: undefined
      }
    }
  },
  methods: {
    updateTagQuery (tags) {
      this.tagQuery = tags
    },
    close () {
      $('.tagQuery-collapse').sideNav('hide')
    },
    loginModal () {
      $('#login-modal').modal('open')
    },
    touchMember () {
      // ensure member is in DB (add if first time signing in)
      this.$http.post('/api/auth/member').then(response => {
        if (!response.data) {
          Materialize.toast('Something went wrong...', 4000)
        }
      }, response => {
        Materialize.toast('Something went wrong...are you online?', 4000)
      })
    },
    updateSettings (settingsObj) {
      this.settings = settingsObj
      Cookies.set('settings', settingsObj)
    },
    getCookies () {
      // alpha warning
      if (!Cookies.get('alpha-warning-seen')) {
        Cookies.set('alpha-warning-seen', true, {
          expires: 7
        })
        Materialize.toast('Hi! Knowlo is in alpha right now...everthing is subject to change and break.', 10000)
        
      } else {
        Cookies.set('alpha-warning-seen', true, {
          expires: 7
        }) // reset expiry
      }

      // get previously selected resource display Style
      if (!Cookies.get('resourceDisplay')) {
        this.resourceDisplay = 'card'
      } else {
        this.resourceDisplay = Cookies.get('resourceDisplay')
      }

      // get previously selected orderby
      if (!Cookies.get('orderby')) {
        this.orderby = 'quality'
      } else {
        this.orderby = Cookies.get('orderby')
      }

      // get previously selected desc/asc setting
      if (!Cookies.get('descending')) {
        this.descending = true
      } else {
        this.descending = (Cookies.get('descending') === 'true')
      }

      // get previously show viewed setting
      if (!Cookies.get('showViewed')) {
        this.showViewed = false
      } else {
        this.showViewed = (Cookies.get('showViewed') === 'true')
      }

      // get previously selected suggestionDisplay
      if (!Cookies.get('suggestionDisplay')) {
        this.suggestionDisplay = 'size'
      } else {
        this.suggestionDisplay = Cookies.get('suggestionDisplay')
      }

      // get tag query
      if (Cookies.get('tagQuery')) {
        this.tagQuery = Cookies.getJSON('tagQuery')
      }

      // get settings
      if (Cookies.get('settings')) {
        this.settings = Cookies.getJSON('settings')
      }

    },
  },
  mounted () {
    // needed to recover from occasional mystery DOM exception on resource/tag suggestion change
    // Vue.config.errorHandler = (err) => { // TODO figure out what is causing this...vueisotope?
    //   Materialize.toast('whoops...hit a snag. Reload the page if things seem off...', 3000)
    //   console.log(err)
    //   // window.setTimeout( ()=> {
    //   //   this.$router.go(this.$route)
    //   // }, 2000)
    // }

    // TODO: use this...
    // var lang = window.navigator.userLanguage || window.navigator.language
    // lang = lang.substr(0, 2) // get two letter language code

    $('#login-modal').modal() // init login modal
    this.getCookies();
    // init headroom (hide/show navbar on scroll down/up)
    var elem = document.querySelector('#nav-slide')
    new Headroom(elem, {
      'offset': 50,
      'tolerance': {
        down: 0,
        up: 10
      }
    }).init()

    // init firebase app
    var config = {
      apiKey: 'AIzaSyBEB96pSPjTN0F3CKaQUNoaSJiQHLc5pEM',
      authDomain: 'knowlo-952cc.firebaseapp.com',
      databaseURL: 'https://knowlo-952cc.firebaseio.com',
      projectId: 'knowlo-952cc',
      storageBucket: 'knowlo-952cc.appspot.com',
      messagingSenderId: '361390483938'
    }
    firebase.initializeApp(config)

    var uiConfig = {
      callbacks: {
        signInSuccess: function (currentUser, credential, redirectUrl) {
          // close login modal if open...
          $('#login-modal').modal('close')
          return true
        }
      },
      signInSuccessUrl: '/#/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      tosUrl: 'knowlo.io/#/legal', // Tags of service url.
      signInFlow: 'popup'
    }

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig)

    // The start method will wait until the DOM is loaded.
    firebase.auth().onAuthStateChanged((member) => {
      if (member) {
        this.member = member
        this.member.first = member.displayName.substr(0, member.displayName.indexOf(' ')) // get first name -  if there is no space at all, then the first line will return an empty string and the second line will return the entire string
        member.getIdToken().then((accesstag) => {
          // this.$http.headers.common['Authorization'] = 'Bearer ' + accesstag
          this.touchMember()
          // bus.$emit('login', member)
        })
      } else {
        this.member = {
          uid: null
        }
        // this.$http.headers.common['Authorization'] = ''
      }
    }, (error) => {
      console.log(error)
      Materialize.toast('Something went wrong...are you online?', 4000)
    })
  }
}
</script>
<style src="assets/materialize-subset.css"></style>
<style src="flickity/dist/flickity.min.css"></style>
<style src="leaflet/dist/leaflet.css"></style>
<style src="firebaseui/dist/firebaseui.css"></style>
<style>
#app {
  background-color: #f7f7f7;
}
.modal .modal-content {
  padding: 0px;
}
.margin20 {
	margin:20px;
}
.modal-overlay {
  height: 100vh;
  position: sticky;
}
.fullPage{
  z-index: 1001;
  top: 0!important;
  width: 100vw;
  height: 100%;
  max-height: none;
  display: block;
  overflow: scroll;
}
.exit {
  border-bottom-left-radius: 6px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  padding-right: 8px;
  padding-top: 2px;
  color: black;
  background-color: white;
  padding-left: 7px;
  padding-bottom: 4px;
}
.exit:hover{
  cursor: pointer;
}
.memberTitle div {
  font-weight: 200;
  color:black;
  font-size: 30px;
  padding-top:20px;
}
.message {
  font-size: 30px;
  font-weight: 300;
  text-align: center;
  margin: 100px;
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 45px;
}
/* in member and nav */
.resourceSections{
  height: 100%!important;
  background-color: #f7f7f7;
}
.resourceStep {
  width: 25vw;
	height: 100%;
  overflow: scroll;
  padding-top: 10px;
}
.viewBtn {
  transition: color .3s;
}
.viewBtn:hover {
  cursor: pointer;
  color: gray;
}
.disabled {
  background-color: #eee!important;
  color: gray!important;
}
.disabled:hover {
  cursor: not-allowed!important;
  background-color: #eee!important;
}
.input-field{
  margin-top: 0;
  max-width: 100%;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 15px;
}

.login-head {
    text-align: center;
    margin: 20px!important;
    font-weight: 300;
}
.fade {
  color:#a8a8a8;
}
.noUi-target.noUi-horizontal .noUi-tooltip {
  background-color: #2196F3!important;
}
.noUi-connect{
  background-color: #2196F3!important;
}
.hidden{
  visibility: hidden;
}
/*hide scroll bars*/
::-webkit-scrollbar {
    display: none;
}
[v-cloak] { display: none }
.headroom {
    will-change: transform;
    transition: transform 200ms linear;
}
.headroom--pinned {
    transform: translateY(0%);
    box-shadow: 0 5px 5px 0 rgba(0,0,0,0.2), 0 7px 11px 0 rgba(0,0,0,0.19);
}
.headroom--unpinned {
    transform: translateY(-100%);
}

.nav-wrapper a:hover {
  color:white;
}
#nav-slide{
  position: fixed;
  width: 100vw;
}
#nav-slide ul {
  margin-left: 13px;
}
#navName {
  color:#2196F3;
  font-size: 38px;
  font-weight: 200;
  text-align: center;
  margin:20px;
}
/* Smartphones (portrait and landscape) ----------- */
@media only screen
and (min-device-width : 320px)
and (max-device-width : 480px) { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
    .metaNav {
      justify-content: flex-start!important;
    }
    .definition{
      width:100vw!important;
    }
    .discussion{
      width:100vw!important;
    }
    .stepContainer{  width: 100vw;}
    .addContainer{
      padding-top: 200px;
      padding-bottom: 100px;
      padding-left: 50px;
      padding-right: 50px;
    }
    .resourceStep{ width:100vw!important;}
}

.metaNav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: #027be3;
    box-shadow: 0 5px 5px 0 rgba(0,0,0,0.2), 0 7px 11px 0 rgba(0,0,0,0.19);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-x: scroll;
    overflow-y: hidden;
  }
.metaNav span {
  font-weight: 300;
  padding-right: 15px;
  padding-left: 15px;
}
.metaNav span:hover {
  cursor: pointer;
}
@media only screen
and (min-device-width : 320px)
and (max-device-width : 480px) { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
    #addResourceModal{
      border-radius: 0px!important;
    }
    .rchart {
      margin: auto;
      width: 90%;
    }
    .text-container{
      padding: 10px;
      font-size: 20px;
    }
    .modal {
        top: 0!important;
        max-height: 100%!important;
        width: 100%!important;
        height: 100%!important;
    }
    .message {
      font-size:20px;
      margin:20px;
      padding: 15px;
    }
    .vid-container-container {
      margin:auto;
      width:100vw;
    }
    .filter {
        margin: 0px;
    }
    .suggestionGroupStep{
      padding: 0;
      width: 90vw;
    }
    .cont i {
      opacity: 1;
    }
    .definition{
      width:100vw!important;
    }
    .discussion{
      width:100vw!important;
    }
    .addContainer{
      padding-top: 200px;
      padding-bottom: 100px;
      padding-left: 50px;
      padding-right: 50px;
    }
    .resourceStep{
      width:100vw!important;
      /* padding: 20px; */
    }
}
.discussion{
  width:100vw!important;
}

element.style {
}

.material-icons {
  font-size: 25px;
}
#login-modal div {
  box-shadow: none;
}
</style>
