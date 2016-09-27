

tabelModel = function(owner, initial) {
	this.owner = owner;
	this.attributes = {};
	this.schema = owner.options.schema;
	this.set = function(newAtts){
		this.attributes = newAtts;
	}
	$.extend(true, this.attributes, this.defaults, initial);
};

$.extend(tabelModel.prototype, {
	validate: function() {return true;},
	toJSON: function(){return this.attributes}
});

// loaf.instances = {};
tabelModel.extend = Berry.field.extend;
// loaf.prototype.events = {initialize: []};
// loaf.prototype.addSub = Berry.prototype.addSub;
// loaf.prototype.on = Berry.prototype.on;
// loaf.prototype.off = Berry.prototype.off;
// loaf.prototype.trigger = Berry.prototype.trigger;
tabelModel.prototype.events = {initialize: []};
tabelModel.prototype.addSub = Berry.prototype.addSub;
tabelModel.prototype.on = Berry.prototype.on;
tabelModel.prototype.off = Berry.prototype.off;
tabelModel.prototype.trigger = Berry.prototype.trigger;
