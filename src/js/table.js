tableBuilder = function(options) {
	this.draw = function() {
		// this.search(_.compactObject(this.filter.toJSON()));
		options.search = _.compactObject(this.filter.toJSON());
		var container = this.$el.find('.list-group');
		container.empty();
		_.each(this.collection.grab(options), function(model){
			new viewitem({ 'model': model, container: container, summary:summary});
		});
		var renderObj = {};
		var showing = (this.collection.models.length>(options.count * options.page))? (options.count * options.page) : this.collection.models.length;
		options.pagecount = Math.ceil(this.collection.models.length / options.count);
		renderObj.pages = [];
		for(var i = 1; i <= options.pagecount; i++){
			var page = {name: i};
			if(options.page == i){
				page.active = 'active';
			}
			renderObj.pages.push(page);
		}
		renderObj.size = this.collection.lastGrabbed;
		renderObj.last = showing;
		renderObj.first = ( (options.count * (options.page-1) ) + 1);
		this.$el.find('.paginate-footer').html(templates['table_footer'].render(renderObj,templates));
	}

	var changePage = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if($(e.currentTarget).data('page') == 'inc') {
		}else if($(e.currentTarget).data('page') == 'dec') {
		}else{
			options.page = $(e.currentTarget).data('page') || options.pagecount;
		}
		this.draw();
	}
	var changeSort = function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(e.currentTarget).siblings('[data-sort]').removeClass('text-primary');
		$(e.currentTarget).siblings('[data-sort]').find('i').attr('class', 'fa fa-sort');
		$(e.currentTarget).addClass('text-primary');

		if(options.sort == $(e.currentTarget).data('sort')) {
			options.reverse = !options.reverse;
		}else{
			options.reverse = false;
		}
		if(options.reverse) {
			$(e.currentTarget).find('i').attr('class', 'fa fa-sort-asc');
		}else{
			$(e.currentTarget).find('i').attr('class', 'fa fa-sort-desc');
		}

		options.sort = $(e.currentTarget).data('sort');
		this.draw();
	}

	var options = $.extend({count: 5, page: 1, sort: 'createdAt', reverse: false}, options);

	var summary = {'items': _.map(options.schema, function(val){
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

		// berryDrupeletListView = berryDrupeletView.extend({view: Hogan.compile(templates['table_row'].render(summary, templates)) });
	var filterFields = _.map($.extend(true, {},options.schema), function(val){
		var name = (val.name|| val.label.split(' ').join('_').toLowerCase());
		switch(val.type){
			case 'textarea':
			case 'contenteditable':
			case 'ace':
			case 'color':
				val.type = 'text';
				break;
			case 'checkbox':
				val.choices = [{label: 'False', value: 'false'}, {label: 'True', value: 'True'}];
			case 'radio':
				val.type = 'select';
			case 'select':
				val.default = {label: 'No Filter', value: ''};
				val.value = '-';
				break;
			default:
		}
		if(val.options){
			val.options = _.map(val.options, function(item){
				return _.omit(item, 'selected');
			})
		}
		return val;
	});

	function render(){
		return template.render();
	}
	function onload($el){
		this.$el = $el;
		this.berry = $el.find('.form').berry({attributes: options, actions: false, fields: [{label:'Records per page', name:'count', type: 'select', options: [5,10,15,20,{label: 'All', value: 100}], columns: 7},{label: 'Search', name:'filter', columns: 5, offset: 0, pre: '<i class="fa fa-filter"></i>'}]}).on('change:count', function(){
			$.extend(options, this.berry.toJSON());
			this.draw();
		}, this);

		this.filter = $el.find('.filter').berry({renderer: 'inline', attributes: {},disableMath: true, suppress: true, fields: filterFields }).on('change', function(){
			this.draw();
		}, this);

		this.collection = new loaf(options.data, {schema:options.schema});//myStack.collection;
		this.collection.on('add', $.proxy(function(record) {
 			new viewitem({ 'model': record , container: this.$el.find('.list-group'),summary: summary});
 			this.draw();
		}, this));


		this.$el.on('click','[data-page]', changePage.bind(this));
		this.$el.on('click','[data-sort]', changeSort.bind(this));
		this.draw();

	}
	var fields = {
		Title: {},
		Feed: {type: 'select', label_key: 'title', value_key: '_id', required: true, default: {title: 'Current Collection', _id: 'collection'}},
	}
	$(options.container).html(render.call(this));
	onload.call(this, $(options.container));

}
