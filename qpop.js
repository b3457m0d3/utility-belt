(function( $ ) {
  $.fn.qpop = function(text,show){
  /*
  * popover shorthand function:
     -----------------------------------------------------------------------------------------------------------
     @ text (string) - Popover content - [optional] { falls back to data-content or default text if attr not set }
     -----------------------------------------------------------------------------------------------------------
     @ show (boolean) - Show immediately? - [optional] { default = false }
     -----------------------------------------------------------------------------------------------------------

  *    || Accepts a variable list of args (in any order) corresponding to the various options
  *    :================================================================================
  *    : _passing a number will set the delay
  *    : __passing a string beginning with a "+" will set the title
  *    : ___passing a string beginning with a "." or a "#" (denoting a css selector) will set the selector
  *    : _passing any of the following strings will set the placement
  *     _-{ "r","l","t","b","right","left","top" or "bottom"
  *    : __passing any of these will set the trigger
  *     __-{ "c","h","f","m","click","hover","focus" or "manual"
  *    : ___to turn ON html content pass "html"
  *    : _to turn OFF animations pass "!"
  *    : __for special cases ('.input-group's and '.btn-group's) pass body to set the container
  *     __-{ *also helpful when popover would be cut-off inside an element with hidden overflow
  */
  getText = (this.attr("data-content"))?this.data("content"):"Look!";
  text = (typeof text === "undefined")?getText:text;
  show = (typeof show === "undefined") ? false : show;
  var args = Array.prototype.slice.call(arguments, 2);
  var options = {};
  options.content = text;
  if(args.length>0){
    for(var i in args){
      if($.isNumeric(args[i])){
        options.delay = args[i];
      } else if (args[i].indexOf(".")>=0 || args[i].indexOf("#")>=0) {
        options.selector = args[i];
      } else if(args[i].charAt( 0 ) === '+'){
        options.title = args[i].slice( 1 );
      } else {
        switch(args[i]){
          case "r": case "right":  options.placement = "right";  break;
          case "l": case "left":   options.placement = "left";   break;
          case "t": case "top":    options.placement = "top";    break;
          case "b": case "bottom": options.placement = "bottom"; break;
          case "c": case "click":  options.trigger = "click";  break;
          case "h": case "hover":  options.trigger = "hover";  break;
          case "f": case "focus":  options.trigger = "focus";  break;
          case "m": case "manual": options.trigger   = "manual"; break;
          case "!": options.animate = false; break;
          case "html": options.html = true;  break;
          case "body": options.container = 'body';  break;
          case "tip": options.tip = true; break;
        }
      }
    }
  }
  if(options.tip == true){
    this.tooltip(options);
    if(show){
      this.tooltip('show');
    }
  } else {
    this.popover(options);
    if(show){
      this.popover('show');
    }
  }

};
}( jQuery ));
