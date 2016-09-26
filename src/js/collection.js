function loaf(models, options){
	this.options = options;
	this.load = function(models) {
		for(var i in models) {
			var temp = new loaf.model(this, models[i]);
			if(temp.validate(models[i], false)) {
				this.models.push(temp);
			}
		}
	};
	this.grab = function(options) {
		var ordered = _.sortBy(this.models, function(obj) { return obj.attributes[options.sort]; });
		if(!options.reverse){
			ordered = ordered.reverse();
		}
		ordered = _.filter(ordered, function(anyModel) {
			var keep = $.isEmptyObject(options.search);
			for(var filter in options.search) {
				keep = keep || ($.score((anyModel.attributes[filter]+'').replace(/\s+/g, " ").toLowerCase(), (options.search[filter]+'').toLowerCase() ) > 0.40);
			}
			return keep;
		})
		this.lastGrabbed = ordered.length;
		return ordered.slice((options.count * (options.page-1) ), (options.count * (options.page-1) ) + options.count)
	};
	this.models = [];
	if(models){
		this.load(models);
	}
}

loaf.model = function(owner, initial) {
	this.owner = owner;
	this.attributes = {};
	this.schema = owner.options.schema;
	this.set = function(newAtts){
		this.attributes = newAtts;
	}
	$.extend(true, this.attributes, this.defaults, initial);
};

$.extend(loaf.model.prototype, {
	validate: function() {return true;},
	toJSON: function(){return this.attributes}
});

loaf.instances = {};
loaf.model.extend = Berry.field.extend;
loaf.prototype.events = {initialize: []};
loaf.prototype.addSub = Berry.prototype.addSub;
loaf.prototype.on = Berry.prototype.on;
loaf.prototype.off = Berry.prototype.off;
loaf.prototype.trigger = Berry.prototype.trigger;
loaf.model.prototype.events = {initialize: []};
loaf.model.prototype.addSub = Berry.prototype.addSub;
loaf.model.prototype.on = Berry.prototype.on;
loaf.model.prototype.off = Berry.prototype.off;
loaf.model.prototype.trigger = Berry.prototype.trigger;
