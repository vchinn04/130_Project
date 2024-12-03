"use client";

import React from "react";
import { SignInButton } from "@clerk/nextjs";

export default function WelcomePage() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", zIndex: 10, width: "55%" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Welcome to MatchAI
        </h1>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
          Effortlessly manage your teams and projects with our intuitive
          software.
        </p>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
          MatchAI is a space for professional and academic teams to find
          collaborators that are perfectly matched to their goals and
          personalities. It aims to remove the main drawbacks of finding a
          group, one of which is members not accurately or honestly describing
          their preferences in teams due to not feeling comfortable in their
          environment, encouraging applicants to be honest in their answers
          since they would be kept private. MatchAI uses AI insights to ideally
          match them with the most compatible people.
        </p>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
          A key aspect of the platform is the way it addresses gaps in skill
          sets. Developers, for instance, may be hesitant to reveal areas where
          they lack expertise, fearing that it could impact their opportunities.
          This allows developers to contribute effectively in areas they excel
          at while having the opportunity to learn from their teammates in other
          areas. The AI-driven matchings ensure that each member brings
          something unique to the table, fostering an environment where
          collaboration is maximized and productivity is enhanced.
        </p>
        {/* <button
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
          }} >*/}

        {/* <Link href="/login">Get Started</Link> */}
        {/* <SignInButton
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
          }}
        /> */}
        <div
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            display: "inline-block",
          }}
        >
          <SignInButton />
        </div>
        {/* </button> */}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            background: "linear-gradient(45deg, #ff6ec4, #7873f5)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            top: "10%",
            left: "10%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "40px",
            height: "40px",
            background: "linear-gradient(45deg, #ff9ec4, #7873f5)",
            borderRadius: "50%",
            animation: "float 9s ease-in-out infinite",
            top: "10%",
            left: "17%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "150px",
            height: "150px",
            background: "linear-gradient(45deg, #42e695, #3bb2b8)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite",
            top: "50%",
            left: "70%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "60px",
            height: "60px",
            background: "linear-gradient(45deg, #ff6e04, #7873f5)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            top: "60%",
            left: "76%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            background: "linear-gradient(45deg, #ff9a9e, #fad0c4)",
            borderRadius: "50%",
            animation: "float 10s ease-in-out infinite",
            top: "80%",
            left: "30%",
          }}
        ></div>
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
