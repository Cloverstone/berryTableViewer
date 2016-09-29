function breadBaker(options) {
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

	options.schema = _.map(options.schema, Berry.processOpts);

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

	var summary = {'items': _.map(options.filterFields, function(val){
		var name = (val.search|| val.label.split(' ').join('_').toLowerCase());
		switch(val.type){
			case 'date':
				name = '<span data-moment="{{'+name+'}}" data-format="L"></span>'
				break;
			case 'select':
			    if(options.inlineEdit){
    				name = '<span data-popins="'+name+'"></span>';
			    }else{
    				name = '{{'+ name + '}}'
			    }
				break;
			case 'color':
				name = '<div class="btn btn-default" style="background-color:{{'+name+'}}">{{'+name+'}}</div> {{'+name+'}}'
				break;
			default:
				name = '{{'+ name + '}}'
		}
		return {'label': val.label, 'name': name, 'cname': (val.name|| val.label.split(' ').join('_').toLowerCase()), 'id': val.id, 'visible':!(val.type == 'hidden')} 
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
		this.berry = $el.find('.form').berry({attributes: options,inline:true, actions: false, fields: [{label:'Entries per page', name:'count', type: 'select',default:{label: 'All', value: 100}, options: options.entries || [5,10,15,20] , columns: 2},{label:false,name:"reset",type:'raw',value:'<button name="reset-search" class="btn btn-warning btn-sm" style="margin-top: 30px;">Reset</button>',columns: 2},{label: 'Search', name:'filter', columns: 5, offset: 3, pre: '<i class="fa fa-filter"></i>'}]}).on('change:count', function(){
			$.extend(options, this.berry.toJSON());
			options.count = parseInt(options.count,10);
			this.draw();
		}, this);



		this.filter = $el.find('.filter').berry({name:'filter',renderer: 'inline', attributes: this.defaults ,disableMath: true, suppress: true, fields: options.filterFields }).on('change', function(){
			this.draw();
		}, this);



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


function viewitem(options){

	this.update = function() {
		if(typeof this.berry !== 'undefined'){this.berry.destroy();}

		this.$el.find('[data-event]').off();

		this.$el.replaceWith(this.setElement(this.view.render(this.model.attributes , templates), this.model.attributes).$el);

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
		this.$el.find('[data-event="edit"]').show().on('click', $.proxy(function(){
			$().berry({name:'edit',legend: 'Edit', model:this.model}).on('saved', function() {
				if(typeof this.model.owner.options.edit == 'function'){
					this.model.owner.options.edit(this.model);
				}
				//else if(typeof this.model.owner.options.edit == 'string' && typeof  == 'function' ){
				    
				//}
				this.update();
			}, this)
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


function tableModel (owner, initial) {
	this.owner = owner;
	this.attributes = {};
	this.schema = owner.options.schema;
	this.set = function(newAtts){
		this.attributes = newAtts;
	}
	$.extend(true, this.attributes, this.defaults, initial);
	this.toJSON = function() {return this.attributes}

};

tableModel.prototype.events = {initialize: []};
tableModel.prototype.addSub = Berry.prototype.addSub;
tableModel.prototype.on = Berry.prototype.on;
tableModel.prototype.off = Berry.prototype.off;
tableModel.prototype.trigger = Berry.prototype.trigger;


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

if (!!!templates) var templates = {};
templates["table"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"well\" style=\"background:#fff\">");t.b("\n" + i);t.b("	<div class=\"form\"></div>		");t.b("\n" + i);t.b("	<div class=\"paginate-footer\" style=\"overflow:hidden\"></div>");t.b("\n" + i);t.b("	<div class=\"table-responsive\">");t.b("\n" + i);t.b("	<table class=\"table table-bordered table-striped table-hover dataTable\">");t.b("\n" + i);t.b("		<thead>");t.b("\n" + i);t.b("			<tr style=\"background:#fff;cursor:pointer\" class=\"noselect\">");t.b("\n" + i);t.b("				");if(t.s(t.f("items",c,p,1),c,p,0,326,481,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,338,469,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<th data-sort=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\"><h6 style=\"margin: 2px;font-size:13px;white-space: nowrap\"><i class=\"fa fa-sort\"></i> ");t.b(t.v(t.f("label",c,p,0)));t.b("</h6></th>");});c.pop();}});c.pop();}t.b("\n" + i);t.b("				<th style=\"width: 100px;\">Actions</th>");t.b("\n" + i);t.b("			</tr>				");t.b("\n" + i);t.b("			<tr style=\"background:#fff;\" class=\"filter\">");t.b("\n" + i);t.b("				");if(t.s(t.f("items",c,p,1),c,p,0,610,679,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,622,667,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<td data-inline=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\"></td>");});c.pop();}});c.pop();}t.b("\n" + i);t.b("				<th><button name=\"reset-search\" class=\"btn btn-warning btn-sm\">Reset</button></th>");t.b("\n" + i);t.b("			</tr>");t.b("\n" + i);t.b("		</thead>");t.b("\n" + i);t.b("		<tbody class=\"list-group\">");t.b("\n" + i);t.b("			<tr><td>");t.b("\n" + i);t.b("				<div class=\"alert alert-info\" role=\"alert\">You have no items.</div>");t.b("\n" + i);t.b("			</td></tr>");t.b("\n" + i);t.b("		</tbody>");t.b("\n" + i);t.b("	</table>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);t.b("	<div class=\"paginate-footer\" style=\"overflow:hidden\"></div>");t.b("\n" + i);t.b("<div>");return t.fl(); },partials: {}, subs: {  }});
templates["table_footer"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);t.b("	<nav class=\"pull-right\">");t.b("\n" + i);if(t.s(t.f("size",c,p,1),c,p,0,42,751,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<ul class=\"pagination\" style=\"margin:0\">");t.b("\n" + i);t.b("			<li class=\"pagination-first\"><a data-page=\"1\" href=\"javascript:void(0);\" aria-label=\"First\"><span aria-hidden=\"true\">&laquo;</span></a></li>");t.b("\n" + i);t.b("			<li><a data-page=\"dec\" href=\"javascript:void(0);\" aria-label=\"Previous\"><span aria-hidden=\"true\">&lsaquo;</span></a></li>");t.b("\n" + i);if(t.s(t.f("pages",c,p,1),c,p,0,368,468,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				<li class=\"");t.b(t.v(t.f("active",c,p,0)));t.b("\"><a data-page=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" href=\"javascript:void(0);\">");t.b(t.v(t.f("name",c,p,0)));t.b("</a></li>");t.b("\n" + i);});c.pop();}t.b("			<li><a data-page=\"inc\" href=\"javascript:void(0);\" aria-label=\"Next\"><span aria-hidden=\"true\">&rsaquo;</span></a></li>");t.b("\n" + i);t.b("			<li class=\"pagination-last\"><a data-page=\"\" href=\"javascript:void(0);\" aria-label=\"Last\"><span aria-hidden=\"true\">&raquo;</span></a></li>");t.b("\n");t.b("\n" + i);t.b("		</ul>");t.b("\n" + i);});c.pop();}t.b("	</nav>");t.b("\n" + i);t.b("	<h5 class=\"range\">");if(t.s(t.f("size",c,p,1),c,p,0,797,846,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("Showing ");t.b(t.v(t.f("first",c,p,0)));t.b(" to ");t.b(t.v(t.f("last",c,p,0)));t.b(" of ");t.b(t.v(t.f("size",c,p,0)));t.b(" entries");});c.pop();}if(!t.s(t.f("size",c,p,1),c,p,1,0,0,"")){t.b("No matching entries");};t.b("</h5>");t.b("\n");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["table_row"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr class=\"filterable\">");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,35,82,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	");if(t.s(t.f("visible",c,p,1),c,p,0,49,68,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<td>");t.b(t.t(t.f("name",c,p,0)));t.b("</td>");});c.pop();}t.b("\n" + i);});c.pop();}t.b("	<td style=\"min-width:100px\">");t.b("\n" + i);t.b("		<!-- <div class=\"btn-group\" role=\"group\">");t.b("\n" + i);t.b("			<span class=\"btn btn-xs btn-info\" data-event=\"edit\" href=\"#\">Edit</span>");t.b("\n" + i);t.b("			<span class=\"btn btn-xs btn-danger\" data-event=\"delete\" href=\"#\">Delete</spab>");t.b("\n" + i);t.b("		</div> -->");t.b("\n" + i);t.b("		<!-- Split button -->");t.b("\n" + i);t.b("		<div class=\"btn-group\">");t.b("\n" + i);t.b("		  <button type=\"button\" class=\"btn btn-xs btn-info go\">Go to</button>");t.b("\n" + i);t.b("		  <button type=\"button\" class=\"btn btn-xs btn-info dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");t.b("\n" + i);t.b("		    <span class=\"caret\"></span>");t.b("\n" + i);t.b("		    <span class=\"sr-only\">Toggle Dropdown</span>");t.b("\n" + i);t.b("		  </button>");t.b("\n" + i);t.b("		  <ul class=\"dropdown-menu dropdown-menu-right\">");t.b("\n" + i);t.b("		    <li><a href=\"javascript:void(0);\" data-event=\"edit\"><i class=\"fa fa-pencil\"></i> Edit</a></li>");t.b("\n" + i);t.b("		    <li><a href=\"javascript:void(0);\" data-event=\"delete\"><i class=\"fa fa-times\"></i> Delete</a></li>");t.b("\n" + i);t.b("		  </ul>");t.b("\n" + i);t.b("		</div>");t.b("\n" + i);t.b("	</td>");t.b("\n" + i);t.b("</tr>");return t.fl(); },partials: {}, subs: {  }});
