defmodule PhaserTestWeb.PageController do
  use PhaserTestWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
