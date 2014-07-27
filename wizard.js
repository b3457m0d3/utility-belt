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
	});
	_.mixin(funcs);
	jQuery.fn.extend({// using a custom plugin library as an api * an underscore prefix indicates that a function is chainable
		formToObj: function(){
			if(this.is('form')){
				var o = {}; var a = this.serializeArray();
				$.each(a,function(){
					if(_.isUndefined(o[this.name])){
						if(!o[this.name].push){
							o[this.name] = [o[this.name]];
						} o[this.name].push(this.value || '');
					} else o[this.name] = this.value || '';
				});
				return o;
			}
		},
		_inputsum: function(){
			if(this.is('form')){
				sum = 0;
				this.find('input[type=text]').each(function(){
					sum+=Number($(this).val());
				});
				return this;
			}
		},
		all:  function(){
			if(this.is($.wiz.h)){ 										console.log("all - "+$("#wizardTabs li").length);
				return $("#wizardTabs li").length;
			}
		},
		done: function(a){
			if(this.is($.wiz.h)){										console.log("done - "+$("#wizardTabs li a i").filter(':visible').length);
				return $("#wizardTabs li a i").filter(":visible").length;
			}
		},
		left: function(){
			if(this.is($.wiz.h)){ 										console.log("left - "+$("#wizardTabs li a i").filter(':hidden').length);
				return $("#wizardTabs li a i").filter(':hidden').length;
			}
		},
		active: function(){
			if(this.is($.wiz.h)){
				var index = Number($("#wizardTabs li.active").find('a').attr("href").match(/\d+$/)[0]);
				this.data("step",index);								console.log("active - "+index);
				return this.data('step');
			}
		},
		bar:  function(){
			if(this.is($.wiz.h)){
				var done = Number(this.done()), left = Number(this.left()), all = Number(this.all()), per = Math.round(100/all);
				if((done+left) === all){								console.log("bar - "+(done*per));
					return (done*per);
				} else {

				}
			}
		},
		_bar: function(){
			if(this.is($.wiz.h)){
				var bar = Number(this.find('.progress-bar').css('width')), progress = Number(this.bar());
				if(bar<progress){										console.log("progress-bar-width - "+bar+" - calculated progress - "+progress);
					this.find('.progress-bar').css({width:progress+'%'});
				}
				return this;
			}
		},
		prev_: function(){
			if(this.is($.wiz.h)){
				var index = Number(this.active()), prev = index-1,
					all = Number(this.all());							console.log("prev - "+ prev);
				return (index>1)? prev : 1;
			}
		},
		next_: function(){
			if(this.is($.wiz.h)){
				var index = Number(this.active()), next = index+1,
				    all = Number(this.all());							console.log("next - "+ next);
				return (index<all)? next : all;
			}
		},
		_check: function(hide){
			if(this.is($.wiz.h)){
				if(_.isUndefined(hide) || hide === false){
					$("#wizardTabs > li.active > a > i").removeClass("hide");
				} else if(hide){
					$("#wizardTabs > li.active > a > i").addClass("hide");
				}
				return this;
			}
		},
		_finish: function(){
			if(this.is($.wiz.h)){
				this._check()._bar()._enableNext().find(".button-next").qpop("Step "+(this.next())+" Complete",true,"left","manual");
				return this;
			}
		},
		_undo:  function(){
			if(this.is($.wiz.h)){
				this.check(true).bar()._disableNext().find($.btn._next).popover('destroy');
				return this;
			}
		},
		isfinished: function(){
			if(this.is($.wiz.h))
				return ($("#wizardTabs li").eq(this.active()).find('i').hasClass("hide"))?false:true;
		},
		disable: function(state){
			return this.each(function(){
				var $this = $(this);
				if($this.is('input, button')) $this.disabled = state;
				else $this.toggleClass('disabled', state);
			});
		},
		_disableNext: function(){
			if(this.is($.wiz.h)){
				$("#wizardTabs li").eq(this.next_()).disable(true);
				this.find($.btn._next).disable(true).data('next-enabled',false);
				return this;
			}
		},
		_enableNext: function(){
			if(this.is($.wiz.h)){
				var next = Number(this.next_());
				next = (next > 0)?next-1:
				$("#wizardTabs li").eq(next-1).removeClass('disabled');
				this.find($.btn._next).disable(false).data('next-enabled',true);
				return this;
			}
		},
		backenabled: function(){
			if(this.is($.wiz.h)){
				var disabled = $.wiz.h.find("button:disabled");
				if(disabled.length>0){
					disabled.each(function(){
						if($(this).is('.button-previous')){					console.log("backenabled - false");
							return false;
						} else {											console.log("backenabled - true");
							return true;
						}
					});
				}
			}
		},
		nextenabled: function(){
			if(this.is($.wiz.h)){
				var disabled = $.wiz.h.find("button:disabled");
				if(disabled.length>0){
					disabled.each(function(){
						if($(this).is('.button-next')){ 					console.log("nextenabled - false");
							return false;
						} else {											console.log("nextenabled - true");
							return true;
						}
					});
				}
			}
		},
		uploaderror: function(msg){
			$("#output").html(msg);
			$("#uploadAlert").removeClass("hide");
			return false;
		}
	});
	$(λ).load(function(){
		$.wiz.v.accwizard({
			'onInit': function(){                                         console.log("acc-wiz - onInit");
				var tto = {placement:"bottom"};
				$("#form-info").validate({
					rules: {
						fName:"required",lName:"required",phone:{required:true,phoneUS:true},email:{required:true,email:true},add1B:"required",cityB:"required",stateB:"required",zipB:{required:true,zipUS:true}
					},
					messages:{
						phone:"Please supply a valid phone number",email:"Please provide a working email address"
					},
					tooltip_options:{
						fName:tto,lName:tto,phone:tto,email:tto,add1B:tto,cityB:tto,stateB:tto,zipB:tto
					}
				});
				$("#form-address").validate({
					rules:{
						add1:"required",city:"required",state:"required",zip:{required:true,zipUS:true}
					},
					tooltip_options:{
						add1:tto,city:tto,state:tto,zip:tto
					}
				});
			},
			'beforeNext': function(parent,panel){                         console.log("acc-wiz - beforeNext");
				switch(panel.id){
					case "items": break;
					case "info":
						if(!$.form.info.valid()){
							onBeforeNext(); $.form.info.focusInvalid();
						} else $.form.info.data('info',$.form.info.formToObj());
					break;
					case "address":
						if(!$.form.address.valid()){
							onBeforeNext(); $.form.address.focusInvalid();
						} else $.form.address.data('address',$.form.address.formToObj());
					break;
				}
			},
			'onNext': function(parent,panel){                              console.log("acc-wiz - onNext");

			},
			'beforeBack': function(parent,panel){                          console.log("acc-wiz - beforeBack");

			},
			'onBack': function(parent,panel){                              console.log("acc-wiz - onBack");

			},
			'onLast': function(parent,panel){                                 console.log("acc-wiz - onLast");

			}
		});
	});
	$.wiz.h.bootstrapWizard({
		'nextSelector': $.btn._next,
		'previousSelector': $.btn._prev,
		'onInit': function(){ 												  console.log("modal-wiz - onInit");
			$.wiz.h.active();
			$(document).keydown(function(e){								  console.log("modal-wiz - setup arrow keys");
				switch(e.which){
					case 37:if($.wiz.h.backenabled()){ $.btn.prev.click(); }  console.log("modal-wiz - left key");  break;
					case 39:if($.wiz.h.nextenabled()){ $.btn.next.click(); }  console.log("modal-wiz - right key"); break;
				}
			});
// #tab1=========================================================================================================================
			$.tab1 = $("#tab1"), $.productSelect = $("#productSelect"), $.other = $("#otherInput"),
			$.img = $("#tab5 img.product"), $.opt = $("#productSelect > option:selected");

			$.productSelect.imagepicker({
				initialized:function(){  									console.log("productSelect - initialize");
					$.other.hide();
				},
				clicked:function(options){  								console.log("productSelect - clicked");
				},
				selected:function(options){ 								console.log("productSelect - selected");
/*  */				if($.opt.val()==9){
						$.other.show().find("input").focus().keydown(function(e){   console.log("productSelect - selected 'other'");
							if(e.which==13){
								$.tab1.data('product',$(this).val());
								$.img.attr("src",$.opt.data("img-src"));
								$.other.hide();
								$.wiz.h._finish();
							}
						});
					} else if($.opt.val()>0 && $.opt.val()!=9){              console.log("productSelect - product selected -NOT 'other'");
						$.other.hide();
					}
				},
				changed:function(oldVal,newVal){      										console.log("productSelect - changed from "+oldVal+" to "+newVal);
					if(newVal>0 && newVal!==9){
						$.tab1.data("product",$.opt.text());
						$.img.attr("src",$.opt.data('img-src'));
						$.wiz.h._finish();
						return;
					}
					if(oldVal>0 && newVal<1){
						$.tab1.data('product', null);
						$.wiz.h._undo();
						return;
					}
				}
			});
// #tab2====================================================================================================================================
			$.tab2 = $("#tab2");
			$("#pr,#noArtwork,#hasArtwork").hide();
			$("#hasArt").switchy();
			$('.has-art').on('click', function(){ $('#hasArt').val($(this).attr('state')).change(); });
			$('#hasArt').on('change', function(){ 					console.log("hasArt - changed"+$(this).val());
				var bgColor = '#949494';
				switch($(this).val()){
				    case 'yes':  bgColor = '#1085c2'; $("#pr").show(); $("#noArtwork,#noState,#hasArtwork").hide(); break;
			        case 'null': bgColor = '#949494'; $("#noState").show(); $("#noArtwork,#pr,#hasArtwork").hide(); break;
					case 'no':   bgColor = '#eac120'; $("#noArtwork").show(); $("#pr,#noState,#hasArtwork").hide(); break;
			    }
				$('#hasArt').find('.switchy-bar').animate({ backgroundColor: bgColor });
			});
			$("[rel=popover]").popover();
			$("#printReady").switchy();
			$('.print-ready').on('click', function(){ $('#printReady').val($(this).attr('state')).change(); });
			$('#printReady').on('change', function(){ 				console.log("printReady - changed - "+$(this).val());
				var bgColor = '#949494';
				switch($(this).val()){
					case 'yes':  bgColor = '#1085c2'; $("#hasArtwork").show(); $("#tab2").data('vector',true); break;
					case 'null': bgColor = '#949494'; $("#hasArtwork").hide(); $("#tab2").data('vector',null); break;
					case 'no':   bgColor = '#eac120'; $("#hasArtwork").show(); $("#tab2").data('vector',false);break;
				}
				$('#printReady').find('.switchy-bar').animate({ backgroundColor: bgColor });
			});
			$("#noArt").click(function(){  							console.log("custom design - clicked");
				$("#tab2").data('art','Custom Design Requested');
				$.wiz.h._finish();
			});
			$("#uploadArtwork").ajaxForm({ target: "#output", resetForm: false, clearForm: false,
			    beforeSend: function(arr,$form,options) { 			console.log("uploadForm - beforeSend");
			        if(λ.File && λ.FileReader && λ.FileList && λ.Blob) {
						var fileInput = document.querySelector("#Fileinput");
						var files = fileInput.files;// FileList object
							for (var i in files) {
								var size = files[i].size, type = files[i].type;
								switch(type){
									case 'image/svg+xml': case 'image/png': case 'image/gif': case 'image/jpeg': case 'image/pjpeg': case 'application/pdf':
									case 'application/x-zip-compressed':  break;
									default: $("body").uploaderror("File(s) must be in svg,png,gif,jpeg,pdf or zip format"); break;
								}
								if(size>5242880) $("body").uploaderror("File(s) should be less than 5 MB");
							}
					} else $("body").uploaderror("Looks like it's time to upgrade your browser.");
				},
				success: function() { 								console.log("uploadForm - success");
					$("#tab2").data('art',$('.zip').html());
					$.wiz.h._finish();
				}
			});
// #tab3====================================================================================================================================
			if($("#location").val().length>0){
				$("#addLocation").click(function(){ 				console.log("addLocation - submitted location");
					$("#tab3").data('location', $("#location").val());
					$.wiz.h._finish();
				});
				$("#location").keypress(function(e){
					if(e.which == 13)  $("#addLocation").click();
				});
			}
// #tab4====================================================================================================================================
			$(".selectpicker").selectpicker();
			//add gildan colors
			$("#garmentForm").find("input[type='text']").keypress(function(e){
				var k=e.which;
				if(k!=0 && k!=8 && k!=13 && (k<48 || k>57)){
					$(this).toggleClass("field-error",true);		console.log("garmentForm - only numbers allowed");
					return false;
				} else if(k == 13){
					 $("#addGarment").click();
				} else $(this).toggleClass("field-error", false);
			});
			$("#addGarment").click(function(){						console.log("addGarment - submitted colors and sizes");
				var _li = _.template($("script.li").html()), _tr = _.template($("script.tr").html()),
				garmentData = {
					"color":  $('select.selectpicker option:selected').text(),
					"swatch": $('select.selectpicker option:selected').data('content'),
					"total":  $.form.garments.data('total'),
					"sizes":  _.map(Array(6), function(){ return 0; })
				};
				$("#garmentForm").find("input[type=text]").each(function(i){ garmentData.sizes[i] = $(this).val(); });
				if($("#garmentList > li:first").is('.empty')) $("#listOfItems").empty();
				if($("#garmentList > li #"+garmentData.color).length>0){
					$("#"+garmentData.color).replaceWith(_li(garmentData));
					$("#colorsAndSizes > tr."+garmentData.color).replaceWith(_tr(garmentData));
				} else {
					$("#garmentList").append(_li(garmentData));
					$("#colorsAndSizes").append(_tr(garmentData));
				}														console.log("addGarment - garment added");
			});
// #tab5====================================================================================================================================
			$("#addToQuote").click(function(){
				var cAndS = [], _qi = _.template($("script.qi").html());
				$("#colorsAndSizes > tr").each(function(){
					if(!_.isEmpty($(this).data())){
						cAndS.push($(this).data());
					} $(this).removeData();
				});
				var $itemData = $("#form-items").data('items'), _id = (_.isEmpty($itemData))?0:$itemData.length,
					$id = {
						"id":     _id,
						"product":tab1.data('product'),
						"brand":  tab1.data('brand'),
						"blend":  tab1.data('blend'),
						"vect":   tab2.data('vector'),
						"art":    tab2.data('art'),
						"qtys":   cAndS,
						"loc":    tab3.data('location'),
						"notes":  $("#notes").val()
					};
				$("#form-items").data('items').push($id);
				if($("#listOfItems > li:first").is('.empty')) $("#listOfItems").empty();

				$(_qi($id)).appendTo("#listOfItems");				console.log("addToQuote - added to quote");
			});
		},
		'onShow': function(){										console.log("modal-wiz - onShow");

		},
		'onTabClick': function(tab,navigation,index){				console.log("modal-wiz - onTabClick");
			return false;
		},
		'onTabShow': function(tab,navigation,index){				console.log("modal-wiz - onTabShow");

			$("input[type=text]:first").focus();
		},
		'onFirst': function(tab,navigation,index){					console.log("modal-wiz - onFirst");

		},
		'onLast': function(tab,navigation,index){					console.log("modal-wiz - onLast");

		},
		'onNext': function(tab,navigation,index){ 					console.log("modal-wiz - onNext");
			$.wiz.h.find($.btn._next).popover('destroy');
			if(!$.wiz.h.isfinished($.wiz.h.active()))
				$.wiz.h._disableNext();
		}
	});

})(jQuery,_,window);
