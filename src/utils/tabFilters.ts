import { mainpageTabs } from "@/constants";
import hasTranscripts from "./hasTranscripts";

const tabFilters = {
	[mainpageTabs.play.id]: hasTranscripts,
};

export default tabFilters;
