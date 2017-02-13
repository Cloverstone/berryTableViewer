
function tableModel (owner, initial) {
	this.owner = owner;
	this.id = Berry.getUID();
	this.attributes = {};
	this.display = {};
	this.attribute_history = [];
	this.schema = owner.options.schema;
	var processAtts = function() {
		debugger;
		_.each(this.schema, function(item){
			if(typeof item.options !== 'undefined'){
				var option =  _.findWhere(item.options,{value:this.attributes[item.name]});
				if(typeof option !== 'undefined') {
					this.display[item.name] = option.label || option.name;
				}else{
					this.display[item.name] = this.attributes[item.name];
				}
			}else{
				this.display[item.name] = this.attributes[item.name];
			}
		}.bind(this))
	}
	this.set = function(newAtts){
		this.attribute_history.push($.extend(true,{}, this.attributes));
		this.attributes = newAtts;
		processAtts.call(this);
	}
	this.checked = false;
	this.toggle = function(statem){
		if(typeof state === 'bool') {
			this.checked = state;
		}else{
			this.checked = !this.checked;
		}
		this.trigger('check');

		// this.owner.updateState();
	}
	$.extend(true, this.attributes, initial);
	processAtts.call(this);
	this.toJSON = function() {return this.attributes}
	this.undo = function(){
		if(this.attribute_history.length){
			this.attributes = this.attribute_history.pop();
			processAtts.call(this);
			this.owner.draw();
			//this.set(this.attribute_history.pop());
		}
	}
	this.delete = function(){
		this.owner.models.splice(_.indexOf(_.pluck(this.owner.models, 'id'), this.id),1);
	}
	
	this.events = {initialize: []};
	this.addSub = Berry.prototype.addSub;
	this.on = Berry.prototype.on;
	this.off = Berry.prototype.off;
	this.trigger = Berry.prototype.trigger;

};

// tableModel.prototype.events = {initialize: []};
// tableModel.prototype.addSub = Berry.prototype.addSub;
// tableModel.prototype.on = Berry.prototype.on;
// tableModel.prototype.off = Berry.prototype.off;
// tableModel.prototype.trigger = Berry.prototype.trigger;
