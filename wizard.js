(function($,_,λ){
	////console.log = function(){};//uncomment this line to turn of //console messages
	$.wiz =  {"h":$("#rootwizard"), "v":$('.acc-wizard')};
	$.btn =  {"prev":$(".button-previous"), "_prev":".button-previous", "next":$(".button-next"), "_next":".button-next" };
	$.form = {"items":$("#form-items"),"garments":$("#garmentForm"),"upload":$("#uploadArtwork"),"info":$("#form-info"),"address":$("#form-address") };
	$.ctrl = {"product":$("#productSelect") };
	$.settings = {};
	$(document).ajaxStart(function(){});
	_.templateSettings = { variable:'data',interpolate: /\{\{=(.+?)\}\}/g, evaluate:/\{\{(.+?)\}\}/g, escape:/\{\{-(.+?)\}\}/g };
	var funcs = _.extend(_.str.exports(),{
		l0g: function(msg){if(_.isNumber(msg)||_.isString(msg)||_.isBoolean(msg)){ console.log(msg); } else if(_.isObject(msg)) _.each(msg,function(val,key){console.log("["+key+"] = "+val); }); else if(_.isArray(msg)) _.each(msg,function(el,i){ console.log("["+i+"] = "+el); }); }
	});
	_.mixin(funcs);
	jQuery.fn.extend({// using a custom plugin library as an api * an underscore prefix indicates that a function is chainable
		formToObj: function(){
			if(this.is('form')){
				var o = {},a = this.serializeArray();
			    $.each(a, function() {
			        if (o[this.name] !== undefined) {
			            if (!o[this.name].push) {
			                o[this.name] = [o[this.name]];
			            }
			            o[this.name].push(this.value || '');
			        } else {
			            o[this.name] = this.value || '';
			        }
			    });
			    return o;
			}
		},
		onBeforeNext: function(e){
			e.preventDefault();
		},
		all:  function(){
			if(this.is($.wiz.h)){ 												//console.log("all - "+$("#wizardTabs li").length);
				return $("#wizardTabs li").length;
			}
		},
		done: function(a){
			if(this.is($.wiz.h)){												//console.log("done - "+$("#wizardTabs li a i").filter(':visible').length);
				return $("#wizardTabs li a i").filter(":visible").length;
			}
		},
		left: function(){
			if(this.is($.wiz.h)){ 												//console.log("left - "+$("#wizardTabs li a i").filter(':hidden').length);
				return $("#wizardTabs li a i").filter(':hidden').length;
			}
		},
		active: function(){
			if(this.is($.wiz.h)){
				var index = Number($("#wizardTabs li.active a").attr("href").match(/\d+$/)[0]);
				if(index>1){
					this._enablePrev();
				}
				this.data("step",index);										console.log("active - "+index);
				return this.data('step');
			}
		},
		current:function(){
			if(this.is($.wiz.h)){
				return this.bootstrapWizard('currentIndex');
			}
		},
		bar:  function(){
			if(this.is($.wiz.h)){
				var done = Number(this.done()), left = Number(this.left()), all = Number(this.all()), per = Math.round(100/all);
				if((done+left) === all){										//console.log("bar - "+(done*per));
					return (done*per);
				} else {
					//console.log('something doesnt add up - done:'+done+' left:'+left+' all:'+all+' per:'+per);
				}
			}
		},
		_bar: function(undo){
			if(this.is($.wiz.h)){
				var bar = $("#bar").find('.progress-bar'), progress = Number(this.bar());
				var w = bar[0].style.width;
				var barW = (w.search('px') > -1) ? w.replace('px','') : w.replace('%','');
																				//console.log("progress-bar-width - "+barW+" - calculated progress - "+progress);
				if(_.isUndefined(undo)){
					if(barW<progress) bar.css({width:progress+'%'});
				} else {
					if(undo) bar.css({width:progress+'%'});
				}
				return this;
			}
		},
		resetBar: function(){
			if(this.is($.wiz.h)){
				$("#bar").find('.progress-bar').css({width:'0%'});
			}
		},
		prev_: function(){
			if(this.is($.wiz.h)){
				var index = Number(this.active()), prev = index-1,
					all = Number(this.all());									//console.log("prev - "+ prev);
				return (index>1)? prev : 1;
			}
		},
		next_: function(){
			if(this.is($.wiz.h)){
				var index = this.active();
				var next = index+1,all = Number(this.all());                    //console.log("next - "+ next);
				return (index<all)? next : all;
			}
		},
		_check: function(hide){
			if(this.is($.wiz.h)){
				if(_.isUndefined(hide) || !_.isBoolean(hide)){
					$("#wizardTabs > li.active > a > i").removeClass("hide");
				} else if(hide){
					$("#wizardTabs > li.active > a > i").addClass("hide");
				}
				return this;
			}
		},
		_finish: function(){
			if(this.is($.wiz.h)){
				if(this.isfinished()){
					console.log("already finished");
				} else {
					this._check()._bar()._enableNext().find(".button-next").qpop("Step "+this.active()+" Complete",true,"left","manual");
					if(!_.contains(this.data('finished'),this.active())){
						this.data('finished').push(this.active());
					}
					console.log('finished: '+_.uniq(this.data('finished')));
					return this;
				}
			}
		},
		_undo:  function(){
			if(this.is($.wiz.h)){
				if(this.isfinished() !== false){
					this._check(true)._bar(true)._disableNext().find(".button-next").popover('destroy');
					this.data('finished').pop();
					return this;
				}
			}
		},
		finished:function(){
			if(this.is($.wiz.h)){
				return this.data("finished");
			}
		},
		isfinished: function(){
			if(this.is($.wiz.h)){
				return _.contains(this.finished(),this.active());
			}
		},
		disable: function(state){
			return this.each(function(){
				var $this = $(this);
				if($this.is('input, button')){
					$this.disabled = state;							   			//console.log("disabled input");
				} else {
					$this.toggleClass('disabled', state);              			//console.log("disabled non input");
				}
			});
		},
		_disableNext: function(){
			if(this.is($.wiz.h) && this.nextenabled()){
				$("#wizardTabs li").eq(this.active()).disable(true);			//console.log("next tab disabled");
				this.find(".button-next").toggleClass('disabled',true);         //console.log("next button disabled");
				this.data('next-enabled',false);
				return this;
			}
		},
		_enableNext: function(){
			if(this.is($.wiz.h)){
				$("#wizardTabs li").eq(this.active()).removeClass('disabled');
				this.find(".button-next").toggleClass('disabled',false);
				this.data('next-enabled',true);									//console.log("next button enabled");
				return this;
			}
		},
		_disablePrev: function(){
			if(this.is($.wiz.h) && this.backenabled()){
				this.find(".button-previous").disable(true);
				this.data('prev-enabled',false);								//console.log("prev button disabled");
				return this;
			}
		},
		_enablePrev: function(){
			if(this.is($.wiz.h)){
				this.find(".button-previous").disable(false);
				this.data('prev-enabled',true);									//console.log("prev button enabled");
				return this;
			}
		},
		backenabled: function(){
			if(this.is($.wiz.h)){
				return this.data('prev-enabled');								//console.log(this.data('prev-enabled'));
			}
		},
		nextenabled: function(){
			if(this.is($.wiz.h)){
				return this.data('next-enabled');								//console.log(this.data('next-enabled'));
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
			'onInit': function(){                                               //console.log("acc-wiz - onInit");
				$(".panel-body").removeClass("hide");

				$(".datepicker").datepicker({format:"yyyy/mm/dd"});
// #items====================================================================================================================================
				$("#form-items").find('button[type=submit]').hide();
// #info====================================================================================================================================
				var tto = {placement:"bottom"};
				$("#form-info").validate({
					rules: {
						fName:"required",lName:"required",
						phone:{required:true,phoneUS:true},email:{required:true,email:true},deadline:{required:true,date:true},
						add1B:"required",cityB:"required",stateB:"required",zipB:{required:true,zipcodeUS:true}

					},
					messages:{
						phone:"Please supply a valid phone number",email:"Please provide a working email address"
					},
					tooltip_options:{
						fName:tto,lName:tto,phone:tto,email:tto,deadline:tto,add1B:tto,cityB:tto,stateB:tto,zipB:tto
					}
				});
				$("#datePicker,#noRush").hide();
				$("#closeDatePicker").click(function(){
					$("#datePicker").hide();
					$("#noRush").show();
				});
				$("#okRush").click(function(){
					$("#noRush").fadeToggle("slow").hide();
					$("#datePicker").show();
				});
				$("#doRush").click(function(){//clicked yes
					$("#rushYesNo").hide();
					$("#datePicker").show();
				});
				$("#dontRush").click(function(){// clicked no
					$("#rushYesNo").hide();
					$("#noRush").show();
				});

// #address====================================================================================================================================
				$("#form-address").find("button[type=submit]").hide();
				$("#pickupAddress,#sameAsBilling,#addressFields").hide();
				$("#form-address").validate({
					rules:{
						add1:"required",city:"required",state:"required",zip:{required:true,zipcodeUS:true}
					},
					tooltip_options:{
						add1:tto,city:tto,state:tto,zip:tto
					}
				});
				$("#pickUp").switchy();
				$('.pick-up').on('click', function(){ $('#pickUp').val($(this).attr('state')).change(); });
				$('#pickUp').on('change', function(){ 					        //console.log("pickUp - changed"+$(this).val());
					var bgColor = '#949494';
					switch($(this).val()){
						case 'pickup':
							var bgColor = '#1085c2';
							$("#pickupAddress").show();
							$("#sameAsBilling,#addressFields").hide();
							$("#form-address").find("button[type=submit]").show();
						break;
						case 'null':
							var bgColor = '#949494';
							$("#pickupAddress,#sameAsBilling,#addressFields").hide();
							$("#form-address").find("button[type=submit]").hide();
						break;
						case 'delivery':
							var bgColor = '#eac120';
							$("#sameAsBilling,#addressFields").show();
							$("#pickupAddress").hide();
							$("#form-address").find("button[type=submit]").show();
						break;
					}
					$('#pickUp').find('.switchy-bar').animate({ backgroundColor: bgColor });
				});
				$("#box3").change(function(){
					if($(this).is(":checked")){
						$("#addressFields").hide();
					} else {
						$("#addressFields").show();
					}
				});


// #review====================================================================================================================================
				$("#sendQuote").click(function(){
					var submitData = $.extend({},{"items":$.form.items.data('items')},$.form.info.data('info'),$.form.address.data('address'));
					$.post("http://syrscreenprinting.com/pages/sendQuote.php",submitData,function(data){
						$("#sendQuoteStatus").html(data);
					});
				});

			},
			'beforeNext': function(parent,panel){                               //console.log("acc-wiz - beforeNext");
				switch(panel.id){
					case "items": break;
					case "info":
						if(!$.form.info.valid()){
							$('body').onBeforeNext();
						} else $.form.info.data('info',$.form.info.formToObj());
					break;
					case "address":
						if(!$.form.address.valid()){
							$('body').onBeforeNext();
						} else $.form.address.data('address',$.form.address.formToObj());
					break;
				}
			},
			'onNext': function(parent,panel){                              		//console.log("acc-wiz - onNext");
				//
			},
			'beforeBack': function(parent,panel){                          		//console.log("acc-wiz - beforeBack");
				//
			},
			'onBack': function(parent,panel){                              		//console.log("acc-wiz - onBack");
				//
			},
			'onLast': function(parent,panel){                                 	//console.log("acc-wiz - onLast");
				//
			}
		});
	});
	$.wiz.h.bootstrapWizard({
		'nextSelector': $.btn._next,
		'previousSelector': $.btn._prev,
		'onInit': function(){ 	    										  	//console.log("modal-wiz - onInit");
			$.wiz.h.active();
			$.wiz.h._disableNext();                                           	//console.log("modal-wiz - next disabled");
			$._ = {
				"co":_.template($("script.co").html()),
			    "li":_.template($("script.li").html()),
				"tr":_.template($("script.tr").html()),
				"qi":_.template($("script.qi").html()),
			};
			$(document).keydown(function(e){								  	//console.log("modal-wiz - setup arrow keys");
				if($.wiz.h.backenabled() && e.which == 37){
					$.btn.prev.click();   								  		//console.log("modal-wiz - left key");
				}
				if($.wiz.h.nextenabled() && e.which == 39){
					$.btn.next.click();    								  		//console.log("modal-wiz - right key");
				}
			});
// #tab1=========================================================================================================================
			$.tab1 = $("#tab1"), $.productSelect = $("#productSelect"), $.other = $("#otherInput"), $.oin = $("#other-input"),
			$.img = $("#tab5 img.product"); $.product = $("#tab5 .product-text")

			$.productSelect.imagepicker({
				initialized:function(){  										//console.log("productSelect - initialize");
					$.other.hide();
				},
				selected:function(options){ 									//console.log("productSelect - selected");
					$.opt = $.productSelect.find("option:selected");
					if(options.value() == 9){									//console.log("productSelect - selected 'other'");
						$.other.show().find("input").focus().keydown(function(e){
							if(e.which == 13){
								$.product.html($.oin.val());
								$.img.attr("src",$.opt.data("img-src"));
								$.other.hide();
								$.wiz.h._finish();
							}
						});
					} else if(options.value()>0 && options.value() != 9){       //console.log("productSelect - product selected -NOT 'other'");
						$.other.hide();
						$.product.html($.opt.text());
						$.img.attr("src",$.opt.data("img-src"));
						$.wiz.h._finish();
					}
				},
				changed:function(oldVal,newVal){      							//console.log("productSelect - changed from "+Number(oldVal)+" to "+Number(newVal));
					newVal = Number(newVal);
					if(newVal>0 && newVal !== 9){								//console.log('finish');
						$.opt = $.productSelect.find("option:selected");
						$.other.hide();
						$.product.html($.opt.text());
						$.img.attr("src",$.opt.data('img-src'));
						$.wiz.h._finish();
					} else if(newVal<1){										//console.log('undo');
						$.product.html('');
						$.wiz.h._undo();
					}
				}
			});
			$("#brandPref").keypress(function(){ $("#brand-pref").html($(this).val()); });
			$("#blendPref").keypress(function(){ $("#blend-pref").html($(this).val()); });
// #tab2====================================================================================================================================
			$.tab2 = $("#tab2");
			$("#pr,#noArtwork,#hasArtwork").hide();
			$("#hasArt").switchy();
			$('.has-art').on('click', function(){ $('#hasArt').val($(this).attr('state')).change(); });
			$('#hasArt').on('change', function(){ 					            //console.log("hasArt - changed"+$(this).val());
				var bgColor = '#949494';
				switch($(this).val()){
				    case 'yes':
						var bgColor = '#1085c2';
						$("#pr").show();
						$("#noArtwork,#noState,#hasArtwork").hide();
					break;
			        case 'null':
						var bgColor = '#949494';
						$("#noState").show();
						$("#noArtwork,#pr,#hasArtwork").hide();
					break;
					case 'no':
						var bgColor = '#eac120';
						$("#noArtwork").show();
						$("#pr,#noState,#hasArtwork").hide();
					break;
			    }
				$('#hasArt').find('.switchy-bar').animate({ backgroundColor: bgColor });
			});
			$("[rel=popover]").popover();
			$("#printReady").switchy();
			$('.print-ready').on('click', function(){ $('#printReady').val($(this).attr('state')).change(); });
			$('#printReady').on('change', function(){ 				            //console.log("printReady - changed - "+$(this).val());
				var bgColor = '#949494';
				switch($(this).val()){
					case 'yes':
						var bgColor = '#1085c2';
						$("#hasArtwork").show();
						$.tab2.data('vector',true);
					break;
					case 'null':
						var bgColor = '#949494';
						$("#hasArtwork").hide();
						$.tab2.data('vector',null);
					break;
					case 'no':
						var bgColor = '#eac120';
						$("#hasArtwork").show();
						$.tab2.data('vector',false);
					break;
				}
				$('#printReady').find('.switchy-bar').animate({ backgroundColor: bgColor });
			});
			$("#noArt").click(function(){  										//console.log("custom design - clicked");
				$("#tab2").data('art','Custom Design Requested');
				$("#designServices").removeClass("hide");
				$.wiz.h._finish();
			});
			$(".hideAlert").click(function(){
				$(this).parent('.alert').addClass('hide');
			});
			$("#uploadArtwork").ajaxForm({ target: "#output", resetForm: false, clearForm: false,
			    beforeSend: function(arr,$form,options) { 						//console.log("uploadForm - beforeSend");
			        if(λ.File && λ.FileReader && λ.FileList && λ.Blob) {
						var fileInput = document.querySelector("#Fileinput");
						var files = fileInput.files;// FileList object
							for (var i in files) {
								var size = files[i].size, type = files[i].type;
								switch(type){
									case'image/svg+xml':case'image/png':case'image/gif':case'image/jpg':case'image/jpeg':case'image/pjpeg':case'application/pdf':
									case "application/x-zip-compressed": break;
									default:
										$("body").uploaderror("File(s) must be in svg,png,gif,jpeg,pdf or zip format");
										return false;
									break;
								}
								if(size>5242880){
									$("body").uploaderror("File(s) should be less than 5 MB");
									return false;
								}
							}
					} else {
						$("body").uploaderror("Looks like it's time to upgrade your browser.");
						return false;
					}
				},
				success: function() { 											//console.log("uploadForm - success");
					$('.zip').html();
					//get images from preview pane for review tab, then reset the form
					var images = $(".file-preview .file-preview-frame img");
					if(images.length>0){
						images.each(function(){
							$("#uploadGallery").append($("<img/>").attr("src",$(this).attr('src')));
						});
						$("#uploadGallery,#controls").removeClass("hide");
					}
					$("#Fileinput").fileinput('clear');
					$.wiz.h._finish();
				}
			});
// #tab3====================================================================================================================================
			$.tab3 = $("#tab3");
			$("#location").on("focus", function(){
				$("#addLocation").on("click",function(){ 						//console.log("addLocation - submitted location");
					if($("#location").val().length>0){
						$.tab3.data('location', $("#location").val());
						if($("#location").val().search(",")>-1){
							var locations = $("#location").val().split(",");
							_.each(locations, function(num){
								$("#locationsList").append("<li><i class='fa fa-map-marker'></i> "+num+"</li>");
							});
						} else {
							$("#locationsList").append("<li><i class='fa fa-map-marker'></i> "+$("#location").val()+"</li>");
						}
						$.wiz.h._finish();
					}
				});
				$(this).keypress(function(e){
					if(e.which == 13){
						$("#addLocation").click();								//console.log('hit enter');
					}
				});
			});
// #tab4====================================================================================================================================
			//add gildan colors
			var colors = { "colors": { "white":7229,"black":6418 } };
			$(".selectpicker").selectpicker({width:"150px",size:8}).append($._.co(colors)).selectpicker("refresh");
			$(".icon-ok").hide();

			$("#garmentForm").find("input[type='text']").keypress(function(e){
				var k=e.which;
				if(k!=0 && k!=8 && k!=13 && (k<48 || k>57)){
					$(this).toggleClass("field-error",true);					//console.log("garmentForm - only numbers allowed");
					return false;
				} else if(k == 13){
					 $("#addGarment").click();
				} else {
					$(this).toggleClass("field-error", false);
				}
			});
			$("#addGarment").click(function(){									//console.log("addGarment - submitted colors and sizes");
				var  sizes = [];
				$("#garmentForm").find("input[type=text]").each(function(){
					sizes.push($(this).val());
				});																//console.log("sizes: "+JSON.stringify(sizes));
				var garmentData = {
					"color":  $('select.selectpicker option:selected').text(),
					"swatch": $('select.selectpicker option:selected').data('content').split("> ")[0]+">",
					"total":  _.reduce(sizes, function(memo, num){ return memo + Number(num); }, 0),
					"sizes":  sizes
				};
																				//console.log(garmentData);
				if($("#garmentList > li:first").hasClass('empty')){ $("#garmentList").empty(); }
				var liHtml = $._.li(garmentData), trHtml = $._.tr(garmentData);
																				//console.log(liHtml);
				if($("#garmentList > li #"+garmentData.color).length<1){		//console.log("adding to the list");
					$("#garmentList").append(liHtml);
					$("#colorsAndSizes").append(trHtml);
				} else {
					$("#"+garmentData.color).replaceWith(liHtml);
					$("#colorsAndSizes > tr."+garmentData.color).replaceWith(trHtml);
				}																//console.log("addGarment - garment added");
				$.wiz.h._finish();
			});
// #tab5====================================================================================================================================
			$("#addToQuote").click(function(){
				var cAndS = [];
				$("#colorsAndSizes > tr").each(function(){
					if(!_.isEmpty($(this).data())){
						cAndS.push($(this).data());
					} $(this).removeData();
				});
				var $itemData = $("#form-items").data('items'), _id = (_.isEmpty($itemData))?0:$itemData.length,
					$id = {
						"id": _id, "product": $.product.html(), "brand":  $("#brand-pref").html(),"blend":  $("#blend-pref").html(),
						"vect": $.tab2.data('vector'), "art": $.tab2.data('art'), "qtys": cAndS, "loc": $.tab3.data('location'), "notes": $("#notes").val()
					};
				console.log($id);
				$.form.items.data('items').push($id);
				if($("#listOfItems").hasClass('empty')){
					$(".empty-block").hide();
					$("#listOfItems").removeClass("empty");
				}
				$($._.qi($id)).appendTo("#listOfItems");							//console.log("addToQuote - added to quote");
				$("#form-items").find('button[type=submit]').show();
				$("[rel=tooltip]").tooltip({placement:"bottom"});
				$("#addItem").modal("hide");
				//go back through the wizard and clear each step
				$.wiz.h.bootstrapWizard('first');
				$.wiz.h.resetBar();
				//tab1
				$.productSelect.val("").data('picker').sync_picker_with_select();
				$("#brandPref,#blendPref,#other-input").val("");
				//tab2
				$("#hasArt").val("null").change();
				$("#printReady").val("null").change();
				$(".hideAlert").click();
				$("#Fileinput").fileinput('clear');
				//tab3
				$("#location").val('');
				//tab4
				$('#garmentForm').clearForm();
				$(".selectpicker").selectpicker("refresh");
				$(".icon-ok").hide();
				$("#garmentList").html('<li class="empty"></li>');
				$("#garmentList > li.empty").html('<i class="flaticon3-delivery30 text-primary"></i> Add colors / sizes & quantities above.');
				//tab5
				$("#product-text,#brand-pref,#blend-pref").html("");
				$("#tab5 img.product").removeAttr("src");
				$("#uploadGallery,#locationList,#colorsAndSizes").empty();
				$("#uploadGallery,#controls").addClass("hide");
				$("#notes").val("");
				$("#wizardTabs li").each(function(){
					$(this).addClass('disabled');
					$(this).find('a > i').addClass('hide');
				});
			});
		},
		'onShow': function(){													//console.log("modal-wiz - onShow");

		},
		'onTabClick': function(tab,navigation,index){							//console.log("modal-wiz - onTabClick");
			return false;
		},
		'onTabShow': function(tab,navigation,index){							//console.log("modal-wiz - onTabShow");
			$("input[type=text]:first").focus();
		},
		'onTabChange': function(tab,navigation,index){							//console.log("modal-wiz - onTabClick");

		},
		'onFirst': function(tab,navigation,index){								//console.log("modal-wiz - onFirst");

		},
		'onLast': function(tab,navigation,index){								//console.log("modal-wiz - onLast");

		},
		'onNext': function(tab,navigation,index){ 								//console.log("modal-wiz - onNext");
			$.wiz.h.find($.btn._next).popover('destroy');
			if($.wiz.h.isfinished()){
				console.log("boom");
			} else {
				console.log("already finished");
				return false;
			}
		}
	});

})(jQuery,_,window);
