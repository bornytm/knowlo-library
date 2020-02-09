Run these sequentially in Neo4j Desktop:
:params {includedSets: ['Sku1yjYb-', 'B1c4loFWb'], language: "en" }

PROFILE MATCH (re:resource)-[:TAGGED_WITH]->(b:synSet)-[:IN_SET*0..2]->(synSet:synSet)
           WITH distinct re, collect(synSet.uid) AS parentTags
           WHERE all(tag IN $includedSets WHERE tag IN parentTags)
                         //  NOT synSet.uid IN {excludedSets} // this doesn't work...
		   return *

Last query takes 98463 total db, all your query execution cost is 109132 in total.
This means that resource resolution takes most time of query execution, but this is intial enrty point in this case.
You expand :HAS_TRANSLATION, :CAST_VOTE, :HAS_PROPERTY after that.

Also take a look at profiler output.
1) You select all :synSet nodes in the database by NodeByLabelScan - 4,195 items (rows)
2) Expand [:IN_SET]->(:synSet) in two hops. Resolves b. 
3) You got strongly interconnected sub-graph of all nodes of :synSet with duplicates (5,143 items (rows), +1000 because of duplicates)
4) Then you reach out re:resource from b - expand 5,147 items edges and got 25,849 resources
5) Then you filter over re is :resource, that takes 25,849 db hits additionally. It returns the same value 25,849 resources
But total number of :resource in your database is 21025
Which means that in re you have possibly all your :resource of the database and with duplicates additionally
6) Then for each of these resources you collect all their parentTags
7) Filter if resource parentTags include all items from $includedSets, got re

On each step put attention on db hits value of the operation in profiler. 
If Filter 
re, b
re:resource
takes 25,849 db hits which means that this operation takes 1/4 of overall execution time.

Also this query returns some strange result, because it returns two resources: "uid": "HJtxYAEbDlW", and "uid": "BJBGH3SWDxb",
Actually "BJBGH3SWDxb" does not have synSet with uid = "Sku1yjYb-", but you have it in parentTags for it.


As I worte before we have two ways to enter the graph quickly - indexes and full-text search.
We need to use index on (:synSet).uid, because our initial information is uids

This is base for this query, it takes only 8544 total db hits:
MATCH (synSet:synSet)
USING INDEX SEEK synSet:synSet(uid)
WHERE synSet.uid IN $includedSets
WITH collect(synSet) AS includedSets
UNWIND includedSets as synSet
WITH synSet, includedSets
MATCH (synSet) <-[:TAGGED_WITH]- (re)
WITH DISTINCT re, collect(synSet) as tags, includedSets
WITH re, tags, includedSets
WHERE all(tag IN includedSets WHERE tag IN tags)
MATCH (re) -[:TAGGED_WITH]-> (reTag)
RETURN re, collect(reTag) as tags

You can also speed up this by adding index:
CREATE CONSTRAINT ON (n:synSet) ASSERT n.uid IS UNIQUE
Then it will use SearchByUnique instead of full label scan.