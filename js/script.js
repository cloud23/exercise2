$(function() {
	var validationTmpl = "<div class='validation'>"
						+ "<p></p>"
						+ "<span class='close'></span>"
						+ "</div>";

	var pageLoad = $("<div class='loading'></div>");

	function initForm($form){ //the $form is a jquery object ($ is used to denote that the variable is a jquery obj)
		var fields, form, position, validateMsg;

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

		fields = $form.find("input[type='email'], input[type='password'], input[type='text']")
			.bind("focusin focusout", function(e){
				var validMsg = $(this).next();

				if(this.required && this.value == "")
				{
					validMsg.find("p").text(this.name + " is required");
					validMsg.show();
				}
				else if (this.required && this.value && e.type == "focusout") {
					validate(this, validMsg);

					if(!validMsg.is(".error")){
						validMsg.hide();
					}
				}
			})
			.bind("validate", function(e, callback){
				validate(this, $(this).next(), callback);
			})
			.each(function(){
				var parent = $(this).parent();

				validateMsg
					.clone(true, true)
					.appendTo(parent);
			});	

		$form.bind("submit", function(e){
			var valid, counter, form, $email, $password;

			form = this;
			valid = true;
			counter = fields.length;
			$email = $form.find("#email");
			$password = $form.find("#password");

			e.preventDefault();

			$.each(fields, function(i, input){
				$(input).trigger("validate", callback);
			});

			function callback(isValid){
				counter -= 1;
				valid = isValid;

				if(!counter && isValid){ // if counter becomes zero(0) it will yield true because 0 is convertible to false
					pageLoad.show();
					//save the value to localStorage instead

					if($form.is(".registration")){
						localStorage.setItem("email", $email.val());
						localStorage.setItem("password", $password.val());
						//go to accounts page

						window.location = form.action;
					}
					else //if logging in
					{
						var email, password;
						email = localStorage.getItem("email");
						password = localStorage.getItem("password");

						if(email == $email.val()){
							$email.next().hide();

							if(password == $password.val()){
								$password.next().hide();
								//go to accounts page

								window.location = form.action;
							}
							else{
								$password.next()
									.trigger("error", "Invalid password entered")
									.show();
							}
						}
						else{
							$email.next()
								.trigger("error", "Invalid email entered")
								.show();
						}
					}
					pageLoad.hide();
					// $.post(
					// 	form.action, $form.serialize(),
					// 	function(data, stat){

					// 	});
				}
			}
		});
	}

	function validate(input, $errMsg, callback){
			var name, value, type, valid, required, errorMsgText, matchElem, match;

			valid = true;
			name = capitalize(input.name);
			value = input.value || '';
			type = input.type || 'text';
			required = input.required || false;
			match = input.dataset ? input.dataset.match : null;

			if(type != "password")
				value = value.trim();

			if(required && !validateRequired(value)) {
				$errMsg.trigger("error", name + " is required.");
				valid = false;
			}

			// if(valid && match && value) {
			// 	matchElem = document.getElementByName(match);

			// 	if(matchElem && value !== matchElem.value)
			// }

			if(valid && value){
				switch(type){
					case 'email':
						if(!validateEmail(value)){
							$errMsg.trigger("error", name + " is not a valid email address");
							valid = false;
						}
						break;
					case 'password':
						if(!validatePassword(value)){
							$errMsg.trigger("error", name + " is too short.");
							valid = false;
						}
						break;
					default:
						break;
				}
			}

			valid && $errMsg //the && operate checks if the first expr is convertible to false, if no the 2nd expr will be returned
				.hide()
				.removeClass("error")
				.find("p")
				.text("");

			callback && callback(valid);
	}

	function validateRequired(value){
		return value != "";
	}

	function validateEmail(email){
		return /[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test( email );
	}

	function validatePassword(pass){
		return pass.length > 6;
	}

	initForm($('form')); //this submits jquery object

	// Helpers
	function capitalize( string ){
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}
});
