-- Seed data: Register all known PennyWiseIT apps
-- Run after schema.sql to populate the app registry

INSERT OR REPLACE INTO apps (id, name, template, domain, worker_name, brand_name, brand_color,
  clerk_enabled, payment_provider, payment_configured, resend_enabled, resend_from_email,
  sms_enabled, sms_provider, d1_database_id, r2_bucket_name, features)
VALUES
  -- Marketplace apps
  ('socialai', 'SocialAI Studio', 'socialai', 'socialaistudio.au', 'socialai-api', 'SocialAI Studio', '#a78bfa',
    1, 'paypal', 1, 1, NULL,
    0, NULL, '6295841e-e5f7-4355-b0e0-c5f22e58d99d', NULL,
    '["ai-content","social-publishing","ai-images","ai-video","facebook-integration"]'),

  ('food-truck-streetmeatz', 'Street Meatz BBQ', 'food-truck', 'streetmeatzbbq.com.au', 'gladstonebbq', 'Street Meatz BBQ', '#f97316',
    1, 'stripe', 1, 1, NULL,
    1, 'twilio', '59de0dce-0e7f-4f66-b961-f1617db3688f', NULL,
    '["online-ordering","catering","loyalty-raffle","sms-broadcast","ticketing"]'),

  ('food-truck-hugheseys', 'Hugheseys Que', 'food-truck', 'hugheseysque.au', 'gladstonebbq', 'Hugheseys Que', '#dc2626',
    1, 'stripe', 0, 1, NULL,
    1, 'twilio', '09db3efb-8bd5-4384-804b-775c37a697a9', NULL,
    '["online-ordering","catering","loyalty-raffle","sms-broadcast"]'),

  ('autohue', 'AutoHue', 'autohue', 'autohue.app', 'autohue-api', 'AutoHue', '#ef4444',
    1, 'paypal', 1, 1, NULL,
    0, NULL, '3c883ddc-829d-410d-94db-9d4ca6e80705', 'autohue-releases',
    '["license-keys","desktop-releases","ai-colour-detection","admin-dashboard"]'),

  ('simplewebsite-picklenick', 'Pickle Nick', 'simple-website', 'picklenick.au', 'pickle-nick-worker', 'Pickle Nick', '#10b981',
    1, 'square', 1, 1, NULL,
    0, NULL, '3a5bfc65-f074-4de1-afba-9f80820d625b', 'pickle-nick-assets',
    '["e-commerce","product-catalog","cart","checkout","cms","ai-content"]'),

  ('wirez', 'Wirez', 'wirez', NULL, 'wirez-r-us-api', 'Wirez', '#3b82f6',
    0, 'stripe', 1, 1, NULL,
    1, 'twilio', '4e54dda5-f1e0-417e-b0ce-145fddadc15c', 'wirez-r-us-uploads',
    '["job-management","dispatch","time-tracking","xero-invoicing","pdf-gen","stocktake","remote-workers","sms"]'),

  -- Customer apps
  ('oconnor', 'O''Connor Agriculture', 'oconnor', 'oconnoragriculture.com.au', 'oconner-api', 'O''Connor Agriculture', '#16a34a',
    1, 'stripe', 1, 1, NULL,
    0, NULL, '8bdf5c09-1509-438f-b93d-d4b7c136ca77', 'oconner-images',
    '["delivery-logistics","subscriptions","driver-tracking","product-catalog","push-notifications","promo-codes"]'),

  ('gladstone-festival', 'Gladstone BBQ Festival', 'festival', NULL, 'gladstonebbq', 'Gladstone BBQ Festival', '#f59e0b',
    1, 'stripe', 1, 1, NULL,
    1, 'twilio', 'cfac9785-e49b-49e0-bdd5-6b063cd6ca1b', NULL,
    '["ticketing","raffle","vendors","pois","schedule","sms-broadcast","alerts"]'),

  -- Non-marketplace apps
  ('aussie-saver', 'Aussie Saver', 'aussie-saver', 'aussiesaver.com.au', 'aussie-saver-api', 'Aussie Saver', '#16a34a',
    1, 'stripe', 1, 1, NULL,
    0, NULL, 'f13d054c-78bd-4ea9-b8da-d500da1a04d5', NULL,
    '["fuel-comparison","energy-comparison","grocery-comparison","budget-tracker"]');
