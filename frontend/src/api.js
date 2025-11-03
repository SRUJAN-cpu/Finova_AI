const GETRESULT_URL = 'https://w4vebx9487.execute-api.us-east-2.amazonaws.com/getresultnew/getresult/getResult';
const API_PREFIX = 'https://k0f458l9i8.execute-api.us-east-2.amazonaws.com/fileupload';

export async function requestPresign(filename, filetype) {
  const res = await fetch(`${API_PREFIX}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, filetype })
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Presign request failed: ${res.status} ${txt}`);
  }

  let parsed;
  try {
    parsed = await res.json();
  } catch (e) {
    const txt = await res.text().catch(() => '');
    try {
      parsed = JSON.parse(txt);
    } catch (e2) {
      throw new Error('Unable to parse presign response');
    }
  }

  if (parsed && typeof parsed === 'object' && 'statusCode' in parsed && 'body' in parsed) {
    try {
      const body = parsed.body;
      return typeof body === 'string' ? JSON.parse(body) : body;
    } catch (e) {
      throw new Error('Failed to parse wrapped presign body');
    }
  }

  if (typeof parsed === 'string') {
    try {
      return JSON.parse(parsed);
    } catch (e) {
      throw new Error('Presign response is an unexpected string');
    }
  }

  return parsed;
}

export function putToS3(presignedUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl, true);
    if (file.type) xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (ev) => {
      if (onProgress && ev.lengthComputable) {
        onProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) resolve(true);
      else reject(new Error(`S3 upload failed: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('S3 upload network error'));
    xhr.send(file);
  });
}

export async function pollResult(
  bucket, resultKey, timeoutMs = 5 * 60 * 1000, intervalMs = 2000, signal = undefined
) {
  const start = Date.now();
  let attempt = 0;
  while (Date.now() - start < timeoutMs) {
    if (signal && signal.aborted) throw new Error('Polling aborted');
    const pollingUrl = GETRESULT_URL || `${API_PREFIX}/getresult`;
    attempt += 1;
    console.log(`🔄 Poll attempt #${attempt} - URL: ${pollingUrl}`);
    
    let res;
    try {
      res = await fetch(pollingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket, result_key: resultKey }),
        signal,
        mode: 'cors'
      });
    } catch (fetchErr) {
      console.warn(`Fetch error on attempt ${attempt}:`, fetchErr);
      await new Promise(r => setTimeout(r, intervalMs));
      continue;
    }

    // Always parse as text first, then JSON
    let txt = await res.text();
    let parsed = null;
    try {
      parsed = JSON.parse(txt);
    } catch (e) {
      console.warn(`❌ Failed to parse JSON on attempt ${attempt}:`, txt.substring(0, 200));
      await new Promise(r => setTimeout(r, intervalMs));
      continue;
    }
    
    console.log(`📦 Raw parsed response (attempt ${attempt}):`, parsed);
    
    // Unwrap API Gateway proxy response if present
    if (parsed && typeof parsed === 'object' && 'statusCode' in parsed && 'body' in parsed) {
      try {
        const body = parsed.body;
        if (typeof body === 'string') {
          // Replace invalid JSON values like NaN with null before parsing
          const cleanBody = body.replace(/:\s*NaN/g, ': null');
          parsed = JSON.parse(cleanBody);
        } else {
          parsed = body;
        }
        console.log(`📦 Unwrapped body (attempt ${attempt}):`, parsed);
      } catch (e) {
        console.warn(`❌ Failed to parse .body JSON on attempt ${attempt}:`, e.message);
        console.warn(`Body content (first 500 chars):`, parsed.body?.substring(0, 500));
        await new Promise(r => setTimeout(r, intervalMs));
        continue;
      }
    }
    
    // Defensive: handle double-wrapped string
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
        console.log(`📦 Double-unwrapped (attempt ${attempt}):`, parsed);
      } catch {}
    }
    
    // Check if ready is true and return immediately
    if (parsed && parsed.ready === true) {
      console.log(`✅ SUCCESS! Result is ready on attempt ${attempt}. Returning:`, parsed);
      return parsed;
    }
    
    console.log(`⏳ Not ready yet (attempt ${attempt}). Waiting ${intervalMs}ms before retry...`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('Result not ready in time');
}
