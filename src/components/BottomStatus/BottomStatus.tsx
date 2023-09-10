import { useTranslations } from "@/i18n/utils";
import { bottomStatus } from "./state";
import MouseIcon from "@/components/MouseIcon.tsx";
import type { SupportedLanguage } from "@/i18n/types";
import classNames from "classnames";

export default function BottomStatus({ lang }: { lang: SupportedLanguage }) {
	const t = useTranslations(lang);

	const isScroll = ()=>bottomStatus() === "scroll";
	const isSpinner =  ()=> bottomStatus() === "spinner";

	const offClass = "important:translate-y-200%";
	const generalClass =
		"fixed bottom-8 left-50% -translate-x-50% z-20 mix-blend-difference text-primary-50 pointer-events-none motion-safe:transition-transform-300";

	return (
		<>
			<div
				role="region"
				aria-label="loading fox model"
				aria-hidden={!isSpinner()}
				class={classNames(
					generalClass,
					"h-60 max-h-10vh w-full i-svg-spinners-12-dots-scale-rotate?mask",
					!isSpinner() && offClass,
				)}
			></div>
			<div
				role="region"
				aria-hidden={!isScroll()}
				// {...disappearOnFoxLoading}
				class={classNames(
					generalClass,
					"flex-col-center",
					!isScroll() && offClass,
				)}
			>
				<MouseIcon class="w-6 h-6 motion-safe:animate-bounce" />
				<p class="text-label motion-safe:animate-bounce">
					{t("common.scroll")}
				</p>
			</div>
		</>
	);
}
