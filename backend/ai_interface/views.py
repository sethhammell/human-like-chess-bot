import chess
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_GET
from urllib.parse import unquote
from .services import get_ai_move


@require_GET
def welcome(request):
    message = """
    <h1>Welcome to the AI Interface!</h1>
    <p>To get started, make a request to get the AI's move.</p>
    <pre>
    <code>
    GET /get_move/&lt;fen_string&gt;/&lt;max_depth&gt;/
    </code>
    </pre>
    <p>For example:</p>
    <pre>
    <code>
    GET /get_move/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201/1/
    </code>
    </pre>
    """
    return HttpResponse(message)


@require_GET
def get_move(request, fen, max_depth):
    decoded_fen = unquote(fen)
    try:
        board = chess.Board(decoded_fen)
    except:
        return HttpResponseBadRequest("Invalid FEN.")

    ai_move = get_ai_move(board, max_depth)
    return JsonResponse(ai_move)
