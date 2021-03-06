
function tableModel (owner, initial) {
	this.owner = owner;
	this.id = Berry.getUID();
	this.attributes = {};
	this.display = {};
	this.attribute_history = [];
	this.schema = owner.options.schema;
	var processAtts = function() {
		_.each(this.schema, function(item){
			if(typeof item.options !== 'undefined'){
				var option;
				if(typeof item.value_key !== 'undefined'){
										if(item.value_key == 'index'){
						option = item.options[this.attributes[item.name]]
					}else{
						var search = {};
						search[item.value_key] = this.attributes[item.name];
						option = _.findWhere(item.options, search);
						if($.isNumeric(this.attributes[item.name])){
							search[item.value_key] = parseInt(this.attributes[item.name]);
							if(typeof option === 'undefined'){
								option = _.findWhere(item.options, search);
							}
							if(typeof option === 'undefined'){
								option = _.findWhere(item.options, search);
							}
						}
					}
				}else{
					option =  _.findWhere(item.options, {value:this.attributes[item.name]});
					if(typeof option === 'undefined'){
						option = _.findWhere(item.options, {id:this.attributes[item.name]});
					}
          if($.isNumeric(this.attributes[item.name])){
            if(typeof option === 'undefined'){
              option = _.findWhere(item.options, {value:parseInt(this.attributes[item.name], 10)});
            }
            if(typeof option === 'undefined'){
              option = _.findWhere(item.options, {id:parseInt(this.attributes[item.name], 10)});
            }
          }
				}
				if(typeof option === 'object') {
					this.display[item.name] = option[item.label_key] || option.label || option.name;
				}else{
					this.display[item.name] = this.attributes[item.name];
				}
			}else{
				if(item.template){
					this.display[item.name] = Hogan.compile(item.template).render(this);
				}else{
					this.display[item.name] = this.attributes[item.name];
				}
			}
		}.bind(this))
	}
	this.set = function(newAtts){
		this.attribute_history.push($.extend(true, {}, this.attributes));
		this.attributes = newAtts;
		processAtts.call(this);
	}
	this.pat =function(){
		processAtts.call(this);
	}
	this.checked = false;
	this.toggle = function(statem) {
		if(typeof state === 'bool') {
			this.checked = state;
		}else{
			this.checked = !this.checked;
		}
		this.trigger('check');
	}
	$.extend(true, this.attributes, initial);
	processAtts.call(this);
	this.toJSON = function() {return this.attributes}
	this.undo = function() {
		if(this.attribute_history.length){
			this.attributes = this.attribute_history.pop();
			processAtts.call(this);
			this.owner.draw();
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
