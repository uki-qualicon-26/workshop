// Public, browser-safe settings. The publishable key is designed to be public: it can only
// call the quiz_* functions, which validate everything server-side. Never put a secret key
// (sb_secret_...), the service_role key or the database password in this file.
window.BOB_QUIZ_CONFIG = {
  SUPABASE_URL: "https://ofrvyhfdbkfvjtugohqi.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_ieeVaqpAjT31nYGEd5vHiQ_UhyYFAyD"
};
