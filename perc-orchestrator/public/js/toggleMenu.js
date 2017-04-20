ToggleMenu = {
	menu: null,
	menuOpen: false,
	sideToggle: function(toggle) {
		if(ToggleMenu.menuOpen) {
			//$('#sideToggleIcon').removeClass('fa-chevron-right').addClass('fa-chevron-left');
			//$('#tocColumn').show();
			//TODO Resize media player
		} else {
			//$('#tocColumn').hide();
        	//$('#sideToggleIcon').removeClass('fa-chevron-left').addClass('fa-chevron-right');
        	//TODO Resize media player
		}
		ToggleMenu.menu.toggle();
		ToggleMenu.menuOpen = !ToggleMenu.menuOpen;
	},
	initSideToggleMenu: function(divId) {
		ToggleMenu.menu = new sidetogglemenu({
			id: divId,
			position: 'right',
			pushcontent: true,
			dismissonclick: false,
			revealamt: 0
		});
	}
}