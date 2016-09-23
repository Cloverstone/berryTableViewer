function viewitem(options){


	var blockEvent= function(e){
		e.stopPropagation();
		e.preventDefault();
	}
	var triggerEvent= function(e) {
		e.stopPropagation();
		e.preventDefault();
		var trigger = $(e.currentTarget).data('event')
		if(typeof trigger !== 'undefined') {
			switch(trigger) {
				case 'delete':
					this.model.destroy();
					Backbone.history.navigate('/'+myStack.config.attributes.createdBy.username+'/'+ myStack.config.attributes.title, { trigger: true });

				break;
				case 'edit':		
					//$().berry({legend: '<i class="fa fa-'+this.config.attributes.icon+'"></i> Edit: ' + this.config.attributes.title, model: this.model});
					$().berry({legend: '<i class="fa fa-pencil"></i> Edit: '+ myStack.config.attributes.title, model: this.model});
			
				break;
				default:
					for(var i in myStack.config.attributes.actions) {
						if(myStack.config.attributes.actions[i].name == trigger){
							var action = myStack.config.attributes.actions[i].from.split('_');
							// myStack.config.attributes.actions[i]

							if(this.model.attributes[action[0]] == action[1]){//this.model.actions[i].from){
								
								var result = myStack.config.attributes.actions[i].to.split('_');

								// var temp = {workflow: this.model.events[i].to};
								var temp = {};
								temp[result[0]] = result[1];
								temp[myStack.config.attributes.actions[i].from] = false;
								temp[myStack.config.attributes.actions[i].to] = true;
								this.model.set(temp);
							}

						}
					}


			}
		}
	}
	this.update = function() {
		if(typeof this.berry !== 'undefined'){this.berry.destroy();}
		this.$el.replaceWith(this.setElement(renderMath(this.view.render(this.model.attributes , templates), this.model.attributes)).$el);
		this.prep(this.$el);
	}
	this.checkPerm = function(name){
		var temp = _.findWhere(myStack.config.attributes.permissions, {name: name});
		if(typeof temp !== 'undefined') {
			return temp.any_one || (temp.owner && user && myStack.config.attributes.createdBy == user.id) || (temp.creator && user && this.model.attributes.createdBy && this.model.attributes.createdBy._id == user.id) || _.intersection(user.groups, _.pluck(temp.groups,'group')).length;
		}else{
			return true;
		}
	}

	this.prep = function(view){
		if(view.find('[data-popins]').length > 0){

			this.berry = view.berry({ popins: {container: '#first',viewport:{ selector: 'body', padding: 20 }}, renderer: 'popins', model: this.model});
		}

		view.find('[data-event]').hide();
		var temp = [];
		view.find('[data-event]').each(function(){
			temp.push($(this).data('event'));
		})

		for(var i =0;i< temp.length;i++){
			if(!this.checkPerm(temp[i])) {
				view.find('[data-event="'+temp[i]+'"]').remove();
			}
		}

		view.find('[data-event="delete"]').show();
		view.find('[data-event="edit"]').show();
		
		var states = _.where(myStack.config.attributes.form, {widgetType: "select"});
		for(var i=0; i<states.length;i++) {
			var list = _.pluck(_.where(myStack.config.attributes.actions, {from: states[i].name+'_'+this.model.get(states[i].name)}), 'name');
			for(var k in list) {
				view.find('[data-event="'+list[k]+'"]').show();
			}
		}
		// this.$el.find("abbr.timeago").timeago();
		this.$el.find("[data-moment]").each(function(item){
			$(this).html(moment.utc($(this).data('moment')).format($(this).data('format')) );
		});
		this.$el.find(".sparkline").each(function(){
			$(this).peity($(this).data('type'), {radius: $(this).data('radius')});
		});


	}

	var conditionalView= function(e){
		if($(e.currentTarget).hasClass('list-group-item')) {
			e.stopPropagation();
			this.viewmodel(e);
		}
	}

	var viewmodel =function(e){
			e.stopPropagation();
			Backbone.history.navigate('/'+myStack.config.attributes.createdBy.username+'/'+ myStack.config.attributes.title +'/' + this.model.attributes._id, { trigger: true });

	}


	var summary = {'items': _.map(myStack.config.attributes.form, function(val){
		var name = (val.name|| val.label.split(' ').join('_').toLowerCase());
		switch(val.type){
			case 'date':
				name = '<span data-moment="{{'+name+'}}" data-format="L"></span>'
				break;
			case 'select':
				name = '<span data-popins="'+name+'"></span>'
				break;
			case 'color':
				name = '<div class="btn btn-default" style="background-color:{{'+name+'}}">{{'+name+'}}</div> {{'+name+'}}'
				break;
			default:
				name = '{{'+ name + '}}'
		}
		return {'label': val.label, 'name': name, 'cname': (val.name|| val.label.split(' ').join('_').toLowerCase())} 
	})};
	var template = Hogan.compile(templates['table'].render(summary, templates));

	this.view = Hogan.compile(templates['table_row'].render(summary, templates));

	this.setElement = function(html){
		//todo handel events

		this.$el = $(html);
		return this;
	}


	this.model = options.model;
	this.setElement(renderMath(this.view.render(this.model.attributes ), this.model.attributes));
	if(options.container){
		options.container.append(this.$el);
	}
	this.model.on('change', this.update, this);
	this.model.on('destroy', $.proxy(function(){
		this.$el.fadeOut('fast', $.proxy(function() {
			this.remove();
		}, this));
	}, this) );
	this.update();

}


