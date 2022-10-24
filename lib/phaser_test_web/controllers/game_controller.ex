defmodule PhaserTestWeb.GameController do
  use PhaserTestWeb, :controller

  alias PhaserTestWeb.Live.Game
  alias Phoenix.LiveView

  def index(conn, _) do
    LiveView.Controller.live_render(conn, Game)
    #render(conn, "index.html")
  end
end
