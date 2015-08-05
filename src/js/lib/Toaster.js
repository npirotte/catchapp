const defaultOpts = {
	duration: "short",
    position: "bottom",
}

export default function(opts)
{
	if (window.plugins && window.plugins.toast) {
		window.plugins.toast.showShortTop(opts.message);
	} else {
		console.log('Tentative de toast :' + opts.message);
	}
}