import {Circle, Layer, Line, Stage} from "react-konva";
import {point, polygonData} from "./Interfaces";
import {getLine} from "./PolygonCanvas";
import React from "react";

function StaticPolygonThumbnail ({points, isClosed}: polygonData) :JSX.Element {
    // This and the canvas in PolygonCanvas can be combined as a separate component so that they
    // aren't so redundant. We'd need to pass around a lot of state/handler stuff,
    // which would make useContext() a good fit - leave for future improvement, though, if this were real.
    const linePoints = getLine(points);

    return (
        <Stage
            height={100}
            listening={false}
            scale={{x: 0.15, y: 0.15}}
            width={115}
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
                        fill={p.pointId !== points[0].pointId ? "black" : "#037ffc"}
                        key={p.pointId}
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

export default StaticPolygonThumbnail;
