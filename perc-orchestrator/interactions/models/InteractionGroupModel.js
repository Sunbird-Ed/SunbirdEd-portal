/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Interaction group data model.
 *
 * @author abhinav
 */
var mongoose = require('mongoose');


var interactionGroupSchema = new mongoose.Schema({
	groupId: String,
	members: [] //An entry of "*" signifies all userss
},{ collection: 'interaction_groups' });
interactionGroupSchema.set('versionKey', false);
module.exports = mongoose.model('InteractionGroupModel', interactionGroupSchema);