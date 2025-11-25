// lib/api.ts  ——  新文件，直接创建
const CONFIG = require('../config.json');

export async function fetchWithRetry(url: string, options = {}, retries = CONFIG.retry_attempts || 3) {
  try {
    const res = await fetch(url, {
      ...options,
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    if (retries > 1) {
      await new Promise(r => setTimeout(r, 800 * (4 - retries)));
      return fetchWithRetry(url, options, retries - 1);
    }
    
    // 备用源兜底（如果配置了 backup）
    try {
      const backup = findBackupUrl(url);
      if (backup && backup !== url) {
        console.log('主源失效，自动切换备用源');
        return await fetch(backup, { cache: 'force-cache' }).then(r => r.json());
      }
    } catch (_) {}
    
    throw err;
  }
}

function findBackupUrl(originalUrl: string) {
  for (const key in CONFIG.api_site) {
    const site = CONFIG.api_site[key];
    if (site.api === originalUrl && site.backup) return site.backup;
    if (site.backup === originalUrl && site.api) return site.api;
  }
  return null;
}
