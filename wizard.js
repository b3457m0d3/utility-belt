function onBeforeNext(e){ e.preventDefault(); }
(function($,_,λ){
	$.wiz =  {"h":$("#rootwizard"), "v":$('.acc-wizard')};
	$.btn =  {"prev":$(".button-previous"), "_prev":".button-previous", "next":$(".btn._next"), "_next":".button-next" };
	$.form = {"items":$("#form-items"),"garments":$("#garmentForm"),"upload":$("#uploadArtwork"),"info":$("#form-info"),"address":$("#form-address") };
	$.ctrl = {"product":$("#productSelct") };
	$(document).ajaxStart(function(){});
	_.templateSettings = { variable:'data',interpolate: /\{\{=(.+?)\}\}/g, evaluate:/\{\{(.+?)\}\}/g, escape:/\{\{-(.+?)\}\}/g };
	var funcs = _.extend(_.str.exports(),{
		l0g: function(msg){if(_.isNumber(msg)||_.isString(msg)||_.isBoolean(msg))console.log(msg);else if(_.isObject(msg)) _.each(msg,function(val,key){console.log("["+key+"] = "+val); }); else if(_.isArray(msg)) _.each(msg,function(el,i){ console.log("["+i+"] = "+el); }); }
	}); _.mixin(funcs);
	jQuery.fn.extend({// using a custom plugin library as an api * an underscore prefix indicates that a function is chainable
		formToObj: function(){ if(this.is('form')){ var o = {}; var a = this.serializeArray(); $.each(a,function(){ if(_.isUndefined(o[this.name])){ if(!o[this.name].push){o[this.name] = [o[this.name]];} o[this.name].push(this.value || ''); } else o[this.name] = this.value || ''; }); return o; } },
		_inputsum: function(){ if(this.is('form')) sum = 0; this.find('input[type=text]').each(function(){ sum+=Number($(this).val()); }); return this; },
		all:  function(){ if(this.is($.wiz.h)) return $("#wizardTabs li").length; },
		done: function(a){ if(this.is($.wiz.h)) return (_.isUndefined(a))?$("#wizardTabs li a i").filter(":visible").length:this.data('finished'); },
		left: function(){ if(this.is($.wiz.h)) return $("#wizardTabs li a.disabled").length; },
		active: function(){if(this.is($.wiz.h)) this.data("step",$("#wizardTabs li.active a").attr("href").match(/\d+$/)[0]); return this.data('step'); },
		bar:  function(){ if(this.is($.wiz.h)) var done = this.done(), left = this.left(), all = this.all(), per = Math.round(100/all); if((done+left) === all) return done*per; },
		_bar: function(){ if(this.is($.wiz.h)) var bar = this.find('.progress-bar').css('width'), progress = this.bar(); if(bar<progress){ this.data('progress', progress).find('.progress-bar').css({width:progress+'%'}); } return this; },
		prev: function(){ if(this.is($.wiz.h)) return (this.active()>1)? this.active()-1 : 1; },
		next: function(){ if(this.is($.wiz.h)) return (this.active()<this.all())? this.active()+1 : this.all(); },
		_check: function(hide){ if(this.is($.wiz.h)) if(_.isUndefined(hide)) $("#wizardTabs li").eq(this.active()).find('i').removeClass("hide"); else if(hide){ $("#wizardTabs li").eq(this.active()).find('i').addClass("hide"); }	return this; },
		_finish: function(){ if(this.is($.wiz.h)) this.check().bar().enableNext(); this.find(".button-next").qpop("Step "+(this.next())+" Complete",true,"left","manual"); return this; },
		_undo:  function(){ if(this.is($.wiz.h)) this.check(true).bar().disableNext(); this.find($.btn._next).popover('destroy'); return this; },
		isfinished: function(){ if(this.is($.wiz.h)) return ($("#wizardTabs li").eq(this.active()).find('i').hasClass("hide"))?false:true; },
		disable: function(state){ return this.each(function() { var $this = $(this); if($this.is('input, button')) $this.disabled = state; else $this.toggleClass('disabled', state); }); },
		_disableNext: function(){ if(this.is($.wiz.h)) $("#wizardTabs li").eq(this.next()).disable(true); this.find($.btn._next).disable(true).data('next-enabled',false); return this; },
		_enableNext: function(){ if(this.is($.wiz.h)) $("#wizardTabs li").eq(this.next()).disable(false); this.find($.btn._next).disable(false).data('next-enabled',true); return this; },
		backenabled: function(){ if(this.is($.wiz.h)) return !$.btn.prev.is(":disabled"); },
		nextenabled: function(){ if(this.is($.wiz.h)) return !$.btn.next.is(":disabled"); },
		uploaderror: function(msg){ $("#output").html(msg); $("#uploadAlert").removeClass("hide"); return false; }
	});
	$(λ).load(function(){
		$.wiz.v.accwizard({
			'onInit': function(){ var tto = {placement:"bottom"}
				$.form.info.validate({ rules: { fName:"required",lName:"required",phone:{required:true,phoneUS:true},email:{required:true,email:true},add1B:"required",cityB:"required",stateB:"required",zipB:{required:true,zipUS:true}},messages:{phone:"Please supply a valid phone number",email:"Please provide a working email address"},tooltip_options:{fName:tto,lName:tto,phone:tto,email:tto,add1B:tto,cityB:tto,stateB:tto,zipB:tto}});
				$.form.address.validate({rules:{ add1:"required",city:"required",state:"required",zip:{required:true,zipUS:true} },tooltip_options:{add1:tto,city:tto,state:tto,zip:tto} });
			},
			'beforeNext': function(parent,panel){ switch(panel.id){ case "items": break; case "info":if(!$.form.info.valid()){ onBeforeNext(); $.form.info.focusInvalid();} else $.form.info.data('info',$.form.info.formToObj()); break; case "address": if(!$.form.address.valid()){ onBeforeNext(); $.form.address.focusInvalid(); } else $.form.address.data('address',$.form.address.formToObj()); break; } },
			'onNext': function(parent,panel){},
			'beforeBack': function(parent,panel){},
			'onBack': function(parent,panel){},
			'onLast': function(parent,panel){}
		});
	});
	$.wiz.h.bootstrapWizard({ 'nextSelector': $.btn._next, 'previousSelector': $.btn._prev,
		'onInit': function(){ $.wiz.h.disableNext();
			$(document).keydown(function(e){ switch(e.which){ case 37:if($.wiz.h.backenabled()) $.btn.prev.click(); break; case 39:if($.wiz.h.nextenabled()) $.btn.next.click(); break; } });
// #tab1========================================================================
			$.ctrl.product.imagepicker({
				initialized:function(){ $("#otherInput").hide(); },
				clicked:function(options){},
				selected:function(options){ var $other=$("#otherInput"),opt=$.ctrl.product.find("option:selected"),tab1=$("#tab1").data(),img=$("img.product"); if(opt.val()==9){$other.show();$other.find("input").focus().keydown(function(e){if(e.which==13){tab1.product=$(this).val();img.attr("src",opt.data("img-src"));$other.hide();$.wiz.h._finish();}}); } else if(opt.val()>0&&opt.val()!=9)$other.hide(); },
				changed:function(ov,nv){
					var opt = $.ctrl.product.find("option:selected"), tab1 = $("#tab1").data(), img = $("img.product");
					if(nv>0 && nv!==9){ tab1.product=opt.text(); img.attr("src",opt.data('img-src')); $.wiz.h._finish(); return; }
					if(ov>0 && nv<1){ tab1.product = null; $.wiz.h._undo(); return; }
				}
			});
// #tab2========================================================================
			$("#pr,#noArtwork,#hasArtwork").hide(); $("#hasArt").switchy();
			$('.has-art').on('click', function(){ $('#hasArt').val($(this).attr('state')).change(); });
			$('#hasArt').on('change', function(){ var bgColor = '#949494';
				switch($(this).val()){ case 'yes':  bgColor = '#1085c2'; $("#pr").show(); $("#noArtwork,#noState,#hasArtwork").hide(); break;
			        case 'null': bgColor = '#949494'; $("#noState").show(); $("#noArtwork,#pr,#hasArtwork").hide(); break;
					case 'no':   bgColor = '#eac120'; $("#noArtwork").show(); $("#pr,#noState,#hasArtwork").hide(); break;
			    } $('#hasArt').find('.switchy-bar').animate({ backgroundColor: bgColor });
			}); $("[rel=popover]").popover(); $("#printReady").switchy();
			$('.print-ready').on('click', function(){ $('#printReady').val($(this).attr('state')).change(); });
			$('#printReady').on('change', function(){ var bgColor = '#949494';
				switch($(this).val()){ case 'yes':  bgColor = '#1085c2'; $("#hasArtwork").show(); $("#tab2").data('vector',true); break;
					case 'null': bgColor = '#949494'; $("#hasArtwork").hide(); $("#tab2").data('vector',null); break;
					case 'no':   bgColor = '#eac120'; $("#hasArtwork").show(); $("#tab2").data('vector',false);break;
				} $('#printReady').find('.switchy-bar').animate({ backgroundColor: bgColor });
			});	$("#noArt").click(function(){ $("#tab2").data('art','Custom Design Requested'); $.wiz.h._finish(); });
			$.form.upload.ajaxForm({ target: "#output", resetForm: false, clearForm: false,
			    beforeSend: function(arr,$form,options) {
			        if(λ.File && λ.FileReader && λ.FileList && λ.Blob) { var files = $form.files; // FileList object
						if(files.length>0){
							for (var i in files) { var size = files[i].size, type = files[i].type;
								switch(type){ case 'image/svg+xml': case 'image/png': case 'image/gif': case 'image/jpeg': case 'image/pjpeg': case 'application/pdf':
									case 'application/x-zip-compressed':  break; default: $.form.upload.uploaderror("File(s) must be in svg,png,gif,jpeg,pdf or zip format"); break;
								} if(size>5242880) $.form.upload.uploaderror("File(s) should be less than 5 MB");
							}
						}
					} else $.form.upload.uploaderror("Looks like it's time to upgrade your browser.");
			    }, success: function() { $("#tab2").data('art',$('.zip').html()); $.wiz.h._finish(); }
			});
// #tab3========================================================================
			if($("#location").val().length>0){
				$("#addLocation").removeClass('disabled').on('click',function(){ $("#tab3").data('location', $("#location").val()); $.wiz.h._finish(); });
				$("#location").keypress(function(e){ if(e.which == 13) $("#addLocation").click(); }); }
// #tab4========================================================================
			$(".selectpicker").selectpicker();
			$.form.garments.find("input[type='text']").keypress(function(e){ var k=e.which; if(k!=8 && k!=0 && (k<48 || k>57)){ $(this).toggleClass("field-error",true); return false; } else if(k == 13) $("#addGarment").click(); else $(this).toggleClass("field-error", false); });
			$("#addGarment").click(function(){
				var _li = _.template($("script.li").html()), _tr = _.template($("script.tr").html()), garmentData = {
					"color":  $('select.selectpicker option:selected').text(),
					"swatch": $('select.selectpicker option:selected').data('content'),
					"total":  $.form.garments.data('total'),
					"sizes":  _.map(Array(6), function(){ return 0; })
				}; $.form.garments.find("input[type=text]").each(function(i){ garmentData.sizes[i] = $(this).val(); });
			});
// #tab5========================================================================
			$("#addToQuote").click(function(){ var cAndS = [], _qi = _.template($("script.qi").html());
				$.each($("#colorsAndSizes tr"), function(){ if(!_.isEmpty($(this).data())){ cAndS.push($(this).data()); } $(this).removeData(); });
				var tab1 = $("#tab1").data(), tab2 = $("#tab2").data(), tab3 = ("#tab3").data(), $itemData = $.form.items.data('items'), _id = (_.isEmpty($itemData))?0:$itemData.length,
				$id = {"id":_id,"product":tab1.product,"brand":tab1.brand,"blend":tab1.blend,"vect":tab2.vector,"art":tab2.art,"qtys":cAndS,"loc":tab3.location,"notes":$("#notes").val() };
				$.form.items.data('items').push($id); $("#listOfItems").append(_qi($id));
			});
		},
		'onShow': function(){},
		'onTabClick': function(tab,navigation,index){},
		'onTabShow': function(tab,navigation,index){ $.wiz.h.active(); $("input[type=text]:first").focus(); },
		'onFirst': function(tab,navigation,index){},
		'onLast': function(tab,navigation,index){},
		'onNext': function(tab,navigation,index){ $.wiz.h.find($.btn._next).popover('destroy'); if(!$.wiz.h.isfinished($.wiz.h.active())) $.wiz.h._disableNext(); }
	});
})(jQuery,_,window);
