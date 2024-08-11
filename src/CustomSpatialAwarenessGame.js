import React, { useState } from "react";
import { RefreshCw, Square, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "./components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/Alert";

const GRID_SIZE = 4;
const CELL_SIZE = 30;

const CustomSpatialAwarenessGame = () => {
  const [beforeGrid, setBeforeGrid] = useState(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false))
  );
  const [afterGrid, setAfterGrid] = useState(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false))
  );
  const [editMode, setEditMode] = useState("before");
  const [solution, setSolution] = useState([]);
  const [showSolution, setShowSolution] = useState(false);
  const [impossible, setImpossible] = useState(false);
  const [afterRotation, setAfterRotation] = useState(0); // 0: 정사각형, -45: 좌 45도, 45: 우 45도

  const toggleCell = (grid, setGrid, row, col) => {
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = !newGrid[row][col];
    setGrid(newGrid);
  };

  const rotateGrid = (grid, angle) => {
    const size = grid.length;
    const newGrid = Array(size)
      .fill()
      .map(() => Array(size).fill(false));
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = j - size / 2 + 0.5;
        const y = i - size / 2 + 0.5;
        const newI = Math.floor(y * cos - x * sin + size / 2);
        const newJ = Math.floor(x * cos + y * sin + size / 2);
        if (newI >= 0 && newI < size && newJ >= 0 && newJ < size) {
          newGrid[newI][newJ] = grid[i][j];
        }
      }
    }
    return newGrid;
  };

  const flipGrid = (grid, axis) => {
    if (axis === "horizontal") {
      return grid.map((row) => [...row].reverse());
    } else {
      return [...grid].reverse();
    }
  };

  const areGridsEqual = (grid1, grid2) => {
    return JSON.stringify(grid1) === JSON.stringify(grid2);
  };

  const calculateSolution = () => {
    let bestSolution = null;
    const visited = new Set();

    const dfs = (currentGrid, steps) => {
      if (bestSolution !== null && steps.length >= bestSolution.length) {
        return;
      }

      if (areGridsEqual(currentGrid, afterGrid)) {
        if (bestSolution === null || steps.length < bestSolution.length) {
          bestSolution = steps;
        }
        return;
      }

      const gridString = JSON.stringify(currentGrid);
      if (visited.has(gridString)) {
        return;
      }
      visited.add(gridString);

      const transformations = [
        { name: "rotateRight45", func: () => rotateGrid(currentGrid, 45) },
        { name: "rotateLeft45", func: () => rotateGrid(currentGrid, -45) },
        {
          name: "flipHorizontal",
          func: () => flipGrid(currentGrid, "horizontal"),
        },
        { name: "flipVertical", func: () => flipGrid(currentGrid, "vertical") },
      ];

      for (let { name, func } of transformations) {
        const newGrid = func();
        dfs(newGrid, [...steps, name]);
      }

      visited.delete(gridString);
    };

    dfs(beforeGrid, []);

    if (bestSolution) {
      if (afterRotation === 45) {
        bestSolution.push("rotateRight45");
      } else if (afterRotation === -45) {
        bestSolution.push("rotateLeft45");
      }
      setSolution(bestSolution);
      setImpossible(false);
    } else {
      setImpossible(true);
      setSolution([]);
    }
    setShowSolution(true);
  };

  const resetGame = () => {
    setBeforeGrid(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false)));
    setAfterGrid(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false)));
    setEditMode("before");
    setSolution([]);
    setShowSolution(false);
    setImpossible(false);
    setAfterRotation(0);
  };

  const renderGrid = (grid, onCellClick, rotation = 0) => {
    const svgSize = CELL_SIZE * GRID_SIZE;
    const centerOffset = svgSize / 2;

    return (
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="mb-4"
      >
        <g transform={`rotate(${rotation} ${centerOffset} ${centerOffset})`}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * CELL_SIZE}
                y={rowIndex * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={cell ? "black" : "white"}
                stroke="gray"
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            ))
          )}
        </g>
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">
        정확한 45도 회전 계산 공간지각능력 게임
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">전 상태</h2>
            {renderGrid(
              beforeGrid,
              (row, col) =>
                editMode === "before" &&
                toggleCell(beforeGrid, setBeforeGrid, row, col)
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">
              후 상태 (회전: {afterRotation}도)
            </h2>
            {renderGrid(
              afterGrid,
              (row, col) =>
                editMode === "after" &&
                toggleCell(afterGrid, setAfterGrid, row, col),
              afterRotation
            )}
            <div className="flex justify-center mt-2">
              <Button
                onClick={() => setAfterRotation(-45)}
                variant={afterRotation === -45 ? "default" : "outline"}
                className="mr-2"
              >
                <RotateCcw size={16} className="mr-2" /> 좌 45도
              </Button>
              <Button
                onClick={() => setAfterRotation(0)}
                variant={afterRotation === 0 ? "default" : "outline"}
                className="mr-2"
              >
                <Square size={16} className="mr-2" /> 정사각형
              </Button>
              <Button
                onClick={() => setAfterRotation(45)}
                variant={afterRotation === 45 ? "default" : "outline"}
              >
                <RotateCw size={16} className="mr-2" /> 우 45도
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <Button
            onClick={() => setEditMode("before")}
            variant={editMode === "before" ? "default" : "outline"}
          >
            전 상태 편집
          </Button>
          <Button
            onClick={() => setEditMode("after")}
            variant={editMode === "after" ? "default" : "outline"}
          >
            후 상태 편집
          </Button>
          <Button onClick={calculateSolution}>
            <RefreshCw className="mr-2" /> 최적 솔루션 계산
          </Button>
        </div>
        {showSolution && (
          <Alert variant={impossible ? "destructive" : "default"}>
            <AlertTitle>
              {impossible ? "불가능한 변환" : "최적 솔루션"}
            </AlertTitle>
            <AlertDescription>
              {impossible ? (
                "주어진 변환 방법으로는 전 상태에서 후 상태로 변환할 수 없습니다."
              ) : (
                <>
                  <p>총 {solution.length}번의 변환이 필요합니다:</p>
                  {solution.map((step, index) => (
                    <span key={index} className="mr-2">
                      {step === "rotateRight45" && "우 45도 회전"}
                      {step === "rotateLeft45" && "좌 45도 회전"}
                      {step === "flipHorizontal" && "좌우 반전"}
                      {step === "flipVertical" && "상하 반전"}
                      {index < solution.length - 1 && " → "}
                    </span>
                  ))}
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={resetGame} className="w-full mt-4">
          새 게임 시작
        </Button>
      </div>
    </div>
  );
};

export default CustomSpatialAwarenessGame;
