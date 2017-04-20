/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved. 
 * 
 * This code is intellectual property of Canopus Consulting. The intellectual and technical 
 * concepts contained herein may be covered by patents, patents in process, and are protected 
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval 
 * from Canopus Consulting is prohibited.
 */

/**
 * Gives ability to depend on all modules in the directory with single require.
 * It creates exports from all modules in this directory
 * 
 * @author ravitejagarlapati
 */

var fs = require('fs');

/*
 * Modules are automatically loaded once they are declared in the controller
 * directory.
 */
fs.readdirSync(__dirname).forEach(function(file) {
	if (file != 'index.js') {
		var moduleName = file.substr(0, file.indexOf('.'));
		exports[moduleName] = require('./' + moduleName);
	}
});