function onBeforeNext(e){
	e.preventDefault();
}
(function($,_){
	$.wiz = $("#rootwizard");
	$._wiz = $('.acc-wizard');
	$.btn = {"prev":$(".button-previous"),"next":$(".button-next")};
	$(document).ajaxStart(function(){

	});
	_.templateSettings = { variable:'data',interpolate: /\{\{=(.+?)\}\}/g, evaluate:/\{\{(.+?)\}\}/g, escape:/\{\{-(.+?)\}\}/g };
	var funcs = _.extend(_.str.exports(),{
		l0g: function(msg){
			if(_.isNumber(msg) || _.isString(msg) || _.isBoolean(msg)) console.log(msg);
			else if(_.isObject(msg)) _.each(msg, function(value,key,list){ console.log("["+key+"] = "+value); });
			else if(_.isArray(msg))  _.each(msg, function(element,index,list){ console.log("["+index+"] = "+element); });
		}
	});
	_.mixin(funcs);
	jQuery.fn.extend({
		//form helpers
		formToObj: function(){
			if(this.is('form')){
				var o = {}, a = this.serializeArray();
				$.each(a, function() { if (_.isUndefined(o[this.name])) {
						if (!o[this.name].push) o[this.name] = [o[this.name]];
						o[this.name].push(this.value || '');
					} else o[this.name] = this.value || '';
				}); return o;
			}
		},
		sumFields: function(){
			if(this.is('form')) var sum = 0; this.find('input[type=text]').each(function(){ sum += Number($(this).val()); });
		},
		// steps
		all: function(){
			if(this.is()) return $("#wizardTabs li").length;
		},
		done: function(array){
			if(this.is($.wiz)) return (_.isUndefined(array)) ? $("#wizardTabs li a i").filter(":visible").length : this.data('finished');
		},
		left: function(){
			if(this.is($.wiz)) return $("#wizardTabs li a.disabled").length;
		},
		active: function(){
			if(this.is($.wiz)){
				this.data("step",$("#wizardTabs li.active a").attr("href").match(/\d+$/)[0];);
				return this.data('step');
			}
		},
		barCalc: function(){
			var done = this.done(), left = this.left(), all = this.all(), per = Math.round(100/all);
			if((done+left) === all) return done*per;
		},
		// progress bar
		bar: function(){
			if(this.is($.wiz)){
				var bar = this.find('.progress-bar').css('width'), progress = this.barCalc();
				if(bar<progress) this.data('progress', progress).find('.progress-bar').css({width:progress+'%'});
			}
		},
		prev: function(){
			if(this.is($.wiz)) return (this.data('step')>1)? this.data('step')-1 : 1;
		},
		next: function(){
			if(this.is($.wiz)) return (this.data('step')<this.all())? this.data('step')+1 : this.all();
		},
		check: function(hide){
			if(this.is('#rootwizard')){
				if(_.isUndefined(hide)) $("#wizardTabs li").eq(this.active()).find('i').removeClass("hide");
				else if(hide) $("#wizardTabs li").eq(this.active()).find('i').addClass("hide");
			}
		},
		finish: function(){
			if(this.is('#rootwizard')){
				this.addFinished();
				this.check();
				this.setProgress();
				this.enableNext();
				this.find(".button-next").qpop("Step "+(this.next())+" Complete",true,"left","manual");
			}
		},
		undo: function(){
			if(this.is('#rootwizard')){
				this.removeFinished();
				this.check(true);
				this.setProgress(this.);
				this.disableNext();
				this.find(".button-next").popover('destroy');
			}
		},
		isfinished: function(){
			if(this.is($.wiz)) return $("#wizardTabs li").eq(this.active()).find('i').hasClass("hide");
		},
		// disabling things
		disable: function(state) {
			return this.each(function() {
				var $this = $(this);
				if($this.is('input, button')) $this.disabled = state;
				else $this.toggleClass('disabled', state);
			});
		},
		disableNext: function(){
			if(this.is($.wiz)){
				$("#wizardTabs li").eq(this.next()).disable(true);
				this.find(".button-next").disable(true).data('next-enabled',false);
			}
		},
		// enabling things
		enableNext: function(){
			if(this.is($.wiz)){
				$("#wizardTabs li").eq(this.next()).disable(false);
			    this.find(".button-next").disable(false).data('next-enabled',true);
			}
		},
		prevOn: function(){
			if(this.is('#rootwizard')) return !$.prev.is(":disabled");
		},
		nextOn: function(){
			if(this.is('#rootwizard')) return !$.next.is(":disabled");
		}
	});
	$(window).load(function(){
		$._wiz.accwizard({
			'onInit': function(){
				var tto = {placement:"bottom"}
				$("#form-info").validate({
					rules: {
						fName: "required",
						lName: "required",
						phone: {required:true,phoneUS:true},
						email: {required:true,email:true},
						add1B: "required",
						cityB: "required",
						stateB: "required",
						zipB: {required:true,zipUS:true}
					},
					messages: {phone: "Please supply a valid phone number",email:"Please provide a working email address"},
					tooltip_options: {fName:tto,lName:tto,phone:tto,email:tto,add1B:tto,cityB:tto,stateB:tto,zipB:tto}
				});
				$("#form-address").validate({
					rules: {
						add1: "required",
						city: "required",
						state: "required",
						zip: {required:true,zipUS:true}
					},
					tooltip_options: {add1: tto,city: tto,state: tto,zip: tto}
				});
			},
			'beforeNext': function(parent,panel){
				var id = panel.id;
				if(id == "items"){
				} else if(id == "info"){
					if(!$("#form-info").valid()){
						onBeforeNext();
						$("#form-info").focusInvalid();
					} else $("#form-info").data('info',$("#form-info").formToObj());
				} else if(id == "address"){
					if(!$("#form-address").valid()){
						onBeforeNext();
						$("#form-address").focusInvalid();
					} else $("#form-address").data('address',$("#form-address").formToObj());
				}
			},
			'onNext': function(parent,panel){

			},
			'beforeBack': function(parent,panel){

			},
			'onBack': function(parent,panel){

			},
			'onLast': function(parent,panel){

			}
		});
	});

	$.wiz.bootstrapWizard({
		'nextSelector': '.button-next',
		'previousSelector': '.button-previous',
		'onInit': function(){
			$('#wizardTabs li').hasClass('disabled').find('a').on('click', function(e) { e.preventDefault(); });
			$.wiz.disableNext();
			$(document).keydown(function(e){
				switch(e.which){
					case 37: if($.wiz.prevOn()) $.btn.prev.click(); break;
					case 39: if($.wiz.nextOn()) $.btn.next.click(); break;
				}
			});
			// #tab1
			$("#productSelect").imagepicker({
				initialized:function(){
					$("#otherInput").hide();
				},
				clicked:function(options){},
				selected:function(options){
					if($("#productSelect option:selected").val() == 9){
						$("#otherInput").show();
						$("#other-input").focus().keydown(function(e){
							if(e.which == 13){
								$("#tab1").data('product',$(this).val());
								$("#tab5 img.product").attr("src",$("#productSelect option:selected").data("img-src"));
								$("#otherInput").hide();
								$.wiz.finish();
							}
						});
					} else if($("#productSelect option:selected").val()>0 && $("#productSelect option:selected").val() != 9){
						$("#otherInput").hide();
					}
				},
				changed:function(oldVal,newVal){
					var $option = $("#productSelect option:selected"), $other = $("#otherInput");
					if(newVal>0 && newVal !== 9){ // if anything was selected except other
						$("#tab1").data("product",$option.text());
						$("#tab5 img.product").attr("src",$option.data('img-src'));
						$.wiz.finish();
						return;
					}
					if(oldVal>0 && newVal<1){ // if a product was selected and then un-selected
						$("#tab1").data('product',null);
						$.wiz.undo();
						return;
					}
				}
			});
			// #tab2
			$("#pr,#noArtwork,#hasArtwork").hide();
			$("#hasArt").switchy();
			$('.has-art').on('click', function(){ $('#hasArt').val($(this).attr('state')).change(); });
			$('#hasArt').on('change', function(){
			    var bgColor = '#949494';
				switch($(this).val()){
				    case 'yes':
						bgColor = '#1085c2';
						$("#pr").show();
						$("#noArtwork,#noState,#hasArtwork").hide();
					break;
			        case 'null':
						bgColor = '#949494';
						$("#noState").show();
						$("#noArtwork,#pr,#hasArtwork").hide();
					break;
					case 'no':
						bgColor = '#eac120';
						$("#noArtwork").show();
						$("#pr,#noState,#hasArtwork").hide();
					break;
			    }
			    $('#hasArt').find('.switchy-bar').animate({ backgroundColor: bgColor });
			});
			$("[rel=popover]").popover();
			$("#printReady").switchy();
			$('.print-ready').on('click', function(){ $('#printReady').val($(this).attr('state')).change(); });
			$('#printReady').on('change', function(){
				var bgColor = '#949494';
				switch($(this).val()){
					case 'yes':  bgColor = '#1085c2'; $("#hasArtwork").show(); $("#tab2").data('vector',true); break;
					case 'null': bgColor = '#949494'; $("#hasArtwork").hide(); $("#tab2").data('vector',null); break;
					case 'no':   bgColor = '#eac120'; $("#hasArtwork").show(); $("#tab2").data('vector',false);break;
				}
				$('#printReady').find('.switchy-bar').animate({ backgroundColor: bgColor });
			});
			$("#noArt").click(function(){
				$("#tab2").data('art','Custom Design Requested');
				$.wiz.finish();
			});
			$("#uploadArtwork").ajaxForm({
				target: "#output",
				resetForm: false,
				clearForm: false,
			    beforeSend: function(arr,$form,options) {
			        if (window.File && window.FileReader && window.FileList && window.Blob) {
						var files = $form.files; // FileList object
						if(files.length>0){
							for (var i in files) {
								var size = files[i].size, type = files[i].type;
								switch(type){
									case 'image/svg+xml': case 'image/png': case 'image/gif': case 'image/jpeg': case 'image/pjpeg': case 'application/pdf':
									case 'application/x-zip-compressed':  break;
									default:
										$("#output").html("File(s) must be in svg,png,gif,jpeg,pdf or zip format");
										$("#uploadAlert").removeClass("hide");
										return false;
									break;
								}
							    if(size>5242880){
									$("#output").html("File(s) should be less than 5 MB");
									$("#uploadAlert").removeClass("hide");
									return false;
								}
							}
						}
					} else {
					    $("#output").html("Looks like it's time to upgrade your browser.");
						$("#uploadAlert").removeClass("hide");
						return false;
					}
			    },
			    success: function() {
					//get the image data from the preview pane and put it in the 5th tab
					$.wiz.finish();
			    }
			});
			// #tab3
			if($("#location").val().length>0){
				$("#addLocation").removeClass('disabled').on('click',function(){
					$("#tab3").data('location', $("#location").val());
					$.wiz.finish();
				});
				$("#location").keypress(function(e){ if(e.which == 13) $("#addLocation").click(); });
			}
			// #tab4
			$(".selectpicker").selectpicker();
			$("#addGarment").click(function(){
				$(this)
				var _li = _.template($("script.li").html()), _tr = _.template($("script.tr").html()), garmentData = {
					"color":  $('select.selectpicker option:selected').text(),
					"swatch": $('select.selectpicker option:selected').data('content'),
					"total":  $("#garmentForm").data('total'),
					"sizes":  _.map(Array(6), function(){ return 0; })
				};
				$("#garmentForm").find("input[type=text]").each(function(i){
					garmentData.sizes[i] = $(this).val();
				});
			});
			// #tab5
			$("#addToQuote").click(function(){
				var cAndS = [], _qi = _.template($("script.qi").html());
				$.each($("#colorsAndSizes tr"), function(){
					if(!_.isEmpty($(this).data())) cAndS.push($(this).data());
					$(this).removeData();
				});
				var $itemData = $("#form-items").data('items'), _id = (_.isEmpty($itemData))?0:$itemData.length, $id = {
					"id":      _id,
					"product": $("#tab1").data('product'),
					"brand":   $("#tab1").data('brand'),
					"blend":   $("#tab1").data('blend'),
					"vect":    $("#tab2").data('vector'),
					"art":     $("#tab2").data('art'),
					"qtys":    cAndS,
					"loc":     $("#tab3").data('location'),
					"notes":   $("#notes").val()
				};
				$("#form-items").data('items').push($id);
				$("#listOfItems").append(_qi($id));
			});
		},
		'onShow': function(){
			//
		},
		'onTabClick': function(tab,navigation,index){
			//return false;
		},
		'onTabShow': function(tab,navigation,index){
			$.wiz.active();
			$("input[type=text]:first").focus();
		},
		'onFirst': function(tab,navigation,index){
			//
		},
		'onLast': function(tab,navigation,index){
			//
		},
		'onNext': function(tab,navigation,index){
			$.wiz.find(".button-next").popover('destroy');
			if(!$.wiz.isfinished($.wiz.active())){
				$.wiz.disableNext();
			}
		}
	});

})(jQuery,_);
