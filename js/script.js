$(function() {
	var validationTmpl = "<div class='validation'>"
						+ "<p></p>"
						+ "<span class='close'></span>"
						+ "</div>";

	var pageLoad = $("<div class='loading'></div>");

	function initForm($form){ //the $form is a jquery object
		var form, position, validateMsg;

		form = $form[0]; //form from the element 0 of $form is a javascript object
		position = {
				top: (form.offsetTop - 40) + 'px'
			,	left: form.offsetLeft + 'px'
			,	width: form.offsetWidth + 'px'
			, height: form.offsetHeight + 'px'
			, display: 'none'
		};

		$form.after(pageLoad.css(position));

		validateMsg = $(validationTmpl)
			.hide()
			.bind('show', function(){ this.style.display = "block"; })
			.bind('close', function(){ this.style.display = "none"; })
			.bind('error', function(e, errMsg){ 
				$(this)
					.addClass("error")
					.find("p").text(errMsg);
			});

		$form.find("input[type='email'], input[type='password'], input[type='text']")
			.bind("focusin focusout", function(e){
				var validMsg = $(this).next();

				if(this.required && this.value == "")
				{
					validMsg.find("p").text(this.name + " is required");
					validMsg.show();
				}
			})
			.each(function(){
				var parent = $(this).parent();

				validateMsg
					.clone(true, true)
					.appendTo(parent);
			});	

	}

	initForm($('form')); //this submits jquery object

});
