
function breadViewer(options) {
	this.draw = function() {
		// this.search(_.compactObject(this.filter.toJSON()));
		options.search = _.compactObject(this.filter.toJSON());

		var container = this.$el.find('.list-group');
		container.empty();
		
		this.search(options);

		var renderObj = {};
		options.pagecount = Math.ceil(this.lastGrabbed / options.count);
		renderObj.pages = [];

        if(options.page > options.pagecount){
            options.page = options.pagecount || 1;
        }
        var showing = (this.lastGrabbed>(options.count * options.page))? (options.count * options.page) : this.lastGrabbed;

        _.each(this.grab(options), function(model){
			new viewitem({ 'model': model, container: container, summary:summary});
		});
		var startpage = options.page - 2;
		if(startpage < 1){startpage = 1}
		var endpage = options.page + 2;
		if(endpage >options.pagecount){endpage = options.pagecount}

		for(var i = startpage; i <= endpage; i++){
			var page = {name: i};
			if(options.page == i){
				page.active = 'active';
			}
			renderObj.pages.push(page);
		}
		renderObj.size = this.lastGrabbed;
		renderObj.last = showing;
		renderObj.first = ( (options.count * (options.page-1) ) + 1);
		this.$el.find('.paginate-footer').html(templates['table_footer'].render(renderObj,templates));
	}

	var changePage = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if($(e.currentTarget).data('page') == 'inc') {
			options.page++;
			if(options.page > options.pagecount){options.page = options.pagecount}

		}else if($(e.currentTarget).data('page') == 'dec') {
			options.page--;
			if(options.page < 1){options.page = 1}
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

	var options = $.extend({count: options.count || 5, page: 1, sort: 'createdAt', reverse: false}, options);

	options.schema = _.map(_.map(options.schema, Berry.processOpts), function(item){
        item.value = item.value || item.default;
	    delete item.default;
	    return item;
	});

	options.filterFields = _.map($.extend(true, {}, options.filters || options.schema), function(val){
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
				val.value = '';
				break;
			default:
		}
		if(val.options){
			val.options = _.map(val.options, function(item){
				return _.omit(item, 'selected');
			})
		}
		val.id = val.id || Berry.getUID();
		val.search = val.name;
		val.name = val.id;
		val.show = {};
        val.isEnabled = true;
		return val;
	});
	if(typeof options.columns == 'object'){
    	options.filterFields = _.filter(options.filterFields, function(item){
    	    return (_.contains(options.columns, item.name) || _.contains(options.columns,item.id))
    	})
	}

	var summary = {'start':'{{', 'end':'}}','items': _.map(options.filterFields, function(val){
		var name = (val.search|| val.label.split(' ').join('_').toLowerCase());
		switch(val.type){
			case 'date':
				name = '<span data-moment="{{attributes.'+name+'}}" data-format="L"></span>'
				break;
			case 'select':
			    if(options.inlineEdit){
    				name = '<span data-popins="'+name+'"></span>';
			    }else{
    				name = '{{attributes.'+ name + '}}'
			    }
				break;
			case 'color':
				name = '<div class="btn btn-default" style="background-color:{{attributes.'+name+'}}">{{attributes.'+name+'}}</div> {{attributes.'+name+'}}'
				break;
			default:
				name = '{{attributes.'+ name + '}}'
		}
		return { 'label': val.label, 'name': name, 'cname': (val.name|| val.label.split(' ').join('_').toLowerCase()), 'id': val.id, 'visible':!(val.type == 'hidden')} 
	})};
	var template = Hogan.compile(templates['table'].render(summary, templates));

	this.defaults = {};
	_.map(options.filterFields, function(val){
		switch(val.type){
			case 'text':
				val.value = '';
				break;
			case 'checkbox':
				val.value = 'false';
			case 'radio':
				val.value = '';
			case 'select':
				val.value = '';
				break;
			default:
		}
		this.defaults[val.name] = val.value;
	}.bind(this));


	function render(){
		return template.render();
	}
	var silentPopulate = function(attributes,fields) {this.each(function(attributes) {if(!this.isContainer) {this.setValue(Berry.search(attributes, this.getPath()));}}, [attributes], this.fields);}

	function onload($el){
		this.$el = $el;



		this.$el.on('click', '[data-event="delete"]', function(e){
		        		    var index =_.indexOf(_.pluck(this.models, 'id'), e.currentTarget.dataset.id);

		    if(confirm("Are you sure you want to delete? \nThis operation can not be undone.\n\n"+ _.values(this.models[index].attributes).join('\n') )){
    
    			if(typeof this.options.delete == 'function'){
    				this.options.delete(this.models[index]);
    			}
                this.models.splice(index,1);
                this.draw();
		    }
		}.bind(this));



		if($el.find('.form').length){
			this.berry = $el.find('.form').berry({attributes: options,inline:true, actions: false, fields: [
					{label:'Entries per page', name:'count', type: 'select',default:{label: 'All', value: 100}, options: options.entries || [5,10,15,20] , columns: 2},
					// {label:false,name:"reset",type:'raw',value:'<button name="reset-search" class="btn btn-warning btn-sm" style="margin-top: 30px;">Reset Filter</button>',columns: 2},
					{label:false,name:"reset",type:'raw',value:'<button data-event="add" class="btn btn-success pull-right btn-sm" style="margin-top: 30px;"><i class="fa fa-pencil-square-o"></i> Create New</button>',columns: 2,offset:8},
					// {label: 'Search', name:'filter', columns: 5, offset: 1, pre: '<i class="fa fa-filter"></i>'}
				]}).on('change:count', function(){
				$.extend(options, this.berry.toJSON());
				options.count = parseInt(options.count,10);
				this.draw();
			}, this);
		}


		if($el.find('.filter').length){

			this.filter = $el.find('.filter').berry({name:'filter',renderer: 'inline', attributes: this.defaults ,disableMath: true, suppress: true, fields: options.filterFields }).on('change', function(){
				this.draw();
			}, this);
		}



		if(options.data) {
			for(var i in options.data) {
				this.models.push(new tableModel(this, options.data[i]));
			}
		}
		// this.collection.on('add', $.proxy(function(record) {
 	// 		new viewitem({ 'model': record , container: this.$el.find('.list-group'),summary: summary});
 	// 		this.draw();
		// }, this));
		

		this.$el.on('click','[data-page]', changePage.bind(this));
		this.$el.on('click','[data-sort]', changeSort.bind(this));
		this.$el.on('click','[name="reset-search"]', function(){
        	silentPopulate.call(this.filter,this.defaults)
			this.draw();
		}.bind(this));
		this.$el.find('[data-event="add"]').show().on('click', $.proxy(function(){
			$().berry({name:'modal', legend: '<i class="fa fa-pencil-square-o"></i> Create New', fields: options.schema}).on('save', function() {
				if(Berries.modal.validate()){
				    var newModel = new tableModel(this, Berries.modal.toJSON());
				    this.models.push(newModel);
				    Berries.modal.trigger('saved');
				    this.draw();
				    
				    if(typeof this.options.add == 'function'){
				        this.options.add(newModel);
			        }
				}
			}, this)
		},this));
		this.draw();

	}
    this.search = function(options){

        var ordered = _.sortBy(this.models, function(obj) { return obj.attributes[options.sort]; });
		if(!options.reverse){
			ordered = ordered.reverse();
		}
		filterMap = this.filterMap;
		ordered = _.filter(ordered, function(anyModel) {

			var keep = $.isEmptyObject(options.search);
			for(var filter in options.search) {
			    var temp;
			    if(typeof _.where(options.filterFields, {id:filter})[0].options == 'undefined') {
			    	temp = ($.score((anyModel.attributes[this.filterMap[filter]]+'').replace(/\s+/g, " ").toLowerCase(), (options.search[filter]+'').toLowerCase() ) > 0.40);
			    }else{
			        temp = (anyModel.attributes[this.filterMap[filter]]+'' == options.search[filter]+'')
			    }
			 //   keep = keep|| temp;
			    keep = temp;
			    if(!keep){break;}
			}
			
			
			
			return keep;
		})
		this.lastGrabbed = ordered.length;
		this.filtered = ordered;
    }
	this.grab = function(options) {
		return this.filtered.slice((options.count * (options.page-1) ), (options.count * (options.page-1) ) + options.count)
	};
	this.models = [];

	this.options = options;
	this.filterMap = {}
	_.map(options.filterFields, function(item){
	    this.filterMap[item.id] = item.search ;
	}.bind(this));
	
	var fields = {
		Title: {},
		Feed: {type: 'select', label_key: 'title', value_key: '_id', required: true, default: {title: 'Current Collection', _id: 'collection'}},
	}
	$(options.container).html(render.call(this));
	onload.call(this, $(options.container));

}
