"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const Animation = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const circle1Ref = useRef<HTMLDivElement>(null);
    const circle2Ref = useRef<HTMLDivElement>(null);
    const circle3Ref = useRef<HTMLDivElement>(null);
    const mainCircleRef = useRef<HTMLDivElement>(null);
    const connectingLineRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

    // Initialize particles array
    useEffect(() => {
        particlesRef.current = particlesRef.current.slice(0, 12);
    }, []);

    const particles = Array.from({ length: 12 }).map((_, i) => (
        <div 
            key={i}
            ref={el => { particlesRef.current[i] = el; }}
            className="absolute w-2 h-2 rounded-full bg-white/20 pointer-events-none"
            style={{
                top: `${50 + Math.sin(i * 0.52) * 50}%`,
                left: `${50 + Math.cos(i * 0.52) * 50}%`
            }}
        />
    ));

    useEffect(() => {
        if (!containerRef.current) return;

        // Calculate positions at 80% radius (144px * 0.8 = 115.2px)
        const orbitRadius = 115;
        const positions = [
            { x: orbitRadius, y: 0 },                   // Right
            { x: -orbitRadius * 0.5, y: -orbitRadius * 0.866 }, // Top-left
            { x: -orbitRadius * 0.5, y: orbitRadius * 0.866 }   // Bottom-left
        ];

        // Create master timeline
        const masterTl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

        // Outward movement (faster)
        const outwardTl = gsap.timeline();
        
        outwardTl.to([circle1Ref.current, circle2Ref.current, circle3Ref.current], {
            x: (i) => positions[i].x,
            y: (i) => positions[i].y,
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.1
        }, 0);

        // Return to center (slower and smoother)
        const returnTl = gsap.timeline();
        
        returnTl.to([circle1Ref.current, circle2Ref.current, circle3Ref.current], {
            x: 0,
            y: 0,
            duration: 2.5,
            ease: "power1.inOut",
            stagger: 0.1
        }, "+=1"); // 1 second pause at outer position

        // Add to master timeline
        masterTl.add(outwardTl).add(returnTl);

        // Main circle animations
        if (mainCircleRef.current) {
            gsap.to(mainCircleRef.current, {
                scale: 1.05,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }

        // Connecting line rotation
        if (connectingLineRef.current) {
            gsap.to(connectingLineRef.current, {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: "none"
            });
        }

        // Particle animations
        particlesRef.current.forEach((particle, i) => {
            if (particle) {
                gsap.to(particle, {
                    x: `+=${(Math.random() - 0.5) * 30}`,
                    y: `+=${(Math.random() - 0.5) * 30}`,
                    opacity: 0.6,
                    duration: 3 + Math.random() * 3,
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.1,
                    ease: "sine.inOut"
                });
            }
        });

        // Initial entrance
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "back.out(1.7)"
        });

        return () => {
            masterTl.kill();
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="relative w-72 h-72 flex items-center justify-center rounded-full"
        >
            {/* Background elements */}
            <motion.div 
                className="absolute inset-0 rounded-full border-2 border-gray-200/20"
                animate={{
                    rotate: 360,
                    transition: {
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear"
                    }
                }}
            />
            
            {/* Connecting line */}
            <div 
                ref={connectingLineRef}
                className="absolute w-40 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform origin-center"
            />
            
            {/* Main central circle - Original colors */}
            <motion.div
                ref={mainCircleRef}
                className="absolute z-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-xl"
                whileTap={{ scale: 0.95 }}
            />
            
            {/* Orbiting circles - Original colors */}
            <motion.div
                ref={circle1Ref}
                className="absolute z-30 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg cursor-pointer"
                whileTap={{ scale: 0.9 }}
                style={{ x: 0, y: 0 }}
            />
            
            <motion.div
                ref={circle2Ref}
                className="absolute z-20 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 shadow-lg cursor-pointer"
                whileTap={{ scale: 0.9 }}
                style={{ x: 0, y: 0 }}
            />
            
            <motion.div
                ref={circle3Ref}
                className="absolute z-40 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 shadow-lg cursor-pointer"
                whileTap={{ scale: 0.9 }}
                style={{ x: 0, y: 0 }}
            />
            
            {/* Particles */}
            {particles}
            
            {/* Subtle pulse effect */}
            <motion.div 
                className="absolute inset-0 rounded-full bg-purple-500/10"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.3, 0.1],
                    transition: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            />
        </div>
    );
};

export default Animation;