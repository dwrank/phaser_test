defmodule PhaserTestWeb.HomeController do
  use PhaserTestWeb, :controller

  def index(conn, _) do
    render(conn, "index.html")
  end
end
