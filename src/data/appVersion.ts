import { eden,useEdenQuery } from "./api";

export function useAppVersion() {
	return useEdenQuery(['app-version'], () => eden.get())
}
