#!/usr/bin/env python3
"""Open the bundled web app at a local, microphone-compatible address."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


class AppHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
        ".webmanifest": "application/manifest+json",
    }

    def list_directory(self, path):
        self.send_error(404)


def main():
    parser = argparse.ArgumentParser(description="启动比特书房提词器")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("端口应在 1 到 65535 之间。")

    directory = Path(__file__).resolve().parent / "docs"
    handler = partial(AppHandler, directory=str(directory))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError as error:
        parser.exit(1, f"无法启动提词器，请检查端口 {args.port}。{error}\n")

    url = f"http://127.0.0.1:{args.port}/"
    with server:
        print(f"比特书房提词器 · {url}\n按 Ctrl+C 退出。", flush=True)
        if not args.no_browser:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
