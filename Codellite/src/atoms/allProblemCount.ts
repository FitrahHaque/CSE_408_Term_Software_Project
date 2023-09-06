import { atom } from "recoil";

type AllProblemsCountState = {
	count: number;
};

const initialAllProblemsCountState: AllProblemsCountState = {
	count: 0,
};

export const allProblemsCountState = atom<AllProblemsCountState>({
	key: "allProblemsCountState",
	default: initialAllProblemsCountState,
});
