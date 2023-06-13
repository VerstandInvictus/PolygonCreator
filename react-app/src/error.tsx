import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import React from "react";

/*
 * Sort of from https://reactrouter.com/en/main/start/tutorial, adapted with https://stackoverflow.com/a/76126878
 * should hopefully not show up, but it's nice to have if it's needed.
 */

function ErrorDisplay (): JSX.Element {
    const error = useRouteError();

    let errorHeader = "Something went wrong",
        errorMessage: string;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.error?.message || error.statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = "Unknown error; check browser console for details.";
    }

    if (errorMessage.startsWith("No route matches URL")) {
        // Common use case
        errorHeader = "404: Page Not Found";
        errorMessage = `${errorMessage.split(" ").slice(-1)} is not a valid URL;
                        please check your entry or the link you followed and try again.`;
    }

    return (
        <Box margin="xxl" padding="xxl">
            <Alert header={errorHeader} statusIconAriaLabel="Error" type="error">
                <p>
                    We're sorry; something isn't working right. For diagnostic purposes, the error was:
                </p>
                <p>
                    { errorMessage }
                </p>
            </Alert>
        </Box>
    );
}

export default ErrorDisplay;
