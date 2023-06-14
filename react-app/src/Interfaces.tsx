export interface point {
    x: number,
    y: number,
    pointId: string
}

interface centroid {
    "latitude": number,
    "longitude": number
}

export interface polygonData {
    "name": string,
    "points": Array<point>,
    "polygonId"?: string,
    "notes"?: string,
    "isClosed": boolean,
    "isGeographical": boolean,
    "centroid"?: centroid
}

export interface polygonApiResponse {
    "polygons": Array<polygonData>,
    // Success is only false if there was an API error. [] alone does not
    // imply failure, e.g. there are no polygons saved, or we're making a new polygon.
    "success": boolean
    "error"?: string
}

export interface CanvasProps {
    points: Array<point>,
    setPoints: Function
    isClosed: boolean,
    setIsClosed: Function
}

export interface apiCallerProps {
    payload?: any,
    target: string,
    verb: "get" | "post"
}
