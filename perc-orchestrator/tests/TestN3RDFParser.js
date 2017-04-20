/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved. 
 * 
 * This code is intellectual property of Canopus Consulting. The intellectual and technical 
 * concepts contained herein may be covered by patents, patents in process, and are protected 
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval 
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for RDF Parser.
 * 
 * @author ravitejagarlapati
 */

var parser = require('../commons/RDFGraphUtil');

module.exports = {
	setUp : function(callback) {

		callback();
	},
	tearDown : function(callback) {
		// clean up
		callback();
	},
	testParser1 : function(test) {
		// expecting 3 assertions to be run
		test.expect(3);
		parser
				.parseN3(
						'\
						@prefix pcp: <http://perceptronnetwork.com/ontologies/#> .\
						@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\
						@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\
						@prefix xml: <http://www.w3.org/XML/1998/namespace> .\
						@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\
						\
						pcp:Course pcp:associatedTo pcp:Concept,\
						        pcp:LearningObjective ;\
						    pcp:class "LOB" ;\
						    pcp:hasConstituent pcp:LearningActivity,\
						        pcp:LearningResource,\
						        pcp:Module ;\
						    pcp:hasSequence pcp:Sequence ;\
						    pcp:id "64" ;\
						    pcp:rules "[courseRule]" ;\
						    pcp:setType "Course" ;\
						    pcp:taxonomyId "lob_taxonomy_1" .\
						\
						pcp:Module pcp:associatedTo pcp:Concept,\
						        pcp:LearningObjective ;\
						    pcp:class "LOB" ;\
						    pcp:hasConstituent pcp:LearningActivity,\
						        pcp:LearningResource ;\
						    pcp:hasSequence pcp:Sequence ;\
						    pcp:id "66" ;\
						    pcp:rules "[moduleRule]" ;\
						    pcp:setType "Module" ;\
						    pcp:taxonomyId "lob_taxonomy_1" .\
						\
						pcp:LearningActivity pcp:associatedTo pcp:Concept,\
						        pcp:Content,\
						        pcp:LearningObjective ;\
						    pcp:class "LOB" ;\
						    pcp:id "70" ;\
						    pcp:rules "[learningActivityRule]" ;\
						    pcp:setType "LearningActivity" ;\
						    pcp:taxonomyId "lob_taxonomy_1" .\
						\
						pcp:LearningResource pcp:associatedTo pcp:Concept,\
						        pcp:Content,\
						        pcp:LearningObjective ;\
						    pcp:class "LOB" ;\
						    pcp:id "68" ;\
						    pcp:rules "[learningResourceRule]" ;\
						    pcp:setType "LearningResource" ;\
						    pcp:taxonomyId "lob_taxonomy_1" .\
						\
						pcp:Content pcp:associatedTo pcp:Concept,\
						        pcp:Content ;\
						    pcp:class "Content" ;\
						    pcp:hasSequence pcp:Sequence ;\
						    pcp:id "76" ;\
						    pcp:setType "Content" ;\
						    pcp:taxonomyId "content_taxonomy_1" .\
						\
						pcp:Sequence pcp:class "Collection" ;\
						    pcp:id "78" ;\
						    pcp:rules "[sequenceRule]" ;\
						    pcp:setType "Sequence" ;\
						    pcp:taxonomyId "sequence_taxonomy_1" .\
						\
						pcp:LearningObjective pcp:class "LearningObjective" ;\
						    pcp:id "74" ;\
						    pcp:outcomeOf pcp:Concept ;\
						    pcp:setType "LearningObjective" ;\
						    pcp:taxonomyId "lo_taxonomy_1" .\
						\
						pcp:Concept pcp:class "Concept" ;\
						    pcp:id "72" ;\
						    pcp:setType "Concept" ;\
						    pcp:taxonomyId "concept_taxonomy_1" .',
						function(graph) {
//							console.log(JSON.stringify(graph, null, 4));
							
							test.equal(graph.numTriplets,58,"Number of triplets not a expected");
							test.equal(graph.numNodes,8,"Number of nodes not a expected");
							test.equal(graph.numRelations,21,"Number of relations not a expected");
							
							test.done()
						});
		
	},
	testParser2 : function(test) {
		// expecting 3 assertions to be run
//		test.expect(3);
		parser
				.parseN3(
						'\
						@prefix gis: <http://canipusconsulting.com/giogis#> .\
						@prefix owl: <http://www.w3.org/2002/07/owl#> .\
						@prefix pcp: <http://canopusconsulting.com/giotest#> .\
						@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\
						@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\
						@prefix xml: <http://www.w3.org/XML/1998/namespace> .\
						@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\
						\
						<http://canipusconsulting.com/giogisrelation/11/#11> a owl:ObjectProperty ;\
						    pcp:id "11" ;\
						    pcp:namespace "gis" ;\
						    pcp:relationEnd <info:fedora/learning:2> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#1> ;\
						    pcp:relation_label "adjacentTo" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#1> ;\
						    rdfs:range <info:fedora/learning:2> .\
						\
						<http://canipusconsulting.com/giogisrelation/12/#12> a owl:ObjectProperty ;\
						    pcp:id "12" ;\
						    pcp:namespace "gis" ;\
						    pcp:relationEnd <http://canopusconsulting.com/giotest#3> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#4> ;\
						    pcp:relation_label "adjacentTo" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#4> ;\
						    rdfs:range <http://canopusconsulting.com/giotest#3> .\
						\
						<http://canopusconsulting.com/giotestrelation/13/#13> a owl:ObjectProperty ;\
						    pcp:id "13" ;\
						    pcp:relationEnd <http://canopusconsulting.com/giotest#3> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#1> ;\
						    pcp:relation_label "tradesWith" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#1> ;\
						    rdfs:range <http://canopusconsulting.com/giotest#3> .\
						\
						<http://canopusconsulting.com/giotestrelation/14/#14> a owl:ObjectProperty ;\
						    pcp:id "14" ;\
						    pcp:relationEnd <http://canopusconsulting.com/giotest#3> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#4> ;\
						    pcp:relation_label "tradesWith" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#4> ;\
						    rdfs:range <http://canopusconsulting.com/giotest#3> .\
						\
						<http://canopusconsulting.com/giotestrelation/15/#15> a owl:ObjectProperty ;\
						    pcp:id "15" ;\
						    pcp:relationEnd <info:fedora/learning:2> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#3> ;\
						    pcp:relation_label "tradesWith" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#3> ;\
						    rdfs:range <info:fedora/learning:2> .\
						\
						<http://canopusconsulting.com/giotestrelation/5/#5> a owl:ObjectProperty ;\
						    pcp:id "5" ;\
						    pcp:relationEnd <info:fedora/learning:2> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#16> ;\
						    pcp:relation_label "hasCollectionMember" ;\
						    pcp:sequence_index "0" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#16> ;\
						    rdfs:range <info:fedora/learning:2> .\
						\
						<http://canopusconsulting.com/giotestrelation/6/#6> a owl:ObjectProperty ;\
						    pcp:id "6" ;\
						    pcp:relationEnd <http://canopusconsulting.com/giotest#4> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#16> ;\
						    pcp:relation_label "hasCollectionMember" ;\
						    pcp:sequence_index "1" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#16> ;\
						    rdfs:range <http://canopusconsulting.com/giotest#4> .\
						\
						<http://canopusconsulting.com/giotestrelation/7/#7> a owl:ObjectProperty ;\
						    pcp:id "7" ;\
						    pcp:relationEnd <http://canopusconsulting.com/giotest#3> ;\
						    pcp:relationStart <http://canopusconsulting.com/giotest#16> ;\
						    pcp:relation_label "hasCollectionMember" ;\
						    pcp:sequence_index "2" ;\
						    rdfs:domain <http://canopusconsulting.com/giotest#16> ;\
						    rdfs:range <http://canopusconsulting.com/giotest#3> .\
						\
						<http://canopusconsulting.com/giotest#1> gis:state "Karnataka" ;\
						    pcp:adjacentTo <info:fedora/learning:2> ;\
						    pcp:id "1" ;\
						    pcp:label "Bangalore" ;\
						    pcp:node_type "NODE" ;\
						    pcp:system_node_name "Bengaluru" ;\
						    pcp:tradesWith <http://canopusconsulting.com/giotest#3> ;\
						    pcp:zone "South" .\
						\
						<http://canopusconsulting.com/giotest#16> pcp:hasCollectionMember <http://canopusconsulting.com/giotest#3>,\
						        <http://canopusconsulting.com/giotest#4>,\
						        <info:fedora/learning:2> ;\
						    pcp:id "16" ;\
						    pcp:node_type "ORDERED_LIST" .\
						\
						<http://canopusconsulting.com/giotest#4> gis:state "HP" ;\
						    pcp:adjacentTo <http://canopusconsulting.com/giotest#3> ;\
						    pcp:id "4" ;\
						    pcp:label "Simla" ;\
						    pcp:node_type "NODE" ;\
						    pcp:tradesWith <http://canopusconsulting.com/giotest#3> ;\
						    pcp:zone "North" .\
						\
						<info:fedora/learning:2> gis:state "AP" ;\
						    pcp:id "2" ;\
						    pcp:label "Hyderabad" ;\
						    pcp:node_type "NODE" ;\
						    pcp:object_uri "info:fedora/learning:2" ;\
						    pcp:zone "South" .\
						\
						<http://canopusconsulting.com/giotest#3> gis:state "WB" ;\
						    pcp:id "3" ;\
						    pcp:label "Kolkata" ;\
						    pcp:node_type "NODE" ;\
						    pcp:tradesWith <info:fedora/learning:2> ;\
						    pcp:zone "East" .',
						function(graph) {
//							console.log(JSON.stringify(graph, null, 4));
							
//							test.equal(graph.numTriplets,58,"Number of triplets not a expected");
//							test.equal(graph.numNodes,8,"Number of nodes not a expected");
//							test.equal(graph.numRelations,21,"Number of relations not a expected");
							
							test.done()
						});
		
	}
};