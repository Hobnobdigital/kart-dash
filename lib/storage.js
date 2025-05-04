/**
 * Lightweight wrapper around localStorage with JSON serialization.
 * Used for high‑score persistence and any future settings flags.
 */
export default {
    set(key, value){
        try{ localStorage.setItem(key, JSON.stringify(value)); }
        catch(e){ console.warn('Storage set failed', e); }
    },
    get(key, fallback=null){
        try{
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        }catch(e){
            console.warn('Storage get failed', e);
            return fallback;
        }
    }
};