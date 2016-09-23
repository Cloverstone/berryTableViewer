
berryDrupeletView = Backbone.View.extend({
	events:{
		'click': 'conditionalView',
		'click .go': 'viewmodel',
		'click [data-event]': 'triggerEvent',
		'click [data-event]': 'triggerEvent',
		'click [data-popins]': 'blockEvent',
		'click [data-popins]': 'blockEvent',
		'click [data-inline]': 'blockEvent'

	},
	blockEvent: function(e){
		e.stopPropagation();
		e.preventDefault();
	},
	triggerEvent: function(e) {
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
	},
	update: function() {
		if(typeof this.berry !== 'undefined'){this.berry.destroy();}
		this.$el.replaceWith( this.setElement(renderMath(this.view.render(this.model.attributes , templates), this.model.attributes)).$el );
		this.prep(this.$el);
	},
	checkPerm: function(name){
		var temp = _.findWhere(myStack.config.attributes.permissions, {name: name});
		if(typeof temp !== 'undefined') {
			return temp.any_one || (temp.owner && user && myStack.config.attributes.createdBy == user.id) || (temp.creator && user && this.model.attributes.createdBy && this.model.attributes.createdBy._id == user.id) || _.intersection(user.groups, _.pluck(temp.groups,'group')).length;
		}else{
			return true;
		}
	},
	prep: function(view){
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


	},
	conditionalView: function(e){
		if($(e.currentTarget).hasClass('list-group-item')) {
			e.stopPropagation();
			this.viewmodel(e);
		}
	},
	viewmodel: function(e){
			e.stopPropagation();
			Backbone.history.navigate('/'+myStack.config.attributes.createdBy.username+'/'+ myStack.config.attributes.title +'/' + this.model.attributes._id, { trigger: true });

	},
	initialize: function(options) {
		// debugger;
		this.setElement(renderMath(this.view.render(this.model.attributes ), this.model.attributes));
		// $('.widget .list-group')
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
});