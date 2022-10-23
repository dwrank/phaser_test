import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :phaser_test, PhaserTestWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "oZ6GfSP8wBt4OWUuNkKTnDL/Z6mtw3ct+6VwZ8YjT7wBSYQgROo5zLEGBtCgvpKW",
  server: false

# In test we don't send emails.
config :phaser_test, PhaserTest.Mailer,
  adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
