import React, { useState } from "react";
import { requestPresign, pollResult } from "../api";

export default function UploadPanel({ onResult, onError, setLoading }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [bucket, setBucket] = useState("");
  const [key, setKey] = useState("");
  const [stage, setStage] = useState(null); // 'presign' | 'upload' | 'poll'
  const [presignInfo, setPresignInfo] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [controller, setController] = useState(null);
  const [lastAttempt, setLastAttempt] = useState(null);

  const handleSelect = (e) => {
    const f = e.target.files[0];
    setFile(f);
  };

  const startUpload = async () => {
    if (!file) return onError && onError("No file selected");
    setLoading(true);
    setErrorDetails(null);
    let hadError = false;
    try {
      setStage("presign");
      const meta = await requestPresign(file.name, file.type);
      setPresignInfo(meta);
      const { presigned_url, bucket: bkt, key: k } = meta;
      setBucket(bkt);
      setKey(k);

      setStage("upload");
      const ac = new AbortController();
      setController(ac);

      const uploadRes = await fetch(presigned_url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
        mode: "cors",
        credentials: "omit",
        signal: ac.signal,
      });

      if (!uploadRes.ok) {
        const body = await uploadRes.text().catch(() => "");
        throw new Error(`S3 upload failed: ${uploadRes.status} ${body}`);
      }

      setStage("poll");
      const resultKey = `results/${k}-analysis.json`;
      setLastAttempt({ time: Date.now(), url: undefined, attempt: 0 });
      const pollRes = await pollResult(
        bkt,
        resultKey,
        5 * 60 * 1000,
        3000,
        ac.signal
      );
      setLastAttempt({
        time: Date.now(),
        url: "completed",
        attempt: 1,
      });

      console.log("✓ UploadPanel: pollResult returned:", pollRes);

      if (pollRes && pollRes.ready === true) {
        console.log("✓ UploadPanel: Calling onResult with:", pollRes.result);
        setStage(null); // Clear the "Processing" stage immediately
        setLoading(false); // Stop loading BEFORE calling onResult
        onResult(pollRes.result);
      } else {
        throw new Error("Result polling finished without ready=true");
      }
    } catch (err) {
      hadError = true;
      console.error("❌ Upload/Poll error:", err);
      setErrorDetails(err.message || String(err));
      onError && onError(err.message || "Upload failed");
    } finally {
      // Ensure these are always reset
      if (hadError) {
        setLoading(false);
        setStage(null);
      }
      setProgress(0);
      setController(null);
    }
  };

  const cancel = () => {
    if (controller) {
      try {
        controller.abort();
      } catch (e) {}
      setController(null);
    }
    setStage(null);
    setLoading(false);
    setErrorDetails("Cancelled by user");
  };

  return (
    <section className="upload-panel">
      <h2>Upload financial file</h2>
      <input
        type="file"
        accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg"
        onChange={handleSelect}
      />
      <div className="upload-actions">
        <button onClick={startUpload} disabled={!file}>
          Upload & Analyze
        </button>
      </div>
      {file && (
        <div className="file-meta">
          Selected: {file.name} ({Math.round(file.size / 1024)} KB)
        </div>
      )}

      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>

      {stage && (
        <div className="stage">
          {stage === "presign" && "Preparing upload..."}
          {stage === "upload" && `Uploading... ${progress}%`}
          {stage === "poll" && "Processing on cloud, waiting for results..."}
        </div>
      )}

      {presignInfo && (
        <div className="presign-info">
          <strong>Presign:</strong>
          <div>bucket: {presignInfo.bucket}</div>
          <div>key: {presignInfo.key}</div>
          <div style={{ marginTop: 6 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard &&
                  navigator.clipboard.writeText(presignInfo.presigned_url);
              }}
            >
              Copy presigned URL
            </a>
          </div>
        </div>
      )}
      {lastAttempt && (
        <div style={{ marginTop: 6, color: "#9fb3c8" }}>
          Last poll: {new Date(lastAttempt.time).toLocaleTimeString()}{" "}
          {lastAttempt.url ? `url: ${lastAttempt.url}` : ""}
        </div>
      )}

      {errorDetails && (
        <div className="error">Error: {String(errorDetails)}</div>
      )}

      {controller && (
        <div style={{ marginTop: 8 }}>
          <button onClick={cancel}>Cancel</button>
        </div>
      )}
    </section>
  );
}
