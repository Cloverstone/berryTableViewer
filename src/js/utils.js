
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


csvify = function(data, labels){
this.labels = labels;

  var csv = '"'+labels.join('","')+'"\n';
  csv += _.map(data,function(d){
      return JSON.stringify(_.values(_.pick(d,labels)))
  },this)
  .join('\n') 
  .replace(/(^\[)|(\]$)/mg, '')



  // var encodedUri = encodeURI(csv);
  // var encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  var link = document.createElement("a");
  link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  link.setAttribute("download", "customers.csv");
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link); 
}
