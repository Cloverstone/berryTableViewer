function viewitem(options){

	this.update = function() {
		if(typeof this.berry !== 'undefined'){this.berry.destroy();}

		this.$el.find('[data-event]').off();

		this.$el.replaceWith($(renderMath(this.view.render(this.model.attributes , templates), this.model.attributes)));
		this.prep(this.$el);
	}


	this.prep = function(view){
		if(view.find('[data-popins]').length > 0){
			this.berry = view.berry({ popins: {container: '#first', viewport:{ selector: 'body', padding: 20 }}, renderer: 'popins', model: this.model});
		}

		view.find('[data-event]').hide();
		var temp = [];
		view.find('[data-event]').each(function(){
			temp.push($(this).data('event'));
		})


		view.find('[data-event="delete"]').show().on('click', function(){
			console.log('delete');
		});
		view.find('[data-event="edit"]').show().on('click', function(){
			console.log('edit');
		});

		// view.find("abbr.timeago").timeago();
		view.find("[data-moment]").each(function(item){
			$(this).html(moment.utc($(this).data('moment')).format($(this).data('format')) );
		});
		view.find(".sparkline").each(function(){
			$(this).peity($(this).data('type'), {radius: $(this).data('radius')});
		});

	}
	this.view = Hogan.compile(templates['table_row'].render(options.summary, templates));

	this.setElement = function(html){
		this.$el = $(html);
		return this;
	}


	this.model = options.model;
	this.$el  = $('<tr>');
	// this.setElement(renderMath(this.view.render(this.model.attributes ), this.model.attributes));
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


