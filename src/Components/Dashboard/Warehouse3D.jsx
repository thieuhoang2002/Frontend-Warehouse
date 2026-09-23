/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import ShelfModel from '../Model3D/ShelfModel';

function Warehouse3D() {
  const rows = 4; // Số hàng
  const columns = 5; // Số kệ mỗi hàng
  const shelfSpacingX = 5; // Khoảng cách ngang giữa các kệ
  const shelfSpacingZ = 5; // Khoảng cách dọc giữa các hàng

  return (
    <Canvas
      orthographic
      camera={{ zoom: 15, position: [15, 20, 30] }}
      style={{ backgroundColor: '#1c1b1b', width: '100%', height: '50vh' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <gridHelper args={[50, 50, '#444', '#222']} />

      {/* Vẽ nhiều kệ với đúng trục X, Y, Z */}
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: columns }).map((_, columnIndex) => (
          <ShelfModel
            key={`${rowIndex}-${columnIndex}`}
            position={[
              columnIndex * shelfSpacingX - (columns * shelfSpacingX) / 2.2, // Lùi về hướng X âm
              0.5, // Tầng mặc định
              rowIndex * shelfSpacingZ - (rows * shelfSpacingZ) / 1.5, // Điều chỉnh trục Z để căn giữa
            ]}
          />
        ))
      )}
 
      <mesh position={[-6, 0, 12]} scale={[12, 0.01, 5]}>
        <boxGeometry />
        <meshStandardMaterial color="#ff5d54" />
        <Text
          position={[0, 1, 0]}  // Đặt tại vị trí trên bề mặt của box
          rotation={[-Math.PI / 2, 1, 0]}  // Xoay chữ 90 độ về phía mặt sàn
          fontSize={0.150}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Nhận/Đóng hàng
        </Text>
      </mesh>

      <mesh position={[8, 0, 12]} scale={[8, 0.01, 5]}>
        <boxGeometry />
        <meshStandardMaterial color="#1384ed" />
        <Text
          position={[0, 1, 0]}  // Đặt tại vị trí trên bề mặt của box
          rotation={[-Math.PI / 2, 1, 0]}  // Xoay chữ 90 độ về phía mặt sàn
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Vận chuyển
        </Text>
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}

export default Warehouse3D