import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import React from "react";

function PolygonEditor (): JSX.Element {
    return (
        <Box margin="xxl" padding="xxl">
            <Alert header="Polygon Editor" statusIconAriaLabel="Info">
                This will be the polygon editor.
            </Alert>
        </Box>
    );
}

export default PolygonEditor;
