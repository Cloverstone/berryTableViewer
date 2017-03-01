function berryTable(options) {
	options = $.extend(true, {filter: true, sort: true, search: true, download: true, upload: true, columns: true}, options);
	this.draw = function() {
			_.each(this.summary.items, function(item){
				$('.filter #'+item.id+',[data-sort='+item.id+']').toggle(item.isEnabled);
			})
		if(this.$el.find('.filter').length){
			options.search = _.compactObject(this.filter.toJSON());
		}else{
			options.search = {};
		}
		var pagebuffer = options.pagebuffer || 2;

		if(this.$el.find('[name="search"]').length && this.$el.find('[name="search"]').val().length){
			this.searchAll(this.$el.find('[name="search"]').val());
		}else{
			this.search(options);
		}

		var renderObj = {};
		options.pagecount = Math.ceil(this.lastGrabbed / options.count);
		renderObj.pages = [];

		if(options.page > options.pagecount){
				options.page = options.pagecount || 1;
		}
		var showing = (this.lastGrabbed>(options.count * options.page))? (options.count * options.page) : this.lastGrabbed;

		var newContainer = $('<tbody class="list-group">');
		_.each(this.grab(options), function(model){
			new viewitem({ 'model': model, container: newContainer, summary:summary});
		});
		var container = this.$el.find('.list-group').empty().replaceWith(newContainer);
		var startpage = options.page - pagebuffer;
		if(startpage < 1){startpage = 1}
		var endpage = options.page + pagebuffer;
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

		renderObj.multiPage = (endpage > startpage);
		renderObj.isFirst = (options.page == 1);
		renderObj.isLast = (options.page == options.pagecount);
		renderObj.showLast = (options.pagecount == endpage);
		renderObj.showFirst = (startpage == 1);
		renderObj.checked_count = _.where(this.models, {checked: true}).length;

		renderObj.entries = _.map(options.entries,function(item){
			return {value:item, selected: (item==options.count)}
		},options)

		this.renderObj = renderObj;
		this.$el.find('.paginate-footer').html(templates['table_footer'].render(this.renderObj,templates));
		this.summary.checked_count = _.where(this.models, {checked: true}).length;
		this.summary.multi_checked = (this.summary.checked_count>1);

		this.$el.find('[name="events"]').html(templates['events'].render(this.summary, templates));

		this.fixStyle();

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
		$(e.currentTarget).siblings('[data-sort]').find('i').attr('class', 'fa fa-sort text-muted');
		$(e.currentTarget).addClass('text-primary');
		var sort = _.findWhere(this.options.filterFields, {name: $(e.currentTarget).data('sort')}).search;
		if(options.sort == sort) {
			options.reverse = !options.reverse;
		}else{
			options.reverse = false;
		}
		if(options.reverse) {
			$(e.currentTarget).find('i').attr('class', 'fa fa-sort-asc');
		}else{
			$(e.currentTarget).find('i').attr('class', 'fa fa-sort-desc');
		}
		options.sort = sort;
		this.draw();
	}

	var options = $.extend({count: options.count || 25, page: 1, sort: 'createdAt', reverse: false}, options);
	// var popts = _.partial(Berry.processOpts,_ ,{update:function(){debugger;}})
	// debugger;
	self = this;
	options.schema = _.map(_.map(options.schema, function(item){
		return Berry.processOpts(item,{update:function(options){
			this.item.choices = options.choices; 
			this.item.options = options.choices; 
			var schema = this.self.options.schema;
			_.each(this.self.models,function(model){
				model.schema = schema;
				model.pat();
			})
			this.self.draw();

		}.bind({item:item,self:self}) });
	} ), function(item){
		item.value = item.value || item.default;
		delete item.default;
		return item;
	});

	if(typeof options.filters !== 'undefined'){
		options.filters = _.map(options.filters, Berry.processOpts)
	}
	options.filterFields = _.map($.extend(true, {}, options.filters || options.schema), function(val){
		val = Berry.normalizeItem(val);
		name = val.name;
		switch(val.type){
			case 'textarea':
			case 'contenteditable':
			case 'ace':
			case 'color':
			case 'date':
			case 'number':
			case 'email':
			case 'base64':
				val.type = 'text';
				break;
			case 'checkbox':
				val.choices = [{label: val.falsestate || 'False', value: val.falsestate || 'false'}, {label: val.truestate || 'True', value: val.truestate || 'True'}];
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
		// val.isEnabled = true;
		val.enabled = true;
		return val;
	});
	if(typeof options.columns == 'object'){
			options.filterFields = _.filter(options.filterFields, function(item){
					return (_.contains(options.columns, item.name) || _.contains(options.columns,item.id))
			})
	}

	var summary = {'start':'{{', 'end':'}}',checked_count:0,multi_checked:false,multiEdit:!!options.multiEdit ,'items': _.map(options.filterFields, function(val){
		var name = (val.search|| val.label.split(' ').join('_').toLowerCase());

		if(val.template){
			name = val.template.replace(/{{value}}/gi, '{{attributes.'+ name + '}}');

		}else{
			switch(val.type){
				case 'date':
					name = '<span data-moment="{{attributes.'+name+'}}" data-format="L"></span>'
					break;
				case 'select':
						if(options.inlineEdit){
							name = '<span data-popins="'+name+'"></span>';
						}else{
							name = '{{display.'+ name + '}}'
						}
					break;
				case 'color':
					name = '<div class="btn btn-default" style="background-color:{{attributes.'+name+'}}">{{attributes.'+name+'}}</div> {{attributes.'+name+'}}'
					break;
				default:
					name = '{{attributes.'+ name + '}}'
			}
		}
		return {'isEnabled': (typeof val.showColumn =='undefined' || val.showColumn), 'label': val.label, 'name': name, 'cname': (val.name|| val.label.split(' ').join('_').toLowerCase()), 'id': val.id, 'visible':!(val.type == 'hidden')} 
	})};
	options.hasActions = !!(options.edit || options.delete || options.events);
	options.hasEdit = !!(options.edit);
	options.hasDelete = !!(options.delete);
	options.entries = options.entries || [25, 50 ,100];
	summary.options = options;
	summary.showAdd = !!(options.add);



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
	this.summary = summary;
	var template = Hogan.compile(templates['table'].render(summary, templates));

	function render(){
		return template.render();
	}
	var silentPopulate = function(attributes,fields) {this.each(function(attributes) {if(!this.isContainer) {this.setValue(Berry.search(attributes, this.getPath()));}}, [attributes], this.fields);}

	function handleFiles(table, e) {
		var files = this.files
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
      (function (fileToRead) {
	      var reader = new FileReader();
	      // Read file into memory as UTF-8      
	      reader.readAsText(fileToRead);
	      reader.onload = function (event) {
		      var csv = event.target.result;
		      var temp = CSVToArray(csv);
		      var valid = true;

					$('#myModal').remove();
					var ref = $(templates['modal'].render({title: "Importing CSV ",footer:'<div class="btn btn-danger" data-dismiss="modal">Cancel</div>', body:'<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><span class="sr-only">50% Complete</span></div></div><div class="status">Validating Items...</div>'}));
					ref.modal();
					ref.on('hidden.bs.modal', function () {
		      	this.importing = false;
					}.bind(this));

					var itemCount = temp.length-1;
					var totalProgress = itemCount*2;
					var items = [];
					this.importing = true;
		      for(var i = 1; i<temp.length; i++){
		      	if(!this.importing) return false;
			      var newtemp = {}
			      for(var j in temp[0]){
			      	newtemp[temp[0][j]] = temp[i][j]
			      }
			      var status = table.validate(newtemp);
			      if(!table.validate(newtemp)){valid =false; break;}
			      items.push(status);
						ref.find('.progress-bar').width((i/totalProgress)*100 +'%')
			    }
			    if(valid){
			    	ref.find('.status').html('Adding Items...');
			      for(var i = 0; i<items.length; i++){
			      	if(!this.importing) return false;
				      table.add(items[i]);
							ref.find('.progress-bar').width(((i+itemCount)/totalProgress)*100 +'%')
				    }
			    }else{
			    	ref.find('.btn').html('Done');
			    	ref.find('.status').html('<div class="alert alert-danger">Error in row '+i+ ', failed to validate!</div>')
			    	return;
			    }
		    	ref.find('.status').html('<div class="alert alert-success">Successfully added '+itemCount+ ', rows!</div>')
		    	ref.find('.btn').toggleClass('btn-danger btn-success').html('Done');
		    	ref.find('.progress').hide();
		    	if(typeof table.options.onBulkLoad == 'function'){
						table.options.onBulkLoad();
					}

		    }
	      reader.onerror = function (evt) {
		      if(evt.target.error.name == "NotReadableError") {
		          alert("Canno't read file !");
		      }
		    }
	    })(files[0]);
	    e.currentTarget.value = '';

    } else {
        alert('FileReader is not supported in this browser.');
    }
  }

	function onload($el){
		this.$el = $el;

		if(this.options.columns){
			this.$el.on('click', '#columnEnables label', function(e){
				e.stopPropagation();
				_.findWhere(this.summary.items, {id:e.currentTarget.dataset.field}).isEnabled = e.currentTarget.childNodes[0].checked;
				this.draw();

			}.bind(this));
		}

		this.$el.on('change', '.csvFileInput', _.partial(handleFiles, this));
		this.$el.on('click','[name="bt-upload"]', function(){
			this.$el.find('.csvFileInput').click();
		}.bind(this));

		this.$el.on('click', '[data-event="delete"]', function(e){
				$(e.target).closest('.dropdown-menu').toggle()
				var model = _.findWhere(this.models, {id:e.currentTarget.dataset.id});
				if(confirm("Are you sure you want to delete? \nThis operation can not be undone.\n\n"+ _.values(model.attributes).join('\n') )){
		
					if(typeof this.options.delete == 'function'){
						this.options.delete(model);
					}
					model.delete();
					this.draw();
					this.updateCount(_.where(this.models, {checked: true}).length)
				}
		}.bind(this));

		this.$el.on('click', '[data-event="delete_all"]', function(e){
			  var checked_models = _.where(this.models, {checked: true})
				if (checked_models.length) {
					if(confirm("Are you sure you want to delete "+checked_models.length+" records? \nThis operation can not be undone.\n\n" )){
						_.each(checked_models, function(item){
							if(typeof this.options.delete == 'function'){
								this.options.delete(item);
							}
								item.delete();
						}.bind(this))
						this.draw();
						this.updateCount(_.where(this.models, {checked: true}).length)
					}	
				}

		}.bind(this));

		this.$el.on('click','[data-event].custom-event-all', function(e){
			e.stopPropagation();
			var event = _.findWhere(this.options.events, {name:e.target.dataset.event})

			if(typeof event !== 'undefined' && typeof event.callback == 'function'){
				if(event.multiEdit	&& _.where(this.models, {checked: true}).length >1) {
					_.each(_.where(this.models, {checked: true}), function(model){
						event.callback(model);
					})
				}else{
					event.callback(_.where(this.models, {checked: true})[0]);
				}
				if(typeof event.complete == 'function'){
					event.complete(_.where(this.models, {checked: true}),this);
				}

			}

		}.bind(this));

		this.$el.on('click','[data-event="edit_all"]', function(e){
			e.stopPropagation();
			if(	typeof this.options.multiEdit !== 'undefined' && 
				this.options.multiEdit.length !== 0 &&
				_.where(this.models, {checked: true}).length >1) {

				this.editCommon();

			}else{
				$().berry($.extend(true,{},{name:'modal', legend: '<i class="fa fa-pencil-square-o"></i> Edit', model: _.where(this.models, {checked: true})[0]}, this.options.berry || {} ) ).on('saved', function() {
					if(typeof this.options.edit == 'function'){
						this.options.edit(_.where(this.models, {checked: true})[0]);
					}
					if(typeof this.options.editComplete === 'function'){
						this.options.editComplete(_.where(this.models, {checked: true}), this);
					}
					this.draw();
				}, this)
			}
		}.bind(this));


		this.$el.on('change', '[name="count"]', function(e) {
			options.count = parseInt($(e.currentTarget).val(),10);
			this.draw();
		}.bind(this))

		this.$el.on('input', '[name="search"]', _.debounce(function(e) {
			this.draw();
		}.bind(this), 300));


		if($el.find('.filter').length) {
			this.filter = $el.find('.filter').berry({name:'filter',renderer: 'inline', attributes: this.defaults ,disableMath: true, suppress: true, fields: options.filterFields }).on('change', function(){
				this.$el.find('[name="search"]').val('');
				this.draw();
			}, this);
		}

		this.updateCount =function(count) {
			this.summary.checked_count = count;
			this.summary.multi_checked = (count>1);

			var checkbox = this.$el.find('[data-event="select_all"].fa');

			if(count>0 && count == this.models.length){
				checkbox.attr('class', 'fa fa-2x fa-fw fa-check-square-o');
			}else if(count == 0){
				checkbox.attr('class', 'fa fa-2x fa-fw fa-square-o');
			}else{
				checkbox.attr('class', 'fa fa-2x fa-fw fa-minus-square-o');
			}

		}

		this.$el.on('click', '[data-event="select_all"]', function(e){
			  var checked_models = _.where(this.models, {checked: true})
			  // var checkbox = this.$el.find('[data-event="select_all"].fa');

				if (checked_models.length || this.models.length == 0) {						
					// _.each(checked_models, function(item){item.checked = false;})	
					_.each(checked_models, function(item){item.toggle(false)})			

					// checkbox.attr('class', 'fa fa-fw fa-2x fa-square-o');

				}else{
					_.each(this.filtered, function(item){item.toggle(true)})			

					// if(this.summary.checked_count == this.models.length){
					// 	checkbox.attr('class', 'fa fa-fw fa-2x fa-check-square-o');
					// }else{
					// 	checkbox.attr('class', 'fa fa-fw fa-2x fa-minus-square-o');
					// }
				}		
			  checked_models = _.where(this.models, {checked: true})
			  // this.draw();
				this.updateCount(checked_models.length);

		}.bind(this));


		if(options.data) {
			for(var i in options.data) {
				this.models.push(new tableModel(this, options.data[i]).on('check', function(){
						this.owner.updateCount(_.where(this.owner.models, {checked: true}).length);
						this.owner.$el.find('[name="events"]').html(templates['events'].render(this.owner.summary, templates));
					})
				);
			}
		}

		this.$el.on('click','[data-page]', changePage.bind(this));
		if(options.sort){
			this.$el.on('click','[data-sort]', changeSort.bind(this));
		}
		this.$el.on('click','[name="reset-search"]', function(){
			this.$el.find('[name="search"]').val('');
			options.sort = null;
			this.$el.find('[data-sort]').removeClass('text-primary');
			this.$el.find('[data-sort]').find('i').attr('class', 'fa fa-sort text-muted');
			if(this.filter){
				silentPopulate.call(this.filter, this.defaults)
			}
			this.draw();
		}.bind(this));
		this.$el.on('click','[name="bt-download"]', function(){
			this.getCSV();
		}.bind(this));
		this.$el.find('[data-event="add"]').on('click', function(){
			$().berry($.extend(true,{},{name:'modal', legend: '<i class="fa fa-pencil-square-o"></i> Create New', fields: options.schema}, options.berry || {} )).on('save', function() {
				if(Berries.modal.validate()){
					var newModel = new tableModel(this, Berries.modal.toJSON()).on('check', function() {
						this.updateCount(_.where(this.models, {checked: true}).length);
						this.$el.find('[name="events"]').html(templates['events'].render(this.summary, templates));
					}.bind(this));
					this.models.push(newModel);
					Berries.modal.trigger('saved');
					this.draw();
					this.updateCount(this.summary.checked_count);
					
					if(typeof this.options.add == 'function') {
						this.options.add(newModel);
					}
				}
			}, this)
		}.bind(this));
		this.draw();
	}
	this.validate = function(item){
		var status = false;
		var tempForm = this.$el.find('.hiddenForm').berry({fields: options.schema,attributes:item});
		if(tempForm.validate()){
			status = tempForm.toJSON(); 
		}else{
			console.log('Model not valid');
		}
		tempForm.destroy();
		return status
	}
	this.add = function(item){
		var newModel = new tableModel(this, item);
		var tempForm = this.$el.find('.hiddenForm').berry({fields: options.schema,model:newModel});
		if(tempForm.validate()){

			this.models.push(newModel);
			this.draw();
			
			if(typeof this.options.add == 'function'){
				this.options.add(newModel);
			}
		}else{
			console.log('Model not valid');
		}
		tempForm.destroy();
	}
	this.search = function(options) {
		var ordered = _.sortBy(this.models, function(obj) { return obj.attributes[options.sort]; });
		if(!options.reverse){
			ordered = ordered.reverse();
		}
		filterMap = this.filterMap;
		ordered = _.filter(ordered, function(anyModel) {

			var keep = $.isEmptyObject(options.search);
			for(var filter in options.search) {
					var temp;
					if(_.where(options.filterFields, {id:filter})[0] && typeof _.where(options.filterFields, {id:filter})[0].options == 'undefined') {
						temp = ($.score((anyModel.attributes[this.filterMap[filter]]+'').replace(/\s+/g, " ").toLowerCase(), (options.search[filter]+'').toLowerCase() ) > 0.40);
					}else{
						temp = (anyModel.attributes[this.filterMap[filter]]+'' == options.search[filter]+'')
					}
					keep = temp;
					if(!keep){break;}
			}
			
			return keep;
		})
		this.lastGrabbed = ordered.length;
		this.filtered = ordered;
	}

	this.find = function(search) {
		var keys = _.keys(search)
		return _.filter(this.models, function(anyModel) {
			return _.isEqual(search, _.pick(anyModel.attributes, keys));
		})
	}

	this.searchAll = function(search) {
		//reset sorts and filters
		options.sort = null;
		this.$el.find('[data-sort]').removeClass('text-primary');
		this.$el.find('[data-sort]').find('i').attr('class', 'fa fa-sort text-muted');
		if(this.filter){
			silentPopulate.call(this.filter, this.defaults)
		}

		search = search.toLowerCase()
		//score each model searching each field and finding a total 
		_.map(this.models, function(model){
			model.score = 0;
			for(var filter in options.filterFields) {
				model.score += $.score((model.display[options.filterFields[filter].search]+'').replace(/\s+/g, " ").toLowerCase(), search);
			}
		})

		//sort by score (highet first) and remove models with no score
		this.filtered = _.filter(_.sortBy(this.models, 'score'), function(model) {
				return (model.score > 0);
		}).reverse();

		this.lastGrabbed = this.filtered.length;
	}

	this.fixStyle = function(){
		if(this.options.autoSize){
		try{
		this.$el.find('.table-container > div').css('width', 'auto') 
		this.$el.find('.table-container > div').css('minWidth', 'auto') 
		this.$el.find('.table-container > div').css('height', $(window).height() - $('.table-container > div').offset().top - (88+ this.options.autoSize) +'px');
		_.each(	this.$el.find('.list-group tr:first td'), function(item, index){
			this.$el.find('.table-container > table tr th:visible')[index].style.width = item.offsetWidth+'px';
			this.$el.find('.table-container > table tr th:visible')[index].style.minWidth = item.offsetWidth+'px';

		}.bind(this))

		this.$el.find('.table-container > div').css('width', this.$el.find('.table-container > div table')[0].offsetWidth + 'px') 
		this.$el.find('.table-container > div').css('minWidth', this.$el.find('.table-container > div table')[0].offsetWidth + 'px') 
				}catch(e){}
	}	
	}

	this.grab = function(options) {
		return this.filtered.slice((options.count * (options.page-1) ), (options.count * (options.page-1) ) + options.count)
	};

	this.editCommon = function (){
		if(typeof this.options.multiEdit == 'undefined' || this.options.multiEdit.length == 0){return;}
		var selectedModels = _.where(this.models, {checked: true});
		if(selectedModels.length == 0){ return; }
		//get the attributes from each model
		var temp = _.map(selectedModels,function(item){return item.attributes;})//_.pick(item.attributes;})
		//get the fields that are common between them
		var common_fields = _.filter(this.options.multiEdit, function(item){return _.unique(_.pluck(temp, item)).length == 1});
		//get the schema fields matching from above
		if(common_fields.length == 0) {
					$(templates['modal'].render({title: "Common Field Editor ",footer:'<div class="btn btn-danger" data-dismiss="modal">Done</div>', body:'<div class="alert alert-warning">No eligible fields have been found for editing.</div>'})).modal();
		} else {
			var newSchema = _.filter(this.options.schema, function(item){return common_fields.indexOf(item.name) >= 0})

			$().berry({legend:'Common Field Editor', fields:newSchema, attributes: $.extend(true,{},_.pick(selectedModels[0].attributes, common_fields))}).on('save', function(){
				var newValues = this.toJSON();
				_.map(selectedModels,function(model){
					model.set($.extend(true,{}, model.attributes, newValues));
				})

				this.trigger('close');
			}).on('close', function(){
				bt.draw();
				if(typeof this.options.editComplete === 'function'){
					this.options.editComplete(_.where(this.models, {checked: true}), this);
				}
			}, this )
		}
	}

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
	this.getCSV = function(title){

		this.filterMap
	csvify(
			_.map(this.filtered, function(item){return item.attributes}),
			_.map(
			_.filter(this.summary.items,function(item){return item.isEnabled}) ,function(item){
			return {label:item.label,name:this.filterMap[item.cname]} 

		}),
		title || this.options.title 
)
//		csvify(_.map(this.filtered, function(item){return item.attributes}),_.pluck(this.options.schema, 'name'), title || this.options.title )
	}

	this.$el.find('[name="search"]').focus();

		this.$el.find('.table-container > div').css('overflow', 'auto');

		// $('.table-container > table tbody tr th')[1].style.width = $('.list-group tr:first td')[1].offsetWidth+'px'


// this.$el.find('.table-container > table tr th').resizable() 


		$(window).on('resize orientationChange', this.fixStyle.bind(this));


}



