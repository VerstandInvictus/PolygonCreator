import {CanvasProps, point} from "./Interfaces";
import {Circle, Layer, Line, Stage} from "react-konva";
import React, {useEffect, useRef, useState} from "react";
import Konva from "konva";
import md5 from "blueimp-md5";
import {Vector2d} from "konva/lib/types";

export function getLine (points: Array<point>): Array<number> {
    // Konva requires flat arrays to draw a line - [x1, y1, x2, y2, x3, y3 ...]
    return points.map((p: point) => [p.x, p.y]).flat();
}

function getPoint (pointerPos: Vector2d): point {
    // Create our point object. md5 hash is for identification of which point is being interacted with.
    return {
        pointId: md5(`${pointerPos.x}-${pointerPos.y}`),
        x: pointerPos.x,
        y: pointerPos.y
    };
}

function detectProximity (p: point, pointerPos: Vector2d): boolean {
    // Determine if a click is close enough to a point to call it the same point.
    if (p && pointerPos) {
        return Math.abs(p.x - pointerPos.x) < 35 && Math.abs(p.y - pointerPos.y) < 35;
    }
    return false;
}

export function PolygonCanvas ({points, setPoints, isClosed, setIsClosed}: CanvasProps): JSX.Element {
    const [linePoints, setLinePoints] = useState<Array<number>>([]);
    const stageRef = useRef<Konva.Stage>(null);

    useEffect(() => {
        // Update our line between the points whenever there's a change to the points
        if (typeof points !== "undefined") {
            setLinePoints(getLine(points));
        }
    }, [points]);

    function handleDragMove (evt: Konva.KonvaEventObject<DragEvent>) {
        // If a point in the canvas is being dragged, we need to update the underlying
        // point array that we're using for the line and passing up to the save function.
        // We do that by reading the point's ID off the Circle element, finding the corresponding
        // point value in the array, and updating it to match the dragged position.
        if (stageRef.current === null) {
            return;
        }
        const newPoint: point = {
            pointId: evt.target.attrs.id,
            x: evt.target.x(),
            y: evt.target.y()
        };
        const pointIndex = points.findIndex((p: point) => p.pointId === newPoint.pointId);
        const newPoints = [...points];
        newPoints[pointIndex] = newPoint;
        setPoints(newPoints);
        setLinePoints(getLine(newPoints));
    }

    function pointClickHandler (evt: Konva.KonvaEventObject<PointerEvent>) {
        // Create new points in the underlying point array when the user clicks on the canvas.
        // These will appear as Circle elements in the canvas, through the magic of useState
        // and the map in the canvas stage code below.
        if (stageRef.current === null) {
            return;
        }
        const pointerPos: Vector2d | null = stageRef.current.getPointerPosition();
        if (pointerPos !== null) {
            if (!(isClosed)) {
                // Let's make the first point a little easier to click, for closing the polygon.
                // Anything a few dozen pixels around it counts as clicking on it.
                // This avoids obnoxious close-overlapping points on top of it.
                if (detectProximity(points[0], pointerPos)) {
                    setIsClosed(true);
                } else {
                    const newPoints = [...points, getPoint(pointerPos)];
                    setPoints(newPoints);
                    setLinePoints(getLine(newPoints));
                }
            }
        }
    }

    function eventFilter (evt: Konva.KonvaEventObject<any>) {
        // See the note below in the return block for why we need this.
        const eventTargetId = evt.target.attrs.id;
        if (eventTargetId === points[0].pointId && evt.evt.type === "pointerdown") {
            pointClickHandler(evt);
        }
        evt.evt.cancelBubble = true;
        evt.cancelBubble = true;
    }

    return (
        // There's a significant conflict between DragEvent and PointerEvent here; dragging necessarily involves
        // clicking. The various filter calls and the special casing of clicks on the first point are intended
        // to handle this without causing points to be added to the polygon while the user is trying to drag points.
        // Unfortunately this does mean that dragging the first point is not possible while the polygon is unclosed.
        // This is called out in the UI and the first point is differently colored for ease of identification.
        <Stage
            height={650}
            onDragMove={(evt: Konva.KonvaEventObject<DragEvent>) => eventFilter(evt)}
            onPointerDown={(evt: Konva.KonvaEventObject<PointerEvent>) => pointClickHandler(evt)}
            ref={stageRef}
            width={750}
        >
            <Layer>
                <Line
                    closed={isClosed}
                    fill="#00dd55"
                    points={linePoints}
                    stroke="#555555"
                    strokeWidth={5}
                />
                {points.map((p: point) => (
                    <Circle
                        draggable={p.pointId !== points[0].pointId || isClosed}
                        fill={p.pointId !== points[0].pointId ? "black" : "#037ffc"}
                        id={p.pointId} // Konva makes it easier to get this
                        key={p.pointId} // But React needs this
                        onDragMove={(evt: Konva.KonvaEventObject<DragEvent>) => handleDragMove(evt)}
                        onPointerDown={(evt: Konva.KonvaEventObject<PointerEvent>) => eventFilter(evt)}
                        onPointerUp={(evt: Konva.KonvaEventObject<PointerEvent>) => eventFilter(evt)}
                        radius={10}
                        stroke="black"
                        strokeWidth={2}
                        x={p.x}
                        y={p.y}
                    />
                ))}
            </Layer>
        </Stage>
    );
}
