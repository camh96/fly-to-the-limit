document.addEventListener("DOMContentLoaded", function() {

	var contactForm = document.querySelector("#contact-form");

	contactForm.addEventListener("submit", function (evt) {
		evt.preventDefault();

		var error = false;
		console.log("form element", evt.target);

		for (var i = 0; i < evt.target.length; i += 1) {
		 	var isValid = validateField(evt.target[i]);
		 	if ( ! isValid) { 
		 		error = true;
		 	}
		}
		
		if (error) {
			evt.preventDefault();
		}
	});

});


function validateField(el) {
	var error = false;

	console.log("validating ", el);

	if (el.type === "submit" || 
		el.type === "reset" || 
		el.type === "button" || 
		el.tagName === "button") {
		return true; // buttons are automatically valid.
	}

	// find this element's match error div.
	var errorDiv = document.querySelector("#" + el.id + "-error");
	errorDiv.innerHTML = "";

	if (el.type === "email" && !isEmail(el.value)) {
		error = true;
		errorDiv.innerHTML = "please provide a valid email address.";
	}

	if (el.className.indexOf("fv-minlength-") > -1) {
		var pos = el.className.indexOf("fv-minlength-");
		var minLength = parseInt( el.className.substr(pos+13), 10);
		if (el.value.length < minLength) {
			error = true;
			errorDiv.innerHTML = "must be at least " + minLength + " characters long.";
		}
	}

	// is this field required?
	if (el.required) { 
		if (el.type === "checkbox" && !el.checked) {
			error = true;
			errorDiv.innerHTML = "this must be checked.";
		} else if (el.value.trim() === "") {
			error = true;
			errorDiv.innerHTML = "this field is required.";
		}
	}

	return !error; // true if no error
}




function isEmail(input) {
	var validTLDChars        = "abcdefghijklmnopqrstuvwxyz";
	var validDomainNameChars = "abcdefghijklmnopqrstuvwxyz0123456789-."
	var validUsernameChars   = "abcdefghijklmnopqrstuvwxyz0123456789-_.+";

	input = input.toLowerCase();

	function hasBadFullStops(input) {
		return ( input.charAt(0) === "." || 
			input.charAt(input.length - 1) === "." || 
			input.indexOf("..") > -1
		);
	}

	function hasBadHyphens(input) {
		return ( input.charAt(0) === "-" || 
			input.charAt(input.length - 1) === "-" ||
			input.indexOf(".-") > -1 ||
			input.indexOf("-.") > -1
		);
	}

	function hasBadCharacters(input, validCharacters) {
		for (var i = 0; i < input.length; i += 1) {
			var letter = input.charAt(i)
			if (validCharacters.indexOf(letter) === -1) return true;
		}
		return false;
	}

	// count the @ symbols - there can only be one.
	if (input.indexOf("@") !== input.lastIndexOf("@")) return false;

	if (input.indexOf("@") < 1) return false; // 1x @ must be present, and not the first char

	if (input.indexOf("@") === input.length - 1) return false; // @ cannot be last char

	var username = input.substr(0, input.indexOf("@"));
	if (hasBadFullStops(username)) return false;
	if (hasBadCharacters(username, validUsernameChars)) return false;
	
	var domainName = input.substr(input.indexOf("@") + 1);
	if (hasBadFullStops(domainName)) return false;
	if (hasBadHyphens(domainName)) return false;
	if (hasBadCharacters(domainName, validDomainNameChars)) return false;

	var tld = domainName.substr(domainName.lastIndexOf(".") + 1);
	if (tld.length < 2) return false;
	if (hasBadCharacters(tld, validTLDChars)) return false;

	return true;
}




