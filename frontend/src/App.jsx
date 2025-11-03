import React, { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>💼 Finova AI</h1>
        <p>Intelligent Financial Analytics for Modern MSMEs</p>
      </header>

      <main className="app-main">
        <UploadPanel
          onResult={(res) => {
            setResult(res);
            setError(null);
            setLoading(false);
          }}
          onError={(err) => {
            setError(err);
            setLoading(false);
          }}
          setLoading={setLoading}
        />

        <div>
          {loading && (
            <div className="loading">
              <span style={{ fontSize: "2rem", marginRight: "0.5rem" }}>
                ⏳
              </span>
              Processing your financial data...
            </div>
          )}

          {error && (
            <div className="error">
              <strong style={{ display: "block", marginBottom: "0.5rem" }}>
                ❌ Error
              </strong>
              {error}
            </div>
          )}

          {result && <Dashboard data={result} />}

          {!loading && !error && !result && (
            <div
              style={{
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "24px",
                padding: "3rem",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📊</div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "0.75rem",
                  color: "#e2e8f0",
                }}
              >
                Ready to Analyze Your Finances
              </h3>
              <p
                style={{
                  fontSize: "1.1rem",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                Upload your financial files and get AI-powered insights, anomaly
                detection, and actionable recommendations in seconds.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        Built with ❤️ using React + Vite | Powered by AWS Lambda & S3
      </footer>
    </div>
  );
}
