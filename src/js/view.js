
function viewitem(options){

	this.update = function() {
		if(typeof this.berry !== 'undefined'){this.berry.destroy();}

		this.$el.find('[data-event]').off();
		this.$el.off();
		this.$el.replaceWith(this.setElement(this.view.render(this.model , templates)).$el);

		if(this.$el.find('[data-popins]').length > 0){
			this.berry = this.$el.berry({ popins: {container: '#first', viewport:{ selector: 'body', padding: 20 }}, renderer: 'popins', model: this.model});
		}

		if(typeof this.model.owner.options.click == 'function'){
			this.$el.on('click',function(){
				this.model.owner.options.click(this.model);
			}.bind(this))
		}
		var temp = [];
		this.$el.find('[data-event]').each(function(){
			temp.push($(this).data('event'));
		})

		this.$el.find(".btn-group > .dropdown-toggle, .dropdown-menu li a").on('click',function(e) {
		    e.stopPropagation();
		    $(this).next('.dropdown-menu').toggle();
		})

		// this.$el.find('[data-event="delete"]')
		this.$el.find('[data-event="edit"]').on('click', $.proxy(function(){
			$().berry($.extend(true,{},{name:'modal', legend: '<i class="fa fa-pencil-square-o"></i> Edit', model:this.model}, this.model.owner.options.berry || {} ) ).on('saved', function() {
				if(typeof this.model.owner.options.edit == 'function'){
					this.model.owner.options.edit(this.model);
				}
				//else if(typeof this.model.owner.options.edit == 'string' && typeof  == 'function' ){
				    
				//}
				this.update();
			}, this)
		},this));
		this.$el.find('[data-event="mark"]').on('click', $.proxy(function(e){
			// debugger;
			this.model.checked = e.currentTarget.checked;
			this.model.trigger('check');
		},this));

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

