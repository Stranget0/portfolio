const shakeKeyframes = `{0%{
	transform: translate(0, 0)
}10%{
 transform: translate(-5%, -5%)
}20%{
 transform: translate(-10%, 5%)
}30%{
 transform: translate(5%, -10%)
}40%{
 transform: translate(-5%, 15%)
}50%{
 transform: translate(-10%, 5%)
}60%{
 transform: translate(15%, 0)
}70%{
 transform: translate(0, 10%)
}80%{
 transform: translate(-15%, 0)
}90%{
 transform: translate(10%, 5%)
}100%{
 transform: translate(5%, 0)
}
}`;

export const shake = {
	keyframes: shakeKeyframes,
	duration: "1s",
	count: "infinite",
	easing: "steps(2)",
	properties: {
		scale: "1.50",
	},
};

const marqueeKeyframes =
	"{0%, 100% {transform:translateX(0)} 50% {transform:translateX(-100%)} 50.01% {transform:translateX(100%)}}";
export const marquee = {
	keyframes: marqueeKeyframes,
	duration: "4s",
	count: "infinite",
	easing: "linear",
};

const backgroundSlowKeyframes = `{
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}`;

export const backgroundSlow = {
	keyframes: backgroundSlowKeyframes,
	duration: "15s",
	easing: "ease",
	count: "infinite",
	properties: {
		"background-size": "400% 400%",
	},
};
