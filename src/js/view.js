function viewitem(options){

	this.update = function() {
		if(typeof this.berry !== 'undefined'){this.berry.destroy();}

		this.$el.find('[data-event]').off();

		this.$el.replaceWith(this.setElement(renderMath(this.view.render(this.model.attributes , templates), this.model.attributes)).$el);

		if(this.$el.find('[data-popins]').length > 0){
			this.berry = this.$el.berry({ popins: {container: '#first', viewport:{ selector: 'body', padding: 20 }}, renderer: 'popins', model: this.model});
		}

		this.$el.find('[data-event]').hide();
		var temp = [];
		this.$el.find('[data-event]').each(function(){
			temp.push($(this).data('event'));
		})


		this.$el.find('[data-event="delete"]').show().on('click', function(){
			console.log('delete');
		});
		this.$el.find('[data-event="edit"]').show().on('click', function(){
			console.log('edit');
		});

		// this.$el.find("abbr.timeago").timeago();
		this.$el.find("[data-moment]").each(function(item){
			$(this).html(moment.utc($(this).data('moment')).format($(this).data('format')) );
		});
		this.$el.find(".sparkline").each(function(){
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


