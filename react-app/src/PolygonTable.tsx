import {polygonApiResponse, polygonData} from "./Interfaces";
import {useLoaderData, useNavigate} from "react-router-dom";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Icon from "@cloudscape-design/components/icon";
import {loadAllPolygons} from "./index";
import React from "react";
import StaticPolygonThumbnail from "./StaticPolygonThumbnail";
import Table from "@cloudscape-design/components/table";

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

    function generateEditButton (polygon: polygonData): JSX.Element {
        // These 3 funcs need to be broken out to avoid re-renders generating new elements - ESLint catches it.
        return (
            <Button onClick={
                (evt) => navigate(`/edit/${polygon.polygonId}`)
            }
            >
                Edit
            </Button>
        );
    }

    function generateTableTextBlock (field: string | undefined): JSX.Element {
        // In the case of text fields, let's make sure we keep what's shown in the table to a reasonable length.
        let paraText = "";
        if (field) {
            paraText = field.length > 300 ? `${field.substring(0, 300)}...` : field;
        }
        return (
            <p className="wrap-text">
                {paraText}
            </p>
        );
    }

    function generateThumbnail (polygon: polygonData): JSX.Element {
        return <StaticPolygonThumbnail {...polygon} />;
    }

    return (
        // Pretty basic/minimal Cloudscape table. There's a lot that could be
        // added to this with more time - filtering by text, pagination, user preferences
        // for display fields, page size, and so on, stored in browser local storage, etc.
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
                        id: "polygonThumbnail",
                        maxWidth: "25%",
                        minWidth: "20%"
                    },
                    {
                        cell: (item: polygonData) => item.polygonId,
                        header: "UUID",
                        id: "polygonId"
                    },
                    {
                        cell: (item: polygonData) => generateTableTextBlock(item.name),
                        header: "Name",
                        id: "polygonName",
                        maxWidth: "30%",
                        minWidth: "25%"
                    },
                    {
                        cell: (item: polygonData) => generateTableTextBlock(item.notes),
                        header: "Notes",
                        id: "polygonNotes",
                        maxWidth: "300px"
                    },
                    {
                        cell: (item: polygonData) => displayBoolean(item.isGeographical),
                        header: "Geographical?",
                        id: "polygonIsGeo",
                        maxWidth: "20%",
                        minWidth: "10%"
                    },
                    {
                        cell: (item: polygonData) => generateEditButton(item),
                        header: "Edit This Polygon",
                        id: "edit",
                        maxWidth: "20%",
                        minWidth: "15%"
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
                items={polygons}
            />
        </Box>
    );
}

export default PolygonTable;
