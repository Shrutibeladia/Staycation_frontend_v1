import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

/**
 * Normalize API responses — hotels/rooms endpoints return paginated objects.
 */
const normalizeResponse = (raw, mode) => {
  if (mode === "raw") return raw;
  if (mode === "object") return raw;
  if (Array.isArray(raw)) return raw;
  if (raw?.hotels) return raw.hotels;
  if (raw?.rooms) return raw.rooms;
  if (raw?.bookings) return raw.bookings;
  if (raw?.users) return raw.users;
  return raw;
};

const extractMeta = (raw) => {
  if (!raw || Array.isArray(raw)) return null;
  if (raw.total !== undefined) {
    return { total: raw.total, page: raw.page, limit: raw.limit };
  }
  return null;
};

/**
 * Reusable GET hook with credentials and optional retry.
 * @param {string|null} url - API path after /api (e.g. "/hotels")
 * @param {object} options - { mode: 'array'|'object'|'raw', enabled: true, retry: true }
 */
const useFetch = (url, options = {}) => {
  const { mode = "array", enabled = true, retry = true } = options;
  const [data, setData] = useState(mode === "object" ? null : []);
  const [meta, setMeta] = useState(null);
  // Start as loading when a URL is provided — avoids rendering with null data before fetch
  const [loading, setLoading] = useState(() => Boolean(enabled && url));
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (targetUrl = url) => {
      if (!targetUrl || !enabled) return;
      setLoading(true);
      setError(null);

      const attempt = async () => {
        const res = await axiosInstance.get(targetUrl);
        return res.data;
      };

      try {
        let raw;
        try {
          raw = await attempt();
        } catch (firstErr) {
          // Retry idempotent GET once on network failure
          if (retry && !firstErr?.response) {
            raw = await attempt();
          } else {
            throw firstErr;
          }
        }
        setMeta(extractMeta(raw));
        const normalized = normalizeResponse(raw, mode);
        if (mode === "object" && (normalized == null || normalized === "")) {
          setData(null);
          setError({ response: { status: 404, data: { message: "Not found." } } });
        } else {
          setData(normalized);
        }
      } catch (err) {
        setError(err);
        if (mode === "object") setData(null);
        else if (mode === "array") setData([]);
      } finally {
        setLoading(false);
      }
    },
    [url, mode, enabled, retry]
  );

  useEffect(() => {
    fetchData(url);
  }, [url, fetchData]);

  return { data, meta, loading, error, reFetch: () => fetchData(url) };
};

export default useFetch;
