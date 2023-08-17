import React, { useEffect } from "react";
import "./styles.css";
const d3 = require("d3-delaunay");
const height = window.innerHeight;
const width = window.innerWidth;
const n = 300;

const particles = Array.from({ length: n }, () => [
  Math.random() * width,
  Math.random() * height,
]);

const drawVoronoi = (context: any) => {
  function update() {
    const delaunay = d3.Delaunay.from(particles);
    const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);
    context.clearRect(0, 0, width, height);

    const V = [...voronoi.neighbors(0)];

    context.beginPath();
    context.globalAlpha = 1;
    context.filter = "brightness(100%)";
    const grd = context.createLinearGradient(0, 0, 0, height);
    grd.addColorStop(0, "#DF3FD7");
    grd.addColorStop(1, "#3FDF84");
    context.fillStyle = grd;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";
    context.fill();

    context.beginPath();
    context.globalAlpha = 0.5;
    voronoi.render(context);
    voronoi.renderBounds(context);
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 0.5;
    context.stroke();

    context.beginPath();
    voronoi.renderCell(0, context);
    context.filter = "brightness(250%)";
    context.fill();

    context.beginPath();
    context.filter = "brightness(120%)";
    for (const j of V) voronoi.renderCell(j, context);
    context.fill();
  }

  context.canvas.ontouchmove = context.canvas.onmousemove = (event: any) => {
    event.preventDefault();
    particles[0] = [event.layerX, event.layerY];
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
    />
  );
}
