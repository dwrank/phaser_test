defmodule PhaserTestWeb.PhaserTemplateController do
  use PhaserTestWeb, :controller

  alias PhaserTestWeb.Live.PhaserTemplate
  alias Phoenix.LiveView

  def index(conn, _) do
    conn
    |> put_root_layout({PhaserTestWeb.LayoutView, "phaser_template_root.html"})
    |> LiveView.Controller.live_render(PhaserTemplate)
  end
end
