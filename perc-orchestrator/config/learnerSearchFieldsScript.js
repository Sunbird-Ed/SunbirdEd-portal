db = db.getSiblingDB('percp_scope_1');
db.learner_search_fields.drop();
db.learner_search_fields.insert(
	[{
	    name: 'name',
		label: 'Name',
		type: 'text', //text/select/multiselect
		operator: 'like',
		order: 1
	},
	{
	    name: 'batch',
		label: 'Batch',
		type: 'select',
		operator: 'eq',
		values: [{name: 'Batch 1', value: '1'}, {name: 'Batch 2', value: '2'}, {name: 'Batch 3', value: '3'}],
		order: 3
	},
	{
	    name: 'joiningDate',
		label: 'Joining Date (on or before)',
		type: 'date',
		operator: 'le',
		order: 2
	},
	{
	    name: 'college',
		label: 'College',
		type: 'text',
		operator: 'like',
		order: 4
	},
	{
	    name: 'branch',
		label: 'Engineering Branch',
		type: 'select',
		operator: 'eq',
		values: [{name: 'Computer Science', value: 'CSE'}, {name: 'Electronics', value: 'ECE'}, {name: 'Electrical', value: 'EEE'}],
		order: 5
	},
	{
	    name: 'programStream',
		label: 'Program Stream',
		type: 'select',
		operator: 'eq',
		values: [{name: 'C', value: 'C'}, {name: 'C++', value: 'C++'}, {name: 'C#', value: 'C#'}, {name: 'Java', value: 'Java'}],
		order: 6
	}]
);