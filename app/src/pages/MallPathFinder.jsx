// src/MallPathFinder.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const mockFeatures = [
  { title: "Parking", description: "Custom feature placeholder", path: "/name" },
  { title: "SOS", description: "Custom feature placeholder", path: "/name" },
  { title: "Name", description: "Custom feature placeholder", path: "/name" },
  { title: "Name", description: "Custom feature placeholder", path: "/name" },
];

// Convert all graph keys to lowercase internally
const normalizeGraph = (graph) => {
  const lowerGraph = {};
  for (const key in graph) {
    lowerGraph[key.toLowerCase()] = {
      ...graph[key],
      connections: graph[key].connections.map((c) => c.toLowerCase()),
    };
  }
  return lowerGraph;
};

// BFS with lowercase lookups
const findShortestPathWithFloors = (graph, start, end) => {
  start = start.toLowerCase();
  end = end.toLowerCase();

  let queue = [[start]];
  let visited = new Set();

  while (queue.length > 0) {
    let path = queue.shift();
    let node = path[path.length - 1];

    if (node === end) return path;

    if (!visited.has(node)) {
      visited.add(node);
      for (let neighbor of graph[node]?.connections || []) {
        if (!visited.has(neighbor)) {
          queue.push([...path, neighbor]);
        }
      }
    }
  }
  return [];
};

// Mall Graph ✅
const rawMallGraph = {
  "Nike": { floor: 0, connections: ["Puma", "Skechers", "Reebok"] },
  "Puma": { floor: 0, connections: ["Nike", "Reebok", "Staircase1", "Skechers"] },
  "Skechers": { floor: 0, connections: ["Nike", "Reebok", "Puma", "Kids Corner"] },
  "Reebok": { floor: 0, connections: ["Skechers", "Burger King"] },
  "Burger King": { floor: 0, connections: ["Kids Corner", "Reebok", "McDonald's", "Staircase1"] },
  "McDonald's": { floor: 0, connections: ["Burger King", "The Concourse", "Staircase1"] },
  "Kids Corner": { floor: 0, connections: ["Burger King", "Cafe Coffee Day", "Plam", "Skechers", "Reebok"] },
  "Cafe Coffee Day": { floor: 0, connections: ["Kids Corner", "Perfume Shop", "Plam", "Burger King"] },
  "Perfume Shop": { floor: 0, connections: ["Plam", "Cafe Coffee Day", "Burger King"] },
  "The Concourse": { floor: 0, connections: ["McDonald's", "Staircase2"] },
  "Maintenance Area": { floor: 0, connections: ["Elevator", "Staircase2"] },
  "Display Area": { floor: 0, connections: ["Elevator"] },
  "Plam": { floor: 0, connections: ["Perfume Shop", "Cafe Coffee Day", "Kids Corner"] },
  "Pantaloons": { floor: 1, connections: ["PepperFry", "RockClimbing1", "Staircase1"] },
  "PepperFry": { floor: 1, connections: ["Pantaloons", "RockClimbing1"] },
  "RockClimbing1": { floor: 1, connections: ["Pantaloons", "PepperFry", "RockClimbing2", "Lifestyle"] },
  "RockClimbing2": { floor: 1, connections: ["RockClimbing1", "Marks & Spencer", "Lifestyle", "ZARA", "Starbucks", "Gucci"] },
  "Marks & Spencer": { floor: 1, connections: ["RockClimbing2", "Gucci"] },
  "Gucci": { floor: 1, connections: ["Marks & Spencer", "Cafe Noir", "Elevator", "RockClimbing2", "Starbucks"] },
  "Cafe Noir": { floor: 1, connections: ["Gucci", "Elevator"] },
  "Lifestyle": { floor: 1, connections: ["Staircase1", "ZARA", "RockClimbing1", "RockClimbing2"] },
  "ZARA": { floor: 1, connections: ["Staircase2", "Lifestyle", "Starbucks", "RockClimbing2"] },
  "Starbucks": { floor: 1, connections: ["ZARA", "Woodland", "RockClimbing2", "Gucci", "Staircase2"] },
  "Woodland": { floor: 1, connections: ["Starbucks", "Elevator", "Staircase2"] },
  "KFC": { floor: 2, connections: ["Domino's", "Staircase1", "Anchor Store"] },
  "Domino's": { floor: 2, connections: ["Apple Store", "Zodiac", "KFC", "Anchor Store"] },
  "Zodiac": { floor: 2, connections: ["Domino's", "Anchor Store", "Food Stall", "Apple Store"] },
  "Apple Store": { floor: 2, connections: ["Domino's", "Food Stall", "Zodiac"] },
  "Food Stall": { floor: 2, connections: ["Zodiac", "Apple Store", "Anchor Store"] },
  "Anchor Store": { floor: 2, connections: ["Domino's", "Zodiac", "Atrium", "Staircase1", "Food Stall", "KFC"] },
  "Atrium": { floor: 2, connections: ["Anchor Store", "Thriller Room", "Staircase1", "Staircase2", "Washroom"] },
  "Thriller Room": { floor: 2, connections: ["Atrium", "Tanishq", "Washroom", "Titan"] },
  "Tanishq": { floor: 2, connections: ["Thriller Room", "Elevator", "Titan"] },
  "US Polo": { floor: 2, connections: ["Washroom", "Staircase2", "Elevator"] },
  "Washroom": { floor: 2, connections: ["US Polo", "Staircase2", "Elevator", "Atrium", "Titan"] },
  "Titan": { floor: 2, connections: ["Washroom", "Thriller Room", "Tanishq", "Elevator"] },
  "KK Cinemas": { floor: 3, connections: ["Fun Land"] },
  "Fun Land": { floor: 3, connections: ["Book Tickets", "Elevator", "Snacks Counter"] },
  "Book Tickets": { floor: 3, connections: ["Fun Land", "Elevator"] },
  "Snacks Counter": { floor: 3, connections: ["Fun Land", "Elevator"] },
  "Staircase1": { floor: "multi", connections: ["Burger King", "Puma", "Reebok", "McDonald's", "Lifestyle", "Pantaloons", "KFC", "Anchor Store", "Atrium","KK Cinemas","Fun Land"] },
  "Staircase2": { floor: "multi", connections: ["The Concourse", "Maintenance Area", "ZARA", "Starbucks", "Woodland", "Washroom", "US Polo", "Atrium","Fun Land","Book Tickets"] },
  "Elevator": { floor: "multi", connections: ["Maintenance Area", "Display Area", "Woodland", "Gucci", "Cafe Noir", "US Polo", "Washroom", "Tanishq", "Titan","Book Tickets","Snack Counter"] }
};

// Normalize graph once
const mallGraph = normalizeGraph(rawMallGraph);

const MallPathFinder = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [path, setPath] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const navigate = useNavigate();

  const handleFindPath = () => {
    if (start && end) {
      const shortestPath = findShortestPathWithFloors(mallGraph, start, end);
      setPath(shortestPath);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative font-sans"
      style={{ backgroundImage: "url('/mall5.png')" }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/70"></div>

      <div className="relative z-10 flex flex-col items-center justify-center py-24 px-6 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 drop-shadow-lg text-center">
          Mall Path Finder
        </h1>

        {/* Input Section */}
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              id="startPoint"
              name="startPoint"
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Enter Start Point"
              className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-900"
            />
            <input
              id="endPoint"
              name="endPoint"
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="Enter End Point"
              className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-900"
            />
          </div>
          <button
            onClick={handleFindPath}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition shadow-lg"
          >
            Find Path
          </button>
        </div>

        {/* Path Display */}
        {path.length > 0 ? (
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-2xl mb-12">
            <h2 className="text-2xl font-semibold mb-4">Shortest Path:</h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
              {path.map((location, index) => {
                const floorChange =
                  index > 0 &&
                  mallGraph[location].floor !== mallGraph[path[index - 1]].floor;

                // Restore original casing when displaying
                const displayName = Object.keys(rawMallGraph).find(
                  (k) => k.toLowerCase() === location
                ) || location;

                return (
                  <li key={index}>
                    {displayName}{" "}
                    {floorChange && (
                      <span className="text-yellow-300 font-medium">
                        (Floor change: {mallGraph[location].floor})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-lg text-gray-300 mb-12">No path found</div>
        )}

        {/* 3D Map Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-5xl h-[60vh]">
          <Canvas>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Model />
            <OrbitControls 
              minDistance={5}
              maxDistance={120}
            />
          </Canvas>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Features</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {mockFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-200">{feature.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Floating Chat Icon */}
      <button
        onClick={() => setShowReview(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowReview(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Leave a Review</h2>
            <textarea
              id="review"
              name="review"
              rows="4"
              placeholder="Write your review..."
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition shadow-lg">
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component to load and render the 3D model
function Model() {
  const gltf = useGLTF("/mallfinal.glb");
  return (
    <primitive 
      object={gltf.scene} 
      scale={[0.5, 0.5, 0.5]}
      position={[0, -2, 0]}
    />
  );
}

export default MallPathFinder;
