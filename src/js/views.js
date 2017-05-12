if (!!!templates) var templates = {};
templates["events"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);if(t.s(t.d("options.hasDelete",c,p,1),c,p,0,29,323,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<!-- <div data-event=\"add\" class=\"btn btn-success\"><i class=\"fa fa-pencil-square-o\"></i> New</div> -->");t.b("\n" + i);t.b("	<a href=\"javascript:void(0);\" data-event=\"delete_all\" class=\"btn btn-danger ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};t.b("\" style=\"margin-right:15px\"><i class=\"fa fa-times\"></i> Delete</a>");t.b("\n" + i);});c.pop();}t.b("	<div class=\"btn-group\"role=\"group\" aria-label=\"...\">");t.b("\n");t.b("\n" + i);t.b("	    ");if(t.s(t.d("options.hasEdit",c,p,1),c,p,0,426,685,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<a href=\"javascript:void(0);\" data-event=\"edit_all\" class=\"btn btn-primary ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};if(!t.s(t.f("multiEdit",c,p,1),c,p,1,0,0,"")){if(t.s(t.f("multi_checked",c,p,1),c,p,0,577,585,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("disabled");});c.pop();}};t.b("\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\"><i class=\"fa fa-pencil\"></i> Edit</a>");});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.d("options.events",c,p,1),c,p,0,731,998,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	    	<a href=\"javascript:void(0);\" data-event=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" class=\"custom-event-all btn btn-default ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};if(!t.s(t.f("multiEdit",c,p,1),c,p,1,0,0,"")){if(t.s(t.f("multi_checked",c,p,1),c,p,0,906,914,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("disabled");});c.pop();}};t.b("\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\">");t.b(t.t(t.f("label",c,p,0)));t.b("</a>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("		");if(t.s(t.f("checked_count",c,p,1),c,p,0,1047,1158,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<h5 class=\"range badge alert-info checked_count\" style=\"margin:0 15px;\">");t.b(t.v(t.f("checked_count",c,p,0)));t.b(" item(s) selected</h5>");});c.pop();}t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["mobile_row"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr><td colspan=\"100%\" class=\"filterable\">		");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,70,246,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("\n" + i);t.b(" 	<span style=\"\">");t.b("\n" + i);t.b(" 		<input type=\"checkbox\" ");t.b(t.v(t.f("start",c,p,0)));t.b("#checked");t.b(t.v(t.f("end",c,p,0)));t.b("checked=\"checked\"");t.b(t.v(t.f("start",c,p,0)));t.b("/checked");t.b(t.v(t.f("end",c,p,0)));t.b(" data-event=\"mark\" style=\"margin: 0 8px 0 4px;\">");t.b("\n" + i);t.b("    	</span>");t.b("\n" + i);});c.pop();}t.b(" <div>");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,289,489,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" 	");if(t.s(t.f("visible",c,p,1),c,p,0,304,474,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("isEnabled",c,p,1),c,p,0,318,460,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"row\" style=\"min-width:85px\"><span class=\"col-sm-3\"><b>");t.b(t.v(t.f("label",c,p,0)));t.b("</b></span><span class=\"col-sm-9 col-xs-12\">");t.b(t.t(t.f("name",c,p,0)));t.b("</span></div>");});c.pop();}});c.pop();}t.b("\n" + i);});c.pop();}t.b(" 	</div>");t.b("\n" + i);t.b("</td></tr>");return t.fl(); },partials: {}, subs: {  }});
templates["table"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"well\" style=\"background:#fff\">");t.b("\n" + i);t.b("	<div style=\"height:40px\">");t.b("\n" + i);t.b("		<input type=\"file\" class=\"csvFileInput\" accept=\".csv\" style=\"display:none\">");t.b("\n");t.b("\n" + i);t.b("		<div class=\"hiddenForm\" style=\"display:none\"></div>");t.b("\n" + i);t.b("		<div class=\"btn-group pull-right\" style=\"margin-bottom:10px\" role=\"group\" aria-label=\"...\">");t.b("\n" + i);if(t.s(t.f("showAdd",c,p,1),c,p,0,312,413,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div data-event=\"add\" class=\"btn btn-success\"><i class=\"fa fa-pencil-square-o\"></i> New</div>");t.b("\n" + i);});c.pop();}if(t.s(t.d("options.download",c,p,1),c,p,0,450,613,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn btn-default hidden-xs\" name=\"bt-download\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Download\"><i class=\"fa fa-download\"></i></div>");t.b("\n" + i);});c.pop();}if(t.s(t.d("options.upload",c,p,1),c,p,0,657,814,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn btn-default hidden-xs\" name=\"bt-upload\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Upload\"><i class=\"fa fa-upload\"></i></div>");t.b("\n" + i);});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.d("options.columns",c,p,1),c,p,0,859,1620,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn-group columnEnables\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Display Columns\">");t.b("\n" + i);t.b("			  <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"enables_");t.b(t.v(t.d("options.id",c,p,0)));t.b("\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">");t.b("\n" + i);t.b("			    <i class=\"fa fa-list\"></i>");t.b("\n" + i);t.b("			    <span class=\"caret\"></span>");t.b("\n" + i);t.b("			  </button>");t.b("\n" + i);t.b("			  <ul class=\"dropdown-menu pull-right\" style=\"padding-top:10px\" aria-labelledby=\"enables_");t.b(t.v(t.d("options.id",c,p,0)));t.b("\">");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,1339,1585,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,1358,1565,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			    <li><label data-field=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" style=\"width:100%;font-weight:normal\"><input type=\"checkbox\" ");if(t.s(t.f("isEnabled",c,p,1),c,p,0,1472,1489,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("checked=\"checked\"");});c.pop();}t.b(" style=\"margin: 5px 0 5px 15px;\"> ");t.b(t.v(t.f("label",c,p,0)));t.b("</label></li>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("			  </ul>");t.b("\n" + i);t.b("			</div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("		</div>");t.b("\n");t.b("\n" + i);t.b("		<div name=\"events\" class=\" pull-left\" style=\"margin-bottom:10px\" ></div>");t.b("\n" + i);t.b("		");if(t.s(t.d("options.search",c,p,1),c,p,0,1748,1877,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<input type=\"text\" name=\"search\" class=\"form-control pull-right\" style=\"max-width:300px; margin-right:15px\" placeholder=\"Search\">");});c.pop();}t.b("\n");t.b("\n" + i);t.b("	</div>	");t.b("\n");t.b("\n" + i);if(!t.s(t.d("options.autoSize",c,p,1),c,p,1,0,0,"")){t.b("	<div class=\"paginate-footer\" style=\"overflow:hidden;margin-top:10px;clear:both\"></div>");t.b("\n" + i);};t.b("\n" + i);t.b("	<div class=\"table-container\" style=\"width:100%;overflow:auto\">");t.b("\n" + i);if(t.s(t.d("options.autoSize",c,p,1),c,p,0,2129,3324,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<table class=\"table ");if(!t.s(t.d("options.noborder",c,p,1),c,p,1,0,0,"")){t.b("table-bordered");};t.b("\" style=\"margin-bottom:0px\">");t.b("\n");t.b("\n" + i);t.b("		<thead>");t.b("\n" + i);t.b("		<tr style=\"background:#fff;cursor:pointer\" class=\"noselect\">");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,2336,2475,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<th style=\"width: 60px;min-width:60px;padding: 0 0 0 10px;\"><i data-event=\"select_all\" class=\"fa fa-fw fa-2x fa-square-o\"></i></th>");t.b("\n" + i);});c.pop();}t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,2513,2725,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,2529,2709,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<th data-sort=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\"><h6 style=\"margin: 2px;font-size:13px;white-space: nowrap\">");if(t.s(t.d("options.sort",c,p,1),c,p,0,2635,2673,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<i class=\"fa fa-sort text-muted\"></i> ");});c.pop();}t.b(t.v(t.f("label",c,p,0)));t.b("</h6></th>");});c.pop();}t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("		</tr>		");t.b("\n");t.b("\n" + i);if(t.s(t.d("options.filter",c,p,1),c,p,0,2769,3282,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<tr style=\"background:#fff;\" class=\"filter\">");t.b("\n" + i);t.b("			");if(t.s(t.d("options.hasActions",c,p,1),c,p,0,2843,3115,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<td>");t.b("\n" + i);t.b("			<div name=\"reset-search\" style=\"position:relative\" class=\"btn\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Clear Filters\">");t.b("\n" + i);t.b("				<i class=\"fa fa-filter\"></i>");t.b("\n" + i);t.b("				<i class=\"fa fa-times text-danger\" style=\"position: absolute;right: 5px;\"></i>");t.b("\n" + i);t.b("			</div>");t.b("\n" + i);t.b("			</td>");});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,3153,3261,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,3169,3245,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<td data-inline=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\" style=\"min-width:85px\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\"></td>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("		</tr>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("	</thead>");t.b("\n" + i);t.b("	</table>");t.b("\n" + i);});c.pop();}t.b("\n");t.b("\n" + i);t.b("	<div style=\"min-height:100px\">");t.b("\n" + i);t.b("		<table class=\"table ");if(!t.s(t.d("options.noborder",c,p,1),c,p,1,0,0,"")){t.b("table-bordered");};t.b(" table-striped table-hover dataTable\" style=\"margin-bottom:0px\">");t.b("\n" + i);if(!t.s(t.d("options.autoSize",c,p,1),c,p,1,0,0,"")){t.b("			<thead>");t.b("\n" + i);t.b("				<tr style=\"background:#fff;cursor:pointer\" class=\"noselect\">");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,3652,3795,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("					<th style=\"width: 60px;min-width:60px;padding: 0 0 0 10px;\"><i data-event=\"select_all\" class=\"fa fa-fw fa-2x fa-square-o\"></i></th>");t.b("\n" + i);});c.pop();}t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,3835,4059,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,3853,4041,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("					<th data-sort=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\"><h6 style=\"margin: 2px;font-size:13px;white-space: nowrap\">");if(t.s(t.d("options.sort",c,p,1),c,p,0,3961,3999,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<i class=\"fa fa-sort text-muted\"></i> ");});c.pop();}t.b(t.v(t.f("label",c,p,0)));t.b("</h6></th>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("				</tr>");t.b("\n" + i);if(t.s(t.d("options.filter",c,p,1),c,p,0,4103,4644,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				<tr style=\"background:#fff;\" class=\"filter\">");t.b("\n" + i);t.b("					");if(t.s(t.d("options.hasActions",c,p,1),c,p,0,4181,4463,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<td>");t.b("\n" + i);t.b("					<div name=\"reset-search\" style=\"position:relative\" class=\"btn\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Clear Filters\">");t.b("\n" + i);t.b("						<i class=\"fa fa-filter\"></i>");t.b("\n" + i);t.b("						<i class=\"fa fa-times text-danger\" style=\"position: absolute;right: 5px;\"></i>");t.b("\n" + i);t.b("					</div>");t.b("\n" + i);t.b("					</td>");});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,4503,4619,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,4521,4601,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("					<td data-inline=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\" style=\"min-width:85px\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\"></td>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("				</tr>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("			</thead>");t.b("\n" + i);};t.b("\n" + i);t.b("			<tbody class=\"list-group\">");t.b("\n" + i);t.b("				<tr><td>");t.b("\n" + i);t.b("					<div class=\"alert alert-info\" role=\"alert\">You have no items.</div>");t.b("\n" + i);t.b("				</td></tr>");t.b("\n" + i);t.b("			</tbody>");t.b("\n");t.b("\n" + i);t.b("		</table>");t.b("\n" + i);t.b("	</div>");t.b("\n");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	<div class=\"paginate-footer\" style=\"overflow:hidden;margin-top:10px\"></div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["table_footer"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);if(t.s(t.f("multiPage",c,p,1),c,p,0,21,930,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<nav class=\"pull-right\" style=\"margin-left: 10px;\">");t.b("\n" + i);if(t.s(t.f("size",c,p,1),c,p,0,85,910,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<ul class=\"pagination\" style=\"margin:0\">");t.b("\n" + i);if(!t.s(t.f("isFirst",c,p,1),c,p,1,0,0,"")){t.b("			");if(!t.s(t.f("showFirst",c,p,1),c,p,1,0,0,"")){t.b("<li class=\"pagination-first\"><a data-page=\"1\" href=\"javascript:void(0);\" aria-label=\"First\"><span aria-hidden=\"true\">&laquo;</span></a></li>");};t.b("\n" + i);t.b("			<li><a data-page=\"dec\" href=\"javascript:void(0);\" aria-label=\"Previous\"><span aria-hidden=\"true\">&lsaquo;</span></a></li>");t.b("\n" + i);};if(t.s(t.f("pages",c,p,1),c,p,0,471,571,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				<li class=\"");t.b(t.v(t.f("active",c,p,0)));t.b("\"><a data-page=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" href=\"javascript:void(0);\">");t.b(t.v(t.f("name",c,p,0)));t.b("</a></li>");t.b("\n" + i);});c.pop();}if(!t.s(t.f("isLast",c,p,1),c,p,1,0,0,"")){t.b("			<li><a data-page=\"inc\" href=\"javascript:void(0);\" aria-label=\"Next\"><span aria-hidden=\"true\">&rsaquo;</span></a></li>");t.b("\n" + i);t.b("			");if(!t.s(t.f("showLast",c,p,1),c,p,1,0,0,"")){t.b("<li class=\"pagination-last\"><a data-page=\"\" href=\"javascript:void(0);\" aria-label=\"Last\"><span aria-hidden=\"true\">&raquo;</span></a></li>");};t.b("\n" + i);};t.b("\n" + i);t.b("		</ul>");t.b("\n" + i);});c.pop();}t.b("	</nav>");t.b("\n");t.b("\n" + i);});c.pop();}t.b("	<h5 class=\"range badge ");if(!t.s(t.f("size",c,p,1),c,p,1,0,0,"")){t.b("alert-danger");};t.b(" pull-left\" style=\"margin-right:15px;\">");if(t.s(t.f("size",c,p,1),c,p,0,1048,1097,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("Showing ");t.b(t.v(t.f("first",c,p,0)));t.b(" to ");t.b(t.v(t.f("last",c,p,0)));t.b(" of ");t.b(t.v(t.f("size",c,p,0)));t.b(" results");});c.pop();}if(!t.s(t.f("size",c,p,1),c,p,1,0,0,"")){t.b("No matching results");};t.b("</h5>");t.b("\n" + i);if(t.s(t.d("entries.length",c,p,1),c,p,0,1170,1509,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<span class=\"pull-left\">");t.b("\n" + i);t.b("			<select class=\"form-control\" style=\"display:inline-block;width:auto;min-width:50px\" name=\"count\">");t.b("\n" + i);t.b("			<option value=\"10000\">All</option>");t.b("\n" + i);if(t.s(t.f("entries",c,p,1),c,p,0,1352,1450,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<option value=\"");t.b(t.v(t.f("value",c,p,0)));t.b("\" ");if(t.s(t.f("selected",c,p,1),c,p,0,1395,1414,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("selected=\"selected\"");});c.pop();}t.b(">");t.b(t.v(t.f("value",c,p,0)));t.b("</option>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("			</select>");t.b("\n" + i);t.b("			results per page");t.b("\n" + i);t.b("		</span>");t.b("\n" + i);});c.pop();}t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["table_row"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr class=\"filterable\">		");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,50,1037,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("\n" + i);t.b("	<td style=\"width: 60px;min-width:60px;\">");t.b("\n" + i);t.b("<!-- 		<div class=\"btn-group\">");t.b("\n" + i);t.b("		  <button type=\"button\" class=\"btn btn-xs btn-info go\">Actions</button>");t.b("\n" + i);t.b("		  <button type=\"button\" class=\"btn btn-xs btn-info dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");t.b("\n" + i);t.b("		    <span class=\"caret\"></span>");t.b("\n" + i);t.b("		    <span class=\"sr-only\">Toggle Dropdown</span>");t.b("\n" + i);t.b("		  </button>");t.b("\n" + i);t.b("		  <ul class=\"dropdown-menu dropdown-menu-right\">");t.b("\n" + i);t.b("		    ");if(t.s(t.d("options.hasEdit",c,p,1),c,p,0,512,635,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<li><a href=\"javascript:void(0);\" data-event=\"edit\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\"><i class=\"fa fa-pencil\"></i> Edit</a></li>");});c.pop();}t.b("\n" + i);t.b("		    ");if(t.s(t.d("options.hasDelete",c,p,1),c,p,0,684,810,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<li><a href=\"javascript:void(0);\" data-event=\"delete\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\"><i class=\"fa fa-times\"></i> Delete</a></li>");});c.pop();}t.b("\n" + i);t.b("		  </ul>");t.b("\n" + i);t.b("		</div> -->");t.b("\n" + i);t.b("		<input type=\"checkbox\" ");t.b(t.v(t.f("start",c,p,0)));t.b("#checked");t.b(t.v(t.f("end",c,p,0)));t.b("checked=\"checked\"");t.b(t.v(t.f("start",c,p,0)));t.b("/checked");t.b(t.v(t.f("end",c,p,0)));t.b(" data-event=\"mark\" style=\"margin: 0 8px 0 4px;\">&nbsp;<div class=\"btn-group\">");t.b("\n" + i);t.b("   	</td>");t.b("\n");t.b("\n" + i);});c.pop();}if(t.s(t.f("items",c,p,1),c,p,0,1072,1170,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	");if(t.s(t.f("visible",c,p,1),c,p,0,1086,1156,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("isEnabled",c,p,1),c,p,0,1100,1142,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<td style=\"min-width:85px\">");t.b(t.t(t.f("name",c,p,0)));t.b("</td>");});c.pop();}});c.pop();}t.b("\n" + i);});c.pop();}t.b("</tr>");return t.fl(); },partials: {}, subs: {  }});
