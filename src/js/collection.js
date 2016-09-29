
function tableModel (owner, initial) {
	this.owner = owner;
	this.id = Berry.getUID();
	this.attributes = {};
	this.schema = owner.options.schema;
	this.set = function(newAtts){
		this.attributes = newAtts;
	}
	$.extend(true, this.attributes, initial);
	this.toJSON = function() {return this.attributes}
};

tableModel.prototype.events = {initialize: []};
tableModel.prototype.addSub = Berry.prototype.addSub;
tableModel.prototype.on = Berry.prototype.on;
tableModel.prototype.off = Berry.prototype.off;
tableModel.prototype.trigger = Berry.prototype.trigger;
