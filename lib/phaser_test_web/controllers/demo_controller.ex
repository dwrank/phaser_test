defmodule PhaserTestWeb.DemoController do
  use PhaserTestWeb, :controller

  def index(conn, _) do
    conn
    |> put_root_layout({PhaserTestWeb.LayoutView, "demo_root.html"})
    |> render("index.html")
  end
end
