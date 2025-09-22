import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  MapPin, Navigation, Waves, Thermometer, Droplets, 
  Eye, EyeOff, RotateCcw, Settings, Globe, Layers,
  BarChart3, TrendingUp, Database, Activity
} from 'lucide-react';

// Enhanced mock data with 3D positioning and depth profiles
const mockFloats = [
  { 
    id: "5906298", 
    lat: 35.2, 
    lng: -65.8, 
    temp: 18.5, 
    salinity: 35.2, 
    depth: 2000,
    status: "active",
    lastProfile: "2024-01-15",
    bgcEnabled: false,
    qc: "GOOD",
    platform: "APEX",
    batteryLevel: 85,
    // Convert lat/lng to 3D coordinates
    x: ((-65.8 + 180) / 360) * 20 - 10, // Normalize longitude to -10 to 10
    z: ((35.2 + 90) / 180) * 20 - 10,   // Normalize latitude to -10 to 10
    y: -2000 / 500, // Depth scaled down
    // Depth profile data
    depthProfile: [
      { depth: 0, temp: 18.5, salinity: 35.2 },
      { depth: 10, temp: 18.2, salinity: 35.3 },
      { depth: 50, temp: 16.8, salinity: 35.5 },
      { depth: 100, temp: 14.2, salinity: 35.8 },
      { depth: 200, temp: 11.5, salinity: 35.9 },
      { depth: 500, temp: 8.1, salinity: 35.7 },
      { depth: 1000, temp: 5.2, salinity: 35.1 },
      { depth: 1500, temp: 3.8, salinity: 34.9 },
      { depth: 2000, temp: 2.9, salinity: 34.8 }
    ],
    profileCount: 145,
    dataQuality: 94.2
  },
  { 
    id: "5906299", 
    lat: 40.1, 
    lng: -70.2, 
    temp: 15.2, 
    salinity: 35.8, 
    depth: 1800,
    status: "active",
    lastProfile: "2024-01-14",
    bgcEnabled: true,
    qc: "GOOD",
    platform: "NOVA",
    batteryLevel: 92,
    x: ((-70.2 + 180) / 360) * 20 - 10,
    z: ((40.1 + 90) / 180) * 20 - 10,
    y: -1800 / 500,
    depthProfile: [
      { depth: 0, temp: 15.2, salinity: 35.8 },
      { depth: 10, temp: 15.0, salinity: 35.9 },
      { depth: 50, temp: 14.2, salinity: 36.0 },
      { depth: 100, temp: 12.8, salinity: 36.1 },
      { depth: 200, temp: 10.5, salinity: 35.8 },
      { depth: 500, temp: 7.8, salinity: 35.5 },
      { depth: 1000, temp: 4.9, salinity: 35.0 },
      { depth: 1500, temp: 3.5, salinity: 34.8 },
      { depth: 1800, temp: 2.8, salinity: 34.7 }
    ],
    profileCount: 89,
    dataQuality: 96.8
  },
  { 
    id: "5906300", 
    lat: 32.8, 
    lng: -64.1, 
    temp: 20.1, 
    salinity: 34.9, 
    depth: 1950,
    status: "inactive",
    lastProfile: "2024-01-10",
    bgcEnabled: false,
    qc: "QUESTIONABLE",
    platform: "APEX",
    batteryLevel: 23,
    x: ((-64.1 + 180) / 360) * 20 - 10,
    z: ((32.8 + 90) / 180) * 20 - 10,
    y: -1950 / 500,
    depthProfile: [
      { depth: 0, temp: 20.1, salinity: 34.9 },
      { depth: 10, temp: 19.8, salinity: 35.0 },
      { depth: 50, temp: 18.5, salinity: 35.2 },
      { depth: 100, temp: 16.2, salinity: 35.4 },
      { depth: 200, temp: 13.1, salinity: 35.6 },
      { depth: 500, temp: 9.2, salinity: 35.3 },
      { depth: 1000, temp: 5.8, salinity: 34.9 },
      { depth: 1500, temp: 4.1, salinity: 34.7 },
      { depth: 1950, temp: 3.2, salinity: 34.6 }
    ],
    profileCount: 67,
    dataQuality: 78.5
  },
  { 
    id: "5906301", 
    lat: 38.5, 
    lng: -68.9, 
    temp: 16.8, 
    salinity: 35.4, 
    depth: 2100,
    status: "active",
    lastProfile: "2024-01-12",
    bgcEnabled: true,
    qc: "GOOD",
    platform: "NAVIS",
    batteryLevel: 76,
    x: ((-68.9 + 180) / 360) * 20 - 10,
    z: ((38.5 + 90) / 180) * 20 - 10,
    y: -2100 / 500,
    depthProfile: [
      { depth: 0, temp: 16.8, salinity: 35.4 },
      { depth: 10, temp: 16.5, salinity: 35.5 },
      { depth: 50, temp: 15.1, salinity: 35.7 },
      { depth: 100, temp: 13.4, salinity: 35.9 },
      { depth: 200, temp: 10.8, salinity: 36.0 },
      { depth: 500, temp: 7.5, salinity: 35.6 },
      { depth: 1000, temp: 4.6, salinity: 35.2 },
      { depth: 1500, temp: 3.3, salinity: 34.9 },
      { depth: 2000, temp: 2.5, salinity: 34.7 },
      { depth: 2100, temp: 2.2, salinity: 34.6 }
    ],
    profileCount: 203,
    dataQuality: 91.7
  },
];

// Simple Profile Plot Component
function ProfilePlot({ data, parameter, color }: { 
  data: Array<{ depth: number; temp: number; salinity: number }>, 
  parameter: 'temp' | 'salinity',
  color: string 
}) {
  const maxDepth = Math.max(...data.map(d => d.depth));
  const values = data.map(d => d[parameter]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  return (
    <div className="relative h-48 w-full bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-4">
      <div className="text-xs font-medium mb-2 text-slate-700">
        {parameter === 'temp' ? 'Temperature (°C)' : 'Salinity (PSU)'} vs Depth
      </div>
      <svg className="w-full h-full" viewBox="0 0 200 160">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(percent => (
          <line
            key={percent}
            x1="30"
            y1={30 + (percent * 100) / 100}
            x2="180"
            y2={30 + (percent * 100) / 100}
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Profile line */}
        <polyline
          points={data.map((d, i) => {
            const x = 30 + ((d[parameter] - minValue) / (maxValue - minValue)) * 150;
            const y = 30 + (d.depth / maxDepth) * 100;
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = 30 + ((d[parameter] - minValue) / (maxValue - minValue)) * 150;
          const y = 30 + (d.depth / maxDepth) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={color}
            />
          );
        })}
        
        {/* Axes labels */}
        <text x="15" y="35" fontSize="8" fill="#64748b" textAnchor="middle">0m</text>
        <text x="15" y="135" fontSize="8" fill="#64748b" textAnchor="middle">{maxDepth}m</text>
        <text x="30" y="150" fontSize="8" fill="#64748b" textAnchor="middle">{minValue.toFixed(1)}</text>
        <text x="180" y="150" fontSize="8" fill="#64748b" textAnchor="middle">{maxValue.toFixed(1)}</text>
      </svg>
    </div>
  );
}

// Ocean Floor Component
function OceanFloor() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create heightmap for ocean floor
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 64, 64);
    const positions = geo.attributes.position.array as Float32Array;
    
    // Add some variation to the ocean floor
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 1];
      // Create some underwater mountains and valleys
      positions[i + 2] = -5 + Math.sin(x * 0.5) * Math.cos(z * 0.3) * 2;
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      color: new THREE.Color(0x1e3a8a), // Deep blue
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} />
  );
}

// Water Surface Component
function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <Plane 
      ref={meshRef}
      args={[20, 20]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]}
    >
      <meshPhongMaterial 
        color={new THREE.Color(0x006994)}
        transparent 
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </Plane>
  );
}

// 3D Float Marker Component
// Enhanced Float Marker with Rich Hover Tooltips
function FloatMarker({ float, isSelected, onSelect, onHover }: { 
  float: typeof mockFloats[0], 
  isSelected: boolean, 
  onSelect: () => void,
  onHover: (float: typeof mockFloats[0] | null) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      if (isSelected) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      } else if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = useMemo(() => {
    if (float.status === "active") return float.bgcEnabled ? "#10b981" : "#3b82f6";
    return "#f59e0b";
  }, [float.status, float.bgcEnabled]);

  const handlePointerOver = () => {
    setHovered(true);
    onHover(float);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
  };

  return (
    <group position={[float.x, float.y, float.z]}>
      {/* Main float body */}
      <Sphere
        ref={meshRef}
        args={[0.1, 16, 16]}
        onClick={onSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshPhongMaterial 
          color={color} 
          emissive={isSelected || hovered ? color : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
        />
      </Sphere>
      
      {/* Depth indicator line */}
      <Box args={[0.01, Math.abs(float.y), 0.01]} position={[0, float.y / 2, 0]}>
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.8 : 0.5} />
      </Box>
      
      {/* Enhanced Float ID and Status label */}
      {(isSelected || hovered) && (
        <>
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.08}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            #{float.id}
          </Text>
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.05}
            color={float.status === "active" ? "#10b981" : "#ef4444"}
            anchorX="center"
            anchorY="middle"
          >
            {float.status.toUpperCase()}
          </Text>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.04}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {float.temp}°C | {float.salinity} PSU
          </Text>
        </>
      )}
      
      {/* Status indicator */}
      <Sphere args={[0.02, 8, 8]} position={[0.15, 0, 0]}>
        <meshBasicMaterial 
          color={float.status === "active" ? "#10b981" : "#ef4444"} 
        />
      </Sphere>

      {/* BGC indicator */}
      {float.bgcEnabled && (
        <Sphere args={[0.015, 8, 8]} position={[-0.15, 0, 0]}>
          <meshBasicMaterial color="#8b5cf6" />
        </Sphere>
      )}
    </group>
  );
}

// Underwater Particles Component
function UnderwaterParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * -6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="#87ceeb" transparent opacity={0.6} />
    </points>
  );
}

// Main 3D Scene Component
function Scene3D({ selectedFloat, onFloatSelect, showParticles, onFloatHover }: {
  selectedFloat: string | null;
  onFloatSelect: (id: string | null) => void;
  showParticles: boolean;
  onFloatHover: (float: typeof mockFloats[0] | null) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#87ceeb" />
      
      {/* Ocean components */}
      <WaterSurface />
      <OceanFloor />
      
      {/* Float markers */}
      {mockFloats.map((float) => (
        <FloatMarker
          key={float.id}
          float={float}
          isSelected={selectedFloat === float.id}
          onSelect={() => onFloatSelect(selectedFloat === float.id ? null : float.id)}
          onHover={onFloatHover}
        />
      ))}
      
      {/* Underwater atmosphere */}
      {showParticles && <UnderwaterParticles />}
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  );
}

// Comprehensive Data Table Component
function FloatDataTable({ floats, selectedFloat, onFloatSelect }: {
  floats: typeof mockFloats;
  selectedFloat: string | null;
  onFloatSelect: (id: string) => void;
}) {
  const [sortBy, setSortBy] = useState<'id' | 'status' | 'depth' | 'temp' | 'salinity' | 'dataQuality'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAndSortedFloats = useMemo(() => {
    let filtered = floats;
    
    if (filterStatus !== 'all') {
      filtered = floats.filter(f => f.status === filterStatus);
    }
    
    return filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [floats, sortBy, sortOrder, filterStatus]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            ARGO Float Data Table
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
              {filteredAndSortedFloats.length} floats
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="text-xs">Filter:</Label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('id')}>
                  Float ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-2">Position</th>
                <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('depth')}>
                  Depth (m) {sortBy === 'depth' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('temp')}>
                  Temp (°C) {sortBy === 'temp' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('salinity')}>
                  Salinity {sortBy === 'salinity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-2">Platform</th>
                <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('dataQuality')}>
                  Quality (%) {sortBy === 'dataQuality' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedFloats.map((float) => (
                <tr 
                  key={float.id} 
                  className={`border-b hover:bg-blue-50 transition-colors ${
                    selectedFloat === float.id ? 'bg-blue-100' : ''
                  }`}
                >
                  <td className="p-2 font-medium">#{float.id}</td>
                  <td className="p-2">
                    <Badge 
                      variant={float.status === "active" ? "outline" : "secondary"}
                      className="text-xs"
                    >
                      {float.status}
                    </Badge>
                  </td>
                  <td className="p-2">{float.lat.toFixed(1)}°N, {Math.abs(float.lng).toFixed(1)}°W</td>
                  <td className="p-2">{float.depth}</td>
                  <td className="p-2">{float.temp}</td>
                  <td className="p-2">{float.salinity}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      {float.platform}
                      {float.bgcEnabled && (
                        <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                          BGC
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            float.dataQuality >= 90 ? 'bg-green-500' : 
                            float.dataQuality >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${float.dataQuality}%` }}
                        />
                      </div>
                      <span>{float.dataQuality}%</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFloatSelect(float.id)}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Hover Tooltip Component
function HoverTooltip({ hoveredFloat }: { hoveredFloat: typeof mockFloats[0] | null }) {
  if (!hoveredFloat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute top-4 right-4 z-10 pointer-events-none"
    >
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm max-w-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            Float #{hoveredFloat.id}
            <Badge variant="outline" className="text-xs">
              {hoveredFloat.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-500" />
              <span>{hoveredFloat.lat.toFixed(2)}°N</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-500" />
              <span>{Math.abs(hoveredFloat.lng).toFixed(2)}°W</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-red-500" />
              <span>{hoveredFloat.temp}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-500" />
              <span>{hoveredFloat.salinity} PSU</span>
            </div>
            <div className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-cyan-500" />
              <span>{hoveredFloat.depth}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-green-500" />
              <span>{hoveredFloat.dataQuality}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            Platform: {hoveredFloat.platform} | Profiles: {hoveredFloat.profileCount}
            {hoveredFloat.bgcEnabled && (
              <Badge variant="outline" className="ml-1 text-xs bg-purple-100 text-purple-700">
                BGC Enabled
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Map3D Component
export function Map3D() {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [hoveredFloat, setHoveredFloat] = useState<typeof mockFloats[0] | null>(null);
  const [showParticles, setShowParticles] = useState(true);
  const [cameraMode, setCameraMode] = useState<'free' | 'follow'>('free');
  const [showDataTable, setShowDataTable] = useState(false);

  const selectedFloatData = selectedFloat ? mockFloats.find(f => f.id === selectedFloat) : null;

  return (
    <TooltipProvider>
      <div className="h-full space-y-4 relative">
        {/* Hover Tooltip */}
        <HoverTooltip hoveredFloat={hoveredFloat} />

        {/* 3D Map Controls */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                3D Ocean World Explorer
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100">
                  {mockFloats.length} floats
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDataTable(!showDataTable)}
                >
                  <Database className="w-3 h-3 mr-1" />
                  {showDataTable ? 'Hide' : 'Show'} Table
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedFloat(null)}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset View
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="particles"
                    checked={showParticles}
                    onCheckedChange={setShowParticles}
                  />
                  <Label htmlFor="particles" className="text-sm">
                    <Waves className="w-3 h-3 inline mr-1" />
                    Underwater Particles
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="camera-follow"
                    checked={cameraMode === 'follow'}
                    onCheckedChange={(checked) => setCameraMode(checked ? 'follow' : 'free')}
                  />
                  <Label htmlFor="camera-follow" className="text-sm">
                    <Eye className="w-3 h-3 inline mr-1" />
                    Follow Mode
                  </Label>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                Hover floats for details • Click to explore • Drag to rotate • Scroll to zoom
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        {showDataTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FloatDataTable 
              floats={mockFloats}
              selectedFloat={selectedFloat}
              onFloatSelect={setSelectedFloat}
            />
          </motion.div>
        )}

        {/* 3D Canvas */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm overflow-hidden h-96">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                {selectedFloat ? `Float #${selectedFloat} - 3D View` : '3D Ocean Environment'}
                <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                  Real-time 3D
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <div className="h-full bg-gradient-to-b from-sky-200 to-blue-900">
              <Canvas
                camera={{ position: [10, 5, 10], fov: 60 }}
                style={{ height: '100%', width: '100%' }}
              >
                <Scene3D 
                  selectedFloat={selectedFloat}
                  onFloatSelect={setSelectedFloat}
                  showParticles={showParticles}
                  onFloatHover={setHoveredFloat}
                />
              </Canvas>
            </div>
          </CardContent>
        </Card>

        {/* Selected Float Details */}
        {selectedFloatData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {/* Basic Info Card */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    Float #{selectedFloatData.id} - Detailed Analysis
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                      {selectedFloatData.profileCount} profiles
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedFloat(null)}>
                    <EyeOff className="w-3 h-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-sm font-medium text-slate-800 mb-2">Position & Depth</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span>{selectedFloatData.lat.toFixed(2)}°N, {Math.abs(selectedFloatData.lng).toFixed(2)}°W</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Waves className="w-3 h-3 text-cyan-500" />
                        <span>Max Depth: {selectedFloatData.depth}m</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-sm font-medium text-slate-800 mb-2">Surface Measurements</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-3 h-3 text-red-500" />
                        <span>Temperature: {selectedFloatData.temp}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span>Salinity: {selectedFloatData.salinity} PSU</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-sm font-medium text-slate-800 mb-2">Status & Platform</div>
                    <div className="space-y-2 text-xs">
                      <Badge variant={selectedFloatData.status === "active" ? "outline" : "secondary"}>
                        {selectedFloatData.status}
                      </Badge>
                      <div>Platform: {selectedFloatData.platform}</div>
                      <div>Battery: {selectedFloatData.batteryLevel}%</div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-sm font-medium text-slate-800 mb-2">Data Quality</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-green-500" />
                        <span>Quality: {selectedFloatData.dataQuality}%</span>
                      </div>
                      <div>QC Status: {selectedFloatData.qc}</div>
                      <div>BGC: {selectedFloatData.bgcEnabled ? 'Enabled' : 'Disabled'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Plots */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Depth Profile Analysis
                  <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                    {selectedFloatData.depthProfile.length} measurements
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfilePlot 
                    data={selectedFloatData.depthProfile} 
                    parameter="temp" 
                    color="#ef4444" 
                  />
                  <ProfilePlot 
                    data={selectedFloatData.depthProfile} 
                    parameter="salinity" 
                    color="#3b82f6" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  Profile Data Table
                  <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-700">
                    Last profile: {selectedFloatData.lastProfile}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-2 font-medium text-slate-700">Depth (m)</th>
                        <th className="text-left p-2 font-medium text-slate-700">Temperature (°C)</th>
                        <th className="text-left p-2 font-medium text-slate-700">Salinity (PSU)</th>
                        <th className="text-left p-2 font-medium text-slate-700">Density</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFloatData.depthProfile.map((point, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-white/50">
                          <td className="p-2 font-mono">{point.depth}</td>
                          <td className="p-2 font-mono text-red-600">{point.temp.toFixed(2)}</td>
                          <td className="p-2 font-mono text-blue-600">{point.salinity.toFixed(2)}</td>
                          <td className="p-2 font-mono text-slate-600">
                            {(1000 + (point.salinity - 35) * 0.8 - (point.temp - 4) * 0.2).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  );
}