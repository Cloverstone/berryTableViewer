$(function(){
myStack = {
	collection: new itemcollection(data), 
	config: {
	// views:{item:"<div>{{email}}</div>"},
		attributes:{form:[
			{type:"text", name:"title", label:"Title"},
			{type:"select", name:"status", label: "Status", options:[{label:'Started', value:'started'}, {label:'Created', value:'created'}]}

			]}
	}

};

tableBuilder = function(container) {

	this.draw = function(){
		// this.$el.find('.list-group').empty();
		var container = this.$el.find('.list-group');
		container.empty();
		_.each(this.collection.grab(options), function(model){
			new berryDrupeletListView({ 'model': model, container: container});
		});
		var renderObj = _.clone(myStack.config.attributes);

		var showing = (this.collection.length>(options.count * options.page))? (options.count * options.page) : this.collection.length;
		options.pagecount = Math.ceil(this.collection.length / options.count);
		renderObj.pages = [];
		for(var i = 1; i <= options.pagecount; i++){
			var page = {name: i};
			if(options.page == i){
				page.active = 'active';
			}
			renderObj.pages.push(page);
		}
		renderObj.size = this.collection.length;
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

			this.collection = new liveCollection(

			myStack.collection.filter(function(anyModel) {
					var keep = $.isEmptyObject(pageFilter);
					for(var filter in pageFilter) {
						keep = keep || ($.score((anyModel.attributes[filter]+'').replace(/\s+/g, " ").toLowerCase(), (pageFilter[filter]+'').toLowerCase() ) > 0.40);
					}
					return keep;
				})
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
		berryDrupeletListView = berryDrupeletView.extend({view: Hogan.compile(templates['table_row'].render(summary, templates)) });
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
 			new berryDrupeletListView({ 'model': record , container: this.$el.find('.list-group')});
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
	// debugger;
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

(function($) {
  $.score = function(base, abbr, offset) {
    
    //offset = offset || 0 // TODO: I think this is unused... remove
    
    if(abbr.length === 0) return 0.9;
    if(abbr.length > base.length) return 0.0;
    
    for (var i = abbr.length; i > 0; i--) {
      var sub_abbr = abbr.substring(0,i);
      var index = base.indexOf(sub_abbr);
      
      if(index < 0) continue;
      if(index + abbr.length > base.length + offset) continue;
      
      var next_string = base.substring(index+sub_abbr.length);
      var next_abbr = null;
      
      if(i >= abbr.length)
        next_abbr = '';
      else
        next_abbr = abbr.substring(i);
      
      // Changed to fit new (jQuery) format (JSK)
      var remaining_score   = $.score(next_string, next_abbr,offset+index);
      
      if (remaining_score > 0) {
        var score = base.length-next_string.length;
        
        if(index !== 0) {
          //var j = 0;
          
          var c = base.charCodeAt(index-1);
          if(c==32 || c == 9) {
            for(var j=(index-2); j >= 0; j--) {
              c = base.charCodeAt(j);
              score -= ((c == 32 || c == 9) ? 1 : 0.15);
            }
          } else {
            score -= index;
          }
        }
        
        score += remaining_score * next_string.length;
        score /= base.length;
        return score;
      }
    }
    return 0.0;
  };
})(jQuery);

function render(template, data){
	if(typeof templates[template] === 'undefined'){
		if($('#'+template).length > 0){
			templates[template] =  Hogan.compile($('#'+template).html());
			$('#'+template).remove();
		}else{
			return Hogan.compile(template).render(data, templates);	
		}
	}
	if(typeof templates[template] !== 'undefined' && templates[template].length !== 0 ){
 	 return templates[template].render(data, templates);
	}else{
		alert("not found:"+template);
	}
}
	function renderMath(content, scope){
		scope = scope||{};
		var myRegexp = /\[\[\=(.*?)\]\]/g;
	  var match = myRegexp.exec(content);
	  var response = JSON.parse( JSON.stringify( content ) );
//	  var response = content;
	  var temp;
	  while (match != null) {
	  	try{
				temp = math.eval(match[1], scope) ;
			if($.isNumeric(temp)){
//				temp = math.format(temp, (this.precision || 0));
				temp = temp.toFixed(0);
			}
			}catch(e){}
	    response = response.replace(match[0], temp || match[0]);
	    match = myRegexp.exec(content);
	  }
		return response;
	}
	Backbone.Collection.prototype.grab = function(options) {
		var ordered = this.sortBy(options.sort);
		if(!options.reverse){
			ordered = ordered.reverse();
		}
		return ordered.slice((options.count * (options.page-1) ), (options.count * (options.page-1) ) + options.count)
	};





Backbone.LiveView = Backbone.View.extend({
	events:{
		'click [data-event]': 'triggerEvent',
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
		this.$el.replaceWith(this.setElement(renderMath(this.view.render(this.model.attributes , templates), this.model.attributes)).$el);
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
			this.berry = view.berry({ popins: {container: '#content'}, renderer: 'popins', model: this.model});
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
});






//collection.item
berryDrupeletView = Backbone.LiveView.extend({
	events:{
		'click [data-event]': 'triggerEvent',
		'click [data-popins]': 'blockEvent',
		// 'click .btn': 'blockEvent',
		'click': 'conditionalView',
		'click .go': 'viewmodel'
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


liveModel = Backbone.Model.extend({
	urlRoot: '/documents',
	preventSave: false,
  initialize: function(options) {
  	this.attributes.workflow = this.attributes.workflow || this.initial;
		this.attributes[this.attributes.workflow || this.initial] = true;

    this.bind('change', function() {
    	if(!this.preventSave && this.hasChanged() && typeof this.collection !== 'undefined' && !this.hasChanged('_id')) {
    		this.locked = true;

    		var callback = function(){
					this.locked = false;
				};
				if(typeof this.attributes._id == 'undefined'){
					callback = function(stuff){
						this.locked = false;
					};
				}
			 	this.save(this.attributes,{patch: true, wait: true, success: $.proxy(callback,this) });	
			}
		});
	},
});

liveCollection = Backbone.Collection.extend({
		initialize: function(models, options){
			// this.localStorage = new Backbone.LocalStorage(options.config._id)
			this.id = 1;//options.config.id;
		},
		model: liveModel,
		url: '/documents',
});

