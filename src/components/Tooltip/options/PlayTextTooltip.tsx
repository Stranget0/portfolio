import { type Component } from "solid-js";
import TooltipMotion from "../TooltipMotion";
import classNames from "classnames";
import { appearingTextState } from "@/components/AppearingText/state";
import { useTranslations } from "@/i18n/utils";


const PlayTextTooltip: Component = () => {
	const t =  useTranslations(new URL(window.location.href))
	const isDefault = appearingTextState() === "default";

	return (
		<TooltipMotion class="flex-col-center">
			<div
				class={classNames(
					"w-8 h-8 mb-4",
					isDefault
						? "i-mingcute-finger-tap-fill?mask"
						: "i-mingcute-close-fill?mask",
				)}
			></div>
			<p>{isDefault ? t("common.play-audio") : t("common.cancel")}</p>
		</TooltipMotion>
	);
};

export default PlayTextTooltip;
