import {Form, useLoaderData, useNavigate} from "react-router-dom";
import {loadSpecificPolygon, polygonApiCaller} from "./index";
import {point, polygonApiResponse, polygonData} from "./Interfaces";
import React, {useEffect, useState} from "react";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Checkbox from "@cloudscape-design/components/checkbox";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import {PolygonCanvas} from "./PolygonCanvas";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Textarea from "@cloudscape-design/components/textarea";

function PolygonEditor (): JSX.Element {
    // This typing feels clunky but see https://github.com/remix-run/react-router/discussions/9792
    const {
        polygons, success, error
    }: polygonApiResponse = useLoaderData() as Awaited<ReturnType<typeof loadSpecificPolygon>>;
    const [errorText, setErrorText] = useState(error);
    const [errorVisible, setErrorVisible] = useState(false);
    const [polygon, setPolygon] = useState(polygons[0]);
    const [polygonIdValue, setPolygonIdValue] = useState("");
    const [points, setPoints] = useState<Array<point>>([]);
    const [pointsValidationErrorVisible, setPointsValidationErrorVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [nameValue, setNameValue] = useState("");
    const [nameValidationError, setNameValidationError] = useState("");
    const [notesValue, setNotesValue] = useState("");
    const [isGeoValue, setIsGeoValue] = useState(false);
    const [centroidLatValue, setCentroidLatValue] = useState<null | string>(null);
    const [centroidLongValue, setCentroidLongValue] = useState<null | string>(null);
    const [centroidValidationError, setCentroidValidationError] = useState("");
    const navigate = useNavigate();

    let headerText = "Create New Polygon";

    useEffect(() => {
        if (!success) {
            setErrorVisible(true);
            setErrorText(error);
        }
        if (!["", undefined].includes(polygon?.name)) {
            headerText = `${polygon.name} - View/Edit`;
            setIsClosed(polygon.isClosed);
            setPolygonIdValue(polygon.polygonId || "");
            setPoints(polygon.points);
            setNameValue(polygon.name);
            setIsGeoValue(polygon.isGeographical || false);
            setNotesValue(polygon.notes || "");
            setCentroidLatValue(polygon.centroid?.latitude.toString() || null);
            setCentroidLongValue(polygon.centroid?.longitude.toString() || null);
        } else {
            setPolygon({
                isClosed: false,
                isGeographical: false,
                name: "",
                points: []
            });
        }
    }, []);

    useEffect(() => {
        if (!["", undefined].includes(polygon?.name)) {
            polygon.isClosed = isClosed;
            polygon.points = points;
            setPolygon(polygon);
        }
    }, [points, isClosed]);

    function validatePolygonData () : false | polygonData {
        let validated = true;
        let centroid = null;

        if (points.length === 0) {
            setPointsValidationErrorVisible(true);
            validated = false;
        } else {
            setPointsValidationErrorVisible(false);
        }
        if (nameValue === "") {
            validated = false;
            setNameValidationError("Polygons must have a name.");
        } else {
            setNameValidationError("");
        }
        if (isGeoValue) {
            setCentroidValidationError("");
            if (!(centroidLatValue && centroidLongValue)) {
                validated = false;
                setCentroidValidationError(
                    `If this is a geographical shape, you
                    must provide numerical centroid coordinates.`
                );
            } else if ([Number(centroidLongValue), Number(centroidLatValue)].includes(NaN)) {
                validated = false;
                setCentroidValidationError(
                    `Your coordinates include non-numeric data. 
                    Please provide them in numeric format.`
                )
            } else {
                // I wanted these to be typed number throughout the component, but that caused a
                // UI bug where the onChange function for the field was deleting "-" if it was the
                // first character - unfortunate for pure numeric coordinates.
                // Future improvement could be to have a function to pass into that that handles edge cases.
                centroid = {
                    latitude: Number(centroidLatValue),
                    longitude: Number(centroidLongValue)
                };
            }
        } else if (centroidLatValue || centroidLongValue) {
            validated = false;
            setCentroidValidationError(
                `You have entered centroid coordinates, 
                but not indicated that this is a geographical shape.`
            );
        }
        if (!validated) {
            return false;
        }
        const payload: polygonData = {
            isClosed,
            isGeographical: isGeoValue,
            name: nameValue,
            points
        };
        if (centroid) {
            payload.centroid = centroid;
        }
        if (polygonIdValue !== "") {
            payload.polygonId = polygonIdValue;
        }
        if (notesValue !== "") {
            payload.notes = notesValue;
        }
        return payload;
    }

    async function savePolygon () {
        const validatedPayload: false | polygonData = validatePolygonData();
        if (!validatedPayload) {
            return;
        }
        const saveResponse: polygonApiResponse = await polygonApiCaller(
            {payload: validatedPayload, target: "/api/polygons/save", verb: "post"}
        );
        if (saveResponse.success) {
            navigate("/");
        } else {
            setErrorVisible(true);
            setErrorText(saveResponse.error);
        }
    }

    function clearAllFields () {
        setErrorText("");
        setErrorVisible(false);
        setPointsValidationErrorVisible(false);
        setNameValue("");
        setNotesValue("");
        setIsGeoValue(false);
        setCentroidLatValue(null);
        setCentroidLongValue(null);
        setCentroidValidationError("");
    }

    return (
        <Box margin="xxl">
            <Header variant="h2">
                {headerText}
            </Header>
            <Box margin="m">
                <Alert
                    header="Could Not Load Polygon"
                    statusIconAriaLabel="Error"
                    type="error"
                    visible={errorVisible}
                >
                    <p>
                        {errorText}
                    </p>
                </Alert>
            </Box>
            <ColumnLayout columns={2}>
                <SpaceBetween direction="vertical" size="m">
                    <Box>
                        <p>
                            Click inside the drawing area to create points. Click on the first point,
                            which is highlighted in blue, again to close the polygon. You can click
                            and drag points you've already created to move them around and change the
                            shape of the polygon. Note that the first point cannot be dragged until the
                            polygon has been closed.
                        </p>
                    </Box>
                    <PolygonCanvas
                        isClosed={isClosed}
                        points={points}
                        setIsClosed={setIsClosed}
                        setPoints={setPoints}
                    />
                    <Button onClick={(evt: CustomEvent) => {
                        setPoints([]);
                        setIsClosed(false);
                    }}
                    >
                        Clear All Points
                    </Button>
                </SpaceBetween>
                <div>
                    <Container header={
                        <Header
                            actions={
                                <Button onClick={(evt: CustomEvent) => (clearAllFields())}>
                                    Clear All Fields
                                </Button>
                            }
                            variant="h2"
                        >
                            Polygon Metadata
                        </Header>
                    }
                    >
                        <Form>
                            <SpaceBetween direction="vertical" size="l">
                                <FormField
                                    description="The internal ID for this polygon."
                                    label="Polygon Name"
                                >
                                    <Input
                                        name="polygonId"
                                        readOnly={true}
                                        value={polygonIdValue}
                                    />
                                </FormField>
                                <FormField
                                    constraintText="Required field. Good names are descriptive, brief, and unique."
                                    description="Enter a name for this polygon."
                                    errorText={nameValidationError}
                                    label="Polygon Name"
                                >
                                    <Input
                                        name="name"
                                        onChange={({detail}) => setNameValue(detail.value)}
                                        value={nameValue}
                                    />
                                </FormField>
                                <FormField
                                    description="Does this polygon represent a geographical shape?"
                                    label="Geographical"
                                    stretch={true}
                                >
                                    <Checkbox
                                        checked={isGeoValue}
                                        name="is_geographical"
                                        onChange={({detail}) => setIsGeoValue(detail.checked)}
                                    />
                                </FormField>
                                <FormField
                                    constraintText="Required if Geographical is set. Must be in numeric format."
                                    description={(
                                        `If this polygon represents a geographical shape, 
                                        enter the coordinates of the centroid.`
                                    )}
                                    errorText={centroidValidationError}
                                    label="Centroid Latitude"
                                >
                                    <Input
                                        name="centroid_lat"
                                        onChange={({detail}) => setCentroidLatValue(detail.value)}
                                        value={centroidLatValue || ""}
                                    />
                                </FormField>
                                <FormField
                                    constraintText="Required if Geographical is set. Must be in numeric format."
                                    errorText={centroidValidationError}
                                    label="Centroid Longitude"
                                >
                                    <Input
                                        name="centroid_long"
                                        onChange={({detail}) => setCentroidLongValue(detail.value)}
                                        value={centroidLongValue || ""}
                                    />
                                </FormField>
                                <FormField
                                    description="Notes or other information you want to associate with this polygon."
                                    label="Notes"
                                >
                                    <Textarea
                                        name="notes"
                                        onChange={({detail}) => setNotesValue(detail.value)}
                                        value={notesValue}
                                    />
                                </FormField>
                                <Box margin="m">
                                    <Alert
                                        header="No Points Created"
                                        statusIconAriaLabel="Error"
                                        type="error"
                                        visible={pointsValidationErrorVisible}
                                    >
                                        You cannot save a polygon with no points.
                                    </Alert>
                                </Box>
                                <Button onClick={savePolygon} variant="primary">
                                    Save Polygon
                                </Button>
                            </SpaceBetween>
                        </Form>
                    </Container>
                </div>
            </ColumnLayout>
        </Box>
    );
}

export default PolygonEditor;
