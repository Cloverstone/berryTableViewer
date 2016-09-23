$(function(){
myform = [
			{type:"text", name:"title", label:"Title"},
			{type:"select", name:"status", label: "Status", options:[{label:'Started', value:'Started'}, {label:'Created', value:'Created'}]}

			];
myStack = {
	collection: new itemcollection(data), 
	config: {
	// views:{item:"<div>{{email}}</div>"},
		attributes:{form:myform}
	}

};

tableBuilder = function(container) {

	this.draw = function(){
		// this.$el.find('.list-group').empty();
		var container = this.$el.find('.list-group');
		container.empty();
		_.each(this.collection.grab(options), function(model){
			new viewitem({ 'model': model, container: container});
		});
		var renderObj = _.clone(myStack.config.attributes);
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
		renderObj.size = this.collection.models.length;
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
		// template: "list",
		this.search = function(pageFilter){
			// console.log(pageFilter);
			this.collection = new itemcollection(
				_.pluck(myStack.collection.filter(function(anyModel) {
					var keep = $.isEmptyObject(pageFilter);
					for(var filter in pageFilter) {
						keep = keep || ($.score((anyModel.attributes[filter]+'').replace(/\s+/g, " ").toLowerCase(), (pageFilter[filter]+'').toLowerCase() ) > 0.40);
					}
					return keep;
				}), 'attributes')
			, {config: myStack.config});

		}
		var options = {count: 5, page: 1, sort: 'createdAt', reverse: false};

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
		// berryDrupeletListView = berryDrupeletView.extend({view: Hogan.compile(templates['table_row'].render(summary, templates)) });
	 	var filterFields = _.map($.extend(true, {},myStack.config.attributes.form), function(val){
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
		return template.render( myStack.config.attributes);
	}
	function onload($el){
		this.$el = $el;
		this.berry = $el.find('.form').berry({attributes: options, actions: false, fields: [{label:'Records per page', name:'count', type: 'select', options: [5,10,15,20,{label: 'All', value: 100}], columns: 7},{label: 'Search', name:'filter', columns: 5, offset: 0, pre: '<i class="fa fa-filter"></i>'}]}).on('change:count', function(){
			$.extend(options, this.berry.toJSON());
			this.draw();
		}, this);

		this.filter = $el.find('.filter').berry({renderer: 'inline', attributes: {},disableMath: true, suppress: true, fields: filterFields }).on('change', function(){
			this.search(_.compactObject(this.filter.toJSON()));
			this.draw();
		}, this);

		this.collection = myStack.collection;
		this.collection.on('add', $.proxy(function(record) {
 			new viewitem({ 'model': record , container: this.$el.find('.list-group')});
 			this.draw();
 			// this.filter.trigger.change();
		}, this));




		// var index = (this.options.records * (this.options.page-1) );
		// this.$el.find('.range').html('Showing ' + ( index + 1) + ' to ' + showing + ' of ' + myStack.collection.length + ' entries');


		// this.$el.find('[data-page='+this.options.page+']').parent().addClass('active');


		this.$el.on('click','[data-page]', changePage.bind(this));
		this.$el.on('click','[data-sort]', changeSort.bind(this));
		this.draw();

	}
	function get() {
		item.widgetType = 'drupe_list_view';
		return item;
	}
	function toJSON() {
		return get();
	}
	function set(newItem){
		$.extend(item, newItem);
	}
	var item = {
		widgetType: 'drupe_list_view',
	}
	var fields = {
		Title: {},
		Feed: {type: 'select', label_key: 'title', value_key: '_id', required: true, default: {title: 'Current Collection', _id: 'collection'}},
	}
	container.html(render.call(this));
	onload.call(this, container);
	return {
		container: container,
		fields: fields,
		render: render.bind(this),
		toJSON: toJSON,
		onload: onload.bind(this),
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
		draw: this.draw
	}
}
tb = new tableBuilder($('#first'))
// tb.container.html(tb.render());


});
_.mixin({
  compactObject: function(o) {
    _.each(o, function(v, k) {
      if(!v && (v !== 0)) {
        delete o[k];
      }
    });
    return o;
  }
});

