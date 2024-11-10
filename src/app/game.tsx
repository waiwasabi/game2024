'use client'

import React, { useState, useEffect } from 'react';
import pixels from '../../public/pixels.json';
import Image_Generator from './image_generator';


const OceanPlatformer = () => {
  const [platformImg, setPlatformImg] = useState("platform.png");
  const [portalImg, setPortalImg] = useState("portal.png");
  const [backgroundImg, setBackgroundImg] = useState("background.png");

  const [platforms, setPlatforms] = useState(pixels["platforms"]);
  const [portal, setPortal] = useState(pixels["portal"]);

  const [playerPos, setPlayerPos] = useState(pixels["player"]);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isWalkingFrame1, setIsWalkingFrame1] = useState(true);

  const [testingMode, setTestingMode] = useState(true);

  // Pixel style
  const pixel_width = 40

  // Game constants
  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const MOVE_SPEED = 5;

  const isMoving = velocity.x !== 0 || velocity.y !== 0; // Check if the player is moving

  useEffect(() => {
    let interval;
    if (isMoving) {
      // Start the animation interval if the player is moving
      interval = setInterval(() => {
        setIsWalkingFrame1(prev => !prev);
      }, 200); // Adjust interval for desired walking speed
    } else {
      // Reset to the first frame when not moving
      setIsWalkingFrame1(true);
    }

    // Clear the interval when the player stops moving
    return () => clearInterval(interval);
  }, [isMoving]);


  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameWon) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          setVelocity(v => ({ ...v, x: -MOVE_SPEED }));
          break;
        case 'ArrowRight':
          setVelocity(v => ({ ...v, x: MOVE_SPEED }));
          break;
        case ' ':
        case 'ArrowUp':
          if (!isJumping) {
            setVelocity(v => ({ ...v, y: JUMP_FORCE }));
            setIsJumping(true);
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (gameWon) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          setVelocity(v => ({ ...v, x: 0 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, gameWon]);


  // Game loop
  useEffect(() => {
    if (gameWon) return;

    const gameLoop = setInterval(() => {
      setPlayerPos(pos => {
        const newPos = {
          x: pos.x + velocity.x,
          y: pos.y + velocity.y
        };

        // Apply gravity
        setVelocity(v => ({ ...v, y: v.y + GRAVITY }));

        // Check platform collisions
        let onPlatform = false;
        platforms.forEach(platform => {
          if (newPos.x + pixel_width >= platform.x &&
              newPos.x < platform.x + pixel_width &&
              newPos.y + pixel_width >= platform.y &&
              newPos.y + pixel_width <= platform.y + pixel_width + 5) {
            newPos.y = platform.y - pixel_width;
            setVelocity(v => ({ ...v, y: 0 }));
            setIsJumping(false);
            onPlatform = true;
          }
        });

        // Check portal collision
        if (newPos.x + pixel_width > portal.x &&
            newPos.x < portal.x + pixel_width &&
            newPos.y + 40 > portal.y &&
            newPos.y < portal.y + 2 * pixel_width) {
          setGameWon(true);
        }

        if(newPos.y > 340) {
          newPos.x = pixels["player"].x;
          newPos.y = pixels["player"].y;
        }

        // Boundary checks
        newPos.x = Math.max(0, Math.min(newPos.x, 750));
        newPos.y = Math.min(newPos.y, 360);

        return newPos;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [velocity, gameWon]);

  return (
    <div>
    <div className="relative w-3/4 mx-auto h-96 bg-blue-200 overflow-hidden rounded-lg border-4 border-blue-400">
      {/* Ocean background elements */}
      <img src={backgroundImg}/>

      {/* Platforms */}
      {platforms.map((platform, index) => (
        <img
          src={platformImg}
          key={index}
          className="absolute bg-amber-800 rounded"
          style={{
            left: platform.x,
            top: platform.y,
            width: pixel_width,
            height: pixel_width
          }}
        />
      ))}

      {/* Portal */}
      <img
        src = {portalImg}
        className="absolute bg-yellow-400 rounded animate-pulse"
        style={{
          left: portal.x,
          top: portal.y,
          width: pixel_width,
          height: pixel_width * 2
        }}
      />

      {/* Player */}
      <img
        src = {isWalkingFrame1 ? "stand.png" : "walk.png"}
        className="absolute rounded"
        style={{
          left: playerPos.x,
          top: playerPos.y,
          width: pixel_width,
          height: pixel_width,
          transition: 'transform 0.1s',
          transform: `scaleX(${velocity.x < 0 ? -1 : 1})`
        }}
      />

      {/* Win message */}
      {gameWon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-4xl text-white font-bold">You Win!</div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-blue-800">
        <p>Use arrow keys to move</p>
        <p>Space or Up arrow to jump</p>
        <p>Reach the yellow portal to win!</p>
      </div>
    </div>

    <div>
        <Image_Generator setBackgroundImg={setBackgroundImg} setPlatformImg={setPlatformImg} setPortalImg={setPortalImg}/>
    </div>

    {/* <div>
      <p>{backgroundImg}</p>
    </div> */}
      
  </div>

  );
};

export default OceanPlatformer;