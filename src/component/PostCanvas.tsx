import React from "react";
import { Download } from "lucide-react";

interface PostCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onDownload: () => void;
}

const PostCanvas: React.FC<PostCanvasProps> = ({ canvasRef, onDownload }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={1080}
        height={1350}
        className="w-full border-4 border-slate-700 rounded-lg shadow-lg"
      />
      <button
        onClick={onDownload}
        className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
      >
        <Download size={20} />
        Download as PNG
      </button>
    </div>
  );
};

export default PostCanvas;
