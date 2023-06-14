import {polygonApiResponse, polygonData} from "./Interfaces";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Icon from "@cloudscape-design/components/icon";
import {loadAllPolygons} from "./index";
import React from "react";
import Table from "@cloudscape-design/components/table";
import TextFilter from "@cloudscape-design/components/text-filter";
import {useLoaderData, useNavigate} from "react-router-dom";


function generateThumbnail (polygon: polygonData): JSX.Element {
    return <div />;
}

function displayBoolean (isGeographical: boolean): JSX.Element {
    if (isGeographical) {
        return <Icon name="check" size="medium" variant="success" />;
    }
    return <Icon name="close" size="medium" variant="error" />;
}

function PolygonTable (): JSX.Element {
    // This typing feels clunky but see https://github.com/remix-run/react-router/discussions/9792
    const {
        polygons, success, error
    }: polygonApiResponse = useLoaderData() as Awaited<ReturnType<typeof loadAllPolygons>>;

    const navigate = useNavigate();
    let errorVisible = false;

    if (!success) {
        errorVisible = true;
    }

    return (
        <Box margin="xxl">
            <Header variant="h2">
                All Polygons
            </Header>
            <Box margin="m">
                <Alert
                    header="Could Not Load Polygons"
                    statusIconAriaLabel="Error"
                    type="error"
                    visible={errorVisible}
                >
                    <p>
                        {error}
                    </p>
                </Alert>
            </Box>
            <Table
                columnDefinitions={[
                    {
                        cell: (item: polygonData) => generateThumbnail(item),
                        header: "Preview",
                        id: "polygonThumbnail"
                    },
                    {
                        cell: (item: polygonData) => item.polygonId,
                        header: "UUID",
                        id: "polygonId"
                    },
                    {
                        cell: (item: polygonData) => item.name,
                        header: "Name",
                        id: "polygonName"
                    },
                    {
                        cell: (item: polygonData) => item.notes,
                        header: "Notes",
                        id: "polygonNotes"
                    },
                    {
                        cell: (item: polygonData) => displayBoolean(item.isGeographical),
                        header: "Geographical?",
                        id: "polygonIsGeo"
                    },
                    {
                        cell: (item: polygonData) => (
                            <Button onClick={(evt) => navigate(`/polygons/edit/${item.polygonId}`)}>
                                Edit
                            </Button>
                        ),
                        header: "Edit This Polygon",
                        id: "edit"
                    }
                ]}
                columnDisplay={[
                    {id: "polygonThumbnail", visible: true},
                    {id: "polygonId", visible: false},
                    {id: "polygonName", visible: true},
                    {id: "polygonNotes", visible: true},
                    {id: "polygonIsGeo", visible: true},
                    {id: "edit", visible: true}
                ]}
                empty={
                    <Box color="inherit" textAlign="center">
                        <b>
                            No Polygons
                        </b>
                        <Box color="inherit" padding={{bottom: "s"}} variant="p">
                            You have not yet created any polygons.
                        </Box>
                    </Box>
                }
                filter={
                    <TextFilter filteringPlaceholder="Find polygons by metadata" filteringText="" />
                }
                items={polygons}
            />
        </Box>
    );
}

export default PolygonTable;
