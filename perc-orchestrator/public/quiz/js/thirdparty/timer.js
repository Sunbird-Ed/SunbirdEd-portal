/*function countdown(mins) {
	var secs = mins * 60;
	setTimeout('Decrement('+mins+','+secs+')',1000);
}*/
function countdown(sec) {
	var secs = sec;
	mins = getminutes(secs);
	setTimeout('Decrement('+mins+','+secs+')',1000);
}
function Decrement(mins,secs) {
	if (document.getElementById) {
		
		targetMinutes = getminutes(secs);
		targetSeconds = getseconds(secs,targetMinutes);

		if(targetMinutes < 10) targetMinutes = '0'+targetMinutes;
		if(targetSeconds < 10) targetSeconds = '0'+targetSeconds;
		
		$("#quizMinutes").html(targetMinutes);
		$("#quizSeconds").html(targetSeconds);
		secs--;
		if(secs >= 0)
		{			
			if($('#pauseTimer').html() == 'pause'){
				exit;			
			}
			else if(secs < 60){
				$('#quizTimer').css({'color':'#F03535'});
				setTimeout('Decrement('+mins+','+secs+')',1000);
			}
			else{
				setTimeout('Decrement('+mins+','+secs+')',1000);
			}
		} 
		else { 
			alert( TIME_OVER_MESSAGE );
			assessmentMgr.finishAssessment();
		}
 
	}
}
function getminutes(secs) {
	// minutes is seconds divided by 60, rounded down
	mins = Math.floor(secs / 60);
	return mins;
}
function getseconds(secs,mins) {
	// take mins remaining (as seconds) away from total seconds remaining
	return secs-Math.round(mins *60);
}