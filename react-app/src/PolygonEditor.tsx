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
        // Initial setup of the component on first render/mount
        if (!success) {
            setErrorVisible(true);
            setErrorText(error);
        } else {
            setErrorVisible(false);
            setErrorText("");
        }
        if (polygons !== undefined) {
            const [currentPolygon] = polygons;
            if (!(["", undefined].includes(currentPolygon?.name))) {
                // We're editing a polygon that already exists - set up our fields with its data
                headerText = `${currentPolygon.name} - View/Edit`;
                setPolygon(currentPolygon);
                setIsClosed(currentPolygon.isClosed);
                setPolygonIdValue(currentPolygon.polygonId || "");
                setPoints(currentPolygon.points);
                setNameValue(currentPolygon.name);
                setIsGeoValue(currentPolygon.isGeographical || false);
                setNotesValue(currentPolygon.notes || "");
                setCentroidLatValue(currentPolygon.centroid?.latitude.toString() || null);
                setCentroidLongValue(currentPolygon.centroid?.longitude.toString() || null);
            } else {
                // We're creating a new polygon, set minimal blank data up
                setPolygon({
                    isClosed: false,
                    isGeographical: false,
                    name: "",
                    points: []
                });
            }
        }
    }, []);

    useEffect(() => {
        // This handles reflecting state changes from PolygonCanvas
        if (!["", undefined].includes(polygon?.name)) {
            polygon.isClosed = isClosed;
            polygon.points = points;
            setPolygon(polygon);
        }
    }, [points, isClosed]);

    function validatePolygonData () : false | polygonData {
        // Validate that we have a polygon that can be saved, and assemble the data if so.
        let validated = true;
        let centroid = null;

        if (points.length === 0) {
            // There are no points on the canvas
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
            // Only validate geo-related fields if the isGeo field itself is checked
            setCentroidValidationError("");
            if (!(centroidLatValue && centroidLongValue)) {
                // One or both of the centroid coordinates was not supplied
                validated = false;
                setCentroidValidationError(
                    `If this is a geographical shape, you
                    must provide numerical centroid coordinates.`
                );
            } else if ([Number(centroidLongValue), Number(centroidLatValue)].includes(NaN)) {
                // One or both of the centroid coordinate fields casts to NaN, i.e. it's got non-numeric chars in it
                validated = false;
                setCentroidValidationError(
                    `Your coordinates include non-numeric data. 
                    Please provide them in numeric format.`
                );
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
            // We also want to reject if there's a centroid, but the isGeo field is not checked.
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
            // As specified in the design, successful save should navigate to the table of all polygons.
            navigate("/");
        } else {
            setErrorVisible(true);
            setErrorText(saveResponse.error);
        }
    }

    function clearAllFields () {
        setErrorText("");
        setErrorVisible(false);
        setNameValidationError("");
        setPointsValidationErrorVisible(false);
        setNameValue("");
        setNotesValue("");
        setIsGeoValue(false);
        setCentroidLatValue(null);
        setCentroidLongValue(null);
        setCentroidValidationError("");
    }

    return (
        // This component got very long with all the inputs, validation handling, state, etc.
        // I'd probably refactor the input fields out into their own component and pass state into it using
        // useContext so that we're not passing a dozen useState getters and setters around.
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
                            {/* With some effort, this could use react-router Actions and HTML forms,
                             instead of the Axios AJAX call I actually use in savePolygon, but handling
                             the points array presents challenges there, so I've gone with what works */}
                            <SpaceBetween direction="vertical" size="l">
                                <FormField
                                    constraintText="Required field. Good names are descriptive, brief, and unique."
                                    description="Enter a name for this polygon."
                                    errorText={nameValidationError}
                                    label="Polygon Name"
                                >
                                    <Input
                                        onChange={({detail}) => setNameValue(detail.value)}
                                        value={nameValue}
                                    />
                                </FormField>
                                <FormField
                                    label="Geographical"
                                    stretch={true}
                                >
                                    <Checkbox
                                        checked={isGeoValue}
                                        onChange={({detail}) => setIsGeoValue(detail.checked)}
                                    >
                                        "Does this polygon represent a geographical shape?"
                                    </Checkbox>
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
