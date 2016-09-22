
function itemcollection(models, options){

	this.load = function(models) {
		for(var i in models) {
			var temp = new itemcollection.model(this, models[i]);
			if(temp.validate(models[i], false)) {
				this.models.push(temp);
			}
		}
	};
	this.grab = function(options) {
		var ordered = _.sortBy(this.models, options.sort);
		if(!options.reverse){
			ordered = ordered.reverse();
		}
		return ordered.slice((options.count * (options.page-1) ), (options.count * (options.page-1) ) + options.count)
	};
	this.filter = function(func){
		return _.filter(this.models, func)
	}



	this.models = [];

	if(models){
		this.load(models);
	}

	// itemcollection.instances[this.options.name] = this;
}


itemcollection.model = function(owner, initial) {
	this.owner = owner;
	this.attributes = {};
	// denu
	this.schema = myform;
	$.extend(true, this.attributes, this.defaults, initial);
};

$.extend(itemcollection.model.prototype, {
	validate: function() {return true;},
	toJSON: function(){return this.attributes}
});






itemcollection.instances = {};
itemcollection.model.extend = Berry.field.extend;
itemcollection.prototype.events = {initialize: []};
itemcollection.prototype.addSub = Berry.prototype.addSub;
itemcollection.prototype.on = Berry.prototype.on;
itemcollection.prototype.off = Berry.prototype.off;
itemcollection.prototype.trigger = Berry.prototype.trigger;


itemcollection.model.prototype.events = {initialize: []};
itemcollection.model.prototype.addSub = Berry.prototype.addSub;
itemcollection.model.prototype.on = Berry.prototype.on;
itemcollection.model.prototype.off = Berry.prototype.off;
itemcollection.model.prototype.trigger = Berry.prototype.trigger;

itemcollection.changed = false;
