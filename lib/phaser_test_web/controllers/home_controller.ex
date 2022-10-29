defmodule PhaserTestWeb.HomeController do
  use PhaserTestWeb, :controller

  alias PhaserTestWeb.Live.Home
  alias Phoenix.LiveView

  def index(conn, _) do
    LiveView.Controller.live_render(conn, Home)
  end
end
