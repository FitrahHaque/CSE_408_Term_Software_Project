import { atom } from "recoil";

type AllProblemsCountState = {
	count: number;
};

const initialAllProblemsCountState: AllProblemsCountState = {
	count: 1,
};

export const allProblemsCountState = atom<AllProblemsCountState>({
	key: "allProblemsCountState",
	default: initialAllProblemsCountState,
});
