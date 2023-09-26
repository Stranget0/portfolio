// BUG this slows down typescript too much
// import type { AttributifyAttributes } from "@unocss";
	declare namespace astroHTML.JSX {
		interface FormHTMLAttributes{
			netlify?: boolean
		}
// 		interface HTMLAttributes
// 			extends AttributifyAttributes,
// 				Partial<Record<"prose" | "snap", string | boolean>> {}
	}
