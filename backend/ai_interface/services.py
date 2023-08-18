import numpy as np
import torch
import chess
import chess.pgn
import os

from .cnn_model import ChessNet

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

current_dir = os.path.dirname(os.path.abspath(__file__))

MODELS_DIR = "model_weights"
MODEL_WHITE_FILE = "model_white.pt"
MODEL_BLACK_FILE = "model_black.pt"


model_white = ChessNet()
model_white.load_state_dict(
    torch.load(
        os.path.join(current_dir, MODELS_DIR, MODEL_WHITE_FILE),
        map_location=torch.device(device),
    )
)
model_white.eval()

model_black = ChessNet()
model_black.load_state_dict(
    torch.load(
        os.path.join(current_dir, MODELS_DIR, MODEL_BLACK_FILE),
        map_location=torch.device(device),
    )
)
model_black.eval()

predictions = 0

letter_2_num = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7}


def square_to_index(square):
    letter = chess.square_name(square)
    return 8 - int(letter[1]), letter_2_num[letter[0]]


def fen_to_board(fen):
    fen, _, _, _, _, _ = fen.split(" ")
    rows = fen.split("/")
    board = chess.Board(fen)
    board_rep = np.zeros((14, 8, 8), dtype=np.float32)
    mapping = {
        "P": 0,
        "N": 1,
        "B": 2,
        "R": 3,
        "Q": 4,
        "K": 5,
        "p": 6,
        "n": 7,
        "b": 8,
        "r": 9,
        "q": 10,
        "k": 11,
        "WHITE_MOVES": 12,
        "BLACK_MOVES": 13,
        "TURN": 14,
    }
    for i, row in enumerate(rows):
        col = 0
        for char in row:
            if char.isdigit():
                col += int(char)
            else:
                board_rep[mapping[char], i, col] = 1
                col += 1

    board.turn = chess.WHITE
    white_moves_layer = np.zeros((8, 8), dtype=int)
    for move in board.legal_moves:
        i, j = square_to_index(move.to_square)
        white_moves_layer[i][j] = 1
    board_rep[mapping["WHITE_MOVES"]] = white_moves_layer

    board.turn = chess.BLACK
    black_moves_layer = np.zeros((8, 8), dtype=int)
    for move in board.legal_moves:
        i, j = square_to_index(move.to_square)
        black_moves_layer[i][j] = 1
    board_rep[mapping["BLACK_MOVES"]] = black_moves_layer

    return board_rep


def minimax_eval(board, model_white, model_black):
    global predictions
    predictions += 1

    fen = board.fen()
    board_rep = fen_to_board(fen)
    board_tensor = torch.from_numpy(board_rep).float().to(device).unsqueeze(0)

    with torch.no_grad():
        if board.turn == chess.BLACK:
            eval = model_black(board_tensor)[0].item()
        else:
            eval = model_white(board_tensor)[0].item()

    return eval


def minimax(board, depth, alpha, beta, maximizing_player, model_white, model_black):
    if depth == 0 or board.is_game_over():
        return minimax_eval(board, model_white, model_black)

    if maximizing_player:
        max_eval = -np.inf
        for move in board.legal_moves:
            board.push(move)
            eval = minimax(
                board, depth - 1, alpha, beta, False, model_white, model_black
            )
            board.pop()
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break
        return max_eval
    else:
        min_eval = np.inf
        for move in board.legal_moves:
            board.push(move)
            eval = minimax(
                board, depth - 1, alpha, beta, True, model_white, model_black
            )
            board.pop()
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break
        return min_eval


def get_ai_move(board, max_depth):
    global predictions
    predictions = 0

    best_move = None
    max_eval = -np.inf
    min_eval = np.inf

    moves = list(board.legal_moves)
    turn = board.turn

    for move in moves:
        board.push(move)
        eval = minimax(
            board, max_depth, -np.inf, np.inf, not turn, model_white, model_black
        )
        board.pop()

        if not turn and eval < min_eval:
            min_eval = eval
            best_move = move
        if turn and eval > max_eval:
            max_eval = eval
            best_move = move

    return {
        "move": best_move.uci(),
        "positions_analyzed": predictions,
        "predicted_wr": max_eval,
    }
