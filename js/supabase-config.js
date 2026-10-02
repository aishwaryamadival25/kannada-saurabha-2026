/**
 * ====================================================================
 * SUPABASE CONFIGURATION — KANNADA SAURABHA 2026
 * ====================================================================
 * 
 * PASTE YOUR SUPABASE CREDENTIALS HERE:
 * 1. Log in to https://supabase.com
 * 2. Select your project -> Project Settings -> API
 * 3. Copy "Project URL" and paste into SUPABASE_URL below
 * 4. Copy "anon public" key and paste into SUPABASE_ANON_KEY below
 * 
 * IMPORTANT SECURITY NOTICE:
 * - Only use your PUBLIC "anon" key here.
 * - NEVER put your secret "service_role" key in any frontend file!
 * ====================================================================
 */

// <<< PASTE YOUR SUPABASE PROJECT URL HERE >>>
const SUPABASE_URL = "https://qmbpclyrtcjynxooupyi.supabase.co";

// <<< PASTE YOUR SUPABASE PUBLISHABLE (ANON) KEY HERE >>>
const SUPABASE_ANON_KEY = "sb_publishable_hGtecPEb6ummaNgA8cskBA_3zkIOisA";

(function (global) {
  var window = global;
  // Check if saved via admin setup or use file constants
  var storedUrl = '';
  var storedKey = '';
  try {
    storedUrl = localStorage.getItem('kv_supabase_url') || '';
    storedKey = localStorage.getItem('kv_supabase_key') || '';
  } catch (e) { }

  var activeUrl = (storedUrl && storedUrl.startsWith('http')) ? storedUrl : SUPABASE_URL;
  var activeKey = (storedKey && storedKey.length > 20) ? storedKey : SUPABASE_ANON_KEY;

  var isConfigured = function () {
    return !!(
      activeUrl &&
      activeUrl !== 'YOUR_SUPABASE_PROJECT_URL' &&
      activeUrl !== 'YOUR_SUPABASE_URL' &&
      activeUrl.startsWith('http') &&
      activeKey &&
      activeKey !== 'YOUR_SUPABASE_PUBLIC_ANON_OR_PUBLISHABLE_KEY' &&
      activeKey !== 'YOUR_SUPABASE_ANON_KEY' &&
      activeKey.length > 20
    );
  };

  var client = null;
  if (isConfigured() && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      client = window.supabase.createClient(activeUrl, activeKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
    }
  }

  function getClient() {
    if (!client && isConfigured() && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(activeUrl, activeKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
      } catch (err) {
        console.warn('Could not initialize Supabase client:', err);
      }
    }
    return client;
  }

  function setRuntimeCredentials(url, key) {
    if (url && key) {
      try {
        localStorage.setItem('kv_supabase_url', url.trim());
        localStorage.setItem('kv_supabase_key', key.trim());
      } catch (e) { }
      activeUrl = url.trim();
      activeKey = key.trim();
      client = null;
      return getClient();
    }
    return null;
  }

  function clearRuntimeCredentials() {
    try {
      localStorage.removeItem('kv_supabase_url');
      localStorage.removeItem('kv_supabase_key');
    } catch (e) { }
    activeUrl = SUPABASE_URL;
    activeKey = SUPABASE_ANON_KEY;
    client = null;
  }

  window.SupabaseConfig = {
    URL: activeUrl,
    ANON_KEY: activeKey,
    isConfigured: isConfigured,
    getClient: getClient,
    setRuntimeCredentials: setRuntimeCredentials,
    clearRuntimeCredentials: clearRuntimeCredentials
  };
})(typeof window !== 'undefined' ? window : this);
