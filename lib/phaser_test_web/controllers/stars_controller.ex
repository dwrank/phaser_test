defmodule PhaserTestWeb.StarsController do
  use PhaserTestWeb, :controller

  alias PhaserTestWeb.Live.Stars
  alias Phoenix.LiveView

  def index(conn, _) do
    conn
    |> put_root_layout({PhaserTestWeb.LayoutView, "stars_root.html"})
    |> LiveView.Controller.live_render(Stars)
  end
end
