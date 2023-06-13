import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import React from "react";

function PolygonTable (): JSX.Element {
    return (
        <Box margin="xxl" padding="xxl">
            <Alert header="Polygon Editor" statusIconAriaLabel="Info">
                This will be the polygon table.
            </Alert>
        </Box>
    );
}

export default PolygonTable;
