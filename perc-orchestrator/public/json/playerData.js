db = db.getSiblingDB('percp_scope_1');
db.eval('db.createCollection("students")');
db.eval('db.createCollection("object_types")');
db.eval('db.createCollection("category_types")');

db.students.remove({});
db.students.insert( {
	'identifier' : '1',
	'name' : 'Feroz',
	'email' : 'feroz@canopusconsulting.com',
	'username' : 'feroz',
	'password' : 'feroz',
	'image' : '/img/feroz.jpg',
	'profile' : {
		'name' : 'Profile A',
		'outcome' : 'learning',
		'learnerLevel' : 'Advanced'
	}
});

db.object_types.remove({});
db.object_types.insert([
	{
		'identifier' : 'course',
		'object_type' : 'course',
		'categories' : [
			{
				'category' : '101',
				'display_priority' : 0
			},
			{
				'category' : 'references',
				'display_priority' : 1
			}
		]
	},
	{
		'identifier' : 'module',
		'object_type' : 'module',
		'categories' : [
			{
				'category' : '101',
				'display_priority' : 0
			},
			{
				'category' : 'references',
				'display_priority' : 1
			},
			{
				'category' : 'explore',
				'display_priority' : 2
			}
		]
	},
	{
		'identifier' : 'lesson',
		'object_type' : 'lesson',
		'categories' : [
			{
				'category' : '101',
				'display_priority' : 0
			},
			{
				'category' : 'challenge',
				'display_priority' : 1
			},
			{
				'category' : 'explore',
				'display_priority' : 2
			},
			{
				'category' : 'drilldown',
				'display_priority' : 3
			},
			{
				'category' : 'prerequisites',
				'display_priority' : 4
			},
			{
				'category' : 'recommended_content',
				'display_priority' : 5
			},
			{
				'category' : 'references',
				'display_priority' : 6
			},
			{
				'category' : 'pairs',
				'display_priority' : 7
			}
		]
	},
	{
		'identifier' : 'learningresource',
		'object_type' : 'LearningResource',
		'categories' : [
			{
				'category' : 'drilldown',
				'display_priority' : 0
			},
			{
				'category' : 'recommended_content',
				'display_priority' : 1
			},
			{
				'category' : 'references',
				'display_priority' : 2
			}
		]
	},
	{
		'identifier' : 'learningactivity',
		'object_type' : 'LearningActivity',
		'categories' : [
			{
				'category' : 'drilldown',
				'display_priority' : 0
			},
			{
				'category' : 'recommended_content',
				'display_priority' : 1
			},
			{
				'category' : 'references',
				'display_priority' : 2
			}
		]
	},
	{
		'identifier' : 'content',
		'object_type' : 'Content',
		'categories' : [
			{
				'category' : 'drilldown',
				'display_priority' : 0
			},
			{
				'category' : 'recommended_content',
				'display_priority' : 1
			},
			{
				'category' : 'references',
				'display_priority' : 2
			}
		]
	}
]);


db.category_types.remove({});
db.category_types.insert([
	{
		'identifier' : '101',
		'category_name' : '101',
		'description' : 'All material linked to the same concept AND learner level is Novice to Beginner AND lesson type is introductory'
	},
	{
		'identifier' : 'challenge',
		'category_name' : 'Challenge',
		'description' : 'All material linked to the same concept AND (Bloom’s taxonomy level is greater OR Difficulty level is higher OR Learner level is higher)'
	},
	{
		'identifier' : 'explore',
		'category_name' : 'Explore',
		'description' : 'All material linked to related concepts. Sorted in the order of Bloom’s Taxonomy level.'
	},
	{
		'identifier' : 'drilldown',
		'category_name' : 'Drilldown',
		'description' : '(All material linked to Sub Concepts OR (material linked to the same concept and Bloom’s taxonomy level is same or lower)) AND Difficulty level is same AND Learner level is same'
	},
	{
		'identifier' : 'pairs',
		'category_name' : 'Pairs',
		'description' : 'All additional material explored along with the current learning element previously by other students. This list is to be composed based on analytics data created from additional material usage'
	},
	{
		'identifier' : 'prerequisites',
		'category_name' : 'Pre-Requisites',
		'description' : 'All material linked to pre-requisite concepts. Sorted in the order of learner level, difficulty level and Bloom’s Taxonomy level'
	},
	{
		'identifier' : 'same_author',
		'category_name' : 'Same Author',
		'description' : 'All material linked to the same concept AND offered by the same author'
	},
	{
		'identifier' : 'same_org',
		'category_name' : 'Same Institute/Organisation',
		'description' : 'All material linked to the same concept AND offered by the same institute or organisation'
	},
	{
		'identifier' : 'popular',
		'category_name' : 'Popular',
		'description' : 'Same list as Explore category but sorted in the order of popularity'
	},
	{
		'identifier' : 'currently_viewed',
		'category_name' : 'Currently Viewed',
		'description' : 'Same list as Explore category but sorted in the order of last viewed time'
	},
	{
		'identifier' : 'recommended_content',
		'category_name' : 'Recommended Content',
		'description' : 'Material manually added to the learning element in studio as Recommended content (in Enrich functionality)'
	},
	{
		'identifier' : 'references',
		'category_name' : 'References',
		'description' : 'Material manually added to the learning element in studio as References (in Enrich functionality)'
	},
]);
