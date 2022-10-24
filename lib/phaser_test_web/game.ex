defmodule PhaserTestWeb.Live.Game do
  @moduledoc """
  Main module, contains the entry point for the live view socket and
  all the game logic
  """

  use Phoenix.LiveView

  alias Phoenix.LiveView.Socket

  def render(assigns) do
    PhaserTestWeb.GameView.render("index.html", assigns)
  end

  @spec mount(map() | :not_mounted_at_router, map(), Socket.t()) :: {:ok, Socket.t()}
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @spec handle_info(atom(), Socket.t()) :: {:noreply, Socket.t()}
  def handle_info(:tick, socket) do
    {:noreply, socket}
  end
end
