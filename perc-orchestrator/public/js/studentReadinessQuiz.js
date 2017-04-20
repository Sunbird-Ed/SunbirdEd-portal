var selfDirectednessPoints = 0;
var learningPreferencesPoints = 0;
var studyHabitsPoints = 0;
var technologySkillsPoints = 0;
var computerEquipmentPoints = 0;

var questionNumber = 0; //Which question are we on?
var answeredAllQuestions = true; //Set to true to start.

function determineStyle() {
  
  answeredAllQuestions = true; //Set to true to start.

  selfDirectednessQuestions  = "1,2,3,4,5,"; //Define the questions in the current set. You must have the last , in place!
  selfDirectednessPoints = 0; //Start at 0.

  while ((selfDirectednessQuestions != "") && (answeredAllQuestions == true)) {
	answeredAllQuestions = false; //Set to false here, set to true if the current particular question in the loop was answered.
    questionNumber = selfDirectednessQuestions.substring(0, selfDirectednessQuestions.indexOf(",")); //Get a question.
    if (selfDirectednessQuestions.indexOf(",") > 0) { //If it's a valid question....
      selfDirectednessQuestions = selfDirectednessQuestions.substring(selfDirectednessQuestions.indexOf(",")+1,selfDirectednessQuestions.length); //...remove e comma from the string,
      eval("if(document.Question" + questionNumber + ".radio[0].checked) { selfDirectednessPoints = selfDirectednessPoints + 2; answeredAllQuestions = true;}"); //Calculate the points.
      eval("if(document.Question" + questionNumber + ".radio[1].checked) { selfDirectednessPoints = selfDirectednessPoints + 1; answeredAllQuestions = true;}");
      eval("if(document.Question" + questionNumber + ".radio[2].checked) { selfDirectednessPoints = selfDirectednessPoints + 0; answeredAllQuestions = true;}");
    }
    else {
      selfDirectednessQuestions = ""; //Just junk left on string; empty it out. This may not be needed.
    }
  }

 learningPreferencesQuestions = "6,7,8,9,10,11,12,";
 learningPreferencesPoints = 0;

 while ((learningPreferencesQuestions != "") && (answeredAllQuestions == true)) {
    answeredAllQuestions = false;
    questionNumber = learningPreferencesQuestions.substring(0, learningPreferencesQuestions.indexOf(",")); //Get a question
    if (learningPreferencesQuestions.indexOf(",") > 0) { //If it's a valid question....
      learningPreferencesQuestions = learningPreferencesQuestions.substring(learningPreferencesQuestions.indexOf(",")+1,learningPreferencesQuestions.length); //...remove it from the string,
      eval("if(document.Question" + questionNumber + ".radio[0].checked) { learningPreferencesPoints = learningPreferencesPoints + 2; answeredAllQuestions = true;}");//Calculate the points.
      eval("if(document.Question" + questionNumber + ".radio[1].checked) { learningPreferencesPoints = learningPreferencesPoints + 1; answeredAllQuestions = true;}");
      eval("if(document.Question" + questionNumber + ".radio[2].checked) { learningPreferencesPoints = learningPreferencesPoints + 0; answeredAllQuestions = true;}");
    }
    else {
      learningPreferencesQuestions = ""; //Just junk left on string; empty it out.
    }
  }

 studyHabitsQuestions = "13,14,15,16,17,18,19,";
 studyHabitsPoints = 0;

 while ((studyHabitsQuestions != "") && (answeredAllQuestions == true)) {
    answeredAllQuestions = false;
    questionNumber = studyHabitsQuestions.substring(0, studyHabitsQuestions.indexOf(",")); //Get a question
    if (studyHabitsQuestions.indexOf(",") > 0) { //If it's a valid question....
      studyHabitsQuestions = studyHabitsQuestions.substring(studyHabitsQuestions.indexOf(",")+1,studyHabitsQuestions.length); //...remove it from the string,
      eval("if(document.Question" + questionNumber + ".radio[0].checked) { studyHabitsPoints = studyHabitsPoints + 2; answeredAllQuestions = true;}"); //Calculate the points.
      eval("if(document.Question" + questionNumber + ".radio[1].checked) { studyHabitsPoints = studyHabitsPoints + 1; answeredAllQuestions = true;}");
      eval("if(document.Question" + questionNumber + ".radio[2].checked) { studyHabitsPoints = studyHabitsPoints + 0; answeredAllQuestions = true;}");
    }
    else {
      studyHabitsQuestions = ""; //Just junk left on string; empty it out.
    }
  }

  technologySkillsQuestions = "20,21,22,23,24,";
  technologySkillsPoints = 0;

  while ((technologySkillsQuestions != "") && (answeredAllQuestions == true)) {
    answeredAllQuestions = false;
    questionNumber = technologySkillsQuestions.substring(0, technologySkillsQuestions.indexOf(",")); //Get a question
    if (technologySkillsQuestions.indexOf(",") > 0) { //If it's a valid question...
      technologySkillsQuestions = technologySkillsQuestions.substring(technologySkillsQuestions.indexOf(",")+1,technologySkillsQuestions.length); //...remove it from the string,
      eval("if(document.Question" + questionNumber + ".radio[0].checked) { technologySkillsPoints = technologySkillsPoints + 2; answeredAllQuestions = true;}"); //Calculate the points.
      eval("if(document.Question" + questionNumber + ".radio[1].checked) { technologySkillsPoints = technologySkillsPoints + 1; answeredAllQuestions = true;}");
      eval("if(document.Question" + questionNumber + ".radio[2].checked) { technologySkillsPoints = technologySkillsPoints + 0; answeredAllQuestions = true;}");
    }
    else {
      learningPreferencesQuestions = ""; //Just junk left on string; empty it out.
    }
  }

  computerEquipmentQuestions = "25,26,27,28,29,30,";
  computerEquipmentPoints = 0;

  while ((computerEquipmentQuestions != "") && (answeredAllQuestions == true)) {
    answeredAllQuestions = false;
    questionNumber = computerEquipmentQuestions.substring(0, computerEquipmentQuestions.indexOf(",")); //Get a question
    if (computerEquipmentQuestions.indexOf(",") > 0) { //If it's a valid question....
      computerEquipmentQuestions = computerEquipmentQuestions.substring(computerEquipmentQuestions.indexOf(",")+1,computerEquipmentQuestions.length); //...remove it from the string,
      eval("if(document.Question" + questionNumber + ".radio[0].checked) { computerEquipmentPoints = computerEquipmentPoints + 2; answeredAllQuestions = true;}"); //Calculate the points.
      eval("if(document.Question" + questionNumber + ".radio[1].checked) { computerEquipmentPoints = computerEquipmentPoints + 1; answeredAllQuestions = true;}");
      eval("if(document.Question" + questionNumber + ".radio[2].checked) { computerEquipmentPoints = computerEquipmentPoints + 0; answeredAllQuestions = true;}");
    }
    else {
      computerEquipmentQuestions = ""; //Just junk left on string; empty it out.
    }
  }

  openDialog(); //Place the results under the questions.
}

function openDialog() {
  var inputs = {
    "SelfDirectionMain":"You need to improve your time management skills and study habits (such as keeping yourself on track, meeting timelines, and working independently) before you can be successful in an online learning program. Remeber, to set some challenging goals for yourself and commit yourself to achieving them.",
    "SelfDirectionAlt":"It seems you have a good sense of self-direction.",
    "learningPreferencesMain":"You may need to stretch yourself to use different  types of media, such as video and e-books, to learn in an online course. Self-reliance to solve minor problems or make decisions about your learning is also vital.  Because you may work in remote team and will require sharp communication and collaboration skills.",
    "learningPreferencesAlt":"Your responses indicate that you can use different types of media in online courses, solve minor problems, and work in groups / teams.",
    "studyHabitsMain":"To succeed in an online course, you must  carefully choose a place to study compatible with your work habits, and plan on spending 10-15 hours each week. StackRoute's online courses requires at least 10-15 hours a week of work. Devise a way to keep track of your assignments and due dates so you can plan your work. You will also need to be willing to reach out to your mentor and fellow classmates when you have questions.",
    "studyHabitsAlt":"It seems you have good study habits.",
    "technologySkillsMain":"Consider identifying someone to serve as your technological support person before taking an online course. Ideally, you should work to acquire the following skills: use the Internet and a Web browser to perform searches, install necessary software on your personal computers, and perform simple troubleshooting activities.",
    "technologySkillsAlt":"It seems you have good technology skills.",
    "computerEquipmentMain":"Your computer may need some upgrades or additional software installed to ensure the best possible online learning experience. You should have a modern, up-to-date operating system, up-to-date browser, fairly fast connection to the Internet, virus protection, and possibly headphones with a microphone. The complete list of hardware and software required for online learning may vary slightly by course. Review specific course requirements before starting any online course.",
    "computerEquipmentAlt":"It seems you have adequate computer capabilities. The complete list of hardware and software required for online learning may vary slightly by course. Review specific course requirements before starting any online course.",
    "answeredAllQuestions":"You must answer all statements for an accurate interpretation of your readiness for online learning. You missed one or more of the radio buttons. Try again."
  };
  var info = "";

  info = "<P><B>Self Direction</B></P>";
  if(selfDirectednessPoints < 10) {
     info = info + "<P>" + inputs.SelfDirectionMain + "</P>";
  }
  else {
     info = info + "<P>" + inputs.SelfDirectionAlt + "</P>";
  }

  info = info + "<P><B>Learning Preferences</B></P>";
  if(learningPreferencesPoints < 14) {
     info = info + "<P>" + inputs.learningPreferencesMain + "</P>";
  }
  else {
     info = info + "<P>" + inputs.learningPreferencesAlt + "</P>";
  }

  info = info + "<P><B>Study Habits</B></P>";
  if(studyHabitsPoints < 14) {
     info = info + "<P>" + inputs.studyHabitsMain + "</P>";
  }
  else {
     info = info + "<P>" + inputs.studyHabitsAlt + "</P>";
  }

  info = info + "<P><B>Technology Skills</B></P>";
  if(technologySkillsPoints < 10) {
     info = info + "<P>" + inputs.technologySkillsMain +"</P>";
  }
  else {
     info = info + "<P>" + inputs.technologySkillsAlt +"</P>";
  }

info = info + "<P><B>Computer Equipment Capabilities</B></P>";
  if(computerEquipmentPoints < 12) {
     info = info + "<P>" + inputs.computerEquipmentMain + "</P>";
  }
  else {
     info = info + "<P>"+ inputs.computerEquipmentAlt + "</P>";
  }

  info = "<P><B><H2>Your Online Readiness Results</H2></B></P>" + info;

  if(answeredAllQuestions == false) {
     info = "<P " + "id=" + "notAnsweredAllQuestions"+ ">" + inputs.answeredAllQuestions + "</P>"
  }

  document.getElementById('results').innerHTML = info; //Display updated info at the bottom of the page.
  //window.location.hash="ShowResults"; //Scroll the window to show the results.


}
