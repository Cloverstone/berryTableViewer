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
