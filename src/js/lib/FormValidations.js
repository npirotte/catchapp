

const emailReg = /\b[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/;

export function emailValidation(input)
{
	return input.match(emailReg);
}