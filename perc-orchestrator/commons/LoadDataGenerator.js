var faker = require('faker');
var fs = require('fs');
var S = require('string');
require('date-format-lite');

faker.locale = 'en_IND';

function generateNames(size, fileName) {

	var namesArray = [];
	var enrollmentArray = [];
	for(var i=0; i < size; i++) {
		var city = faker.address.city();
		var fname = faker.name.firstName();
		var lname = faker.name.lastName();
		namesArray.push(
			{
				type: 'student',
				givenName: fname,
				middleName: '',
				familyName: lname,
				employeeId:'',
				email: fname.toLowerCase() + '.' + lname.toLowerCase() + '@app.ilimi.in',
				password: 'ilimi123',
				image: faker.internet.avatar(),
				description: '',
				contactNumber: faker.phone.phoneNumber('##########'),
				address: faker.address.streetName() + ', ' + faker.address.streetAddress() + ', ' + city + ', ' + faker.address.state(),
				gender: '',
				location: city,
				speakingLanguages: 'English:8,hindi:2,telugu',
				linkedin: '',
				facebook: '',
				twitter: '',
				googleplus: '',
				github: '',
				website: '',
				programmingProficiency: '6',
				programmingToolsUsed: 'eclipse,ant,maven:5',
				computerScienceSpecializations: '',
				laptop: '',
				skills: 'java:10,c:10,c++',
				workExperience: 10,
				organization: faker.company.companyName(),
				organizationImage: faker.image.business(),
				yearOfGraduation: '2015',
				degree: 'B Tech',
				college: 'JNTU College of engineering',
				stream: stream[getRandomInt(0, 2)],
				programStream: programStream[getRandomInt(0, 3)],
				joiningDate: dates[getRandomInt(0, 2)],
				uniqueid: fname.toLowerCase() + '.' + lname.toLowerCase() + '@app.ilimi.in'
			}
		);

		enrollmentArray.push({
				uniqueid: fname.toLowerCase() + '.' + lname.toLowerCase() + '@app.ilimi.in',
				courseId: 'WEB301:1',
				type: 'student',
				batch: 1
		});
	}
	console.log('User Names generated');
	outputToFile(namesArray, fileName);
	outputToFile(enrollmentArray, 'enroll_users.csv');
}

var stream = ['CSE', 'ECE', 'EEE'];
var programStream = ['C','C++','C#','Java'];
var dates = ['29/12/2014', '13/01/2015', '27/01/2015'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function outputToFile(array, fileName) {

	var headerFields = [];
	var firstRecord = array[0];
	for(k in firstRecord) {
		headerFields.push({name: k, label: S(k).humanize().s});
	}
	var jsonCSV = require('json-csv');
	var args = {
		data: array,
		fields: headerFields
	}
	jsonCSV.toCSV(args, function(err, csv) {
		fs.appendFile(fileName, csv, function (err) {
		  	if (err) throw err;
		  	console.log(fileName+ ' created successfully!...');
		});
	});
}

generateNames(1500, 'users_import_1500.csv');

//console.log('avatar:', faker.internet.avatar());
//console.log('image people:', faker.image.people());

