import React, { useEffect } from "react";
import "./styles.css";
const d3 = require("d3-delaunay");
const height = window.innerHeight;
const width = window.innerWidth;
const n = 200;

const particles = Array.from({ length: n }, () => [
  Math.random() * width,
  Math.random() * height,
]);

const drawVoronoi = (context: any) => {
  function update() {
    const delaunay = d3.Delaunay.from(particles);
    const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);
    context.clearRect(0, 0, width, height);

    //context.beginPath();
    //delaunay.render(context);
    //context.strokeStyle = "#ccc";
    //context.stroke();

    context.beginPath();
    voronoi.render(context);
    voronoi.renderBounds(context);
    context.strokeStyle = "#000";
    context.stroke();

    context.fillStyle = "#0f0";
    context.beginPath();
    voronoi.renderCell(0, context);
    context.fill();

    //context.beginPath();
    //delaunay.renderPoints(context);
    //context.fill();
  }

  context.canvas.ontouchmove = context.canvas.onmousemove = (event: any) => {
    event.preventDefault();
    particles[0] = [event.layerX, event.layerY];
    //colorSelectedParticle(delaunay.find(event.layerX, event.layerY));
    update();
  };

  update();
};

export default function App() {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    if (canvas == null) return;
    const ctx = canvas?.getContext("2d");
    drawVoronoi(ctx);
  });

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={(e) => {}}
    />
  );
}
