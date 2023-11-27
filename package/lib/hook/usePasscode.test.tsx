import "@testing-library/jest-dom";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import usePasscode from "./usePasscode";

const TestComponent = (props: { isAlphaNumeric: boolean }) => {
    const { passcode, getEventHandlers, refs } = usePasscode({
        count: 4,
        isAlphaNumeric: props.isAlphaNumeric,
    });

    return (
        <>
            {passcode.map((value: string | number, index: number) => (
                <input
                    ref={(el) => el && (refs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    pattern="\d{1}"
                    value={String(value)}
                    key={`index-${index}`}
                    data-testid={`index-${index}`}
                    {...getEventHandlers(index)}
                />
            ))}
        </>
    );
};

describe("test basic workflow", () => {
    it("1. test whether passing count prop creates an array(input elements) with size count", () => {
        render(<TestComponent isAlphaNumeric={false} />);
        expect(screen.getAllByTestId(/index-[0-9]/)).toHaveLength(4);
    });

    it("2. test if the focus changes to next element when typed", async () => {
        render(<TestComponent isAlphaNumeric={false} />);
        // focus on the first input
        const firstInput: HTMLInputElement = screen.getByTestId("index-0");
        firstInput.focus();
        expect(firstInput).toHaveFocus();

        //Type in first input and check the focus of next input
        userEvent.type(firstInput, "1");
        const secondtInput: HTMLInputElement = screen.getByTestId("index-1");
        await waitFor(() => {
            expect(secondtInput).toHaveFocus();
        });

        // Verify that the value of first input is 1
        expect(firstInput).toHaveValue("1");
    });


    it("3. test if the focus changes to next element when the zero digit is typed", async () => {
        render(<TestComponent isAlphaNumeric={false} />);
        // focus on the first input
        const firstInput: HTMLInputElement = screen.getByTestId("index-0");
        firstInput.focus();
        expect(firstInput).toHaveFocus();

        //Type in first input and check the focus of next input
        userEvent.type(firstInput, "0");
        const secondtInput: HTMLInputElement = screen.getByTestId("index-1");
        await waitFor(() => {
            expect(secondtInput).toHaveFocus();
        });

        // Verify that the value of first input is 0
        expect(firstInput).toHaveValue("0");
    });


    it("4. test if the focus changes to previous element when backspaced", async () => {
        render(<TestComponent isAlphaNumeric={false} />);
        // focus on the first input
        const firstInput: HTMLInputElement = screen.getByTestId("index-0");
        firstInput.focus();

        //Type in first input and check the focus of next input
        userEvent.type(firstInput, "1");
        const secondInput: HTMLInputElement = screen.getByTestId("index-1");
        await waitFor(() => {
            expect(secondInput).toHaveFocus();
        });

        //Backspace and observe focus shift
        userEvent.keyboard("{Backspace}");
        await waitFor(() => {
            expect(firstInput).toHaveFocus();
        });

        // Verify that the value of second input is empty
        expect(secondInput).toHaveValue("");
    });


    it("5. test if the focus changes to previous element when backspaced over the zero digit", async () => {
        render(<TestComponent isAlphaNumeric={false} />);
        // focus on the first input
        const firstInput: HTMLInputElement = screen.getByTestId("index-0");
        firstInput.focus();

        //Type in first input and check the focus of next input
        userEvent.type(firstInput, "0");
        const secondInput: HTMLInputElement = screen.getByTestId("index-1");
        await waitFor(() => {
            expect(secondInput).toHaveFocus();
        });

        //Backspace and observe focus shift
        userEvent.keyboard("{Backspace}");
        await waitFor(() => {
            expect(firstInput).toHaveFocus();
        });

        // Verify that the value of second input is empty
        expect(secondInput).toHaveValue("");
    });
});
