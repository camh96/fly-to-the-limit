function addFormValidation(formElement) {

	if (formElement === null || formElement.tagName.toUpperCase() !== 'FORM') {
		throw new Error("first parameter must be a FORM, but got " + formElement.tagName);
	}

	formElement.addEventListener("submit", function (evt) {
		if (!validateForm(evt.target)) {
			evt.preventDefault();
		}
	});

	for (var i = 0; i < formElement.length; i += 1) {
		var field = formElement[i];
		field.addEventListener('blur', function (evt) {
			validateField(evt.target);
		});
	}
}

function validateForm(formElement) {
	var error = false;

	for (var i = 0; i < formElement.length; i += 1) {
	 	var isValid = validateField(formElement[i]);
	 	if ( ! isValid) { 
	 		error = true;
	 	}
	}

	return !error;
}


function validateField(el) {
	var error = "";

	if (el.type === "submit" || 
		el.type === "reset" || 
		el.type === "button" || 
		el.type === "hidden" ||
		el.tagName.toUpperCase() === "BUTTON") {
		return true; // buttons are automatically valid.
	}

	if (el.id.length === 0 || el.name.length === 0) {
		console.error("error: ", el);
		throw new Error("found a form element that is missing an id and/or name attribute. name should be there. id is required for determining the field's error message element.");
	}

	// find this element's match error div.
	var errorDiv = document.querySelector("#" + el.id + "-error");
	if (errorDiv === null) {
		console.error("error: ", el);
		throw new Error("could not find an element to use for error messages when #" + el.id + " is invalid.");
	}

	errorDiv.innerHTML = "";

	if (el.classList) {
	  el.classList.remove('invalid');
	  errorDiv.classList.remove('danger');
	} else {
	  el.className = el.className.replace(/(^|\b)invalid(\b|$)/gi, ' ');
	  errorDiv.className = el.className.replace(/(^|\b)danger(\b|$)/gi, ' ');
	}

	if (el.type === "email" && el.value.length >= 1 && !isEmail(el.value)) {
		error = "Anything sent to that address wont go anywhere. Try again";
	}

	if (el.className.indexOf("fv-minlength-") > -1) {
		var pos = el.className.indexOf("fv-minlength-");
		var minLength = parseInt( el.className.substr(pos+13), 10);
		if (el.value.length < minLength) {
			error = "Must be " + minLength + " or more characters long. Type some more. Even some spaces will make the js shut up.";
		}
	}

	// is this field required?
	if (el.required) { 
		if (el.type === "checkbox" && !el.checked) {
			error = "You gotta agree to the T's and C's!";
		} else if (el.value.trim() === "") {
			error = "Type something, anything. Anything at all. Whatever you like. Just something.";
		}
	}

	if (error !== "") {
		errorDiv.innerHTML = error;
		if (el.classList) {
		  el.classList.add('invalid');
		  errorDiv.classList.add('danger');
		} else {
		  el.className += ' invalid';
		  errorDiv.className += ' danger';
		}
		return false; // it's invalid
	}

	return true;
}

function isEmail(input) {
	return input.match(/^([a-z0-9_.\-+]+)@([\da-z.\-]+)\.([a-z\.]{2,})$/);
}