const btns = [...document.getElementsByClassName("tooltip")];

btns.map((btn) => {
	const tooltipContent = btn.getAttribute("data-text");

	return tippy(btn, {
		content: tooltipContent,
		theme: "light",
		placement: "bottom",
		arrow: true,
		animation: "scale-extreme",
		duration: [400, 700],
	});
});
