# [knowlo](knowlo.org)

> For the design and proliferation of knowledge.

Knowlo is a principled, community driven, open source, radically transparent, not-for-profit educational organization driven to optimize access to and proliferation of insight.

# [Knowlo Library](knowlo.io)

#### Definition:

The Knowlo Library is a [principled](https://www.knowlo.org/principles), open source tool for resource organization, proliferation, and collaboration.

#### Technical definition:

The Knowlo Library is a [Node.js](nodejs.org/en/) and [Vue app](vuejs.org/) using the cross platform [Quasar Framework](quasar-framework.org/), hosted on [Heroku](heroku.com), using [Firebase](firebase.google.com/) (file hosting, member management) and [Neo4j](neo4j.com/) (graph database).

# Installation:

1. Install development dependencies
  1. [neo4j](https://neo4j.com/download/)
  2. development neo4j db
  2. [node.js](https://nodejs.org/en/)
  3. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Clone the repo
`git clone https://github.com/MintyOrb/knowlo-library `
3. Install npm packages
`npm install`

# Development:

### Develop as SPA
1. Start neo4j database server via desktop app or command line
2. Start node server `node server.js`
3. Start Quasar: `quasar dev`


### Develop as Mobile app (via cordova)
Additional installation steps required (details to follow - check out quasar [mobile docs](https://quasar.dev/quasar-cli/developing-mobile-apps))

Once installed, develop on android with `npm run m`

### Develop as Desktop app (via electron)
Instructions to follow - additional installation steps required.

# Build
Instructions to follow. Varies by platform.

# Deploy
Currently, pushing to the master branch automatically builds the app on heroku. 

# Contributing
Knowlo is an open source project, collaboration is welcomed- contribution guidelines are under development. For now, reach out to @MintyOrb.
