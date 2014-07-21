def new_board
  new_url = ""
  loop do
    new_url = random_url
    break unless Board.exists?(url: new_url)
  end
  Board.create(url: new_url)
end

def find_board(board_url)
  @board = Board.find_by_url board_url
end

def random_url
  letters = ('0'..'9').to_a + ('A'..'Z').to_a
  letters.shuffle[0,6].join
end