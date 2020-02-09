// #1
:params {includedSets: ['Sku1yjYb-', 'B1c4loFWb'], language: "en" }

// #2
PROFILE
MATCH (re:resource)-[:TAGGED_WITH]->(b:synSet)-[:IN_SET*0..2]->(synSet:synSet)
           WITH distinct re, collect(synSet.uid) AS parentTags
           WHERE all(tag IN $includedSets WHERE tag IN parentTags)
		   // return *
                         //  NOT synSet.uid IN {excludedSets} // this doesn't work...
           MATCH (re)-[:TAGGED_WITH]->(synSet:synSet)<-[synR:IN_SET]-(syn:tag)-[tlang:HAS_TRANSLATION]->(tlangNode:translation)
           WHERE
               synR.order=1
               AND tlang.languageCode IN [ $language , 'en' ]
           WITH synSet, tlangNode, tlang, re//collect(distinct synSet.setID) AS blah, filter(x IN re)"//filter(x IN collect(distinct{re:re,synSets:sets}) WHERE x.re.setID NOT IN {excludedSets}) as ree
           OPTIONAL MATCH (:member)-[gVote:CAST_VOTE]->(re) // get global rankings
             WITH synSet, tlangNode, tlang, re, AVG(gVote.quality) AS gq, AVG(gVote.complexity) AS gc, COUNT(gVote) AS votes
           OPTIONAL MATCH (re)-[p:HAS_PROPERTY]->(prop:prop)-[plang:HAS_TRANSLATION ]->(ptrans:translation)
           WHERE p.order=1 AND plang.languageCode IN [ $language , 'en' ]
           RETURN
             collect(DISTINCT {tag: synSet.uid, url: synSet.url, translation: {name: tlangNode.name, languageCode: tlang.languageCode } } ) AS tags,
             collect(DISTINCT {type: prop.type, value: ptrans.value}) AS properties,
             collect(DISTINCT synSet.uid) AS tagIDs, // for filtering into suggestion group...no longer used?
             {quality: gq , complexity: gc } AS globalVote,
             votes,
             re AS resource

PROFILE
MATCH (synSet:synSet)
USING INDEX SEEK synSet:synSet(uid)
WHERE synSet.uid IN $includedSets
OPTIONAL MATCH (synSet) <-[:IN_SET*0..2]- (subSynSet)
WITH collect(subSynSet) AS parentTags
UNWIND parentTags AS tag
WITH DISTINCT tag
MATCH (tag) <-[:TAGGED_WITH]- (re)
WITH DISTINCT re
MATCH (re) -[:TAGGED_WITH]-> (synSet:synSet)
WITH re, collect(synSet) AS reTags
WHERE all(tag IN $includedSets WHERE tag IN reTags)
return re
        //    return *
 <-[synR:IN_SET]- (tag:tag)
WHERE synR.order = 1
MATCH (tag) -[tlang:HAS_TRANSLATION]-> (tlangNode)
WHERE tlang.languageCode IN [ $language , 'en' ]
WITH re, tag, collect({
    translation: properties(tlangNode),
    languageCode: tlang.languageCode
    }) AS tagTranslations
WITH re, collect({
    tag: properties(tag),
    tagTranslations: tagTranslations
}) AS reTags, collect(tag.uid) AS reTagIDs

OPTIONAL MATCH (:member) -[gVote:CAST_VOTE]-> (re) // get global rankings
WITH  re, reTags, reTagIDs, AVG(gVote.quality) AS gq, AVG(gVote.complexity) AS gc, COUNT(gVote) AS votes

OPTIONAL MATCH (re) -[p:HAS_PROPERTY]-> (prop:prop)
WHERE p.order = 1
WITH re, reTags, reTagIDs, gq, gc, votes, prop

OPTIONAL MATCH (prop) -[plang:HAS_TRANSLATION]-> (ptrans:translation)
WHERE plang.languageCode IN [ $language , 'en' ]
WITH re, reTags, reTagIDs, gq, gc, votes, prop, collect({
    translation: properties(ptrans),
    languageCode: plang.languageCode
}) as propTranslaions
WITH re, reTags, reTagIDs, gq, gc, votes, collect({
    prop: properties(prop),
    propTranslaions: propTranslaions
}) AS reProps

RETURN re, reTags, reTagIDs, gq, gc, votes, reProps

WITH DISTINCT  collect() AS tags


RETURN resource, tags



match (r:resource) WITH r LIMIT 1 MATCH (r) -[]- (n:synSet) RETURN r, n

params: {},
query:
{ languageCode: 'en',
showViewed: 'false',
skip: '0',
limit: '30',
orderby: 'votes',
descending: 'true' },

With a few tags:
params: {},
query:
{ languageCode: 'en',
include: [ 'Sku1yjYb-', 'B1c4loFWb' ],
exclude: [ 'B1uCRqtZZ' ],
showViewed: 'false',
skip: '0',
limit: '30',
orderby: 'votes',
descending: 'true' },