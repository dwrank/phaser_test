defmodule PhaserTestWeb.StarsController do
  use PhaserTestWeb, :controller

  #alias PhaserTestWeb.Live.Stars
  #alias Phoenix.LiveView

  def index(conn, _) do
    #LiveView.Controller.live_render(conn, Stars)
    render(conn, "index.html")
  end
end
