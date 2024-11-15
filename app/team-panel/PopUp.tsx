import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef } from "react";

const PopUp = ({
	setIsPopupOpen,
}: {
	setIsPopupOpen: (isOpen: boolean) => void;
}) => {
	const handleClose = () => {
		setIsPopupOpen(false);
	};
	const [isIdValid, setIsIdValid] = React.useState(false);
	const [isChecked, setIsChecked] = React.useState(false);

	const promptAnswerRef = useRef<HTMLInputElement>(null);

	const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const id = event.target.value;
		setIsIdValid(id === "test");
	};

	const handleSubmit = () => {
		const promptAnswer = promptAnswerRef.current;

		if (promptAnswer && promptAnswer.value.trim() === "") {
			// Prompt answer is empty
			return;
		}

		if (!isChecked) {
			// Checkbox is not checked
			return;
		}

		// Call the mock function with the value of the input
		if (promptAnswer) {
			mockFunction(promptAnswer.value);
		}
	};

	const mockFunction = (value: string) => {
		// Mock function implementation
		console.log("Mock function called with value:", value);
	};

	return (
		<div className="fixed inset-0 flex justify-center items-center bg-gray-300 bg-opacity-75">
			<Card className=" relative max-w-md w-full p-6 rounded-lg shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className=" text-2xl font-bold">Join Group</CardTitle>
					<div className="border-t-2 border-gray-200 mt-2"></div>
					<button
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
						onClick={handleClose}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</CardHeader>
				<CardContent className="space-y-4">
								<label htmlFor="team-id" className="font-semibold">Team ID:</label>
					<Input
                    id="team-id"
						placeholder="test"
						className="bg-gray-100 text-gray-500"
						onChange={handleIdChange}
					/>
					{isIdValid && (
						<>
							<div>
								<p className="font-semibold">Answer the prompt:</p>
								<p className="text-gray-600">Some cool prompt</p>
							</div>
							<Input
								placeholder="Prompt Answer"
								className="bg-gray-100"
								ref={promptAnswerRef}
							/>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="ready"
									checked={isChecked}
									onCheckedChange={(checked) => {
										setIsChecked(!!checked);
									}}
								/>
								<label htmlFor="ready" className="text-gray-600">
									Ready
								</label>
							</div>
						</>
					)}
				</CardContent>
				{isIdValid && (
					<CardFooter className="flex justify-center pt-4">
						<Button
							className={`bg-${
								isChecked ? "purple-200" : "gray-300"
							} text-purple-700 px-6 py-2 rounded-lg shadow-md ${
								isChecked ? "" : "cursor-not-allowed"
							}`}
							onClick={handleSubmit}
							disabled={!isChecked}
						>
							Confirm
						</Button>
					</CardFooter>
				)}
			</Card>
		</div>
	);
};

export default PopUp;
