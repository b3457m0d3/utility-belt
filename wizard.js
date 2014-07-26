function onBeforeNext(e){
	e.preventDefault();
}
(function($,_){
	$('body').on('click', 'a.disabled', function(e) {
		e.preventDefault();
	});
	$(document).ajaxStart(function(){

	});
	_.templateSettings = { variable:'data',interpolate: /\{\{=(.+?)\}\}/g, evaluate:/\{\{(.+?)\}\}/g, escape:/\{\{-(.+?)\}\}/g };
	var funcs = _.extend(_.str.exports(),{
		l0g: function(msg){
			if(_.isNumber(msg) || _.isString(msg) || _.isBoolean(msg)){
				console.log(msg);
			} else if(_.isArray(msg) || _.isObject(msg)){
				_.each(_.toArray(msg), function(element,index,list){
					console.log("["+index+"] = "+element);
				});
			}
		}
	});
	_.mixin(funcs);
	jQuery.fn.extend({
		disable: function(state) {
			return this.each(function() {
				var $this = $(this);
				if($this.is('input, button')) this.disabled = state;
				else $this.toggleClass('disabled', state);
			});
		},
		formToObj: function(){
			if(this.is('form')){
				var o = {}, a = this.serializeArray();
				$.each(a, function() {
					if (o[this.name] !== undefined) {
						if (!o[this.name].push) o[this.name] = [o[this.name]];
						o[this.name].push(this.value || '');
					} else o[this.name] = this.value || '';
				});
				return o;
			}
		},
		getProgress: function(){
			if(this.is("#rootwizard")) return this.data('progress');
		},
		setProgress: function(percent){
			if(this.is("#rootwizard")){
				this.data('progress', percent);
				this.find('.progress-bar').css({width:percent+'%'});
			}
		},
		totalSteps: function(){
			if(this.is("#rootwizard")) return $("#wizardTabs li").length;
		},
		finishedSteps: function(array){
			if(this.is("#rootwizard")) return (_.isUndefined(array) || array == false)? this.data('finished').length : this.data('finished');
		},
		remainingSteps: function(){
			if(this.is("#rootwizard")) return $("#wizardTabs li a.disabled").length;
		},
		currentStep: function(){
			if(this.is("#rootwizard")) return this.data('step');
		},
		previousStep: function(){
			if(this.is("#rootwizard")) return (this.data('step')>0)? this.data('step')-1 : false;
		},
		nextStep: function(){
			if(this.is("#rootwizard")) return (this.data('step')<this.totalSteps())? this.data('step')+1 : false;
		},
		addFinished: function(step){
			if(this.is("#rootwizard")) this.data('finished').push(step);
		},
		removeFinished: function(){
			if(this.is("#rootwizard")){
				var finished = this.finishedSteps(true);
				if($.inArray(step,finished)){
					var newList = _.without(finished,step);
					this.removeData('finished');
					this.data('finished', newList)
				}
			}
		},
		enableNextTab: function(){
			if(this.is("#rootwizard")) $("#wizardTabs li").eq(this.nextStep()).disable(true);
		},
		disableNextTab: function(){
			if(this.is("#rootwizard")) $("#wizardTabs li").eq(this.nextStep()).disable(true);
		},
		enableNextBtn: function(){
			if(this.is("#rootwizard")){
				this.find(".button-next").disable(false);
				this.data('next-enabled',true);
			}
		},
		disableNextBtn: function(){
			if(this.is("#rootwizard")){
				this.find(".button-next").disable(true);
				this.data('next-enabled',false);
			}
		},
		isBackEnabled: function(){
			if(this.is('#rootwizard')) return (!$(".button-previous").is(":disabled"))?true:false;
		},
		isNextEnabled: function(){
			if(this.is('#rootwizard')) return (!$(".button-next").is(":disabled"))?true:false;
		},
		stepCheck: function(hide){
			if(this.is('#rootwizard')){
				if(_.isUndefined(hide)){
					$("#wizardTabs li").eq(this.currentStep()).find('i').removeClass("hide");
				} else if(hide){
					$("#wizardTabs li").eq(this.currentStep()).find('i').addClass("hide");
				}
			}
		},
		finishStep: function(){
			if(this.is('#rootwizard')){
				this.addFinished(this.currentStep());
				this.stepCheck();
				this.enableNextTab();
				this.setProgress(this.finishedSteps()*20);
				this.enableNextBtn();
				this.find(".button-next").qpop("Step "+(this.getStep()+1)+" Complete",true,"left","manual");
			}
		},
		unfinishStep: function(){
			if(this.is('#rootwizard')){
				this.removeFinished();
				this.stepCheck(true);
				this.disableNextTab()
				this.setProgress(this.finishedSteps()*20);
				this.disableNextBtn();
				this.find(".button-next").popover('destroy');
			}
		},
		updateSizesTotal: function(){
			if(this.is('#garmentForm'))
				this.find('input[type=text]').each(function(){ this.data('total') += Number($(this).val()); });
		}
	});

	$(window).load(function(){
		$('.acc-wizard').accwizard({
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
					} else {
						$("#form-info").data('info',$("#form-info").formToObj());
					}
				} else if(id == "address"){
					if(!$("#form-address").valid()){
						onBeforeNext();
						$("#form-address").focusInvalid();
					} else {
						$("#form-address").data('address',$("#form-address").formToObj());
					}
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

	$("#rootwizard").bootstrapWizard({
		'nextSelector': '.button-next',
		'previousSelector': '.button-previous',
		'onInit': function(){
			$(document).keydown(function(e){
				switch(e.keyCode){
					case 37: //left
						if($("#rootwizard").isBackEnabled()) $(".button-previous").trigger('click');
					break;
					case 39: //right
						if($("#rootwizard").isNextEnabled()) $(".button-next").trigger('click');
					break;
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
								$("#rootwizard").finishStep();
							}
						});
					} else {
						$("#otherInput").hide();
					}
				},
				changed:function(oldVal,newVal){
					var $option = $("#productSelect option:selected"), $other = $("#otherInput");
					if(newVal>0 && newVal !== 9){ // if anything was selected except other
						$("#tab1").data("product",$option.text());
						$("#tab5 img.product").attr("src",$option.data('img-src'));
						$("#rootwizard").finishStep();
						return;
					}
					if(oldVal>0 && newVal<1){ // if a product was selected and then un-selected
						$("#tab1").data('product',null);
						$("#rootwizard").unfinishStep();
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
				$("#rootwizard").finishStep();
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
									case 'image/svg+xml':
									case 'image/png':
									case 'image/gif':
									case 'image/jpeg':
									case 'image/pjpeg':
									case 'application/pdf':
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
					$("#rootwizard").finishStep();
				}
			});

			// #tab3
			if($("#location").val().length>0){
				$("#addLocation").removeClass('disabled').on('click',function(){
					$("#tab3").data('location', $("#location").val());
					$("#rootwizard").finishStep();
				});
				$("#location").keypress(function(e){
					if(e.which == 13) $("#addLocation").click()
				});
			}

			// #tab4
			$(".selectpicker").selectpicker();
			$("#garmentForm input[type=text]");

			$("#addGarment").click(function(){

			});

			// #tab5
			$("#addToQuote").click(function(){
				var cAndS = [], _qi = _.template($("script.qi").html());
				$.each($("#colorsAndSizes tr"), function(){
					if(!_.isEmpty($(this).data())) cAndS.push($(this).data());
					$(this).removeData();
				});
				var $itemData = $("#form-items").data('items'), _id = (_.isEmpty($itemData))?0:$itemData.length;
				var $id = {
					"id": _id,
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

		},
		'onTabClick': function(tab,navigation,index){
			//return false;
		},
		'onTabShow': function(tab,navigation,index){
			$("#rootwizard").data('step',index+1);
			_.l0g($("#rootwizard").data());
		},
		'onFirst': function(tab,navigation,index){

		},
		'onLast': function(tab,navigation,index){

		},
		'onNext': function(tab,navigation,index){
			$("input[type=text]:first").focus();
			$("#rootwizard .button-next").popover('destroy');
		},


	});

})(jQuery,_);
