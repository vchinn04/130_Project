"use client";

import React from 'react';
import Link from 'next/link'

export default function WelcomePage() {
    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            height: '100vh',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            overflow: 'hidden'
        }}>
            <div style={{ textAlign: 'center', zIndex: 10, width: '55%' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to Group-Manager-Thing</h1>
                <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Effortlessly manage your teams and projects with our intuitive software.</p>
                <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <button style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.375rem'
                }}>
                    <Link href="/login">Get Started</Link>
                </button>
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                <div style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #ff6ec4, #7873f5)',
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite',
                    top: '10%',
                    left: '10%'
                }}></div>
                <div style={{
                    position: 'absolute',
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(45deg, #ff9ec4, #7873f5)',
                    borderRadius: '50%',
                    animation: 'float 9s ease-in-out infinite',
                    top: '10%',
                    left: '17%'
                }}></div>
                <div style={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    background: 'linear-gradient(45deg, #42e695, #3bb2b8)',
                    borderRadius: '50%',
                    animation: 'float 8s ease-in-out infinite',
                    top: '50%',
                    left: '70%'
                }}></div>
                                <div style={{
                    position: 'absolute',
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(45deg, #ff6e04, #7873f5)',
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite',
                    top: '60%',
                    left: '76%'
                }}></div>
                <div style={{
                    position: 'absolute',
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
                    borderRadius: '50%',
                    animation: 'float 10s ease-in-out infinite',
                    top: '80%',
                    left: '30%'
                }}></div>
            </div>
            <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}